import { Router } from 'express'
import FmsController from '../controller/fmsController'

class FmsRoute {
    
    router = Router();
    controller = new FmsController();

    constructor(){
       this.initializeRoute();
    }

    initializeRoute(){
      this.router.get('/dash', this.controller.loadDashboard);
      this.router.post('/report', this.controller.loadReport);
      
      /* Session */
       this.router.get('/bills', this.controller.fetchBills);
       this.router.get('/bills/list', this.controller.fetchBillList);
       this.router.get('/bills/:id', this.controller.fetchBill);
       this.router.get('/bills/:id/activity', this.controller.billActivity);
       this.router.get('/bills/:id/receipients', this.controller.billReceivers);
       this.router.post('/bills/:id/include', this.controller.includeBill);
       this.router.post('/bills/:id/exclude', this.controller.excludeBill);
       this.router.get('/bills/:id/activate', this.controller.activateBill);
       this.router.get('/bills/:id/revoke', this.controller.revokeBill);
       this.router.post('/bills', this.controller.postBill);
       this.router.patch('/bills/:id', this.controller.updateBill);
       this.router.delete('/bills/:id', this.controller.deleteBill);

      /* Charges */
      this.router.get('/charges', this.controller.fetchCharges);
      this.router.get('/charges/:id', this.controller.fetchCharge);
      this.router.post('/charges/late', this.controller.lateCharge);
      this.router.post('/charges', this.controller.postCharge);
      this.router.patch('/charges/:id', this.controller.updateCharge);
      this.router.delete('/charges/:id', this.controller.deleteCharge);

      /* Payments */
      this.router.get('/payments', this.controller.fetchPayments);
      this.router.get('/payments/other', this.controller.fetchPaymentOthers);
      this.router.get('/payments/voucher', this.controller.fetchPaymentVouchers);
      this.router.get('/payments/:id', this.controller.fetchPayment);
      this.router.post('/payments/convert', this.controller.convertPayment);
      this.router.post('/payments', this.controller.postPayment);
      this.router.patch('/payments/:id', this.controller.updatePayment);
      this.router.delete('/payments/:id', this.controller.deletePayment);

      /* Accounts & Debtors */
      this.router.get('/accounts', this.controller.fetchAccounts);
      this.router.get('/accounts/debts', this.controller.fetchDebts);
      this.router.get('/accounts/retire/:tag', this.controller.retireAccount);
      this.router.get('/accounts/:id', this.controller.fetchAccount);
      
      
      /* Services */
      this.router.get('/services', this.controller.fetchServices);
      this.router.get('/services/list', this.controller.fetchServiceList);
      this.router.get('/services/:id', this.controller.fetchService);
      this.router.post('/services', this.controller.postService);
      this.router.patch('/services/:id', this.controller.updateService);
      this.router.delete('/services/:id', this.controller.deleteService);

      /* Form Vouchers & Cost */
      this.router.get('/vsales', this.controller.fetchVsales);
      this.router.get('/vsales/:id', this.controller.fetchVsale);
      this.router.post('/vsales', this.controller.postVsale);
      this.router.patch('/vsales/:id', this.controller.updateVsale);
      this.router.delete('/vsales/:id', this.controller.deleteVsale);
      
      
      /* FMS Helpers */
      this.router.get('/bankaccs/list', this.controller.fetchBanks);
      
      

    }

   
}

export default new FmsRoute().router;