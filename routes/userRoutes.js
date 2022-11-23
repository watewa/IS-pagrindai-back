import express from 'express';
import { loginUser, signupUser } from '../controllers/userController.js';
export const userRoutes = express.Router();

// signup
userRoutes.post('/signup', signupUser);

// login
userRoutes.post('/login', loginUser);