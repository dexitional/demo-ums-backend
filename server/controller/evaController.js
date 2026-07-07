"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../prisma/client");
const paramStr_1 = require("../util/paramStr");
const moment_1 = __importDefault(require("moment"));
const eva = client_1.prisma;
class EvaController {
    // Fetch Options for Likert scale questions
    fetchForms(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get Active Sessions Info
                const id = (0, paramStr_1.paramStr)(req.params.indexno);
                // const indexno = '41329275';
                const { indexno } = yield eva.student.findUnique({ where: { id } });
                const sessions = yield eva.session.findMany({ where: { default: true } });
                let options = yield eva.assessment.findMany({
                    where: {
                        sessionId: {
                            in: sessions.map((r) => r.id)
                        },
                        indexno
                    },
                    select: {
                        course: { select: { id: true, title: true } }
                    }
                });
                if (options) {
                    options = options.map((r) => r.course);
                    const takenEvals = yield eva.courseEvaluation.findMany({
                        where: {
                            courseId: {
                                in: options.map((r) => r.id)
                            },
                            sessionId: {
                                in: sessions.map((r) => r.id)
                            },
                            indexno
                        },
                        include: { session: true, student: { include: { program: true } } }
                    });
                    // Check whether student has completed evaluations for semester
                    if ((options === null || options === void 0 ? void 0 : options.length) && (takenEvals === null || takenEvals === void 0 ? void 0 : takenEvals.length) == (options === null || options === void 0 ? void 0 : options.length))
                        res.status(200).json({ status: 'completed', data: takenEvals });
                    else
                        res.status(200).json({ status: 'started', data: options });
                }
                else {
                    res.status(204).json({ status: (0, moment_1.default)(new Date()).isBetween((0, moment_1.default)(sessions.evaluationStart), (0, moment_1.default)(sessions.evaluationEnd)) ? 'not started' : 'not registered', data: options });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    // Fetch Options for Likert scale questions
    fetchOptions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const options = yield eva.evaluationOption.findMany({
                    where: { status: true },
                    orderBy: { orderNum: 'asc' },
                    select: {
                        id: true,
                        option: true,
                        value: true,
                        orderNum: true
                    }
                });
                if (options) {
                    res.status(200).json(options);
                }
                else {
                    res.status(204).json({ message: "No options found" });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    // Fetch Questions for the evaluation form
    fetchQuestions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const questions = yield eva.evaluationQuestion.findMany({
                    where: { status: true },
                    orderBy: { orderNum: 'asc' },
                    select: {
                        id: true,
                        question: true,
                        category: true,
                        type: true,
                        orderNum: true,
                        required: true
                    }
                });
                if (questions) {
                    res.status(200).json(questions);
                }
                else {
                    res.status(204).json({ message: "No questions found" });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    // Fetch Courses for dropdown
    fetchCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield eva.course.findMany({
                    where: { status: true },
                    select: {
                        id: true,
                        title: true
                    },
                    orderBy: { title: 'asc' }
                });
                if (courses) {
                    res.status(200).json(courses);
                }
                else {
                    res.status(204).json({ message: "No courses found" });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    // Fetch Staff for dropdown
    fetchStaff(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const staff = yield eva.staff.findMany({
                    where: { status: true },
                    select: {
                        staffNo: true,
                        fname: true,
                        lname: true
                    },
                    orderBy: { fname: 'asc' }
                });
                const formattedStaff = staff.map((s) => ({
                    staffNo: s.staffNo,
                    name: `${s.fname} ${s.lname}`
                }));
                if (formattedStaff) {
                    res.status(200).json(formattedStaff);
                }
                else {
                    res.status(204).json({ message: "No staff found" });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    // Fetch Students for dropdown
    fetchStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const students = yield eva.student.findMany({
                    where: { completeStatus: false }, // Only active students
                    select: {
                        indexno: true,
                        fname: true,
                        lname: true
                    },
                    orderBy: { fname: 'asc' }
                });
                const formattedStudents = students.map((s) => ({
                    indexno: s.indexno,
                    name: `${s.fname} ${s.lname}`
                }));
                if (formattedStudents) {
                    res.status(200).json(formattedStudents);
                }
                else {
                    res.status(204).json({ message: "No students found" });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    // Fetch Sessions for dropdown
    fetchSessions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sessions = yield eva.session.findMany({
                    where: { status: true },
                    select: {
                        id: true,
                        title: true,
                        year: true,
                        semester: true
                    },
                    orderBy: { createdAt: 'desc' }
                });
                if (sessions) {
                    res.status(200).json(sessions);
                }
                else {
                    res.status(204).json({ message: "No sessions found" });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    // Submit Course Evaluation
    submitEvaluation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { courseId, staffNo, indexno, sessionId, responses } = req.body;
                console.log(req.body);
                // Validate required fields
                if (!courseId) {
                    return res.status(400).json({ message: "Course is required" });
                }
                // Get Student Info
                const student = yield eva.student.findFirst({ include: { program: { select: { schemeId: true, hasMajor: true } } }, where: { indexno } });
                // Get Active Sessions Info
                const sessions = yield eva.session.findMany({ where: { default: true } });
                // Get Session, for AUCC Only
                const session = sessions.find((row) => { var _a, _b; return ((0, moment_1.default)(student === null || student === void 0 ? void 0 : student.entryDate).format("MM") == '01' && (student === null || student === void 0 ? void 0 : student.semesterNum) <= 2) ? ((_a = row === null || row === void 0 ? void 0 : row.tag) === null || _a === void 0 ? void 0 : _a.toUpperCase()) == 'SUB' : ((_b = row === null || row === void 0 ? void 0 : row.tag) === null || _b === void 0 ? void 0 : _b.toUpperCase()) == 'MAIN'; });
                sessionId = session.id;
                indexno = '41329275';
                // Check if evaluation already exists
                let evaluation;
                if (indexno && sessionId && courseId) {
                    evaluation = yield eva.courseEvaluation.findUnique({
                        where: {
                            indexno_sessionId_courseId: {
                                indexno,
                                sessionId,
                                courseId
                            }
                        }
                    });
                }
                if (!evaluation) {
                    // Create new evaluation record
                    evaluation = yield eva.courseEvaluation.create({
                        data: {
                            courseId,
                            staffNo,
                            indexno,
                            sessionId,
                            status: 'completed',
                            completedAt: new Date()
                        }
                    });
                }
                else {
                    // Update existing evaluation
                    evaluation = yield eva.courseEvaluation.update({
                        where: { id: evaluation.id },
                        data: {
                            staffNo,
                            status: 'completed',
                            completedAt: new Date()
                        }
                    });
                }
                if (evaluation) {
                    // Create individual response records
                    const responsePromises = Object.entries(responses).map((_a) => __awaiter(this, [_a], void 0, function* ([questionId, responseValue]) {
                        const response = responseValue;
                        // For Likert questions, find the option ID
                        let optionId = null;
                        if (response && response !== '') {
                            const option = yield eva.evaluationOption.findFirst({
                                where: { option: response, status: true }
                            });
                            if (option) {
                                optionId = option.id;
                            }
                        }
                        return eva.evaluationResponse.create({
                            data: {
                                evaluationId: evaluation === null || evaluation === void 0 ? void 0 : evaluation.id,
                                questionId,
                                optionId,
                                response: response || ''
                            }
                        });
                    }));
                    yield Promise.all(responsePromises);
                    res.status(201).json({
                        message: "Evaluation submitted successfully",
                        data: evaluation
                    });
                }
                else {
                    res.status(500).json({ message: "Failed to submit evaluation" });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    // Get Evaluation Tracking Statistics
    getEvaluationTrackingStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sessionId, courseId } = req.query;
                let whereClause = {};
                if (sessionId)
                    whereClause.sessionId = sessionId;
                if (courseId)
                    whereClause.courseId = courseId;
                const stats = yield eva.courseEvaluation.groupBy({
                    by: ['status'],
                    where: whereClause,
                    _count: {
                        id: true
                    }
                });
                // Get total count
                const total = yield eva.courseEvaluation.count({
                    where: whereClause
                });
                // Get completion time statistics
                const completionStats = yield eva.courseEvaluation.findMany({
                    where: Object.assign(Object.assign({}, whereClause), { status: 'completed', startedAt: { not: null }, completedAt: { not: null } }),
                    select: {
                        startedAt: true,
                        completedAt: true
                    }
                });
                const avgCompletionTime = completionStats.length > 0
                    ? completionStats.reduce((acc, stat) => {
                        const duration = new Date(stat.completedAt).getTime() - new Date(stat.startedAt).getTime();
                        return acc + duration;
                    }, 0) / completionStats.length
                    : 0;
                res.status(200).json({
                    total,
                    byStatus: stats,
                    avgCompletionTimeMs: avgCompletionTime,
                    avgCompletionTimeMinutes: Math.round(avgCompletionTime / (1000 * 60))
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    // Fetch Evaluations (for admin/review)
    fetchEvaluations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { page = 1, pageSize = 10, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            try {
                let searchCondition = {};
                if (keyword) {
                    searchCondition = {
                        where: {
                            OR: [
                                { course: { title: { contains: keyword } } },
                                { lecturerName: { contains: keyword } }
                            ]
                        }
                    };
                }
                const resp = yield eva.$transaction([
                    eva.courseEvaluation.count(Object.assign({}, (searchCondition))),
                    eva.courseEvaluation.findMany(Object.assign(Object.assign({}, (searchCondition)), { skip: offset, take: Number(pageSize), include: {
                            course: true,
                            staff: true,
                            student: true,
                            session: true,
                            responses: {
                                include: {
                                    question: true
                                }
                            }
                        }, orderBy: { createdAt: 'desc' } }))
                ]);
                if (resp && ((_a = resp[1]) === null || _a === void 0 ? void 0 : _a.length)) {
                    res.status(200).json({
                        totalPages: Math.ceil(resp[0] / pageSize) || 0,
                        totalData: (_b = resp[1]) === null || _b === void 0 ? void 0 : _b.length,
                        data: resp[1]
                    });
                }
                else {
                    res.status(204).json({ message: "No evaluations found" });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    // Fetch Single Evaluation
    fetchEvaluation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const evaluation = yield eva.courseEvaluation.findUnique({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) }
                });
                if (evaluation) {
                    res.status(200).json(evaluation);
                }
                else {
                    res.status(404).json({ message: "Evaluation not found" });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    // Delete Evaluation
    deleteEvaluation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const evaluation = yield eva.courseEvaluation.delete({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) }
                });
                if (evaluation) {
                    res.status(200).json({ message: "Evaluation deleted successfully" });
                }
                else {
                    res.status(404).json({ message: "Evaluation not found" });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    // Get Evaluation Statistics
    getEvaluationStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const totalEvaluations = yield eva.courseEvaluation.count();
                // Get all evaluations for analysis
                const evaluations = yield eva.courseEvaluation.findMany({
                    include: {
                        course: true,
                        staff: true
                    }
                });
                // Basic stats
                const courseStats = {};
                const lecturerStats = {};
                evaluations.forEach((evaluation) => {
                    const courseName = evaluation.course.title;
                    const lecturerName = evaluation.staff ? `${evaluation.staff.fname} ${evaluation.staff.lname}` : 'Unknown';
                    // Count by course
                    if (!courseStats[courseName]) {
                        courseStats[courseName] = { count: 0, lecturers: new Set() };
                    }
                    courseStats[courseName].count++;
                    courseStats[courseName].lecturers.add(lecturerName);
                    // Count by lecturer
                    if (!lecturerStats[lecturerName]) {
                        lecturerStats[lecturerName] = { count: 0, courses: new Set() };
                    }
                    lecturerStats[lecturerName].count++;
                    lecturerStats[lecturerName].courses.add(courseName);
                });
                // Convert Sets to arrays for JSON response
                Object.keys(courseStats).forEach(course => {
                    courseStats[course].lecturers = Array.from(courseStats[course].lecturers);
                });
                Object.keys(lecturerStats).forEach(lecturer => {
                    lecturerStats[lecturer].courses = Array.from(lecturerStats[lecturer].courses);
                });
                res.status(200).json({
                    totalEvaluations,
                    courseStats,
                    lecturerStats
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    loadData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Seeding evaluation questions and options...');
                // Check if questions already exist
                // const existingCount = await prisma.evaluationQuestion.count();
                const existingCount = yield eva.evaluationQuestion.count();
                console.log("count: ", existingCount);
                if (existingCount > 0) {
                    console.log('Questions already seeded, skipping...');
                    return;
                }
                // Seed options first
                const options = [
                    { option: "Strongly Disagree", value: 1, orderNum: 1 },
                    { option: "Disagree", value: 2, orderNum: 2 },
                    { option: "Agree", value: 3, orderNum: 3 },
                    { option: "Strongly Agree", value: 4, orderNum: 4 },
                ];
                for (const option of options) {
                    yield eva.evaluationOption.create({
                        data: option
                    });
                }
                console.log('Seeded evaluation options successfully!');
                // Seed questions
                const questions = [
                    // Course Content
                    { question: "The course was well organized.", category: "Course Content", type: "likert", orderNum: 1, required: true },
                    { question: "The instructor communicated course objectives and learning goals.", category: "Course Content", type: "likert", orderNum: 2, required: true },
                    { question: "Assignments helped us to meet the course objectives and learning goals", category: "Course Content", type: "likert", orderNum: 3, required: true },
                    { question: "Course requirements were clearly stated and followed", category: "Course Content", type: "likert", orderNum: 4, required: true },
                    { question: "Required materials and books were helpful.", category: "Course Content", type: "likert", orderNum: 5, required: true },
                    // Course Delivery
                    { question: "The instructor came to class well prepared.", category: "Course Delivery", type: "likert", orderNum: 6, required: true },
                    { question: "The instructor knows his/her subject", category: "Course Delivery", type: "likert", orderNum: 7, required: true },
                    { question: "Course activities help students to problem solve and think critically.", category: "Course Delivery", type: "likert", orderNum: 8, required: true },
                    { question: "Course activities make the subject matter meaningful.", category: "Course Delivery", type: "likert", orderNum: 9, required: true },
                    { question: "The instructor is flexible in accommodating individual student needs.", category: "Course Delivery", type: "likert", orderNum: 10, required: true },
                    { question: "The instructor returns homework in a timely manner", category: "Course Delivery", type: "likert", orderNum: 11, required: true },
                    { question: "The instructor communicated course content clearly", category: "Course Delivery", type: "likert", orderNum: 12, required: true },
                    { question: "The instructor taught in a way that helped me learn the subject", category: "Course Delivery", type: "likert", orderNum: 13, required: true },
                    { question: "The instructor returned assignments and examinations in a timely manner.", category: "Course Delivery", type: "likert", orderNum: 14, required: true },
                    { question: "The instructor was available outside of class (office hours, email, etc)", category: "Course Delivery", type: "likert", orderNum: 15, required: true },
                    // Learning Environment
                    { question: "The instructor treated students and their contributions with respect", category: "Learning Environment", type: "likert", orderNum: 16, required: true },
                    { question: "The instructor generated enthusiasm for learning the subject matter", category: "Learning Environment", type: "likert", orderNum: 17, required: true },
                    { question: "The instructor clearly explained the grading system", category: "Learning Environment", type: "likert", orderNum: 18, required: true },
                    { question: "The instructor respects the opinions of and decisions of students", category: "Learning Environment", type: "likert", orderNum: 19, required: true },
                    { question: "The instructor was sensitive to the needs of students", category: "Learning Environment", type: "likert", orderNum: 20, required: true },
                    { question: "The instructor likes and respects students", category: "Learning Environment", type: "likert", orderNum: 21, required: true },
                    { question: "The instructor helps you when you ask for help", category: "Learning Environment", type: "likert", orderNum: 22, required: true },
                    { question: "The instructor is consistent and fair in discipline", category: "Learning Environment", type: "likert", orderNum: 23, required: true },
                    // Course's Impact on You
                    { question: "I have learned a lot in the course about this subject", category: "Course's Impact on You", type: "likert", orderNum: 24, required: true },
                    { question: "The course improved my oral communication skills", category: "Course's Impact on You", type: "likert", orderNum: 25, required: true },
                    { question: "The course improved my written communication skills", category: "Course's Impact on You", type: "likert", orderNum: 26, required: true },
                    { question: "The course challenged me intellectually", category: "Course's Impact on You", type: "likert", orderNum: 27, required: true },
                    // Open-ended questions
                    { question: "What is one thing that you really liked about the course?", category: "Additional Feedback", type: "text", orderNum: 28, required: false },
                    { question: "What is one thing that you can suggest to help improve this course?", category: "Additional Feedback", type: "text", orderNum: 29, required: false },
                    { question: "Any other thoughts?", category: "Additional Feedback", type: "text", orderNum: 30, required: false },
                ];
                for (const q of questions) {
                    yield eva.evaluationQuestion.create({
                        data: q
                    });
                }
                console.log('Seeded evaluation questions successfully!');
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.default = EvaController;
