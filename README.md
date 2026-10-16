# ProjectMate 🎓

**Your Project. Your Research. Your Success.**

ProjectMate is a student-focused project management platform designed to help students organize, manage, and track their academic and final-year projects in one place.

The platform aims to simplify the project journey, from organizing project activities and assigning tasks to tracking progress and preparing for successful project completion.

## 📌 Project Overview

Managing a final-year project can be challenging. Students often struggle to organize tasks, meet deadlines, track progress, and coordinate with other people involved in their work.

ProjectMate aims to solve these problems by providing a centralized workspace for managing academic projects and their associated tasks.

The platform is being developed with students in universities, polytechnics, and colleges of education in mind, including ND, HND, and degree students.

## 🎯 Mission

To make academic project management more organized, accessible, and efficient by giving students the tools they need to plan their work, manage deadlines, and monitor progress.

## ✨ Current Features

The initial Minimum Viable Product (MVP) focuses on essential project management functionality.

- **User Registration and Login:** Users can create accounts and authenticate themselves.
- **Dashboard:** A central place to access projects and project-related activities.
- **Project Management:** Create and view academic projects.
- **Task Management:** Create tasks associated with a project.
- **Task Assignment:** Assign tasks to registered users.
- **Status Tracking:** Track task progress using `TODO`, `IN_PROGRESS`, and `COMPLETED`.
- **Deadlines:** Add deadlines to tasks.
- **Backend API:** A dedicated backend handles application requests and business logic.
- **Database Integration:** PostgreSQL is used for persistent application data.

*Note: Features are still being tested and refined. Not every workflow has been fully verified for production use.*

## 🛠️ Technology Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- NestJS
- TypeScript
- JWT-based authentication
- Prisma ORM tooling

### Database
- PostgreSQL

### Development Tools
- Visual Studio Code
- Git and GitHub
- npm

## 📁 Project Structure

```text
ProjectMate/
├── backend/
│   ├── migrations/
│   ├── prisma/
│   ├── src/
│   │   ├── auth/
│   │   ├── projects/
│   │   ├── tasks/
│   │   ├── users/
│   │   ├── prisma/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── globals.css
│   │   └── page.tsx
│   └── package.json
├── ROADMAP/
├── package.json
├── package-lock.json
├── prisma.config.ts
└── README.md
```

## ⚙️ Getting Started

Follow these instructions to run ProjectMate locally.

### Prerequisites

Install the following tools:

- Node.js and npm
- PostgreSQL
- Git
- Visual Studio Code (recommended)

### 1. Clone the repository

```bash
git clone https://github.com/beloved1990/ProjectMate.git
cd ProjectMate
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `backend/` folder.

Configure the required environment variables:

```env
DATABASE_URL="postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@localhost:5432/projectmate"
JWT_SECRET="replace-with-a-secure-random-secret"
```

Replace the database username and password with your own PostgreSQL credentials. Ensure that the `projectmate` database exists.

Never commit your real `.env` file or expose passwords, tokens, or secret keys publicly.

### 4. Prepare the database

Configure the database using the Prisma configuration, contract, and migration files included in the backend.

Because this project uses Prisma 8 tooling, follow the commands defined by the installed backend package and its Prisma configuration rather than assuming older Prisma CLI commands are compatible.

### 5. Start the backend

From the `backend/` directory, run:

```bash
npm run start:dev
```

The backend is configured to run locally on port `4000`.

### 6. Install frontend dependencies

Open a second terminal at the project root and run:

```bash
cd frontend
npm install
```

### 7. Start the frontend

From the `frontend/` directory, run:

```bash
npm run dev
```

Open the application in your browser:

**http://localhost:3000**

Keep both the frontend and backend running while using the application.

## 🔄 Core Application Workflow

The intended core workflow is:

1. Register or log in.
2. Open the dashboard.
3. Create a project.
4. Add tasks to the project.
5. Set task deadlines where needed.
6. Assign tasks to registered users.
7. Update task statuses as work progresses.
8. Review project progress and outstanding tasks.

## 🚧 Development Roadmap

### Phase 1 — Core MVP
- [x] Initial frontend and backend setup
- [x] Project and task management implementation
- [x] User authentication implementation
- [x] Task assignment implementation
- [x] Task status tracking implementation
- [ ] Verify all core workflows end to end
- [ ] Complete authorization and security testing

### Phase 2 — Stability and Launch
- [ ] Improve validation and error handling
- [ ] Test data persistence and task assignments
- [ ] Finalize essential user interface improvements
- [ ] Configure production hosting and database
- [ ] Launch a small pilot for students

### Phase 3 — Future Enhancements
- [ ] Academic project templates
- [ ] Improved collaboration and notifications
- [ ] AI-assisted research and project planning
- [ ] Progress reports and analytics
- [ ] Subscription plans and payment integration

Future features will be prioritized according to actual student needs and feedback.

## 🔐 Security Considerations

ProjectMate is under active development. Before production deployment, the application must be tested to ensure that:

- Passwords are stored securely.
- Authentication and authorization are enforced.
- Users cannot access projects or tasks without appropriate permissions.
- Environment variables and credentials remain private.
- Database access is properly configured.
- Production traffic uses HTTPS.
- Important database records can be backed up and restored.

## 🤝 Contributing

ProjectMate is currently under active development.

Suggestions, bug reports, and improvement ideas are welcome. Before contributing, discuss significant changes with the project maintainer to keep development focused on the MVP.

## 📍 Project Status

**Status:** Active Development

ProjectMate is currently focused on completing and testing its core project and task management workflows before expanding into advanced features.

## 📄 License

No license has been specified yet. Until a license is added to the repository, the project should not be assumed to be open-source software that others may freely reuse or redistribute.

---

**ProjectMate — Your Project. Your Research. Your Success.**
