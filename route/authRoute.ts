import { Router } from 'express'
import AuthController from '../controller/authController'

class AuthRoute {
    
    router = Router();
    controller = new AuthController();

    constructor(){
       this.initializeRoute();
    }

    initializeRoute(){
      /* Authentication Providers */
       this.router.post('/credential', this.controller.authenticateWithCredential);
       this.router.post('/google', this.controller.authenticateWithGoogle);
       this.router.post('/switch', this.controller.authenticateWithKey);
      /* Account Management - Change Password */
       this.router.post('/password', this.controller.changePassword);
       this.router.post('/forget', this.controller.forgetPassword);
      /* Photo Management */
       this.router.get('/file', this.controller.fetchAmsFile);
       this.router.get('/mobile', this.controller.fetchAmsApk);
       this.router.get('/pixo', this.controller.fetchEvsPhoto);
       this.router.get('/photos', this.controller.fetchPhoto);
       this.router.post('/photos', this.controller.postPhoto);
       this.router.post('/photos/rotate', this.controller.rotatePhoto);
       this.router.delete('/photos/:id', this.controller.removePhoto);
       /* SSO Pin Management */
       this.router.post('/pins/generate', this.controller.resetStudentPins);
       this.router.post('/pins/generate/:tag', this.controller.resetStudentPin);
       this.router.get('/pins/send', this.controller.sendStudentPins);
       this.router.get('/pins/send/:tag', this.controller.sendStudentPin);
       
    }

}

export default new AuthRoute().router;