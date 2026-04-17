# LifeOS 

LifeOS is an all-in-one web app to track your tasks, habits, daily journaling, and deep work focus sessions. It also features an AI coach that gives you productivity advice.

This project was built with clean code in mind, specifically focusing on organization and object-oriented design patterns. 

## Application Architecture

The system uses a strict layered architecture on the backend and is broken down by feature on the frontend. This keeps the code clean and easy to read.

### SOLID Principles in Action

We built the code using SOLID principles to keep everything organized:

* **Single Responsibility Principle (SRP):** 
  The backend is broken into separate layers. `Routes` only handle URLs. `Controllers` only format the data. `Services` handle the actual business logic. `Repositories` only talk to the database.
* **Open/Closed Principle (OCP):**
  The frontend UI is sorted into a `features` folder. If you want to add a new dashboard widget, you just create a new folder without editing the core code.
* **Liskov Substitution Principle (LSP):**
  Our AI setup is highly flexible. Because all AI code follows the same basic rule (an `AIProvider`), we can swap out Groq for OpenAI tomorrow and the system won't break.
* **Interface Segregation Principle (ISP):**
  Instead of one massive backend service handling everything, we split the logic up. Tasks, habits, and journals all have their own small, focused service files.
* **Dependency Inversion Principle (DIP):**
  Our business logic (`AIService`) does not rely on hardcoded API URLs. Instead, it relies on an abstract interface, meaning our code is disconnected from third-party vendor setups.

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Framer Motion
**Backend:** Node.js, Express, JSON Web Tokens (JWT)
**Database:** MongoDB, Mongoose
**Integrations:** Groq Language Model API

## Project Structure

```text
LifeOS/
├── client/
│   ├── src/
│   │   ├── context/        # React context (like Auth)
│   │   ├── features/       # UI code sorted by feature
│   │   └── services/       # Code to talk to the backend API
├── server/
│   ├── src/
│   │   ├── core/           # App setup, error handlers, and config
│   │   ├── middlewares/    # Custom code that runs before requests
│   │   └── modules/        # Backend logic sorted by feature (tasks, habits, etc.)
```

## Local Development Setup

### 1. Environment Configurations

Setup the backend `.env` (`server/.env`):
```text
PORT=8001
MONGO_URL=mongodb+srv://<auth>@<cluster>.mongodb.net
DB_NAME=lifeos_db
JWT_SECRET=development_secret_key
GROQ_API_KEY=your_groq_api_token
```

Setup the frontend `.env` (`client/.env`):
```text
VITE_BACKEND_URL=http://localhost:8001
```

### 2. Run the App

Open two different terminal windows.

**Run the Backend:**
```bash
cd server
npm install
npm run dev
```

**Run the Frontend:**
```bash
cd client
npm install
npm run dev
```

Finally, open `http://localhost:5173` in your browser.
