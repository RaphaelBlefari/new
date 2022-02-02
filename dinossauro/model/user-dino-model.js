"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDino = void 0;
const dinossauro_model_1 = require("./dinossauro-model");
class UserDino {
    constructor() {
        this.IdSteam = "";
        this.IdServidor = "";
        this.IdSlot = "";
        this.Status = 0;
        this.Dinossauro = new dinossauro_model_1.Dinossauro;
    }
}
exports.UserDino = UserDino;
