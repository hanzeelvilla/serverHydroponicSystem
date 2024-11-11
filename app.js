import express from 'express';
import path from 'node:path';

const app = express();

app.get('/', (req, res) => {
    const filePath = path.join('client', 'index.html')
    console.log(filePath);
    res.sendFile(process.cwd() + '/' + filePath); // verrify this line on windows
    // process.cwd() + '/client/index.html'
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});