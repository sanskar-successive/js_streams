import express from 'express';
import fs from 'fs';
import cors from 'cors';

const app = express();

app.use(cors());

app.get('/', (req, res) => {

    return res.send('welcome to streams');
})

app.get('/stream', (req, res) => {

    const fileReadStream = fs.createReadStream('data2.txt', { highWaterMark: 50 });

    res.setHeader('Content-Type', 'text/plain');

    fileReadStream.pipe(res);

    fileReadStream.on('error', (err) => {
        console.error('An error occurred while reading the file:', err);
        res.status(500).send('An error occurred while reading the file.');
    });


    fileReadStream.on('end', () => {
        console.log('Finished reading the file.');
    });

})

app.listen(5000, () => {
    console.log('server listening');
});