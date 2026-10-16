# IoT Platform Backend Architecture

## Project Overview

This project is an IoT platform built around ESP32 devices and a highly dynamic dashboard.

The main design goal is flexibility.

Users are not restricted to predefined devices or layouts. A user can freely assign different modules to different ESP32 GPIO pins and arrange those modules on the dashboard.

The dashboard is generated dynamically from a configuration JSON file.

---

# Core Architecture

The system consists of four major parts:

1. Dashboard Frontend (Cloudflare Pages)
2. Cloudflare Worker
3. Cloudflare Durable Objects
4. ESP32 Devices

---

# Dashboard Configuration

The dashboard is not hardcoded.

When the dashboard loads, it first downloads a configuration JSON file.

Example:

```json
{
  "modules": [
    {
      "id": "module_1",
      "type": "switch",
      "pins": [4]
    },
    {
      "id": "module_2",
      "type": "relay",
      "pins": [12, 13]
    }
  ]
}
```

The dashboard UI is generated entirely from this configuration.

This configuration changes rarely.

Examples:

* Adding a new module
* Removing a module
* Reordering modules
* Changing module type

Because updates are rare, Cloudflare KV is planned for storing dashboard configuration.

---

# Real-Time Device State

A second data structure stores live device states.

Examples:

```json
{
  "pin_4": true,
  "pin_5": false,
  "pin_12": true
}
```

This data changes frequently.

Examples:

* User toggles a switch
* Relay changes state
* Sensor status updates

Because updates are frequent, Durable Objects are used instead of KV.

---

# Durable Object Responsibilities

Durable Objects act as the source of truth for runtime device state.

Responsibilities:

* Store current GPIO states
* Accept updates from ESP32
* Provide current states to Dashboard
* Survive Worker restarts
* Restore state after ESP32 reconnects

---

# Pin-Based Storage Model

The selected architecture uses a pin-centric model.

Each ESP32 pin is represented by a logical record.

Example:

```json
{
  "pinId": 4,
  "value": true,
  "lastUpdate": 1740000000
}
```

This model was chosen because future modules may consume multiple pins.

Examples:

* Relay module -> 1 pin
* RGB LED -> 3 pins
* Motor driver -> 2 pins
* Stepper controller -> 4 pins

By storing pin states independently, all future module types can reuse the same infrastructure.

---

# Communication Flow

## Dashboard -> ESP32

User clicks a switch.

Dashboard sends a WebSocket command to ESP32.

Example:

```json
{
  "type": "set_pin",
  "pin": 4,
  "value": true
}
```

ESP32 updates the physical GPIO.

---

## ESP32 -> Durable Object

After successfully changing the GPIO state:

```json
{
  "pin": 4,
  "value": true
}
```

is sent to the Durable Object.

Durable Object stores the new state.

---

## Durable Object -> ACK

Durable Object returns:

```json
{
  "success": true
}
```

ESP32 uses this acknowledgment to verify persistence.

---

# State Recovery

A critical requirement is recovery after ESP32 reboot.

Scenario:

1. Pin 4 is ON.
2. ESP32 reboots.
3. GPIO resets.
4. ESP32 reconnects.
5. ESP32 requests latest states from Durable Object.
6. Durable Object returns stored values.
7. ESP32 restores GPIO outputs.

Example response:

```json
{
  "pin_4": true,
  "pin_5": false
}
```

---

# API Requirements

Current version only requires:

## GET

Read current state.

Example:

```
GET /pins/4
```

Response:

```json
{
  "pin": 4,
  "value": true
}
```

---

## POST

Update state.

Example:

```
POST /pins/4
```

Body:

```json
{
  "value": true
}
```

Response:

```json
{
  "success": true
}
```

---

# Future Features

The architecture must remain extensible for:

* WebSocket support
* Multi-device support
* Authentication
* User accounts
* Device ownership
* Historical logs
* Event rules
* Automation engine
* Notifications
* OTA firmware updates
* Device groups
* Sensor streaming

---

# Cloudflare Services

Current Plan:

## Cloudflare Pages

Used for dashboard hosting.

---

## Cloudflare Worker

Acts as API gateway.

---

## Durable Objects

Used for frequently changing device state.

Examples:

* GPIO state
* Runtime status
* Connected device information

---

## KV

Used for rarely changing data.

Examples:

* Dashboard configuration
* Module layout
* User preferences

---

# Development Goals

Priority order:

1. Stable architecture
2. Simplicity
3. Scalability
4. Cloudflare-native implementation
5. Easy ESP32 integration

The codebase should be designed for long-term expansion without major architectural rewrites.
