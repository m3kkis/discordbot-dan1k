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
    store_sale: { type: Boolean, default: false },
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
        location: { type: String, default: 'arena'},
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
        description: { type: String, default: '<UNKNOWN>'},
        special: { type: String, default: '<UNKNOWN>'},
        level: { type: Number,  default: 1},
        points: { type: Number,  default: 0},
        points_upgrade: { type: Number,  default: 0},
        hp: { type: Number, default: 10},
        hp_max: { type: Number, default: 10},
        atk: { type: Number, default: 1},
        def: { type: Number, default: 1},
        chance: { type: Number, default: 0},
        img: { type: String, default: 'https://raw.githubusercontent.com/m3kkis/discordbot-dan1k/master/img/no_pet.jpg'},
        color: { type: String, default: '#03b6fc'},
        inBattle: { type: Boolean, default: false }
    }
});

const User = mongoose.model('user', userSchema);
module.exports = User;