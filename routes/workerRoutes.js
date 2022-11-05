import express from 'express';
import { getAllWorkers } from '../controllers/workerController.js';

export const workerRouter = express.Router();
workerRouter.get("/", getAllWorkers);