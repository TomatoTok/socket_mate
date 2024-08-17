import express from 'express';
import morgan from 'morgan';

const port = process.env.PORT || 3000;
const app = express();
// Log all requests to the console with morgan
app.use(morgan('dev'));
// Serve static files from the 'public' folder
app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client/index.html');
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

