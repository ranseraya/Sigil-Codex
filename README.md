# Sigil Codex 🔮

> **Your Digital Grimoire for AI Prompts.** > *Master the art of prompt engineering with a secure, organized, and community-driven mobile platform.*


## 📖 About The Project

**Sigil Codex** is a comprehensive mobile application designed to help AI enthusiasts, developers, and prompt engineers store, manage, and discover AI prompts. Built as a final project for Mobile Programming, this app bridges the gap between local prompt management and community sharing.

The app features a robust **React Native** frontend with a smooth UI and a custom **PHP Native** REST API backend, ensuring fast performance and data sovereignty.

## ✨ Key Features

### 🔐 Security & Auth
* **Secure Authentication:** User Registration and Login with encrypted passwords.
* **Session Management:** Persistent login states using Async Storage.

### 📂 Prompt Management (The Grimoire)
* **CRUD Operations:** Create, Read, Update, and Delete prompts effortlessly.
* **Collections:** Organize prompts into specific folders (e.g., "Coding", "Writing", "Art").
* **Smart Search:** Filter prompts by title or category instantly.

### 🌍 Community & Social
* **Explore Feed:** Discover global prompts shared by other users.
* **Social Actions:** Give "Likes" to appreciate good prompts.
* **Favorites:** Bookmark 🔖 prompts to your personal "Favorites" list for quick access.
* **One-Tap Copy:** Copy prompt content to clipboard with instant toast feedback.

### 🎨 UI/UX
* **Modern Design:** Built with Tailwind CSS (`twrnc`) for a sleek, dark-themed aesthetic.
* **Smooth Animations:** Native transitions and loading skeletons.
* **Privacy Mode:** (Simulated) UI for Biometric and Privacy settings.

## 🛠️ Tech Stack

**Frontend (Mobile):**
* [React Native](https://reactnative.dev/)
* [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
* [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS (twrnc)](https://www.npmjs.com/package/twrnc)
* [Axios](https://axios-http.com/) (API Consumption)

**Backend (API):**
* PHP Native (No Framework)
* PDO (PHP Data Objects) for Secure SQL
* RESTful Architecture
* MySQL / MariaDB

**Tools:**
* VS Code
* Postman (API Testing)
* Git & GitHub

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
* Node.js & npm
* PHP & MySQL (XAMPP / Laragon)
* Expo Go App (on your phone)

### 1. Backend Setup
1.  Navigate to the `backend` folder.
2.  Import the database schema (SQL file) into your MySQL database (e.g., via phpMyAdmin).
3.  Rename `config/database.example.php` to `config/database.php`.
4.  Open `config/database.php` and configure your database credentials:
    ```php
    private $host = "localhost";
    private $db_name = "sigilcodex_db";
    private $username = "root";
    private $password = "";
    ```

### 2. Frontend Setup
1.  Navigate to the `frontend` folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Configure API Endpoint:**
    * Find `src/services/api.ts` (or `config.js`).
    * Change the `BASE_URL` to point to your local PHP server IP (e.g., `http://192.168.x.x/backend/api/`) or your live server URL.
4.  Start the app:
    ```bash
    npx expo start
    ```
5.  Scan the QR code with the **Expo Go** app on your Android/iOS device.

## 👥 Meet the Team (Group 2)

This project was built with dedication by the team at UPN "Veteran" Jawa Timur.
## 👥 Development Team

| Nama         |  Role                                |
| :-----------:|:------------------------------------:|
| **Ayala**    | **Lead Developer & Fullstack**       |
| **Rizky**    | **Fullstack**                        |
| **Narendra** | **UI/UX & Frontend**                 |
| **Faris**    | **QA & Analyst**                     |

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built by <b>Sigil Codex Team</b>
</p>