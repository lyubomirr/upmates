var mongoose = require('mongoose');
Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var AdminSchema = new Schema({
    password: String
});

AdminSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

AdminSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('Admin', AdminSchema);

