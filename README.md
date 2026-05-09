# StudySync — Web-Based Smart Study Dashboard

A full-stack web application that helps college students manage 
subjects, tasks, study sessions, and deadlines in one place.

## 🔗 Live Demo
- **Frontend:** https://studysync-two-sigma.vercel.app
- **Backend API:** https://studysync-api-448w.onrender.com

## 🚀 Features
- 🔐 User authentication (register/login with JWT)
- 📚 Subject Manager with color tags
- 📋 Task Manager with priority levels and status tracking
- ⏱ Study Timer with session history
- ⏰ Deadline Tracker with overdue detection
- 📊 Dashboard with live summary and motivational quotes

## 🛠 Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | SQLite (better-sqlite3) |
| Auth | JWT + bcrypt |
| External APIs | ZenQuotes API |
| Deployment | Vercel (frontend), Render.com (backend) |

## 📁 Project Structure
studysync/
├── client/                 # Frontend
│   ├── index.html          # Login/Register page
│   ├── css/style.css       # Global styles
│   ├── js/main.js          # Toast notifications
│   └── pages/
│       ├── dashboard.html
│       ├── tasks.html
│       ├── subjects.html
│       ├── timer.html
│       └── deadlines.html
└── server/                 # Backend
├── app.js              # Express entry point
├── config/db.js        # SQLite database
├── controllers/        # Route logic
├── middleware/         # JWT auth
└── routes/             # API routes

## ⚙️ Local Setup

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
Open `client/index.html` with Live Server in VS Code.

## 🔑 Environment Variables
Create a `.env` file in the `server/` folder:
PORT=5000
JWT_SECRET=your_secret_key

## 👨‍💻 Developer
- **Name:** Joshua
- **Project:** Software Engineering — Academic Year 2025-2026
- **Methodology:** Rapid Application Development (RAD)
- **Timeline:** March 20 – May 11, 2026