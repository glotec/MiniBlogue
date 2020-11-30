const express = require('express');

const app = express();

// const usersRoute = require('./routes/api/users');

// app.use('/', usersRoute);

app.get('/', (req, res) => {
    res.send('salut');
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server listining on port ${PORT}...`));