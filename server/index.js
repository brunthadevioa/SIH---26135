import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api', apiRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'MahaSkill 360 Express Backend Engine Running' });
});

app.listen(PORT, () => {
  console.log(`🚀 MahaSkill 360 Backend API Server listening at http://localhost:${PORT}`);
});
