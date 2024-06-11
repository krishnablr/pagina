//mongoose
const mongoose = require('mongoose');

//user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

//user model
const User = mongoose.model('User', userSchema);

//export the model
module.exports = User;

