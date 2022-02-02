"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coop = void 0;
class Coop {
    constructor() {
        this.steamid = "";
        this.tipoCoop = "";
        this.dataCoopExpiracao = new Date;
        this.expirado = false;
    }
}
exports.Coop = Coop;
