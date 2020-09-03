require('./initDB');
const File = require('./models/file');

async function deleteFile() {
    const files = await File.find({ createdAt : { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000)} })
    if(files.length) {
        for (const file of files) {
            try {
                fs.unlinkSync(file.filePath);
                await file.remove();
                console.log(`successfully deleted ${file.fileName}`);
            } catch(err) {
                console.log(`error while deleting file ${err} `);
            }
        }
    }
    console.log('Job done!');

    deleteFile().then(process.exit);
}