import { Router } from 'express'
// import EvsController from '../controller/evsController'
import EvsController from '../controllerDrizzle/evsController'
import AuthController from '../controller/authController'
//const { voteLimiter } = require("../middleware/rateLimitterFlexible");
//const { verifyToken } = require("../middleware/verifyToken");

class EvsRoute {
    
    router = Router();
    controller = new EvsController();
    auth = new AuthController();

    constructor(){
       this.initializeRoute();
    }

    initializeRoute(){
      // Elections & Control
      //this.router.get('/test', this.controller.fetchTest);
      this.router.get("/elections", this.controller.fetchElections);
      this.router.get("/elections/search", this.controller.fetchAdminElections);
      this.router.get("/elections/my/:tag", this.controller.fetchMyElections);
      this.router.get("/elections/:id", this.controller.fetchElection);
      this.router.get("/elections/:id/pins", this.auth.sendVoterPins);
      this.router.get("/elections/:id/reminder", this.auth.sendVoterReminder);
      this.router.get("/elections/:id/data", this.controller.fetchVotes);
      this.router.post("/elections/:id/data", this.controller.postVotes);
      this.router.get("/elections/:id/portfolios", this.controller.fetchPortfolios);
      this.router.post("/elections/:id/voters", this.controller.postVoter);
      this.router.get("/elections/:id/voters/:tag", this.controller.fetchVoter);
      this.router.delete("/elections/:id/voters/:tag", this.controller.deleteVoter);
        // this.router.get("/elections/:id/admins", this.controller.fetchAdmins);
        // this.router.post("/elections/:id/admins", this.controller.postAdmin);
        // this.router.delete("/elections/:id/admins/:tag", this.controller.deleteAdmin);
      this.router.get("/elections/:id/receipt/:tag", this.controller.fetchReceipt);
      this.router.post("/elections", this.controller.postElection);
      this.router.patch("/elections/:id", this.controller.updateElection);
      this.router.delete("/elections/:id", this.controller.deleteElection);

      // Action
      this.router.post("/action/reset", this.controller.actionReset);
      this.router.post("/action/admin", this.controller.actionAdmin);
      this.router.post("/action/voters", this.controller.setupVoters);
      
      // Portfolios
      this.router.get("/portfolios/list", this.controller.fetchPortfolioList);
      this.router.get("/portfolios/:id", this.controller.fetchPortfolio);
      this.router.get("/portfolios/:id/candidates", this.controller.fetchCandidates);
      this.router.post("/portfolios", this.controller.postPortfolio);
      this.router.patch("/portfolios/:id", this.controller.updatePortfolio);
      this.router.delete("/portfolios/:id", this.controller.deletePortfolio);
      
      // Candidates
      this.router.get("/candidates/:id", this.controller.fetchCandidate);
      this.router.post("/candidates", this.controller.postCandidate);
      this.router.patch("/candidates/:id", this.controller.updateCandidate);
      this.router.delete("/candidates/:id", this.controller.deleteCandidate);
    }

}

  export default new EvsRoute().router;