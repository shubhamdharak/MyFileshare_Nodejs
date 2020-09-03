const mongoose = require('mongoose');

const ShareFile = new mongoose.Schema({
    fileName: {type: String, required: true},
    fileSize: {type: Number, required: true},
    filePath: {type: String, required: true},
    uuid: {type: String, required: true},
    sender: {type: String, required: false},
    receiver: {type: String, required: false},
},{timestamps: true});


module.exports = mongoose.model('File', ShareFile);