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
exports.getUrlSteamVerify = exports.getUrlSteamLogin = exports.getUrlSteamLogn = exports.getUserSteamIdStaff = exports.getUserSteamId = void 0;
const openid = __importStar(require("openid"));
const axios = __importStar(require("axios"));
const jwt = __importStar(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const fs = require('fs-extra');
const ENV_TOKEN_SECRET = process.env.ENV_TOKEN_SECRET || "";
const ENV_URL_OPENID_VERIFY = process.env.ENV_URL_OPENID_VERIFY || "";
const ENV_URL_OPENID_REALM = process.env.ENV_URL_OPENID_REALM || "";
const ENV_STEAM_KEY = process.env.ENV_STEAM_KEY || "";
const ENV_STAFFS = JSON.parse(process.env.ENV_STAFFS || `[{"idsteam": "76561198010996634","name": "Blefs"}]`);
function createToken(tokenPayload) {
    return jwt.sign({ tokenPayload }, ENV_TOKEN_SECRET, {
        expiresIn: "24h"
    });
}
const getUserSteamId = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        if (verifyToken(token)) {
            var decoded = jwt.verify(token, ENV_TOKEN_SECRET);
            resolve(decoded.tokenPayload.steamid);
        }
        reject();
    });
});
exports.getUserSteamId = getUserSteamId;
const getUserSteamIdStaff = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        if (verifyToken(token)) {
            var decoded = jwt.verify(token, ENV_TOKEN_SECRET);
            if (retornaUsuarioTipo(decoded.tokenPayload.steamid) == "administrador") {
                resolve(decoded);
            }
            else {
                reject();
            }
        }
        reject();
    });
});
exports.getUserSteamIdStaff = getUserSteamIdStaff;
function verifyToken(token) {
    try {
        jwt.verify(token, ENV_TOKEN_SECRET);
        return true;
    }
    catch (err) {
        return false;
    }
}
;
const getUrlSteamLogn = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        relyingPartyReturn().authenticate("https://steamcommunity.com/openid", false, function (err, authURL) {
            if (err) {
                reject(err);
            }
            if (authURL) {
                resolve(`{"urlAuthSteam":"${authURL}"}`);
            }
        });
    });
});
exports.getUrlSteamLogn = getUrlSteamLogn;
const getUrlSteamLogin = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        relyingPartyReturn().authenticate("https://steamcommunity.com/openid", false, function (err, authURL) {
            if (err) {
                reject(err);
            }
            if (authURL) {
                resolve(`{"urlAuthSteam":"${authURL}"}`);
            }
        });
    });
});
exports.getUrlSteamLogin = getUrlSteamLogin;
const getUrlSteamVerify = (request) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        relyingPartyReturn().verifyAssertion(request, function (err, result) {
            if (err) {
                reject(err);
            }
            if (result) {
                resolve(fetchIdentifier(result.claimedIdentifier));
            }
        });
    });
});
exports.getUrlSteamVerify = getUrlSteamVerify;
function fetchIdentifier(openid) {
    const steamID = openid.replace('https://steamcommunity.com/openid/id/', '');
    return new Promise((resolve, reject) => {
        axios.default.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${ENV_STEAM_KEY}&steamids=${steamID}`)
            .then(({ data }) => {
            let players = data.response.players;
            if (players.length == 0)
                throw new Error('Nenhum player encontrado ara seu steam ID.');
            let player = players[0];
            resolve(Object.entries(({
                token: createToken({ steamid: steamID }),
                steamid: steamID,
                nome: player.personaname,
                avatar_Small: player.avatarfull,
                tipo: retornaUsuarioTipo(steamID)
            })).map(([key, val]) => `${key}=${val}`).join('&'));
        });
    });
}
function retornaUsuarioTipo(steamid) {
    let staffs = [];
    try {
        staffs = JSON.parse(fs.readFileSync(`parametros/staffs.json`));
        if (staffs.filter(x => x.steamid == steamid).length > 0) {
            return "administrador";
        }
        else {
            console.log("Logado como User");
            return "";
        }
    }
    catch (ex) {
        return "";
    }
}
function relyingPartyReturn() {
    return new openid.RelyingParty(ENV_URL_OPENID_VERIFY, ENV_URL_OPENID_REALM, true, true, []);
}
