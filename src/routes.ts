import express from 'express';
import { customErrorHandler } from './middlewares/customErrorHandler';
import { uploadEndpoint } from './endpoints/upload';
import { confirmEndpoint } from './endpoints/confirm';
import { listEndpoint } from './endpoints/list';

const router = express.Router();

// Endpoints
router.post('/upload', uploadEndpoint);
router.patch('/confirm', confirmEndpoint);
router.get('/:customer_code/list', listEndpoint);

// Custom Error Handler Middleware (Last middleware to use)
router.use(customErrorHandler);

export default router;
