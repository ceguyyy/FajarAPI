import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import documentRoutes from './routes/documentRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Parse application/json, text/plain, and URL-encoded payloads
app.use(express.json({ type: ['application/json', 'text/plain', 'application/vnd.api+json'] }));
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: '*/*' }));
app.use(express.raw({ type: '*/*' }));
// Main API Route
app.use('/api', documentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;
