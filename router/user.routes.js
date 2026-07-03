// backend - router/user.routes.js
import express from 'express';
import { createUser } from '../controller/user.controller.js';

const router = express.Router();

router.post('/', createUser);

export default router;
