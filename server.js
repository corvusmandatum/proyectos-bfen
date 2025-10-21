const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Endpoint to get the schedule data
app.get('/api/schedule', (req, res) => {
    fs.readFile(path.join(__dirname, 'schedule.json'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading schedule file');
            return;
        }
        res.send(data);
    });
});

// Endpoint to save the schedule data
app.post('/api/schedule', (req, res) => {
    const newData = JSON.stringify(req.body, null, 2);
    fs.writeFile(path.join(__dirname, 'schedule.json'), newData, 'utf8', (err) => {
        if (err) {
            res.status(500).send('Error writing schedule file');
            return;
        }
        res.send('Schedule updated successfully');
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
