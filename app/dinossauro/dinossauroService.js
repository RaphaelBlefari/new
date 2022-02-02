'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.retornaDinoDBSpecies = exports.getUserDino = exports.editUserDino = void 0;
const user_dino_model_1 = require("./model/user-dino-model");
const user_model_1 = require("./model/user-model");
const dotenv = __importStar(require("dotenv"));
const dinossauro_model_1 = require("./model/dinossauro-model");
const uuid_1 = require("uuid");
const coopService = __importStar(require("../coop/coop-service"));
dotenv.config();
const fs = require('fs-extra');
const ENV_SERVERS = JSON.parse(process.env.ENV_SERVERS || ``);
const ENV_DATA_USUARIOS_SLOT = process.env.ENV_DATA_USUARIOS_SLOT || ``;
const ENV_USUARIOS_SLOT_FREE_QTD = Number(process.env.ENV_USUARIOS_SLOT_FREE_QTD) || 2;
const ENV_USUARIOS_SLOT_PREMIUM_QTD = Number(process.env.ENV_USUARIOS_SLOT_PREMIUM_QTD) || 1;
const ENV_USUARIOS_SLOT_DELUX_QTD = Number(process.env.ENV_USUARIOS_SLOT_DELUX_QTD) || 2;
const editUserDino = (user, idSteam, staff, idSteamStaff) => __awaiter(void 0, void 0, void 0, function* () {
    if (validaPreludeCoins(user.preludeCoins, idSteam, staff, idSteamStaff)) {
        user.userDino.filter(x => x.IdServidor != "").forEach((udinos, index) => {
            let servidor = ENV_SERVERS.filter(x => x.name == udinos.IdServidor)[0];
            if (udinos.IdSlot != "" && udinos.Dinossauro.CharacterClass && udinos.Status == 3 || udinos.IdSlot != "" && udinos.Dinossauro.CharacterClass && udinos.Status == 2) {
                try {
                    if (udinos.Status == 3) {
                        console.log(`${new Date().toLocaleString()} - Excluir Manual - IdSteam: ${user.idSteam} -  [Servidor: ${servidor.name} -  Dino Removido: ${udinos.Dinossauro.CharacterClass} - ${udinos.Dinossauro.Growth}]`);
                        udinos.IdServidor = "";
                    }
                    udinos.IdServidor = "";
                    if (fs.existsSync(`${servidor.path}/${idSteam}.json`)) {
                        fs.unlink(`${servidor.path}/${idSteam}.json`);
                    }
                    else {
                        console.log(`${new Date().toLocaleString()} - Tentativa Duplicidade, Enviando slot dino morto - IdSteam: ${user.idSteam} -  [Servidor: ${servidor.name} -  Dino: ${udinos.Dinossauro.CharacterClass} - ${udinos.Dinossauro.Growth}]`);
                    }
                }
                catch (_a) {
                    udinos.IdServidor = "";
                }
            }
            else if (udinos.Dinossauro.CharacterClass) {
                fs.writeFileSync(`${servidor.path}/${idSteam}.json`, JSON.stringify(udinos.Dinossauro, null, 4));
            }
        });
        try {
            let userSaveEdit = new user_model_1.User;
            userSaveEdit.idSteam = user.idSteam;
            userSaveEdit.preludeCoins = user.preludeCoins;
            userSaveEdit.qtdSlot = user.qtdSlot;
            userSaveEdit.userDino = user.userDino.filter(x => x.IdServidor == "" && x.Dinossauro.CharacterClass && x.Status != 3);
            fs.writeFileSync(`${ENV_DATA_USUARIOS_SLOT}/${idSteam}.json`, JSON.stringify(userSaveEdit, null, 4));
        }
        catch (_a) {
            console.log("erro ao gravar slot");
        }
        logsEdicaoDino(user);
        return exports.getUserDino(idSteam, false);
    }
    return new user_model_1.User;
});
exports.editUserDino = editUserDino;
const getUserDino = (idSteam, external) => __awaiter(void 0, void 0, void 0, function* () {
    let user = new user_model_1.User;
    user.idSteam = idSteam;
    // Busca Slots
    try {
        user = JSON.parse(fs.readFileSync(`${ENV_DATA_USUARIOS_SLOT}/${idSteam}.json`));
        user.qtdSlot = yield retornaQuantidadeSlots(idSteam);
    }
    catch (ex) {
        user.preludeCoins = 1;
        user.qtdSlot = yield retornaQuantidadeSlots(idSteam);
        user.userDino = [];
    }
    // Buscar Servidores
    let servidores = ENV_SERVERS;
    servidores.forEach(server => {
        let userDino = new user_dino_model_1.UserDino;
        userDino.IdSteam = idSteam;
        userDino.IdServidor = server.name;
        try {
            userDino.Dinossauro = JSON.parse(fs.readFileSync(`${server.path}/${idSteam}.json`));
            user.userDino.push(userDino);
        }
        catch (_a) {
            userDino.Dinossauro = new dinossauro_model_1.Dinossauro;
            user.userDino.push(userDino);
        }
    });
    //  Adiciona Slots disponiveis
    let slotsFreeQtdRestantes = user.userDino.filter(x => x.IdServidor == "").length;
    while (slotsFreeQtdRestantes < user.qtdSlot) {
        let userDino = new user_dino_model_1.UserDino;
        userDino.IdServidor = "";
        userDino.IdSteam = idSteam;
        userDino.IdSlot = "";
        userDino.Dinossauro = new dinossauro_model_1.Dinossauro;
        user.userDino.push(userDino);
        slotsFreeQtdRestantes++;
    }
    if (external) {
        let contemAlteracao = false;
        let dinos = user.userDino;
        let dinosUnicos = [];
        dinos.filter(x => x.Dinossauro.CharacterClass).forEach(((dino, ia) => {
            if (dinosUnicos.filter(x => x.Dinossauro.CharacterClass.includes(dino.Dinossauro.CharacterClass.substring(0, 3))).length > 0) {
                if (dino.IdServidor != "") {
                    dino.IdSlot = uuid_1.v4();
                    dino.Status = 3;
                    console.log(`${new Date().toLocaleString()} - Duplicidade - IdSteam: ${user.idSteam} -  [Servidor: ${dino.IdServidor} -  Dino Removido: ${dino.Dinossauro.CharacterClass} - ${dino.Dinossauro.Growth}]`);
                }
                else {
                    console.log(`${new Date().toLocaleString()} - Duplicidade - IdSteam: ${user.idSteam} -  [Local: Slot -  Dino Removido: ${dino.Dinossauro.CharacterClass} - ${dino.Dinossauro.Growth}]`);
                    dino.Dinossauro = new dinossauro_model_1.Dinossauro;
                }
                contemAlteracao = true;
            }
            else {
                dinosUnicos.push(dino);
            }
        }));
        if (contemAlteracao) {
            user.userDino = dinos;
            return exports.editUserDino(JSON.parse(JSON.stringify(user)), idSteam, false);
        }
        ;
    }
    user.qtdSlot = yield retornaQuantidadeSlots(idSteam);
    user.userDino = user.userDino.sort((a, b) => a.IdSlot.localeCompare(b.IdSlot));
    return user;
});
exports.getUserDino = getUserDino;
function logsEdicaoDino(user) {
    user.userDino = user.userDino.filter(x => x.Dinossauro.CharacterClass);
    let dinosLog = "";
    user.userDino.filter(x => x.Dinossauro.CharacterClass != undefined).forEach(y => {
        if (y.IdServidor != "") {
            dinosLog = `${dinosLog} - [Servidor: ${y.IdServidor}, Dino: ${y.Dinossauro.CharacterClass}, Growth: ${y.Dinossauro.Growth}]`;
        }
        else {
            dinosLog = `${dinosLog} - [Em Slot , Dino: ${y.Dinossauro.CharacterClass}, Growth: ${y.Dinossauro.Growth}]`;
        }
    });
    console.log(`${new Date().toLocaleString()} - Alteração - IdSteam:  ${user.idSteam} ${dinosLog} `);
}
function validaPreludeCoins(preludeCoin, idSteam, staff, idSteamStaff) {
    let user = new user_model_1.User;
    user.idSteam = idSteam;
    try {
        user = JSON.parse(fs.readFileSync(`${ENV_DATA_USUARIOS_SLOT}/${idSteam}.json`));
    }
    catch (ex) {
        user.preludeCoins = 1;
        user.qtdSlot = retornaQuantidadeSlots(idSteam);
        user.userDino = [];
    }
    if (!staff) {
        if (preludeCoin > user.preludeCoins) {
            console.log(`${idSteam} - PreludeCoin Hacker - Solicitado: ${preludeCoin}, Atual: ${user.preludeCoins} `);
            return false;
        }
    }
    else {
        if (preludeCoin > user.preludeCoins) {
            console.log(`${new Date().toLocaleString()} - PreludeCoin Staff - [Staff: ${idSteamStaff}  -  User: ${idSteam} - Adicionado: ${preludeCoin}, Atual: ${user.preludeCoins} ]`);
        }
    }
    if (preludeCoin < user.preludeCoins) {
        console.log(`${new Date().toLocaleString()} - ${idSteam} - PreludeCoinAlteracao  - Total: ${user.preludeCoins} , Gasto - ${user.preludeCoins - preludeCoin} , Atual - ${preludeCoin}`);
    }
    return true;
}
const retornaDinoDBSpecies = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return JSON.parse(fs.readFileSync(`parametros/dinos.json`));
    }
    catch (ex) {
    }
    return [];
});
exports.retornaDinoDBSpecies = retornaDinoDBSpecies;
function retornaQuantidadeSlots(idSteam) {
    return new Promise((resolve, reject) => {
        coopService.getCoop(idSteam).then(x => {
            if (x.tipoCoop == "free") {
                resolve(ENV_USUARIOS_SLOT_FREE_QTD);
            }
            else if (x.tipoCoop == "premium" && !x.expirado) {
                resolve(ENV_USUARIOS_SLOT_FREE_QTD + ENV_USUARIOS_SLOT_PREMIUM_QTD);
            }
            else if (x.tipoCoop == "delux" && !x.expirado) {
                resolve(ENV_USUARIOS_SLOT_FREE_QTD + ENV_USUARIOS_SLOT_DELUX_QTD);
            }
            else {
                resolve(ENV_USUARIOS_SLOT_FREE_QTD);
            }
        });
    });
}
