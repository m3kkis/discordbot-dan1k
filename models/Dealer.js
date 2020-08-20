const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dealerSchema = new Schema(
{
    name: { type: String, default: "dan-1000" },
    win: { type: Number, default: 0 },
    loss: { type: Number, default: 0 },
    push: { type: Number, default: 0 },
    cash_won: { type: Number, default: 0 },
    cash_lost: { type: Number, default: 0 },
});

const Dealer = mongoose.model('dealer', dealerSchema);
module.exports = Dealer;