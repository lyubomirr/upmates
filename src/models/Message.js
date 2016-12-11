var mongoose = require('mongoose');
Schema = mongoose.Schema;
var MessageSchema = new Schema({
    sender: {
        id: String,
        firstName: String,
        lastName: String,
        email: String
    },
    reciever: {
        id: String,
        firstName: String,
        lastName: String,
        email: String
    },
    dateSent: {
        type: Date,
        default: Date.now
    },
    title: String,
    body: String
});

module.exports = mongoose.model('Message', MessageSchema);