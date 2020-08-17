const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
{
    dsid: { type: String },
    tag: { type: String },
    username: { type: String },
    economy: {
        cash: { type: Number },
        bank: { type: Number },
    }
});

const User = mongoose.model('user', userSchema);
module.exports = User;