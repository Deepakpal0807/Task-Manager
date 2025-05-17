import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { connectDB } from './config/db';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';
import { setupSwagger } from './utils/swagger';
import { startCronJobs } from './utils/cronJobs';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from backend folder (one level up from compiled file)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Now access variables from process.env, e.g.:
console.log(process.env.PORT);
console.log(process.env.MONGODB_URI);
console.log(process.env.JWT_SECRET);
console.log(process.env.JWT_EXPIRES_IN);

 


// dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;
console.log('MONGO_URI:', process.env.MONGODB_URI);


// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


// Setup Swagger documentation
setupSwagger(app);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Default route
// app.get('/', (req, res) => {
//   res.json({ message: 'Welcome to Task Management API' });
// });

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
    // Start cron jobs
    startCronJobs();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;