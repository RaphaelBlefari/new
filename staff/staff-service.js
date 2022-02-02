"use strict";
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
exports.EditBanimento = exports.getBanimento = exports.editUserDinos = exports.getUserDinos = void 0;
const dinossauroService = __importStar(require("../dinossauro/dinossauroService"));
const banido_model_1 = require("./model/banido-model");
const fs = require('fs-extra');
const getUserDinos = (idSteam) => __awaiter(void 0, void 0, void 0, function* () {
    return dinossauroService.getUserDino(idSteam, false);
});
exports.getUserDinos = getUserDinos;
const editUserDinos = (user, idSteam) => __awaiter(void 0, void 0, void 0, function* () {
    return dinossauroService.editUserDino(user, idSteam, true);
});
exports.editUserDinos = editUserDinos;
const getBanimento = (idSteam) => __awaiter(void 0, void 0, void 0, function* () {
    let banidos = [];
    let banido = new banido_model_1.Banido;
    try {
        banidos = JSON.parse(fs.readFileSync(`parametros/banidos.json`));
        if (banidos.filter(x => x.steamid == idSteam).length > 0) {
            return banidos.filter(x => x.steamid == idSteam)[0];
        }
        else {
            banido.dataBanimento = "";
            banido.steamid = idSteam;
        }
    }
    catch (ex) {
        return banido;
    }
    return banido;
});
exports.getBanimento = getBanimento;
const EditBanimento = (banido) => __awaiter(void 0, void 0, void 0, function* () {
    let banidos = [];
    try {
        banidos = JSON.parse(fs.readFileSync(`parametros/banidos.json`));
        if (banidos.filter(x => x.steamid == banido.steamid).length > 0) {
            banidos.filter(x => x.steamid == banido.steamid).forEach(x => {
                x.dataBanimento = banido.dataBanimento;
                x.steamid = banido.steamid;
                x.motivo = banido.motivo;
                x.diasBanidos = banido.diasBanidos;
            });
        }
        else {
            banidos.push(banido);
        }
        try {
            fs.writeFileSync(`parametros/banidos.json`, JSON.stringify(banidos, null, 4));
        }
        catch (ex) {
            console.log("erro ao banir" + ex);
        }
    }
    catch (ex) {
        return banido;
    }
    return banido;
});
exports.EditBanimento = EditBanimento;
