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
    },
    jobs:{
        work:{
            last_updated: { type: Number },
            times_used_success: { type: Number },
            times_used_failed: { type: Number },
            cash_earned: { type: Number },
            cash_lost: { type: Number },
        },
        slut:{
            last_updated: { type: Number },
            times_used_success: { type: Number },
            times_used_failed: { type: Number },
            cash_earned: { type: Number },
            cash_lost: { type: Number },
        },
        crime:{
            last_updated: { type: Number },
            times_used_success: { type: Number },
            times_used_failed: { type: Number },
            cash_earned: { type: Number },
            cash_lost: { type: Number },
        },
        rob:{
            last_updated: { type: Number },
            times_used_success: { type: Number },
            times_used_failed: { type: Number },
            cash_earned: { type: Number },
            cash_lost: { type: Number },
        }
    },
    blackjack: {
        win: { type: Number },
        loss: { type: Number },
        push: { type: Number },
        cash_won: { type: Number },
        cash_lost: { type: Number },
        cash_spent: { type: Number },
    }
});

const User = mongoose.model('user', userSchema);
module.exports = User;