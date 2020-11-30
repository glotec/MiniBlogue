var express = require('express');
var bodyParser = require('body-parser');
var apiRouter = require('./apiRouter').router;

const app = express();

//Body Parser configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

app.use('/api/', apiRouter);

app.get('/', (req, res) => {
    res.send('salut');
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server listining on port ${PORT}...`));