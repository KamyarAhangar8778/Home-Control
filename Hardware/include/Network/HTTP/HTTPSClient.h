#pragma once

#define ERROR_HTTPS_CLIENT_CONNECTION_FAILED "unable to connect"
#define ERROR_HTTPS_CLIENT_INVALID_HOST "invalid host"

#include <CertStoreBearSSL.h>
#include <ESP8266HTTPClient.h>
#include <WiFiConnector.h>
#include <Arduino.h>
#include <Optimization/SmallVector.h>
#include <Optimization/AtomicSharedPtr.h>
#include <sync_clock.h>
#include <Optimization/CompilerTraits.h>
#include <Optimization/FastFunction.h>
#include <Optimization/StaticArray.h>

// Uncomment the following line to enable True Async features (RTOS + Deferred).
// Note: Enabling this will increase Flash usage.
#define UNIUNO_HTTP_ASYNC_ENABLED

#ifdef UNIUNO_HTTP_ASYNC_ENABLED
#include <Core/Async/Deferred.h>
#if defined(ESP32)
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#endif
#endif // UNIUNO_HTTP_ASYNC_ENABLED

namespace uniuno {

class ResponseStream : public Stream {
public:
  ResponseStream() : wifi_client(), http_client() {}
  ~ResponseStream() {
    if (this->x509_list != nullptr) {
      free(this->x509_list);
    }
    this->http_client.end();
  }

  FORCE_INLINE int available() {
    this->check_bytes_left();

    if (!this->http_client.connected()) {
      return 0;
    }

    return this->bytes_left;
  }

  FORCE_INLINE size_t readBytes(uint8_t *buffer, size_t length) {
    this->check_bytes_left();

    if (this->bytes_left == 0) {
      return 0;
    }

    int bytesRead = this->wifi_client.readBytes(
        buffer, std::min((size_t)this->bytes_left, length));

    if (this->bytes_left > 0) {
      this->bytes_left -= bytesRead;
    }

    return bytesRead;
  }

  FORCE_INLINE size_t write(uint8_t buffer) {
    return this->wifi_client.write(&buffer, sizeof(buffer));
  }
  FORCE_INLINE int read() { return this->wifi_client.read(); }
  FORCE_INLINE int peek() { return this->wifi_client.peek(); }

  FORCE_INLINE String readString() { return this->wifi_client.readString(); }

  template <size_t N>
  FORCE_INLINE size_t readStaticArray(uniuno::StaticArray<uint8_t, N>& buffer) {
    size_t available_space = N - buffer.size();
    if (UNLIKELY(available_space == 0)) return 0;
    size_t to_read = std::min((size_t)this->available(), available_space);
    if (to_read == 0) return 0;
    
    size_t bytes_read = this->wifi_client.read((uint8_t*)buffer.data() + buffer.size(), to_read);
    if (LIKELY(bytes_read > 0)) {
        buffer.force_set_size(buffer.size() + bytes_read);
        MEMORY_BARRIER(); // Hardware memory sync
    }
    return bytes_read;
  }

  template <size_t N>
  FORCE_INLINE size_t readSmallVector(uniuno::SmallVector<uint8_t, N>& buffer, size_t max_bytes = SIZE_MAX) {
    size_t available_space = buffer.capacity() - buffer.size();
    size_t to_read = std::min({(size_t)this->available(), available_space, max_bytes});
    if (UNLIKELY(to_read == 0)) return 0;
    
    size_t bytes_read = this->wifi_client.read((uint8_t*)buffer.data() + buffer.size(), to_read);
    if (LIKELY(bytes_read > 0)) {
        buffer.force_set_size(buffer.size() + bytes_read);
        MEMORY_BARRIER(); // Hardware memory sync
    }
    return bytes_read;
  }

  // Raw C pointer 32-bit fast search for \r\n\r\n (End of Headers)
  FORCE_INLINE static bool fast_scan_headers_end(const uint8_t* data, size_t length) {
    if (length < 4) return false;
    const uint32_t crlf_crlf = 0x0A0D0A0D; // Little-endian \r\n\r\n
    
    size_t limit = length - 3;
    for (size_t i = 0; i < limit; i++) {
        // Unaligned 32-bit read directly from memory
        uint32_t val = *(const uint32_t*)(data + i);
        if (UNLIKELY(val == crlf_crlf)) return true;
    }
    return false;
  }

  FORCE_INLINE void check_bytes_left() {
    if (this->bytes_left == -2) {
      this->bytes_left = this->http_client.getSize();
    }
  }

  FORCE_INLINE BearSSL::WiFiClientSecure &get_wifi_client() { return this->wifi_client; }
  FORCE_INLINE HTTPClient &get_HTTP_client() { return this->http_client; }

  FORCE_INLINE void set_wifi_client_cert_store(BearSSL::CertStore *cert_store) {
    this->wifi_client.setCertStore(cert_store);
  }

  FORCE_INLINE void set_wifi_client_trust_anchors(const char *pem_cert) {
    this->x509_list = new BearSSL::X509List(pem_cert);
    this->wifi_client.setTrustAnchors(this->x509_list);
  }

private:
  BearSSL::WiFiClientSecure wifi_client;
  HTTPClient http_client;
  BearSSL::X509List *x509_list;
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
  uniuno::SmallVector<std::pair<const char *, const char *>, 4> headers;
};

class RequestBuilder {
public:
  RequestBuilder(Request::Method method, const char *url) {
    request.method = method;
    request.url = url;
  }

  FORCE_INLINE operator Request &&() { return std::move(request); }

  FORCE_INLINE RequestBuilder &body(const char *b) {
    request.body_cstr = b;
    request.body_size = strlen(b);
    request.body = nullptr;
    return *this;
  }

  FORCE_INLINE RequestBuilder &body(Stream *s, size_t size) {
    request.body = s;
    request.body_size = size;
    request.body_cstr = nullptr;

    return *this;
  }

  FORCE_INLINE RequestBuilder &body(File *file) { return this->body(file, file->size()); }

  FORCE_INLINE RequestBuilder &
  headers(uniuno::SmallVector<std::pair<const char *, const char *>, 4> h) {
    request.headers = h;
    return *this;
  }

private:
  Request request;
};

FORCE_INLINE RequestBuilder Request::build(Request::Method method, const char *url) {
  return RequestBuilder(method, url);
}

struct Response {
  int status_code;
  uniuno::AtomicSharedPtr<ResponseStream> body;
};

class HTTPSClient {
public:
  HTTPSClient(CertStore *cert_store, WiFiConnector *wifi_connector) {
    this->cert_store = cert_store;
    this->wifi_connector = wifi_connector;
  }

  HTTPSClient(WiFiConnector *wifi_connector, const char *host,
              const char *pem_cert) {
    this->wifi_connector = wifi_connector;
    this->host = host;
    this->pem_cert = pem_cert;
  }

  Future<void, Response> send_request(const Request& request) {
    return sync_clock(this->wifi_connector).and_then(create_future([=](time_t) {
      return this->try_to_send_request(request);
    }));
  }

#ifdef UNIUNO_HTTP_ASYNC_ENABLED
  Future<void, Response> send_request_deferred(const Request& request) {
#if defined(ESP32)
    Deferred<void, Response, Error> deferred;
    auto future = deferred.get_future();
    auto params = new AsyncTaskParams{this, request, deferred};

    xTaskCreate([](void* arg) {
        auto p = (AsyncTaskParams*)arg;
        auto res = p->client->try_to_send_request(p->req);
        if (res.is_resolved()) {
            p->deferred.resolve(*res.get_value());
        } else {
            p->deferred.reject(*res.get_error());
        }
        delete p;
        vTaskDelete(NULL);
    }, "HTTP_Async", 8192, params, 1, NULL);

    return future;
#else
    return this->send_request(request);
#endif
  }
#endif // UNIUNO_HTTP_ASYNC_ENABLED

  FORCE_INLINE void send_request_callback(const Request& request, FastFunction<void(AsyncResult<Response>), 64> callback) {
    auto result = this->try_to_send_request(request);
    if (callback) {
      callback(std::move(result));
    }
  }

private:
  AsyncResult<Response> try_to_send_request(const Request& request) {
    auto body = uniuno::AtomicSharedPtr<ResponseStream>::make();

    if (host != nullptr) {
      DEBUG("setting single pem certificate on ssl client");
      body->set_wifi_client_trust_anchors(this->pem_cert);

      if (strstr(request.url, this->host) == nullptr) {
        return AsyncResult<Response>::reject(
            Error(ERROR_HTTPS_CLIENT_INVALID_HOST));
      }
    } else {
      DEBUG("setting certificate store on ssl client");
      body->set_wifi_client_cert_store(this->cert_store);
    }

    HTTPClient &http = body->get_HTTP_client();

    DEBUG("[HTTP] begin...\n");

    if (LIKELY(http.begin(body->get_wifi_client(), request.url))) {
      const char* method = this->getMethod(request.method);

      DEBUGF("[HTTP] %s %s\n", method, request.url);
      // start connection and send HTTP header, set the HTTP method and
      // request body
      for (auto &h : request.headers) {
        http.addHeader(h.first, h.second);
      }

      int http_status_code;

      if (request.body == nullptr && request.body_cstr == nullptr) {
        http_status_code = http.sendRequest(method, (uint8_t *)nullptr, 0);
      } else if (request.body != nullptr) {
        http_status_code =
            http.sendRequest(method, request.body, request.body_size);
      } else {
        http_status_code = http.sendRequest(method, (uint8_t *)request.body_cstr, request.body_size);
      }

      // http_status_code will be negative on error
      if (LIKELY(http_status_code > 0)) {
        // HTTP header has been send and Server response header has been
        // handled
        DEBUGF("[HTTP] %s... code: %d\n", method, http_status_code);

        return AsyncResult<Response>::resolve(Response{http_status_code, body});
      } else {
        // print out the error message
        ERRORF("[HTTP] %s... failed, error: %s\n", method,
               http.errorToString(http_status_code).c_str());
        return AsyncResult<Response>::reject(
            Error(http.errorToString(http_status_code).c_str()));
      }
    } else {
      ERROR("[HTTP] Unable to connect\n");
      return AsyncResult<Response>::reject(
          Error(ERROR_HTTPS_CLIENT_CONNECTION_FAILED));
    }
  }

protected:
#ifdef UNIUNO_HTTP_ASYNC_ENABLED
  struct AsyncTaskParams {
    HTTPSClient* client;
    Request req;
    Deferred<void, Response, Error> deferred;
  };
#endif // UNIUNO_HTTP_ASYNC_ENABLED

  FORCE_INLINE const char* getMethod(Request::Method method) {
    switch (method) {
    case Request::OPTIONS: return "OPTIONS";
    case Request::DELETE: return "DELETE";
    case Request::PATCH: return "PATCH";
    case Request::PUT: return "PUT";
    case Request::POST: return "POST";
    case Request::HEAD: return "HEAD";
    default: return "GET";
    }
  }

  WiFiConnector *wifi_connector;
  CertStore *cert_store;

  const char *host;
  const char *pem_cert;
};

} // namespace uniuno