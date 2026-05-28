import express from 'express';
import { requestRegistration, verifyAndRegister, loginUser } from '../controllers/auth.Controller.js';

const router = express.Router();

router.post('/request-register', requestRegistration);
router.post('/verify-register', verifyAndRegister);
router.post('/login', loginUser);

export default router;