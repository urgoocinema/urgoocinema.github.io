const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read JSON files
async function readJsonFile(filepath) {
    try {
        const data = await fs.readFile(path.join(__dirname, filepath), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading file ${filepath}:`, error);
        throw error;
    }
}

// API Routes
// Get all movies
app.get('/api/movies', async (req, res) => {
    try {
        const movies = await readJsonFile('data/ongoing/movies-list.json');
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});

// Get all branches
app.get('/api/branches', async (req, res) => {
    try {
        const branches = await readJsonFile('data/branches/branch-list.json');
        res.json(branches);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch branches' });
    }
});

// Get seat availability
app.get('/api/seats/availability', async (req, res) => {
    try {
        const seatData = await readJsonFile('data/realtime-data/seat-availability.json');
        res.json(seatData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch seat availability' });
    }
});

// Get upcoming movies
app.get('/api/movies/upcoming', async (req, res) => {
    try {
        const upcomingMovies = await readJsonFile('data/upcoming/upcoming.json');
        res.json(upcomingMovies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch upcoming movies' });
    }
});

// Get user info
app.get('/api/user/info', async (req, res) => {
    try {
        const userInfo = await readJsonFile('data/user/user-info.json');
        res.json(userInfo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user info' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'UrgOO Cinema API is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🎬 UrgOO Cinema API Server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints available at:`);
    console.log(`   • GET /api/movies - Current movies`);
    console.log(`   • GET /api/branches - Cinema branches`);
    console.log(`   • GET /api/seats/availability - Seat availability`);
    console.log(`   • GET /api/movies/upcoming - Upcoming movies`);
    console.log(`   • GET /api/user/info - User information`);
    console.log(`   • GET /api/health - Health check`);
});
