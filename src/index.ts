import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (_req, res) => {
    res.json({ message: 'Hello from Express with TypeScript and ES Modules!' });
});

app.get('/dong', (_req, res) => {
    res.json({ message: 'Hello dong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
