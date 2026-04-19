# React Components Catalog

This document details all individual modular UI pieces powering the StarGazerChat frontend ecosystem.

## Pages

### `ChatPage` (`src/pages/ChatPage`)
The unified application shell strictly for authenticated users.
- **State Managed:** `activeView` (Chats vs Profile), `selectedRoom` (the active discussion), `refreshTrigger` (forced mutation hook), `rooms` (shared room array).
- **Core Function:** Top-level glue. Handles establishing the raw `socket.io-client` connection and orchestrating state distribution across children so memory isn't fragmented or duplicated.

### `EditProfilePage` (`src/pages/EditProfilePage`)
Full-page form for updating the currently authenticated user's profile.
- **State Managed:** `username`, `bio`, `isLoading`, `error`.
- **Core Behavior:** Pre-populates fields by calling `GET /users/me` on mount. On submit, calls `PATCH /users/me` via `updateProfile()`. Displays backend error messages inline (e.g. "Username already taken"). Navigates back to the Profile view on success.

### `ChangePasswordPage` (`src/pages/ChangePasswordPage`)
Full-page form for changing the currently authenticated user's password.
- **State Managed:** `currentPassword`, `newPassword`, `confirmPassword`, `error`, `success`.
- **Core Behavior:** Client-side validates that `newPassword` and `confirmPassword` match before sending the request. Calls `PATCH /users/password` via `changePassword()`. Shows a green success message and auto-redirects after 1.5 seconds, or displays a red error if the current password is wrong.

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


