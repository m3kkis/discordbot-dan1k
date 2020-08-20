const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
{
    dsid: { type: String },
    tag: { type: String },
    username: { type: String },
    lootbox: { type: Number, default: 0 },
    economy: {
        cash: { type: Number, default: 1000 },
        bank: { type: Number, default: 1000 },
    },
    jobs:{
        work:{
            last_updated: { type: Number, default: 0 },
            times_used_success: { type: Number, default: 0 },
            times_used_failed: { type: Number, default: 0 },
            cash_earned: { type: Number, default: 0 },
            cash_lost: { type: Number, default: 0 },
        },
        slut:{
            last_updated: { type: Number, default: 0 },
            times_used_success: { type: Number, default: 0 },
            times_used_failed: { type: Number, default: 0 },
            cash_earned: { type: Number, default: 0 },
            cash_lost: { type: Number, default: 0 },
        },
        crime:{
            last_updated: { type: Number, default: 0 },
            times_used_success: { type: Number, default: 0 },
            times_used_failed: { type: Number, default: 0 },
            cash_earned: { type: Number, default: 0 },
            cash_lost: { type: Number, default: 0 },
        },
        rob:{
            last_updated: { type: Number, default: 0 },
            times_used_success: { type: Number, default: 0 },
            times_used_failed: { type: Number, default: 0 },
            cash_earned: { type: Number, default: 0 },
            cash_lost: { type: Number, default: 0 },
        }
    },
    blackjack: {
        win: { type: Number, default: 0 },
        loss: { type: Number, default: 0 },
        push: { type: Number, default: 0 },
        cash_won: { type: Number, default: 0 },
        cash_lost: { type: Number, default: 0 },
        cash_spent: { type: Number, default: 0 },
    },
});

const User = mongoose.model('user', userSchema);
module.exports = User;