require('dotenv').config(); 
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const pool = require('./config/db'); 
const socketHandler = require('./sockets/socketHandler'); 

const app = express();
const server = http.createServer(app);

// ✅ CORS FIX: Sabhi origins allow karo taaki Vercel se connectivity block na ho
const corsOptions = {
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ SOCKET.IO FIX: Render/Vercel ke liye transports define karna zaroori hai
const io = new Server(server, {
    cors: corsOptions,
    transports: ['websocket', 'polling'] 
});

// Health Check Route
app.get('/', (req, res) => {
    res.send("Server is running perfectly! 🚀");
});

app.get('/test', (req, res) => {
    res.json({ message: "Backend is Running! 🚀", database: "Connected to Aiven ✅" });
});

// ✅ ROUTES
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/buses', require('./routes/busRoutes'));
app.use('/api/stops', require('./routes/stopRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes')); 

// ✅ SOCKET HANDLER
socketHandler(io, pool); 

// ✅ RENDER DEPLOYMENT FIX: '0.0.0.0' par listen karna zaroori hai
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; 

server.listen(PORT, HOST, () => {
    console.log(`🚀 Server is live on http://${HOST}:${PORT}`);
    console.log(`📅 Started at: ${new Date().toLocaleString()}`);
});