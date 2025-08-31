# UrgOO Cinema - Full Stack Application

This project consists of a **frontend** (HTML/CSS/JavaScript) and a **backend** (Node.js/Express API server).

## Prerequisites

Make sure you have the following installed:
- **Node.js** (version 14 or higher) - Download from [nodejs.org](https://nodejs.org/)
- **Live Server Extension** for VS Code (or any local server for frontend)

## 🚀 How to Run the Application

### Step 1: Start the Backend Server

1. Open a terminal/command prompt
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies (first time only):
   ```bash
   npm install
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

You should see:
```
🎬 UrgOO Cinema API Server running on http://localhost:3001
📡 API endpoints available at:
   • GET /api/movies - Current movies
   • GET /api/branches - Cinema branches
   • GET /api/seats/availability - Seat availability
   • GET /api/movies/upcoming - Upcoming movies
   • GET /api/user/info - User information
   • GET /api/health - Health check
```

**⚠️ Keep this terminal window open! The backend must stay running.**

### Step 2: Start the Frontend

1. Open VS Code in the project root directory
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. Your browser should open at `http://127.0.0.1:5500` (or similar)

## 🛑 How to Stop the Servers

### Stop Backend Server:
- In the terminal where the backend is running, press `Ctrl + C`
- Type `Y` if prompted to confirm

### Stop Frontend Live Server:
- In VS Code, click the "Port: 5500" button in the status bar
- Or close the VS Code Live Server

## 📡 API Endpoints

The backend provides these endpoints:

| Endpoint | Description | URL |
|----------|-------------|-----|
| `GET /api/movies` | Get current movies | http://localhost:3001/api/movies |
| `GET /api/branches` | Get cinema branches | http://localhost:3001/api/branches |
| `GET /api/seats/availability` | Get seat availability | http://localhost:3001/api/seats/availability |
| `GET /api/movies/upcoming` | Get upcoming movies | http://localhost:3001/api/movies/upcoming |
| `GET /api/user/info` | Get user information | http://localhost:3001/api/user/info |
| `GET /api/health` | Health check | http://localhost:3001/api/health |

## 🔧 Troubleshooting

### Backend Issues:
- **"npm is not recognized"**: Install Node.js from nodejs.org
- **Port 3001 in use**: Change port in `backend/server.js` (line 6)
- **Module not found**: Run `npm install` in the backend directory

### Frontend Issues:
- **API errors**: Make sure backend is running on port 3001
- **CORS errors**: Backend has CORS enabled, should work automatically
- **Live Server not working**: Install "Live Server" extension in VS Code

## 📁 Project Structure

```
project-root/
├── index.html              # Main frontend page
├── components/
│   ├── fetch.js            # API calls to backend
│   ├── config.js           # API configuration
│   └── ...                 # Other frontend components
├── backend/
│   ├── server.js           # Express server
│   ├── package.json        # Node.js dependencies
│   └── data/               # JSON data files
└── README.md               # This file
```

## 🎯 Quick Start (For Teachers)

1. **Terminal 1** (Backend):
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **VS Code** (Frontend):
   - Open project in VS Code
   - Right-click `index.html` → "Open with Live Server"

3. **Test**: Visit http://localhost:3001/api/health to verify backend is working

That's it! Both servers should now be running and communicating with each other.

---

**Note**: The frontend automatically detects if it's running locally and will connect to the backend at `http://localhost:3001`. No additional configuration needed!
