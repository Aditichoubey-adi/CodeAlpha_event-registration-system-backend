// server.js

// 1. Core Imports at the very top
const express = require('express'); // <-- THIS LINE IS CRUCIAL AND MUST BE FIRST
const dotenv = require('dotenv');
const cors = require('cors');

// 2. Project-specific Imports
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware'); // Error handling middleware


// 3. Load environment variables
dotenv.config();

// 4. Connect to database
connectDB();

// 5. Initialize Express app (express MUST be defined here)
const app = express();


// 6. Global Middleware
app.use(express.json()); // Body parser for JSON data
app.use(cors());         // Enable CORS for all routes


// 7. Basic route for testing (optional, but good for quick check)
app.get('/', (req, res) => {
    res.send('API is running...');
});
// Use registration routes
app.use('/api/registrations', require('./routes/registrations'));


// 8. API Routes
// Use auth routes
app.use('/api/auth', require('./routes/auth'));
// Use event routes
app.use('/api/events', require('./routes/events'));
app.use('/api/registrations', require('./routes/registrations')); // NEW LINE

// 9. Error Handling Middleware (MUST be after all routes)
app.use(notFound);
app.use(errorHandler);


// 10. Define the port and start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});