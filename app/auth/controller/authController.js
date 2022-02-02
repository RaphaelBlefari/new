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
exports.verifyJWTAddSteamIdRequestStaff = exports.verifyJWTAddSteamIdRequest = exports.teste = exports.AuthSteamVerify = exports.AuthSteamLogin = void 0;
const authService = __importStar(require("../service/authService"));
const staffService = __importStar(require("../../staff/staff-service"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const ENV_FRONTEND_REDIRECT = process.env.ENV_FRONTEND_REDIRECT || "http://localhost:4200";
const AuthSteamLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).send((yield authService.getUrlSteamLogin().then(res => {
            return res;
        })));
    }
    catch (e) {
        res.status(404).send(e.message);
    }
});
exports.AuthSteamLogin = AuthSteamLogin;
const AuthSteamVerify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.redirect(`${ENV_FRONTEND_REDIRECT}?${yield authService.getUrlSteamVerify(req)}`);
    }
    catch (e) {
        res.status(404).send(e.message);
    }
});
exports.AuthSteamVerify = AuthSteamVerify;
const teste = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).send({});
    }
    catch (e) {
        res.status(404).send(e.message);
    }
});
exports.teste = teste;
const verifyJWTAddSteamIdRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers['authorization'];
        if (req.headers["origin"] != ENV_FRONTEND_REDIRECT || !token) {
            console.log((yield authService.getUserSteamId(token)) + " - " + req.headers["origin"] + " --" + ENV_FRONTEND_REDIRECT);
            return res.status(401).json({ message: 'Versão do navegador invalida. Err: 335549R2' });
        }
        req.headers.steamid = yield authService.getUserSteamId(token);
        let banido = yield staffService.getBanimento(req.headers.steamid);
        if (banido.dataBanimento != "") {
            res.status(403).json({ auth: false, messagem: "Usuario Banido do Painel" });
        }
        else {
            next();
        }
    }
    catch (_a) {
        res.status(401).json({ auth: false, messagem: "Erro ao validar token" });
    }
});
exports.verifyJWTAddSteamIdRequest = verifyJWTAddSteamIdRequest;
const verifyJWTAddSteamIdRequestStaff = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers['authorization'];
        if (req.headers["origin"] != ENV_FRONTEND_REDIRECT || !token) {
            return res.status(401).json({ message: 'Versão do navegador invalida. Err: 335549R2' });
        }
        req.headers.steamid = yield authService.getUserSteamIdStaff(token);
        next();
    }
    catch (_b) {
        res.status(401).json({ auth: false, messagem: "Erro ao validar token" });
    }
});
exports.verifyJWTAddSteamIdRequestStaff = verifyJWTAddSteamIdRequestStaff;
