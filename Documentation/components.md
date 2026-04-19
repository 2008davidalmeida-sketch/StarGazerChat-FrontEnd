# React Components Catalog

This document details all individual modular UI pieces powering the StarGazerChat frontend ecosystem.

## Pages

### `ChatPage` (`src/pages/ChatPage`)
The unified application shell strictly for authenticated users.
- **State Managed:** `activeView` (Chats vs Profile), `selectedRoom` (the active discussion), `refreshTrigger` (forced mutation hook), `rooms` (shared room array).
- **Core Function:** Top-level glue. Handles establishing the raw `socket.io-client` connection and orchestrating state distribution across children so memory isn't fragmented or duplicated.

## Components

### `ChatWindow` (`src/components/ChatWindow`)
The main interactive message view component capturing chat inputs and logs.
- **Props:** 
  - `room` (Object): The selected conversation properties from MongoDB.
  - `currentUserId` (String): Mongoose ID of the logged-in user to ascertain bubble styling alignment.
  - `socket` (SocketIO instance): Forwarded socket dependency mapping to backend emit flows.
  - `onRoomDelete` (Function): Propagates deletions over to UI handlers.
- **State Managed:** `messages` (historic array log), `input` (controlled input value), `otherStatus` (real-time online availability flag).

### `RoomList` (`src/components/RoomList`)
Sidebar representation of conversations, and the discovery gateway for connecting with new users.
- **Props:** Accepts global `socket`, `refreshTrigger`, `rooms`, and handles `onRoomSelect`. 
- **State Managed:** `searchQuery` (finding users), `searchResults`.
- **Core Behavior:** Mounts `socket.on('newMessage')` internally to intercept incoming DB changes to recalculate `unreadCounts` arrays without re-querying the backend.

### `ProfileWindow` (`src/components/ProfileWindow`)
Display widget reflecting account statistics.
- **Props:** None
- **State Managed:** `user` object containing API payload data.
- **Core Behavior:** Fires a `GET /users/me` request upon mount sequentially updating the UI mapping.

### Validation Overlays
- **`LoginForm` / `SignupForm`**: Standalone widgets. Handle internal string inputs exclusively while delegating token manipulation specifically through global `auth.js` backend interceptors. 

---

## 📝 When to Update this File
You should update this documentation file when:
- A new React component is generated (e.g., a Settings widget or Notification Toast UI).
- Structural prop signatures drastically change.
- A functional component is abstracted up or broken apart.
