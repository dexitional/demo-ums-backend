"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const amsController_1 = __importDefault(require("../controller/amsController"));
class AmsRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.controller = new amsController_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        /* Session */
        this.router.get('/sessions', this.controller.fetchSessions);
        this.router.get('/sessions/list', this.controller.fetchSessionList);
        this.router.get('/sessions/:id', this.controller.fetchSession);
        this.router.get('/sessions/:id/activate', this.controller.ActivateSession);
        this.router.post('/sessions', this.controller.postSession);
        this.router.patch('/sessions/:id', this.controller.updateSession);
        this.router.delete('/sessions/:id', this.controller.deleteSession);
        /* Voucher */
        this.router.get('/vouchers', this.controller.fetchVouchers);
        this.router.get('/vouchers/list', this.controller.fetchVoucherList);
        this.router.get('/vouchers/:id', this.controller.fetchVoucher);
        this.router.post('/vouchers/:id/sell', this.controller.sellVoucher);
        this.router.post('/vouchers/:id/recover', this.controller.recoverVoucher);
        this.router.post('/vouchers', this.controller.postVoucher);
        this.router.patch('/vouchers/:id', this.controller.updateVoucher);
        this.router.delete('/vouchers/:id', this.controller.deleteVoucher);
        /* Letter */
        this.router.get('/letters', this.controller.fetchLetters);
        this.router.get('/letters/list', this.controller.fetchLetterList);
        this.router.get('/letters/:id', this.controller.fetchLetter);
        this.router.post('/letters', this.controller.postLetter);
        this.router.patch('/letters/:id', this.controller.updateLetter);
        this.router.delete('/letters/:id', this.controller.deleteLetter);
        /* Applicant */
        this.router.get('/applicants', this.controller.fetchApplicants);
        this.router.get('/applicants/:id', this.controller.fetchApplicant);
        this.router.get('/applicants/:id/preview', this.controller.fetchApplicantPreview);
        this.router.post('/applicants', this.controller.postApplicant);
        this.router.patch('/applicants/:id', this.controller.updateApplicant);
        this.router.delete('/applicants/:id', this.controller.deleteApplicant);
        /* Shortlist */
        this.router.get('/shortlists', this.controller.fetchShortlists);
        this.router.get('/shortlists/:id', this.controller.fetchShortlist);
        this.router.post('/shortlists', this.controller.postShortlist);
        this.router.patch('/shortlists/:id', this.controller.updateShortlist);
        this.router.delete('/shortlists/:id', this.controller.deleteShortlist);
        /* Matriculants */
        this.router.get('/matriculants', this.controller.fetchMatriculants);
        this.router.get('/matriculants/list', this.controller.fetchMatriculantList);
        this.router.get('/matriculants/:id', this.controller.fetchMatriculant);
        this.router.post('/matriculants', this.controller.postMatriculant);
        this.router.patch('/matriculants/:id', this.controller.updateMatriculant);
        this.router.delete('/matriculants/:id', this.controller.deleteMatriculant);
        /*  Helpers */
        this.router.get('/subjects/list', this.controller.fetchSubjectList);
        this.router.get('/institutes/list', this.controller.fetchInstituteList);
        this.router.get('/certificates/list', this.controller.fetchCertList);
        this.router.get('/gradeweights/list', this.controller.fetchWeightList);
        this.router.get('/awardclasses/list', this.controller.fetchAwardList);
        this.router.get('/stages/list', this.controller.fetchStageList);
        this.router.get('/applytypes/list', this.controller.fetchApplytypeList);
        this.router.get('/prices/list', this.controller.fetchAmsPriceList);
        this.router.get('/documents/list', this.controller.fetchAmsDocList);
        // Update Admitted Profile
        this.router.post('/profile', this.controller.saveProfile);
        // ADMISSSION PORTAL ROUTES
        /* Step - Configuration  */
        this.router.get('/step/applicant/:id', this.controller.fetchStepApplicant);
        this.router.post('/step/applicant', this.controller.saveStepApplicant);
        /*  Step - Profile */
        this.router.get('/step/profile/:id', this.controller.fetchStepProfile);
        this.router.post('/step/profile', this.controller.saveStepProfile);
        /*  Step - Guardian */
        this.router.get('/step/guardian/:id', this.controller.fetchStepGuardian);
        this.router.post('/step/guardian', this.controller.saveStepGuardian);
        /*  Step - Education */
        this.router.get('/step/education/:id', this.controller.fetchStepEducation);
        this.router.post('/step/education', this.controller.saveStepEducation);
        /*  Step - Result */
        this.router.get('/step/result/:id', this.controller.fetchStepResult);
        this.router.post('/step/result', this.controller.saveStepResult);
        /*  Step - Employment */
        this.router.get('/step/employment/:id', this.controller.fetchStepEmployment);
        this.router.post('/step/employment', this.controller.saveStepEmployment);
        /*  Step - Referee */
        this.router.get('/step/referee/:id', this.controller.fetchStepReferee);
        this.router.post('/step/referee', this.controller.saveStepReferee);
        /*  Step - Document */
        this.router.get('/step/document/:id', this.controller.fetchStepDocument);
        this.router.post('/step/document', this.controller.saveStepDocument);
        /*  Step - Choice */
        this.router.get('/step/choice/:id', this.controller.fetchStepChoice);
        this.router.post('/step/choice', this.controller.saveStepChoice);
        /*  Step - Review */
        this.router.post('/step/review', this.controller.saveStepReview);
        /* Dashboard Statistics */
        this.router.get('/dash', this.controller.fetchDashboard);
    }
}
exports.default = new AmsRoute().router;
