const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
{
    dsid: { type: String },
    tag: { type: String },
    username: { type: String },
    lootbox: { type: Number, default: 0 },
    inventorySize: { type: Number, default: 5 },
    inventory: { type: Array, default: [] },
    economy: {
        cash: { type: Number, default: 1000 },
        bank: { type: Number, default: 1000 },
    },
    jobs:{
        work:{
            last_updated: { type: Number, default: 0 },
        },
        slut:{
            last_updated: { type: Number, default: 0 },
        },
        crime:{
            last_updated: { type: Number, default: 0 },
        },
        rob:{
            last_updated: { type: Number, default: 0 },
        }
    }
});

const User = mongoose.model('user', userSchema);
module.exports = User;