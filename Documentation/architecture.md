# StarGazerChat Architecture Overview

This document outlines the high-level structural decisions, state management, and application flow inside the StarGazerChat frontend React SPA.

## File & Folder Structure
```text
StarGazerChat-FrontEnd/StarGazerChat/
├── src/
│   ├── assets/       # Static SVGs, images, and brand assets
│   ├── components/   # Modular, reusable React UI components
│   ├── context/      # React Contexts for global state (e.g. Auth)
│   ├── pages/        # High-level route views combining components
│   ├── services/     # Pure JavaScript files for 'fetch' abstractions
│   ├── utils/        # Generic helper functions 
│   ├── App.jsx       # Root router wrapper
│   ├── config.js     # Unified Environment config map
│   └── main.jsx      # React DOM entry point
```

## Routing Strategy
Routing is handled exclusively via `react-router-dom` defined in `App.jsx`.
- **Public Routes:** `/login` and `/signup`.
- **Protected Routes:** `/` (maps to `ChatPage.jsx`).
- **Protection Mechanism:** Inside protected views like `ChatPage`, a runtime check asserts if the `token` from `AuthContext` exists. If the user is unauthenticated, they are immediately forcefully redirected via `<Navigate to="/login" />` prior to component rendering.

## Global State (AuthContext)
Instead of heavily utilizing Redux, this application relies natively on React Context.
- `AuthContext.jsx` manages the JWT token injection into `localStorage`.
- It acts as the single source of truth for the `currentUser` identity decoding.
- Exposes `login()` and `logout()` setter methods uniformly throughout the DOM tree.

## Real-Time Management (WebSockets)
StarGazerChat relies on `socket.io-client` for real-time messaging latency requirements.
- **Hoisting:** To prevent disconnects and re-renders when navigating between chat rooms or the profile tab, the `io()` socket connection is initiated globally at the `ChatPage.jsx` layer.
- **Prop Drilling:** The connection is passed down to `<RoomList />` (so dynamic updates natively pop chats to the top and trigger unread badges) and `<ChatWindow />` (so the UI can emit specific `sendMessage` events to unique room IDs).


