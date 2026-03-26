import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'nominal', service: 'InfraLense Core API' });
});

// Mock Petition generation endpoint
app.post('/api/petitions/generate', (req, res) => {
  const { location, stats } = req.body;
  // Proxy call to AI Service would go here
  res.json({
    status: 'success',
    petition_draft: `To the Municipal Corporation of ${location},\n\nWe urgently request the allocation of budget for new infrastructure based on data projecting a critical 65% gap in educational facilities...`
  });
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Broadcast mock real-time events to admins
  setInterval(() => {
    socket.emit('admin_notification', {
      type: 'PETITION_SUBMITTED',
      location: 'Dharavi, Mumbai',
      severity: 'CRITICAL',
      timestamp: new Date().toISOString()
    });
  }, 30000);

  socket.on('admin_action', (data) => {
    io.emit('governance_update', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
