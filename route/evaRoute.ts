import { Router } from 'express';
import EvaController from '../controller/evaController';

class EvaRoute {

    router = Router();
    controller = new EvaController();

    constructor() {
       this.initializeRoute();
    }

    initializeRoute() {
      // Fetch data for form
      this.router.get('/load', this.controller.loadData);
      this.router.get('/data/:indexno', this.controller.fetchForms);
      this.router.get('/options', this.controller.fetchOptions);
      this.router.get('/questions', this.controller.fetchQuestions);
      // Evaluation tracking statistics
      this.router.get('/tracking/stats', this.controller.getEvaluationTrackingStats);
      // Fetch data for dropdowns
      this.router.get('/courses', this.controller.fetchCourses);
      this.router.get('/staff', this.controller.fetchStaff);
      this.router.get('/students', this.controller.fetchStudents);
      this.router.get('/sessions', this.controller.fetchSessions);
      // Submit evaluation
      this.router.post('/evaluations', this.controller.submitEvaluation);
      // Fetch evaluations (admin)
      this.router.get('/evaluations', this.controller.fetchEvaluations);
      // Fetch single evaluation
      this.router.get('/evaluations/:id', this.controller.fetchEvaluation);
      // Delete evaluation
      this.router.delete('/evaluations/:id', this.controller.deleteEvaluation);
      // Get evaluation statistics
      this.router.get('/evaluations/stats', this.controller.getEvaluationStats);
    }
}

export default new EvaRoute().router;