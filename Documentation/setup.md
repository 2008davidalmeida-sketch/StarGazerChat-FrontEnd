# StarGazerChat Frontend Setup Guide

Welcome to the StarGazerChat frontend repository! This guide details how to configure your local development environment to start contributing to this React SPA powered by Vite.

## Prerequisites
- **Node.js**: v18.x or higher recommended.
- **npm** or **yarn**: usually bundled with Node.js.
- **Git**: to clone and manage version control.

> [!NOTE]
> This repository is nested containing the actual application code inside the `StarGazerChat` folder.

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/2008davidalmeida-sketch/StarGazerChat-FrontEnd.git
cd StarGazerChat-FrontEnd/StarGazerChat
```
*Note: Make sure to navigate into the inner `StarGazerChat` directory where the `package.json` file is located before running npm commands.*

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
The frontend relies on knowing where the backend Node.js server lives. Instead of `.env` files, this app manages API URLs using a unified configuration file: `src/config.js`.

To run the application locally alongside your locally hosted backend server:
1. Open `src/config.js`
2. Update the `BASE_URL`:
```javascript
export const BASE_URL = 'http://localhost:3000'; // Development
// export const BASE_URL = 'https://stargazerchat-backend-production.up.railway.app'; // Production
```

### 4. Run the Development Server
```bash
npm run dev
```
Vite will launch the server and provide a local URL (e.g., `http://localhost:5173`). 


