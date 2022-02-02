'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSlots = exports.retornaUserSlotsAtivos = void 0;
const user_slots_dinos_ativos_model_1 = require("./model/user-slots-dinos-ativos-model");
const user_slots_model_1 = require("./model/user-slots-model");
const fs = require('fs');
const retornaUserSlotsAtivos = (idSteam) => __awaiter(void 0, void 0, void 0, function* () {
    const userSlotsDinosAtivos = [];
    for (var x = 1; x <= 2; ++x) {
        const userSlotsDinosAtivo = new user_slots_dinos_ativos_model_1.UserSlotsDinosAtivo();
        userSlotsDinosAtivo.IdSteam = idSteam;
        userSlotsDinosAtivo.IdServidor = `servidor-${x}`;
        userSlotsDinosAtivo.Dinossauro = retornaJson(`Z:/${userSlotsDinosAtivo.IdServidor}/${idSteam}.json`, idSteam);
        userSlotsDinosAtivos.push(userSlotsDinosAtivo);
    }
    return userSlotsDinosAtivos;
});
exports.retornaUserSlotsAtivos = retornaUserSlotsAtivos;
const getUserSlots = (idSteam) => __awaiter(void 0, void 0, void 0, function* () {
    return retornaJson(`Z:/data-usuarios/${idSteam}.json`, idSteam);
});
exports.getUserSlots = getUserSlots;
function retornaJson(url, idSteam) {
    try {
        if (ValidaUserArquivo(url, idSteam)) {
            let rawdata = fs.readFileSync(url, idSteam);
            return JSON.parse(rawdata);
        }
    }
    catch (ex) {
        return ex;
    }
}
function ValidaUserArquivo(url, idString) {
    try {
        if (fs.existsSync(url)) {
            return true;
        }
    }
    catch (err) {
        let userSlots = new user_slots_model_1.UserSlots;
        userSlots.IdSteam = idString;
        fs.writeFile(url, userSlots, 'utf8');
    }
    return false;
}
