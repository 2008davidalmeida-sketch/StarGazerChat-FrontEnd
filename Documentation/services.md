# API Services Index

This application centralizes all backend network `fetch` calls into modular functions located in `src/services/`. This separates UI logic from networking code.

All functions natively resolve the JSON response objects directly to be consumable by `useEffect` components natively.

## `auth.js`
Handles user identity verification and token generation.

- **`login(username, password)`**
  - **Endpoint Activity:** `POST /auth/login`
  - **Returns:** `{ token: "jwt_string" }` or `{ message: "Error phrasing" }`

- **`register(username, password)`**
  - **Endpoint Activity:** `POST /auth/register`
  - **Returns:** `{ message: "Success" }` upon save confirmation.

## `rooms.js`
Handles conversation lifecycle persistence natively stored in Mongo Collections.

- **`getRooms(token)`**
  - **Endpoint Activity:** `GET /rooms`
  - **Returns:** An array of complex `Room` objects, fully populated with `lastMessage`, `unreadCount`, and `members`.

- **`createRoom(token, targetUsername)`**
  - **Endpoint Activity:** `POST /rooms`
  - **Returns:** Single populated `Room` object upon creation intercepting duplicates.

- **`deleteRoom(token, roomId)`**
  - **Endpoint Activity:** `DELETE /rooms/:roomId`
  - **Returns:** Text successful mutation acknowledgment.

- **`updateLastSeen(token, roomId)`**
  - **Endpoint Activity:** `PATCH /rooms/:roomId/lastSeen`
  - **Returns:** JSON object acknowledgment, recalculating backend MongoDB `unread` pointers to `0` universally globally.

## `users.js`
Fetches global generic profile descriptors isolated to identities.

- **`searchUsers(token, query)`**
  - **Endpoint Activity:** `GET /users/search?q={query}`
  - **Returns:** Dynamic array list containing users resembling the string input cleanly removing passwords securely.

- **`getMe(token)`**
  - **Endpoint Activity:** `GET /users/me`
  - **Returns:** The securely resolved object identity (`_id`, `username`, `createdAt`, `bio`) inherently attached to the JWT payload directly via local user session tokens natively.

---

## 📝 When to Update this File
You should update this documentation file when:
- Backend REST API routes are modified or redefined (e.g. changing `v1/auth/`).
- Function signatures require additional parameters (e.g. implementing Pagination query flags).
- The internal networking framework changes entirely (e.g. migrating from generic browser `fetch` API over to lightweight wrappers like Axial or React Query configurations).
