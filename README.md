# Expense Tracker

A comprehensive and modern Expense Tracker application designed to help users manage their finances effectively. It provides intuitive dashboards, categorized expense tracking, and detailed analytics to give users complete visibility into their income and spending habits.

## Features

- **User Authentication**: Secure registration and login using JWT and bcrypt.
- **Dashboard & Analytics**: Visual representation of income vs. expenses and expenses by category using interactive charts.
- **Expense Management**: Seamless CRUD operations for tracking daily transactions.
- **Responsive UI**: A beautiful, modern interface built with React and Tailwind CSS.
- **API Security**: Rate limiting, Helmet, and CORS configured for a secure backend.

## Tech Stack

**Frontend:**
- React 19 (Vite)
- TypeScript
- Tailwind CSS 4
- React Router DOM
- Recharts (for analytics and charts)
- React Hook Form & Zod (validation)
- Axios

**Backend:**
- Node.js & Express
- TypeScript
- MongoDB (Mongoose)
- JSON Web Token (JWT)
- Joi (data validation)
- Jest & Supertest (testing)

## Project Structure

```text
expense-tracker/
├── backend/                # Express & MongoDB backend
│   ├── src/                # Backend source code and controllers
│   ├── .env.example        # Example environment variables
│   ├── Dockerfile          # Docker configuration for backend
│   └── package.json        
├── frontend/               # React frontend
│   ├── src/                # Frontend source code, components, pages
│   ├── .env                # React environment variables
│   ├── Dockerfile          # Docker configuration for frontend
│   └── package.json        
├── docker-compose.yml      # Docker compose configuration for full stack
└── README.md
```

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` files.

### Backend (`backend/.env`)

Create a `.env` file in the `backend` directory based on `backend/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here
```

### Frontend (`frontend/.env`)

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## Run Locally

Make sure you have Node.js and MongoDB installed on your machine.

**1. Clone the repository**
```bash
git clone <your-repo-url>
cd expense-tracker
```

**2. Setup Backend**
```bash
cd backend
npm install
# Add your .env file here
npm run dev
```

**3. Setup Frontend**
Open a new terminal window/tab:
```bash
cd frontend
npm install
# Add your .env file here
npm run dev
```

Your frontend should now be running on `http://localhost:5173` (or the port Vite provides) and the backend on `http://localhost:5000`.

## Run with Docker

This project comes with a `docker-compose.yml` file for easy deployment.

Make sure you have Docker and Docker Compose installed.

**1. Ensure your `.env` files are configured**
Especially the `backend/.env` file with the correct `MONGO_URI` and `JWT_SECRET`.

**2. Build and start the containers**
From the root directory of the project, run:
```bash
docker compose up --build
```
Alternatively, to run in detached mode:
```bash
docker compose up -d --build
```

**3. Access the application**
- **Frontend**: `http://localhost:80` (or simply `http://localhost`)
- **Backend API**: `http://localhost:5000`

To stop the containers, run:
```bash
docker compose down
```
