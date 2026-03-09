import { Router } from 'express';
import { receiveDocument } from '../controllers/documentController';

const router = Router();

// Endpoint for receiving documents
router.post('/documents', receiveDocument);

export default router;
