const Discord = require("discord.js");

class PetHandler {

    constructor(){
        
    }

    createPet(name, _User){
        console.log("[PETHANDLER] Create new pet -> " + name);

        _User.pet.name = name;
        _User.pet.description = "<UNKNOWN>";
        _User.pet.special = "<UNKNOWN>";
        _User.pet.level = 1;
        _User.pet.points = 0;
        _User.pet.hp = 10;
        _User.pet.atk = 1;
        _User.pet.def = 1;
        _User.pet.img = "https://raw.githubusercontent.com/m3kkis/discordbot-dan1k/master/img/no_pet.jpg";
        _User.pet.color = "#03b6fc";
        _User.save();
    }

    changeDescription(desc, _User){
        console.log("[PETHANDLER] Changed pet description");

        _User.pet.description = desc;
        _User.save();
    }

    deletePet(_User){
        console.log("[PETHANDLER] Deleting pet");
        _User.pet = undefined;
        _User.save();
    }

    changeColor(color, _User){
        console.log("[PETHANDLER] Changed pet color");

        _User.pet.color = color;
        _User.save();
    }

    changeImage(img, _User){
        console.log("[PETHANDLER] Changed pet image");

        _User.pet.img = img;
        _User.save();
    }

    changeSpecial(spec, _User){
        console.log("[PETHANDLER] Changed pet special");

        _User.pet.special = spec;
        _User.save();
    }

}

module.exports = PetHandler;