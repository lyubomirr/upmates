var mongoose = require('mongoose');
Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var AccountSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    password: String,
    firstName: String,
    lastName: String,
    country: String,
    position: String,
    age: {
        type:Number,
        min: 13,
        max: 90
    },
    gender: String,
    education: String,
    city: String,
    phone: String,
    languages: String,
    aboutMe: String,
    skills: String,
    workTerms: String,
    createdOn: {
        type:Date,
        default:Date.now
    },
    imageURL: {
        type:String,
        default:" "
    },
    fb: {
        id:String,
        access_token: String
    },
    google: {
        id:String,
        access_token: String
    }
});

AccountSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

AccountSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('Account', AccountSchema);


