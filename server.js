const express = require('express');
const app = express()
const path = require('path')
const port = process.env.PORT || 3000
require('./initDB')
const core = require('cors');

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.json());
app.use(core());

//Routes
app.get('/', (req,res)=> {
    res.render('index.ejs')
});
app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'))

app.listen(port, ()=> {
    console.log(`Server running on ${port}`);
})