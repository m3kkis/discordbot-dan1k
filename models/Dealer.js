const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dealerSchema = new Schema(
{
    name: { type: String },
    win: { type: Number },
    loss: { type: Number },
    push: { type: Number },
    cash_won: { type: Number },
    cash_lost: { type: Number },
});

const Dealer = mongoose.model('dealer', dealerSchema);
module.exports = Dealer;