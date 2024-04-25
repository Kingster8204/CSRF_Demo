const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/submit', (req, res) => {
  const { name, service, paymentStatus } = req.body;
  const data = { name, service, paymentStatus };
  fs.readFile('db.json', 'utf8', (err, fileData) => {
    if (err && err.code !== 'ENOENT') {
      console.error('Error reading db.json:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    let entries = [];
    if (fileData) {
      entries = JSON.parse(fileData);
    }
    entries.push(data);
    fs.writeFile('db.json', JSON.stringify(entries), (err) => {
      if (err) {
        console.error('Error writing to db.json:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      console.log('Data appended to db.json:', data);
      res.send('Form submitted successfully.');
    });
  });
});

app.get('/attacker', (req, res) => {
  res.sendFile(__dirname + '/public/attacker.html');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Display all entries in the terminal
fs.readFile('db.json', 'utf8', (err, data) => {
  if (err && err.code !== 'ENOENT') {
    console.error('Error reading db.json:', err);
    return;
  }
  const entries = data ? JSON.parse(data) : [];
  console.log('All entries in db.json:', entries);
});
