const Discord = require("discord.js");

class PetHandler {

    constructor(){
        
    }

    createPet(name, _User){
        console.log("[PETHANDLER] Create new pet -> " + name);

        _User.pet.name = name;
        _User.pet.description = "<UNKNOWN>";
        _User.pet.level = 1;
        _User.pet.points = 0;
        _User.pet.hp = 10;
        _User.pet.atk = 1;
        _User.pet.def = 1;
        _User.pet.img = "";
        _User.save();
    }

    changeDescription(desc, _User){
        console.log("[PETHANDLER] Changed pet description");

        _User.pet.description = desc;
        _User.save();
    }

    

}

module.exports = PetHandler;