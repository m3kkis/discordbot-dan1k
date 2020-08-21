const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const botSchema = new Schema(
{
    name: { type: String, default: "DAN-1000" },
    bank: { type: Number, default: 0 },
});

const Bot = mongoose.model('bot', botSchema);
module.exports = Bot;