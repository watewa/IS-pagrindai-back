import express from 'express';
import { getAllWorkers } from '../controllers/workerController.js';
import { requireAuth } from '../middleware/useAuth.js';

export const workerRouter = express.Router();

//require auth for all routes
workerRouter.use(requireAuth);

workerRouter.get("/", getAllWorkers);