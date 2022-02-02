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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dinossauroController = __importStar(require("./dinossauro/dinossauroController"));
const slotController = __importStar(require("./dinossauro/slotController"));
const authController = __importStar(require("./auth/controller/authController"));
const staffController = __importStar(require("./staff/staff-controller"));
const coopController = __importStar(require("./coop/coop-controller"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
var corsOptions = {
    origin: 'http://localhost:3000/',
    optionsSuccessStatus: 200 // For legacy browser support
};
const app = express_1.default();
const PORT = 3000;
const routes = express_1.default.Router();
routes.use(cors_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/api/", routes);
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
// New Controllers
routes.get('/auth/steam', authController.AuthSteamLogin);
routes.get('/auth/verify', authController.AuthSteamVerify);
routes.get('/auth/teste', authController.teste);
// User Dinos
routes.post('/edicao/dino', authController.verifyJWTAddSteamIdRequest, dinossauroController.editUserDinos);
routes.get('/slot/:idsteam', authController.verifyJWTAddSteamIdRequest, slotController.getUserSlots);
routes.get('/userslotsativos/:idsteam', authController.verifyJWTAddSteamIdRequest, slotController.retornaUserSlotsAtivos);
routes.get('/userdinos', authController.verifyJWTAddSteamIdRequest, dinossauroController.getUserDinos);
routes.get('/userdinos/species', authController.verifyJWTAddSteamIdRequest, dinossauroController.retornaDinoSpecies);
// Staffs
routes.get('/staff/userdinos/:id', authController.verifyJWTAddSteamIdRequestStaff, staffController.getUserDinos);
routes.post('/staff/userdinosedicao', authController.verifyJWTAddSteamIdRequestStaff, staffController.editUserDinos);
routes.get('/staff/getuserbanimento/:id', authController.verifyJWTAddSteamIdRequestStaff, staffController.getBanimento);
routes.post('/staff/edituserbanimento', authController.verifyJWTAddSteamIdRequestStaff, staffController.editBanimento);
// Coops
routes.get('/coop/usercoop', authController.verifyJWTAddSteamIdRequest, coopController.getUserCoop);
routes.get('/coop/usuarioscoop/:id', authController.verifyJWTAddSteamIdRequestStaff, coopController.getCoop);
routes.post('/coop/alterausuariocoop', authController.verifyJWTAddSteamIdRequestStaff, coopController.setCoopTipo);
