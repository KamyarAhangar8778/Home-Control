#pragma once

#define ERROR_HTTPS_CLIENT_CONNECTION_FAILED "unable to connect"
#define ERROR_HTTPS_CLIENT_INVALID_HOST "invalid host"

#ifdef ESP8266
#include <ESP8266HTTPClient.h>
#include <CertStoreBearSSL.h>
#elif defined(ESP32)
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#endif

#include <WiFiConnector.h>
#include <logging.h>
#include <memory>
#include <Arduino.h>

namespace uniuno {

class ResponseStream : public Stream {
public:
  #ifdef ESP8266
  ResponseStream() : wifi_client(), http_client(), x509_list(nullptr) {}
  #elif defined(ESP32)
  ResponseStream() : wifi_client(), http_client() {}
  #endif
  
  ~ResponseStream() {
    #ifdef ESP8266
    if (this->x509_list != nullptr) {
      delete this->x509_list;
    }
    #endif
    this->http_client.end();
  }

  int available() {
    this->check_bytes_left();
    if (!this->http_client.connected()) return 0;
    return this->bytes_left;
  }

  size_t readBytes(uint8_t *buffer, size_t length) {
    this->check_bytes_left();
    if (this->bytes_left == 0) return 0;

    int bytesRead = this->wifi_client.readBytes(
        buffer, std::min((size_t)this->bytes_left, length));

    if (this->bytes_left > 0) {
      this->bytes_left -= bytesRead;
    }
    return bytesRead;
  }

  size_t write(uint8_t buffer) {
    return this->wifi_client.write(&buffer, sizeof(buffer));
  }
  
  int read() { return this->wifi_client.read(); }
  int peek() { return this->wifi_client.peek(); }
  String readString() { return this->wifi_client.readString(); }

  void check_bytes_left() {
    if (this->bytes_left == -2) {
      this->bytes_left = this->http_client.getSize();
    }
  }

  #ifdef ESP8266
  BearSSL::WiFiClientSecure &get_wifi_client() { return this->wifi_client; }
  
  void set_wifi_client_cert_store(BearSSL::CertStore *cert_store) {
    this->wifi_client.setCertStore(cert_store);
  }

  void set_wifi_client_trust_anchors(const char *pem_cert) {
    this->x509_list = new BearSSL::X509List(pem_cert);
    this->wifi_client.setTrustAnchors(this->x509_list);
  }
  #elif defined(ESP32)
  WiFiClientSecure &get_wifi_client() { return this->wifi_client; }
  
  void set_wifi_client_insecure() {
    this->wifi_client.setInsecure();
  }

  void set_wifi_client_ca_cert(const char *ca_cert) {
    this->wifi_client.setCACert(ca_cert);
  }
  #endif

  HTTPClient &get_HTTP_client() { return this->http_client; }

private:
  #ifdef ESP8266
  BearSSL::WiFiClientSecure wifi_client;
  BearSSL::X509List *x509_list = nullptr;
  #elif defined(ESP32)
  WiFiClientSecure wifi_client;
  #endif
  
  HTTPClient http_client;
  int bytes_left = -2;
};

class RequestBuilder;

class Request {
public:
  enum Method { GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS };

  static RequestBuilder build(Request::Method method, const char *url);
  
  const char *url;
  Request::Method method;
  Stream *body = nullptr;
  size_t body_size = 0;
  const char *body_cstr = nullptr;
  std::vector<std::pair<const char *, const char *>> headers;
};

class RequestBuilder {
public:
  RequestBuilder(Request::Method method, const char *url) {
    request.method = method;
    request.url = url;
  }

  operator Request &&() { return std::move(request); }

  RequestBuilder &body(const char *b) {
    request.body_cstr = b;
    request.body_size = strlen(b);
    request.body = nullptr;
    return *this;
  }

  RequestBuilder &body(Stream *s, size_t size) {
    request.body = s;
    request.body_size = size;
    request.body_cstr = nullptr;
    return *this;
  }

  RequestBuilder &body(File *file) { 
    return this->body(file, file->size()); 
  }

  RequestBuilder &headers(std::vector<std::pair<const char *, const char *>> h) {
    request.headers = h;
    return *this;
  }

private:
  Request request;
};

inline RequestBuilder Request::build(Request::Method method, const char *url) {
  return RequestBuilder(method, url);
}

struct Response {
  int status_code;
  std::shared_ptr<ResponseStream> body;
};

class HTTPSClient {
public:
  #ifdef ESP8266
  HTTPSClient(BearSSL::CertStore *cert_store, WiFiConnector *wifi_connector) {
    this->cert_store = cert_store;
    this->wifi_connector = wifi_connector;
  }
  #endif

  HTTPSClient(WiFiConnector *wifi_connector, const char *host, const char *pem_cert) {
    this->wifi_connector = wifi_connector;
    this->host = host;
    this->pem_cert = pem_cert;
  }

  Future<void, Response> send_request(Request request) {
    return create_future([this, request]() {
      return this->try_to_send_request(request);
    });
  }

private:
  AsyncResult<Response> try_to_send_request(Request request) {
    auto body = std::make_shared<ResponseStream>();

    if (host != nullptr) {
      DEBUG("setting certificate on ssl client");
      
      #ifdef ESP8266
      body->set_wifi_client_trust_anchors(this->pem_cert);
      #elif defined(ESP32)
      body->set_wifi_client_ca_cert(this->pem_cert);
      #endif

      if (strstr(request.url, this->host) == nullptr) {
        return AsyncResult<Response>::reject(Error(ERROR_HTTPS_CLIENT_INVALID_HOST));
      }
    } else {
      #ifdef ESP8266
      DEBUG("setting certificate store on ssl client");
      body->set_wifi_client_cert_store(this->cert_store);
      #elif defined(ESP32)
      DEBUG("setting insecure mode on ssl client");
      body->set_wifi_client_insecure();
      #endif
    }

    HTTPClient &http = body->get_HTTP_client();
    DEBUG("[HTTP] begin...\n");

    if (http.begin(body->get_wifi_client(), request.url)) {
      char method[10];
      this->readMethod(request.method, method);

      DEBUGF("[HTTP] %s %s\n", method, request.url);
      
      for (auto &h : request.headers) {
        http.addHeader(h.first, h.second);
      }

      int http_status_code;

      if (request.body == nullptr && request.body_cstr == nullptr) {
        http_status_code = http.sendRequest(method, (uint8_t *)nullptr, 0);
      } else if (request.body != nullptr) {
        http_status_code = http.sendRequest(method, request.body, request.body_size);
      } else {
        http_status_code = http.sendRequest(method, String(request.body_cstr));
      }

      if (http_status_code > 0) {
        DEBUGF("[HTTP] %s... code: %d\n", method, http_status_code);
        return AsyncResult<Response>::resolve(Response{http_status_code, body});
      } else {
        ERRORF("[HTTP] %s... failed, error: %s\n", method,
               http.errorToString(http_status_code).c_str());
        return AsyncResult<Response>::reject(
            Error(http.errorToString(http_status_code).c_str()));
      }
    } else {
      ERROR("[HTTP] Unable to connect\n");
      return AsyncResult<Response>::reject(Error(ERROR_HTTPS_CLIENT_CONNECTION_FAILED));
    }
  }

  void readMethod(Request::Method method, char *method_value) {
    switch (method) {
    case Request::OPTIONS: strcpy(method_value, "OPTIONS"); break;
    case Request::DELETE: strcpy(method_value, "DELETE"); break;
    case Request::PATCH: strcpy(method_value, "PATCH"); break;
    case Request::PUT: strcpy(method_value, "PUT"); break;
    case Request::POST: strcpy(method_value, "POST"); break;
    case Request::HEAD: strcpy(method_value, "HEAD"); break;
    default: strcpy(method_value, "GET"); break;
    }
  }

  WiFiConnector *wifi_connector;
  
  #ifdef ESP8266
  BearSSL::CertStore *cert_store = nullptr;
  #endif
  
  const char *host = nullptr;
  const char *pem_cert = nullptr;
};

} // namespace uniuno
