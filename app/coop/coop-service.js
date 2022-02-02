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
exports.setCooptipo = exports.getCoop = void 0;
const coop_model_1 = require("./model/coop-model");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const fs = require('fs-extra');
const ENV_SERVERS = process.env.ENV_DATA_COOPS_PATH || "";
const getCoop = (idSteam) => __awaiter(void 0, void 0, void 0, function* () {
    let coop = new coop_model_1.Coop;
    try {
        coop = JSON.parse(fs.readFileSync(`${ENV_SERVERS}/${idSteam}.json`));
        let today = new Date();
        let dateCoop = new Date(coop.dataCoopExpiracao);
        coop.expirado = (dateCoop < today);
        return coop;
    }
    catch (ex) {
        coop.dataCoopExpiracao = new Date();
        coop.dataCoopExpiracao.setMonth(coop.dataCoopExpiracao.getMonth() + 999);
        coop.tipoCoop = "free";
        coop.steamid = idSteam;
        try {
            fs.writeFileSync(`${ENV_SERVERS}/${idSteam}.json`, JSON.stringify(coop, null, 4));
        }
        catch (ex) {
            console.log(ex);
        }
        return coop;
    }
});
exports.getCoop = getCoop;
const setCooptipo = (coop, staffSteamId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`${new Date().toLocaleString()} - Alteracao Coop - [Staff: ${staffSteamId}  -  User: ${coop.steamid} - Adicionado: ${coop.tipoCoop}]`);
    try {
        coop.dataCoopExpiracao = new Date;
        if (coop.tipoCoop != 'free') {
            coop.dataCoopExpiracao.setMonth(coop.dataCoopExpiracao.getMonth() + 1);
        }
        else {
            coop.dataCoopExpiracao.setMonth(coop.dataCoopExpiracao.getMonth() + 999);
        }
        let today = new Date();
        let dateCoop = new Date(coop.dataCoopExpiracao);
        coop.expirado = (dateCoop < today);
        fs.writeFileSync(`${ENV_SERVERS}/${coop.steamid}.json`, JSON.stringify(coop, null, 4));
    }
    catch (ex) {
        return coop;
    }
    return coop;
});
exports.setCooptipo = setCooptipo;
