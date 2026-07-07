import { Router } from 'express';
import AisController from '../controller/aisController';

const { voteLimiter } = require("../middleware/rateLimitterFlexible");
const { verifyToken } = require("../middleware/verifyToken");

class AisRoute {
    
    router = Router();
    controller = new AisController();

    constructor(){
       this.initializeRoute();
    }

    initializeRoute(){
      this.router.get('/dash', this.controller.loadDashboard);
      this.router.post('/report', this.controller.loadReport);
      
       
      this.router.get('/test', this.controller.fetchTest);
      /* Calendar Sessions */
      this.router.get('/sessions', [verifyToken], this.controller.fetchSessions);
      this.router.get('/sessions/list', [verifyToken], this.controller.fetchSessionList);
      this.router.get('/sessions/:id', [verifyToken], this.controller.fetchSession);
      // this.router.get('/students/:id/transcript', [verifyToken], this.controller.fetchStudentTranscript);
      // this.router.get('/students/:id/finance', [verifyToken], this.controller.fetchStudentFinance);
      // this.router.get('/students/:id/activity', [verifyToken], this.controller.fetchStudentActivity);
      this.router.post('/sessions/activate', [verifyToken], this.controller.activateSession);
      this.router.post('/sessions', [verifyToken], this.controller.postSession);
      this.router.patch('/sessions/:id', [verifyToken], this.controller.updateSession);
      this.router.delete('/sessions/:id', [verifyToken], this.controller.deleteSession);
       
      /* Student */
      this.router.get('/students', [verifyToken], this.controller.fetchStudents);
      this.router.get('/students/:id', [verifyToken], this.controller.fetchStudent);
      this.router.get('/students/:id/transcript', [verifyToken], this.controller.fetchStudentTranscript);
      this.router.get('/students/:id/finance', [verifyToken], this.controller.fetchStudentFinance);
      this.router.get('/students/:id/activity', [verifyToken], this.controller.fetchStudentActivity);
      this.router.post('/students/transcripts', [verifyToken], this.controller.fetchStudentTranscripts);
      this.router.post('/students/progress', [verifyToken], this.controller.postProgression);
      this.router.post('/students/stage', [verifyToken], this.controller.stageStudent);
      this.router.post('/students/reset', [verifyToken], this.controller.resetStudent);
      this.router.post('/students/forget', [verifyToken], this.controller.resetStudent);
      this.router.post('/students/photo', [verifyToken], this.controller.changePhoto);
      this.router.post('/students/indexgen', [verifyToken], this.controller.generateIndex);
      this.router.post('/students/mailgen', [verifyToken], this.controller.generateEmail);
      this.router.post('/students', [verifyToken], this.controller.postStudent);
      this.router.post('/students/publish', [verifyToken], this.controller.publishStudentTranscript);
      this.router.patch('/students/:id', [verifyToken], this.controller.updateStudent);
      this.router.delete('/students/:id', [verifyToken], this.controller.deleteStudent);
      this.router.delete('/students/transcript/:id', [verifyToken], this.controller.deleteStudentTranscript);
      
      /* Program */
      this.router.get('/programs', [verifyToken], this.controller.fetchPrograms);
      this.router.get('/programs/list', [verifyToken], this.controller.fetchProgramList);
      this.router.get('/programs/:id', [verifyToken], this.controller.fetchProgram);
      this.router.get('/programs/:id/curriculum', [verifyToken], this.controller.fetchProgramStructure);
      this.router.get('/programs/:id/students', [verifyToken], this.controller.fetchProgramStudents);
      this.router.get('/programs/:id/statistics', [verifyToken], this.controller.fetchProgramStatistics);
      this.router.post('/programs', [verifyToken], this.controller.postProgram);
      this.router.patch('/programs/:id', [verifyToken], this.controller.updateProgram);
      this.router.delete('/programs/:id', [verifyToken], this.controller.deleteProgram);

       /* Program */
       this.router.get('/majors/list', [verifyToken], this.controller.fetchMajorList);
     
      /* Course */
      this.router.get('/courses', [verifyToken], this.controller.fetchCourses);
      this.router.get('/courses/list', [verifyToken], this.controller.fetchCourseList);
      this.router.get('/courses/:id', [verifyToken], this.controller.fetchCourse);
      this.router.post('/courses', [verifyToken], this.controller.postCourse);
      this.router.patch('/courses/:id', [verifyToken], this.controller.updateCourse);
      this.router.delete('/courses/:id', [verifyToken], this.controller.deleteCourse);
      
      /* Scheme */
      this.router.get('/schemes', [verifyToken], this.controller.fetchSchemes);
      this.router.get('/schemes/list', [verifyToken], this.controller.fetchSchemeList);
      this.router.get('/schemes/:id', [verifyToken], this.controller.fetchScheme);
      this.router.post('/schemes', [verifyToken], this.controller.postScheme);
      this.router.patch('/schemes/:id', [verifyToken], this.controller.updateScheme);
      this.router.delete('/schemes/:id', [verifyToken], this.controller.deleteScheme);
      
      // /* Curriculum */
      this.router.get('/curriculums', [verifyToken], this.controller.fetchCurriculums);
      this.router.get('/curriculums/:id', [verifyToken], this.controller.fetchCurriculum);
      this.router.post('/curriculums', [verifyToken], this.controller.postCurriculum);
      this.router.patch('/curriculums/:id', [verifyToken], this.controller.updateCurriculum);
      this.router.delete('/curriculums/:id', [verifyToken], this.controller.deleteCurriculum);

      // /* Registration */
      this.router.get('/registrations', [verifyToken], this.controller.fetchRegistrations); // Registration Logs - only active semester
      this.router.get('/registrations/mount/:indexno', [verifyToken], this.controller.fetchRegistrationMount); // Fetch Mounted Courses
      this.router.get('/registrations/:indexno', [verifyToken], this.controller.fetchRegistration); // Fetch Registration Slip
      this.router.post('/registrations', [verifyToken], this.controller.postRegistration); // Send New Registration
      this.router.patch('/registrations/:indexno', [verifyToken], this.controller.updateRegistration); // Update Registration
      this.router.delete('/registrations/:indexno', [verifyToken], this.controller.deleteRegistration);

      /* Sheet */
      this.router.get('/sheets', [verifyToken], this.controller.fetchSheets);
      this.router.get('/sheets/my', [verifyToken], this.controller.fetchMySheets);
      this.router.get('/sheets/:id', [verifyToken], this.controller.fetchSheet);
      this.router.post('/sheets/stage', [verifyToken], this.controller.stageSheet);
      // this.router.get('/sanitize', this.controller.fixSheet);
      // this.router.get('/sanitize', this.controller.sanitizeSheet);
      this.router.get('/sanitize', this.controller.cleanSheet);
      this.router.post('/sheets/load', [verifyToken], this.controller.loadSheet);
      this.router.post('/sheets/save', [verifyToken], this.controller.saveSheet);//AUUG09210105
      this.router.post('/sheets/reverse', [verifyToken], this.controller.reverseSheet);
      this.router.post('/sheets/upload', [verifyToken], this.controller.uploadSheet);//AUUG09210105
      this.router.post('/sheets', [verifyToken], this.controller.postSheet);
      this.router.patch('/sheets/:id/submit', [verifyToken], this.controller.submitSheet);
      this.router.patch('/sheets/:id/close', [verifyToken], this.controller.closeSheet);
      this.router.patch('/sheets/:id/publish', [verifyToken], this.controller.publishSheet);
      this.router.patch('/sheets/:id/unpublish', [verifyToken], this.controller.unpublishSheet);
      this.router.patch('/sheets/:id', [verifyToken], this.controller.updateSheet);
      this.router.delete('/sheets/:id', [verifyToken], this.controller.deleteSheet);

       /* Backlog */
       this.router.get('/backlogs', [verifyToken], this.controller.fetchBacklogs);
       this.router.get('/backlogs/:id', [verifyToken], this.controller.fetchBacklog);
       this.router.post('/backlogs/approve', [verifyToken], this.controller.approveBacklog);
       this.router.post('/backlogs', [verifyToken], this.controller.postBacklog);
       this.router.post('/backlogs/upload', [verifyToken], this.controller.uploadBacklog);
       this.router.patch('/backlogs/:id', [verifyToken], this.controller.updateBacklog);
       this.router.delete('/backlogs/:id', [verifyToken], this.controller.deleteBacklog);
       
       /* Progression */
       this.router.get('/progression', [verifyToken], this.controller.fetchProgressions);
       this.router.get('/progression/:id', [verifyToken], this.controller.fetchProgression);
       this.router.post('/progression', [verifyToken], this.controller.postAllProgression);
       this.router.post('/progression/student', [verifyToken], this.controller.postProgression);
      
       /* Deferment */
       this.router.get('/deferments', [verifyToken], this.controller.fetchDeferments);
       this.router.get('/deferments/list', [verifyToken], this.controller.fetchDefermentList);
       this.router.get('/deferments/:id', [verifyToken], this.controller.fetchDeferment);
       this.router.post('/deferments', [verifyToken], this.controller.postDeferment);
       this.router.patch('/deferments/:id/upgrade', [verifyToken], this.controller.upgradeDeferment);
       this.router.patch('/deferments/:id', [verifyToken], this.controller.updateDeferment);
       this.router.delete('/deferments/:id', [verifyToken], this.controller.deleteDeferment);

      /* Circulars */
       this.router.get('/circulars', [verifyToken], this.controller.fetchSchemes);
       this.router.get('/circulars/list', [verifyToken], this.controller.fetchSchemeList);
       this.router.get('/circulars/:id', [verifyToken], this.controller.fetchScheme);
       this.router.post('/circulars', [verifyToken], this.controller.postScheme);
       this.router.patch('/circulars/:id', [verifyToken], this.controller.updateScheme);
       this.router.delete('/circulars/:id', [verifyToken], this.controller.deleteScheme);
       
       /* Service Letters */
       this.router.get('/letters', [verifyToken], this.controller.fetchLetters);
       this.router.get('/letters/:id', [verifyToken], this.controller.fetchLetter);
      //  this.router.post('/letters/approve', [verifyToken], this.controller.approveLetter);
       this.router.post('/letters', [verifyToken], this.controller.postLetter);
       this.router.patch('/letters/:id', [verifyToken], this.controller.updateLetter);
       this.router.delete('/letters/:id', [verifyToken], this.controller.deleteLetter);
      
      /* Transwift */
      this.router.get('/transwifts', [verifyToken], this.controller.fetchTranswifts);
      this.router.get('/transwifts/list', [verifyToken], this.controller.fetchTranswiftList);
      this.router.get('/transwifts/:id', [verifyToken], this.controller.fetchTranswift);
      this.router.get('/transwifts/:id/student', [verifyToken], this.controller.fetchTranswiftByStudent);
      this.router.post('/transwifts', [verifyToken], this.controller.postTranswift);
      this.router.patch('/transwifts/:id/upgrade', [verifyToken], this.controller.upgradeTranswift);
      this.router.patch('/transwifts/:id', [verifyToken], this.controller.updateTranswift);
      this.router.delete('/transwifts/:id', [verifyToken], this.controller.deleteTranswift);
       
     
      /////////////////////////////////////////////////////////////////////////////////////
      // # Resit Session must be Active and Default to allow generation of list of registered.
      // # Resit registration date must be before Resit Exam start period.
      // ###### CONDITIONS #######
      // # Resit fee must be paid for number of papers to be registered, and to set paid status
      // # Resit registration must be completed to set sessionId, registerSessionId, registeredAt
      // # Bulk entry form must be used to enter scores for resit session and status set to taken for scores (non-empty)
      // # Taken status is set if student has registered resit and scores has been entered. ( Not just register )
      /////////////////////////////////////////////////////////////////////////////////////
      /* Resit Sessions */
      this.router.get('/resit-sessions', [verifyToken], this.controller.fetchResitSessions);
      this.router.get('/resit-sessions/list', [verifyToken], this.controller.fetchResitSessionsList);
      this.router.get('/resit-sessions/:id/list', [verifyToken], this.controller.fetchResitSessionList);
      this.router.get('/resit-sessions/:id', [verifyToken], this.controller.fetchResitSession);
      this.router.post('/resit-sessions', [verifyToken], this.controller.postResitSession);
      this.router.post('/resit-sessions/save', [verifyToken], this.controller.saveResitSession);
      this.router.patch('/resit-sessions/:id', [verifyToken], this.controller.updateResitSession);
      this.router.delete('/resit-sessions/:id', [verifyToken], this.controller.deleteResitSession);
      
      /* Resit */
      this.router.get('/resits', [verifyToken], this.controller.fetchResits);
      this.router.get('/resits/:id', [verifyToken], this.controller.fetchResit);
      this.router.post('/resits', [verifyToken], this.controller.postResit);
      this.router.patch('/resits/:id', [verifyToken], this.controller.updateResit);
      this.router.delete('/resits/:id', [verifyToken], this.controller.deleteResit);
        
      /////////////////////////////////////////////////////////////////////////////////////
      // # Graduations Session must be Active and Default to allow generation of list.
      // # Graduation List generation must be not be after graduation end period.
      // # Generation must come with timestamp to know when each graduate was processed.
      // # Generated list must come with total fees balance - show debt status
      // ###### CONDITIONS #######
      // # No Pending Resit
      // # Must have Completed Minimum Program Total Credits
      // # Must have Current Semester Level same as Maximum Program Semester Level
      /////////////////////////////////////////////////////////////////////////////////////
      /* Graduation Sessions */
      this.router.get('/graduate-sessions', [verifyToken], this.controller.fetchGraduateSessions);
      this.router.get('/graduate-sessions/:id/generate', [verifyToken], this.controller.generateGraduateSessionList);
      this.router.get('/graduate-sessions/list', [verifyToken], this.controller.fetchGraduateSessionsList);
      this.router.get('/graduate-sessions/:id/list', [verifyToken], this.controller.fetchGraduateSessionList);
      this.router.get('/graduate-sessions/:id', [verifyToken], this.controller.fetchGraduateSession);
      this.router.post('/graduate-sessions', [verifyToken], this.controller.postGraduateSession);
      this.router.patch('/graduate-sessions/:id', [verifyToken], this.controller.updateGraduateSession);
      this.router.delete('/graduate-sessions/:id', [verifyToken], this.controller.deleteGraduateSession);
        
       /* Graduations */
       this.router.get('/graduates', [verifyToken], this.controller.fetchGraduates);
       this.router.get('/graduates/:id', [verifyToken], this.controller.fetchGraduate);
       this.router.patch('/graduates/exclude/:id', [verifyToken], this.controller.excludeGraduate);
       this.router.post('/graduates/upload', [verifyToken], this.controller.uploadGraduate);
       this.router.post('/graduates/supplement', [verifyToken], this.controller.uploadGraduateSupplement);
       this.router.post('/graduates', [verifyToken], this.controller.postGraduate);
       this.router.patch('/graduates/:id', [verifyToken], this.controller.updateGraduate);
       this.router.delete('/graduates/:id', [verifyToken], this.controller.deleteGraduate);
       
       /* Graduation Log */
       this.router.get('/graduate-logs', [verifyToken], this.controller.fetchGraduateLogs);

       this.router.post('/broadsheet', this.controller.fetchBroadsheet);
       
         

       /* Circulars */
      this.router.get('/notices', [verifyToken], this.controller.fetchNotices);
      this.router.get('/notices/:id', [verifyToken], this.controller.fetchNotice);
      this.router.post('/notices/send', [verifyToken], this.controller.sendNotice);
      this.router.post('/notices', [verifyToken], this.controller.postNotice);
      this.router.patch('/notices/:id', [verifyToken], this.controller.updateNotice);
      this.router.delete('/notices/:id', [verifyToken], this.controller.deleteNotice);
      
 

       /* Staff */
       this.router.get('/staff', [verifyToken], this.controller.fetchStaffs);
       this.router.get('/staff/:id', [verifyToken], this.controller.fetchStaff);
       this.router.post('/staff/stage', [verifyToken], this.controller.stageStaff);
       this.router.post('/staff/reset', [verifyToken], this.controller.resetStaff);
       this.router.post('/staff/photo', [verifyToken], this.controller.changeStaffPhoto);
       this.router.post('/staff/role', [verifyToken], this.controller.staffRole);
       this.router.post('/staff', [verifyToken], this.controller.postStaff);
       this.router.patch('/staff/:id', [verifyToken], this.controller.updateStaff);
       this.router.delete('/staff/:id', [verifyToken], this.controller.deleteStaff);
      
       
      /* Units  */
      this.router.get('/departments', [verifyToken], this.controller.fetchDepartments);
      this.router.get('/faculties', [verifyToken], this.controller.fetchFaculties);
      this.router.get('/units', [verifyToken], this.controller.fetchUnits);
      this.router.get('/units/list', [verifyToken], this.controller.fetchUnitList);
      this.router.get('/units/:id', [verifyToken], this.controller.fetchUnit);
      this.router.post('/units', [verifyToken], this.controller.postUnit);
      this.router.patch('/units/:id', [verifyToken], this.controller.updateUnit);
      this.router.delete('/units/:id', [verifyToken], this.controller.deleteUnit);

      /* Jobs */
      this.router.get('/jobs', [verifyToken], this.controller.fetchJobs);
      this.router.get('/jobs/list', [verifyToken], this.controller.fetchJobList);
      this.router.get('/jobs/:id', [verifyToken], this.controller.fetchJob);
      this.router.post('/jobs', [verifyToken], this.controller.postJob);
      this.router.patch('/jobs/:id', [verifyToken], this.controller.updateJob);
      this.router.delete('/jobs/:id', [verifyToken], this.controller.deleteJob);

       /* User Roles */
       this.router.get('/uroles', [verifyToken], this.controller.fetchURoles);
       this.router.get('/uroles/:id', [verifyToken], this.controller.fetchURole);
       this.router.post('/uroles/list', [verifyToken], this.controller.fetchURoleList);
       this.router.post('/uroles', [verifyToken], this.controller.postURole);
       this.router.patch('/uroles/:id', [verifyToken], this.controller.updateURole);
       this.router.delete('/uroles/:id', [verifyToken], this.controller.deleteURole);
       this.router.post('/checkuser', [verifyToken], this.controller.checkUser);
       
      /* App Roles */
      this.router.get('/aroles/list', [verifyToken], this.controller.fetchARoleList);

      /* Evaluations */
      this.router.get('/evaluations', [verifyToken], this.controller.fetchEvaluations);
      // this.router.get('/evaluations/:id', [verifyToken], this.controller.fetchEvaluation); 
      // this.router.post('/evaluations', [verifyToken], this.controller.postEvaluation); 
      // this.router.patch('/evaluations/:id', [verifyToken], this.controller.updateEvaluation); 
      // this.router.delete('/evaluations/:id', [verifyToken], this.controller.deleteEvaluation); 

      /* Utility */
      this.router.get('/countries', [verifyToken], this.controller.fetchCountries);
      this.router.get('/regions', [verifyToken], this.controller.fetchRegions);
      this.router.get('/religions', [verifyToken], this.controller.fetchReligions);
      this.router.get('/disabilities', [verifyToken], this.controller.fetchDisabilities);
      this.router.get('/categories', [verifyToken], this.controller.fetchCategories);
      this.router.get('/relations', [verifyToken], this.controller.fetchRelations);
      this.router.get('/marital', [verifyToken], this.controller.fetchMarital);
      this.router.get('/titles', [verifyToken], this.controller.fetchTitles);
      this.router.get('/vendors', [verifyToken], this.controller.fetchVendors);
      this.router.get('/collectors', [verifyToken], this.controller.fetchCollectors);
     

      /* Run Scripts */
      this.router.get('/run-data',  this.controller.runData);
      this.router.get('/run-account', this.controller.runAccount);   

      /* Mobile Personalized */
      this.router.get('/academic-status/:id',  this.controller.academicStatus);
      this.router.get('/next-class',  this.controller.nextClass);
      this.router.get('/academic-event',  this.controller.runData);
    }

}

export default new AisRoute().router;