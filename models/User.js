const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
{
    dsid: { type: String },
    tag: { type: String },
    username: { type: String },
    experience: {
        level:{ type: Number, default: 1 },
        points:{ type: Number, default: 0 }
    },
    ingame: { type: Boolean, default: false },
    rob_protection: { type: Boolean, default: false },
    bj_insurance: { type: Boolean, default: false },
    isMayor: { type: Boolean, default: false },
    isPolice: { type: Boolean, default: false },
    arrest:{ 
        priceBail: { type: Number, default: 0 },
        isArrested:{ type: Boolean, default: false },
        last_updated: { type: Number, default: 0 },
        canEscape: { type: Boolean, default: true },
    },
    inventorySize: { type: Number, default: 5 },
    inventory: { type: Array, default: [] },
    upgrades:{
        farm:{
            level_quantity: { type: Number, default: 1 },
            level_quality: { type: Number, default: 0 },
        }
    },
    travel:{
        location: { type: String, default: 'city'},
        isTraveling: { type: Boolean, default: false },
        last_updated: { type: Number, default: 0 },
        last_method: { type: String },
        transportation: {
            hasBicycle: { type: Boolean, default: false },
            hasCar: { type: Boolean, default: false },
            hasBoat: { type: Boolean, default: false },
            hasHelicopter: { type: Boolean, default: false },
            hasPortalGun: { type: Boolean, default: false }
        }
    },
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
        },
        harvest:{
            last_updated: { type: Number, default: 0 },
        },
        mine:{
            last_updated: { type: Number, default: 0 },
        }
    },
    pet:{
        name: { type: String },
        description: { type: String },
        level: { type: Number},
        points: { type: Number},
        hp: { type: Number},
        atk: { type: Number},
        def: { type: Number},
        img: { type: String },
        color: { type: String },
    }
});

const User = mongoose.model('user', userSchema);
module.exports = User;