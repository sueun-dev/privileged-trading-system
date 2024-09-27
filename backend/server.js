// server.js (Node.js with Express.js)

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes');
const cron = require('node-cron');
const { deactivateAllUsers } = require('./controllers/userController');

app.use(bodyParser.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Schedule a cron job to deactivate all users on the 1st of every month at 00:00
cron.schedule('0 0 1 * *', () => {
  deactivateAllUsers();
});
