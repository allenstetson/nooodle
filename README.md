# Noodle Mobile App

Noodle is a React Native / Expo mobile application backed by a Node.js/TypeScript API. The app is designed to provide an LLM-powered experience (via the backend) with a clean, focused “start page” UX for quickly getting into the core flows.

The project is split into two main pieces:

- **Frontend (Expo app)**  
  `Y:\home\2025_11_24_noodle\application\noodle`

- **Backend (API + LLM integration, auth, business logic)**  
  `Y:\home\2025_11_24_noodle\backend`

This document is split into:

1. [App Overview](#1-app-overview)
2. [Development Environment & Workflow](#2-development-environment--workflow)

---

## 1. App Overview

### 1.1 Purpose

Noodle is intended to:

- Provide a mobile UI that talks to a backend service for LLM-driven features (e.g. generating content, assisting with workflows, etc.).
- Offer a focused “start page” that gets the user quickly into their main tasks (rather than a generic home screen).
- Act as a sandbox for experimenting with app-embedded LLM flows, prompt UX, and app-level orchestration.

> **Note:** This section is meant as a living document. As you finalize the UX (start page flows, navigation, feature set), update this section with screenshots, wireframe links, and detailed behavior.

### 1.2 Tech Stack

**Frontend**

- React Native + [Expo](https://expo.dev/)
- TypeScript (if enabled in the project)
- React Navigation (for screens / stacks / tabs)
- Android first (emulator via Android Studio), with potential for iOS support later

**Backend**

- Node.js + npm
- Likely TypeScript/JavaScript (check `tsconfig.json` / file extensions)
- Express / Fastify / similar HTTP framework
- LLM integration layer (e.g. OpenAI / other provider) via REST endpoints

### 1.3 High-Level Architecture

[ Noodle Mobile App (Expo, React Native) ]
                |
                |  HTTPS / HTTP API calls (REST / JSON)
                v
[ Noodle Backend (Node.js) ]
    - Auth / user/session handling
    - LLM orchestration (prompting, tools, etc.)
    - Business logic
    - Persistence / external services (if any)

### KEY FEATURES

Start page driven navigation

LLM interactions through backend endpoints

Centralized state management

Configurable environments (API base URL, keys, etc.)

### DEVELOPMENT ENVIRONMENT

#### REQUIREMENTS

Required tools:

Node.js (LTS)

npm

Git

Android Studio

Android SDK + Emulator

Java JDK

Access to Y:\ drive

Optional but recommended:

VS Code or similar editor

Expo CLI (or use npx instead)

### RUNNING THE BACKEND

Open a terminal and run:

cd Y:\home\2025_11_24_noodle\backend
npm install
npm run dev

Notes:

Keep this terminal open

The backend will run on a local port (check console output)

Make sure .env exists if the backend uses one

RUNNING THE FRONTEND (EXPO)

In a separate terminal:

cd Y:\home\2025_11_24_noodle\application\noodle
npm install
npm expo start --offline

Expo commands:

Press "a" -> launch Android emulator
Press "r" -> reload app
Press "m" -> toggle dev menu

### STARTING THE ANDROID EMULATOR

Open Android Studio

Go to Tools ? Device Manager

Start an emulator (Pixel preferred)

Wait until fully booted

In Expo terminal, press "a"

### CODING IN ANDROID STUDIO

Use Android Studio for:

Emulator management

Logcat inspection

Profiler

Native code editing (if android folder exists)

OPENING NATIVE ANDROID PROJECT

Only if you generated / have an android folder:

In Android Studio select Open Project

Navigate to:

Y:\home\2025_11_24_noodle\application\noodle\android

Let Gradle sync

Run or debug from Android Studio

TYPICAL DEV WORKFLOW

Start backend

cd Y:\home\2025_11_24_noodle\backend
npm run dev

Start Android Studio emulator

Start frontend

cd Y:\home\2025_11_24_noodle\application\noodle
npm expo start --offline
Press "a"

Code and test

Shut down

CTRL+C in backend
CTRL+C in Expo
Close emulator

### TROUBLESHOOTING

Expo cannot reach backend:

Confirm backend is running

Verify IP/port and base URL

Android emulator uses:
http://10.0.2.2:PORT

Emulator not detected:

adb devices
Restart emulator if empty
