const { Router } = require("express");
const multer  = require('multer');
const router = new Router()
const {v4: uuid4} = require('uuid')

const File = require('../models/file')

const storage = multer.diskStorage({
    destination: (req, file, cb)=> cb(null, 'uploads/'),
    filename: (req, file, cb)=>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null,uniqueSuffix + file.originalname)
    }
});

let upload = multer({
    storage, 
    limits: {fileSize: 100000* 100}
}).single('myFile');

router.post('/',(req, res) =>{
    
    upload(req, res,async (err)=>{
        if(!req.file) {
            return res.json({error: "All Field are required."})
        }
        if(err){
            return res.staus(500).send({error: err.message})
        }
        const file = new File({
            fileName: req.file.filename,
            uuid: uuid4(),
            filePath: req.file.path,
            fileSize: req.file.size
        });
        const response = await file.save()
        return res.json({file: `${process.env.APP_BASE_URL}/files/${response.uuid}`})
    });

});

router.post('/send', async (req, res) => {
    const { uuid, emailTo, emailFrom, expiresIn } = req.body;
    if(!uuid || !emailTo || !emailFrom) {
        return res.status(422).send({ error: 'All fields are required except expiry.'});
    }
    // Get data from db 
    try {
      const file = await File.findOne({ uuid: uuid });
      if(file.sender) {
        return res.status(422).send({ error: 'Email already sent once.'});
      }
      file.sender = emailFrom;
      file.receiver = emailTo;
      const response = await file.save();
      // send mail
      const sendMail = require('../services/emailService');
      sendMail({
        from: emailFrom,
        to: emailTo,
        subject: 'Myshare file sharing',
        text: `${emailFrom} shared a file with you.`,
        html: require('../services/emailTemplate')({
                  emailFrom, 
                  downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email` ,
                  size: parseInt(file.fileSize/1000) + ' KB',
                  expires: '24 hours'
              })
      }).then(() => {
        return res.json({success: true});
      }).catch(err => {
        console.log(err);
        return res.status(500).json({error: 'Error in email sending.'});
      });
  } catch(err) {
    console.log(err);
    return res.status(500).send({ error: 'Something went wrong.'});
  }
  
  });
module.exports = router;