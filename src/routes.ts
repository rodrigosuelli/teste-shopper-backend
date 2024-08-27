import express from 'express';
import { customErrorHandler } from './middlewares/customErrorHandler';
import { upload } from './endpoints/upload';

const router = express.Router();

// Endpoints
router.post('/upload', upload);
// router.get('/contatos', setAcessTokenAndInterceptor, contatoList);
// router.get('/contatos/:codigo', setAcessTokenAndInterceptor, contatoRead);
// router.put('/produtos/:codigo', setAcessTokenAndInterceptor, produtoUpdate);

// Custom Error Handler Middleware (Last middleware to use)
router.use(customErrorHandler);

export default router;
