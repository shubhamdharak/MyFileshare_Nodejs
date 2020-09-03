const express = require('express');
const app = express()
const path = require('path')
const port = process.env.PORT || 3000
require('./initDB')

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.json());

//Routes
app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'))

app.listen(port, ()=> {
    console.log(`Server running on ${port}`);
})