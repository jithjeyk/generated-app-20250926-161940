# Cryptext Diary

Cryptext Diary is a secure, minimalist, and beautifully designed online journal for private thoughts and daily reflections. The core principle is absolute privacy through client-side encryption: every entry is encrypted in the browser using a user's master password before being sent to the server. This ensures that only the user can ever decrypt and read their content. The application features a calming, distraction-free user interface to foster a focused writing experience. It includes a secure login, a main dashboard with a list of recent entries, and a dedicated, elegant editor for writing and editing.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/jithjeyk/generated-app-20250926-160014)

## ✨ Key Features

*   **Client-Side Encryption**: Your diary entries are encrypted and decrypted in your browser. The server only ever sees encrypted text.
*   **Zero Knowledge**: We have no access to your master password or your unencrypted diary content.
*   **Minimalist & Distraction-Free UI**: A clean, beautiful interface designed to help you focus on writing.
*   **Secure Authentication**: Uses a master password to derive the encryption key, ensuring only you can access your diary.
*   **Responsive Design**: A flawless experience across all your devices, from desktop to mobile.
*   **Robust State Management**: Built with Zustand for predictable and efficient state handling.

## 🚀 Technology Stack

*   **Frontend**: React, Vite, TypeScript, Tailwind CSS
*   **UI Components**: shadcn/ui, Framer Motion, Lucide React
*   **State Management**: Zustand
*   **Backend**: Hono on Cloudflare Workers
*   **Storage**: Cloudflare Durable Objects
*   **Encryption**: crypto-js
*   **Validation**: Zod

## 🏁 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later)
*   [Bun](https://bun.sh/) package manager

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/cryptext_diary.git
    cd cryptext_diary
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

### Running the Development Server

To start the local development server, which includes both the Vite frontend and the Hono backend worker:

```bash
bun run dev
```

The application will be available at `http://localhost:3000`.

## 📂 Project Structure

*   `src/`: Contains all the frontend React application code, including pages, components, stores, and utilities.
*   `worker/`: Contains the backend Hono application code that runs on Cloudflare Workers.
*   `shared/`: Contains shared types and data structures used by both the frontend and backend.
*   `public/`: Static assets that are served directly.

## 🔧 Development

*   **Frontend**: Modify files within the `src` directory. The Vite dev server provides Hot Module Replacement (HMR) for a fast development experience.
*   **Backend**: Add or modify API routes in `worker/user-routes.ts`. The development server will automatically reload worker changes.
*   **Styling**: The project uses Tailwind CSS. You can customize the theme and add new styles in `tailwind.config.js` and `src/index.css`.

## 部署 (Deployment)

This project is designed for seamless deployment to the Cloudflare network.

1.  **Login to Wrangler:**
    If you haven't already, authenticate the Wrangler CLI with your Cloudflare account.
    ```bash
    bunx wrangler login
    ```

2.  **Deploy the application:**
    Run the deploy script, which will build the application and deploy it to your Cloudflare account.
    ```bash
    bun run deploy
    ```

Alternatively, you can deploy directly from your GitHub repository with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/jithjeyk/generated-app-20250926-160014)

## ⚠️ Important Security Note

**Password Loss is Irreversible.**

If you forget your master password, your encrypted data will be **permanently unrecoverable**. We do not store your password and have no way to reset it or decrypt your data. Please store your master password in a safe and secure location.