const express = require('express');
const app = express()
const path = require('path');
const File = require('./models/file');
const fs = require('fs')
const port = process.env.PORT || 3000
require('./initDB')
const core = require('cors');
// const { delete } = require('./routes/show');
// // const { delete } = require('./routes/show');

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
     setInterval(async()=> {
        const files =  await File.find({ createdAt : { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000)} })
            if(files.length) {
                for (const file of files) {
                    try {
                        file.deleteOne();
                        fs.unlinkSync(file.filePath);
                        await file.remove();
                        console.log(`successfully deleted ${file.fileName}`);
                    } catch(err) {
                        console.log(`error while deleting file ${err} `);
                    }
                }
            }
            console.log('Job done!');
    },24 * 60 * 60 * 1000);
        
            // deleteFile().then(process.exit);
    
});