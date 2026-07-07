"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fmsController_1 = __importDefault(require("../controller/fmsController"));
const helper_1 = require("../util/helper");
class ApiRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.controller = new fmsController_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        /* Bank Payment API Services  */
        this.router.get('/services', (0, helper_1.apiLogger)('LOAD_API_SERVICES'), this.controller.loadPayServices);
        this.router.get('/services/:type', (0, helper_1.apiLogger)('LOAD_VOUCHER_FORMS'), this.controller.loadPayService);
        this.router.get('/services/:type/:refno', (0, helper_1.apiLogger)('VERIFY_STUDENT'), this.controller.loadPayService);
        this.router.post('/payservice', (0, helper_1.apiLogger)('SEND_TRANSACTION'), this.controller.payService);
    }
}
exports.default = new ApiRoute().router;
