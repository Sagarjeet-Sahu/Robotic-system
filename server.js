const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Create or connect to the SQLite database
const db = new sqlite3.Database(':memory:');

// Create table to store robotic data
db.serialize(() => {
  db.run("CREATE TABLE robotic_data (id INTEGER PRIMARY KEY AUTOINCREMENT, batteryLevel INTEGER, status TEXT, log TEXT)");
});

// Populate initial data
db.serialize(() => {
  const initialData = [
    { batteryLevel: 80, status: 'Active', log: 'Activity 1' },
    { batteryLevel: 70, status: 'Idle', log: 'Activity 2' },
    { batteryLevel: 90, status: 'Charging', log: 'Activity 3' }
  ];

  initialData.forEach(({ batteryLevel, status, log }) => {
    db.run("INSERT INTO robotic_data (batteryLevel, status, log) VALUES (?, ?, ?)", [batteryLevel, status, log]);
  });
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Endpoint to fetch robotic data
app.get('/api/data', (req, res) => {
  db.get("SELECT * FROM robotic_data ORDER BY id DESC LIMIT 1", (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
    } else {
      res.json({
        batteryLevel: row.batteryLevel,
        status: row.status,
        logs: [row.log]
      });
    }
  });
});

// Endpoint to update robotic data
app.post('/api/update', (req, res) => {
  const { batteryLevel, status, log } = req.body;

  db.run("INSERT INTO robotic_data (batteryLevel, status, log) VALUES (?, ?, ?)", [batteryLevel, status, log], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
    } else {
      res.send('Data updated successfully');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
