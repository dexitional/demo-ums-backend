"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hrsController_1 = __importDefault(require("../controller/hrsController"));
class HrsRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.controller = new hrsController_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        /* NSS Routes */
        this.router.get('/nss/all', this.controller.fetchNSSAll);
        this.router.post('/nss/register', this.controller.postNSSRegister);
        this.router.get('/nss/:id', this.controller.fetchNSS);
        this.router.get('/nss/person/:pin', this.controller.fetchNSSByPin);
        this.router.post('/nss', this.controller.postNSS);
        this.router.patch('/nss/:id', this.controller.updateNSS);
        this.router.delete('/nss/:id', this.controller.deleteNSS);
        /* Circulars & Notices Routes */
        this.router.get('/notices', this.controller.fetchNotices);
        this.router.get('/notices/nss', this.controller.fetchNSSNotices);
        this.router.get('/notices/:id', this.controller.fetchNotice);
        this.router.post('/notices', this.controller.postNotice);
        this.router.patch('/notices/:id', this.controller.updateNotice);
        this.router.delete('/notices/:id', this.controller.deleteNotice);
        /* NSS Service Request Routes */
        this.router.get('/services', this.controller.fetchServices);
        this.router.get('/services/:id', this.controller.fetchService);
        this.router.post('/services', this.controller.postService);
        this.router.patch('/services/:id', this.controller.updateService);
        this.router.delete('/services/:id', this.controller.deleteService);
        /* NSS Password Change  */
        this.router.post('/password/nss', this.controller.postNSSPassword);
        /* Units Routes  */
        this.router.get('/units', this.controller.fetchUnits);
        // /* Submission Routes */
        // this.router.get('/voters', this.controller.fetchVoters);
        // this.router.get('/votes', this.controller.fetchVotes);
        // this.router.get('/votes/:regno', this.controller.fetchVote);
        // this.router.post('/votes', this.controller.postVote);
        // this.router.patch('/votes/:regno', this.controller.updateVote);
        // /* roles */
        // this.router.get('/roles', this.controller.fetchRoles);
        // this.router.get('/roles/:id', this.controller.fetchRole);
        // this.router.post('/roles', this.controller.postRole); 
        // this.router.patch('/roles/:id', this.controller.updateRole);
        // this.router.delete('/roles/:id', this.controller.deleteRole)
    }
}
exports.default = new HrsRoute().router;
