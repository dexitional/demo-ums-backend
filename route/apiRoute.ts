import { Router } from 'express'
import FmsController from '../controller/fmsController'
import { apiLogger } from '../util/helper';

class ApiRoute {
    
    router = Router();
    controller = new FmsController();

    constructor(){
       this.initializeRoute();
    }

    initializeRoute(){
      
      /* Bank Payment API Services  */
      this.router.get('/services', apiLogger('LOAD_API_SERVICES'), this.controller.loadPayServices);
      this.router.get('/services/:type', apiLogger('LOAD_VOUCHER_FORMS'), this.controller.loadPayService);
      this.router.get('/services/:type/:refno', apiLogger('VERIFY_STUDENT'), this.controller.loadPayService);
      this.router.post('/payservice', apiLogger('SEND_TRANSACTION'), this.controller.payService);
 
    }

   
}

export default new ApiRoute().router;