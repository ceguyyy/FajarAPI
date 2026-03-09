import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import documentRoutes from './routes/documentRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Vercel Serverless Functions automatically parse the body and consume the stream.
// If we use express.json(), it will read an empty stream and overwrite req.body to undefined.
app.use((req, res, next) => {
    if (req.body !== undefined) {
        // Vercel already parsed it! Just proceed.
        return next();
    }
    // Otherwise, we are running locally, so use Express parsers
    express.json({ type: ['application/json', 'text/plain', '*/*'] })(req, res, (err) => {
        if (err) return next(err);
        express.urlencoded({ extended: true })(req, res, next);
    });
});
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
