import { prisma } from "../prisma/client";
import { paramStr } from "../util/paramStr";
import { Request, Response } from "express";
import moment from 'moment'
// import { PrismaClient } from "../prisma/client";
const eva = prisma;

export default class EvaController {

    // Fetch Options for Likert scale questions
    async fetchForms(req: Request, res: Response) {
        try {
            // Get Active Sessions Info
            const id = paramStr(req.params.indexno);
            // const indexno = '41329275';
            const { indexno }: any = await eva.student.findUnique({ where: { id } })
            const sessions: any = await eva.session.findMany({ where: { default: true } })
            let options = await eva.assessment.findMany({
                where: { 
                    sessionId: {
                      in: sessions.map((r:any) => r.id)
                    },
                    indexno
                },
                select: {
                  course:{  select: { id: true, title: true } }
                }
            });

            if (options) {
                options = options.map((r:any) => r.course);
                const takenEvals:any = await eva.courseEvaluation.findMany({
                   where: {
                      courseId: {
                        in: options.map((r:any) => r.id)
                      },
                      sessionId: {
                        in: sessions.map((r:any) => r.id)
                      },
                      indexno
                   },
                   include: { session: true, student: { include:{ program: true }} }
                })

                // Check whether student has completed evaluations for semester
                if(options?.length && takenEvals?.length == options?.length)
                   res.status(200).json({ status: 'completed', data: takenEvals});
                else
                   res.status(200).json({ status: 'started', data: options});
            } else {
                res.status(204).json({ status: moment(new Date()).isBetween(moment(sessions.evaluationStart),moment(sessions.evaluationEnd)) ? 'not started' : 'not registered', data: options });
            }
        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    }

    // Fetch Options for Likert scale questions
    async fetchOptions(req: Request, res: Response) {
        try {
            const options = await eva.evaluationOption.findMany({
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
            } else {
                res.status(204).json({ message: "No options found" });
            }
        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    }

    // Fetch Questions for the evaluation form
    async fetchQuestions(req: Request, res: Response) {
        try {
            const questions = await eva.evaluationQuestion.findMany({
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
            } else {
                res.status(204).json({ message: "No questions found" });
            }
        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    }

    // Fetch Courses for dropdown
    async fetchCourses(req: Request, res: Response) {
        try {
            const courses = await eva.course.findMany({
                where: { status: true },
                select: {
                    id: true,
                    title: true
                },
                orderBy: { title: 'asc' }
            });

            if (courses) {
                res.status(200).json(courses);
            } else {
                res.status(204).json({ message: "No courses found" });
            }
        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    }

    // Fetch Staff for dropdown
    async fetchStaff(req: Request, res: Response) {
        try {
            const staff = await eva.staff.findMany({
                where: { status: true },
                select: {
                    staffNo: true,
                    fname: true,
                    lname: true
                },
                orderBy: { fname: 'asc' }
            });

            const formattedStaff = staff.map((s: { staffNo: string | null; fname: string | null; lname: string | null }) => ({
                staffNo: s.staffNo,
                name: `${s.fname} ${s.lname}`
            }));

            if (formattedStaff) {
                res.status(200).json(formattedStaff);
            } else {
                res.status(204).json({ message: "No staff found" });
            }
        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    }

    // Fetch Students for dropdown
    async fetchStudents(req: Request, res: Response) {
        try {
            const students = await eva.student.findMany({
                where: { completeStatus: false }, // Only active students
                select: {
                    indexno: true,
                    fname: true,
                    lname: true
                },
                orderBy: { fname: 'asc' }
            });

            const formattedStudents = students.map((s: { indexno: string | null; fname: string | null; lname: string | null }) => ({
                indexno: s.indexno,
                name: `${s.fname} ${s.lname}`
            }));

            if (formattedStudents) {
                res.status(200).json(formattedStudents);
            } else {
                res.status(204).json({ message: "No students found" });
            }
        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    }

    // Fetch Sessions for dropdown
    async fetchSessions(req: Request, res: Response) {
        try {
            const sessions = await eva.session.findMany({
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
            } else {
                res.status(204).json({ message: "No sessions found" });
            }
        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    }


    // Submit Course Evaluation
    async submitEvaluation(req: Request, res: Response) {
        try {
            let { courseId, staffNo, indexno, sessionId, responses } = req.body;
            console.log(req.body)
            // Validate required fields
            if (!courseId) {
                return res.status(400).json({ message: "Course is required" });
            }

            // Get Student Info
            const student: any = await eva.student.findFirst({ include: { program: { select: { schemeId: true, hasMajor: true } } }, where: { indexno } })
            // Get Active Sessions Info
            const sessions: any = await eva.session.findMany({ where: { default: true } })
            // Get Session, for AUCC Only
            const session: any = sessions.find((row: any) => (moment(student?.entryDate).format("MM") == '01' && student?.semesterNum <= 2) ? row?.tag?.toUpperCase() == 'SUB' : row?.tag?.toUpperCase() == 'MAIN')
            sessionId = session.id;
            indexno = '41329275';

            // Check if evaluation already exists
            let evaluation: any;
            if (indexno && sessionId && courseId) {
                evaluation = await eva.courseEvaluation.findUnique({
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
                evaluation = await eva.courseEvaluation.create({
                    data: {
                        courseId,
                        staffNo,
                        indexno,
                        sessionId,
                        status: 'completed',
                        completedAt: new Date()
                    }
                });
            } else {
                // Update existing evaluation
                evaluation = await eva.courseEvaluation.update({
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
                const responsePromises = Object.entries(responses).map(async ([questionId, responseValue]) => {
                    const response = responseValue as string;

                    // For Likert questions, find the option ID
                    let optionId = null;
                    if (response && response !== '') {
                        const option = await eva.evaluationOption.findFirst({
                            where: { option: response, status: true }
                        });
                        if (option) {
                            optionId = option.id;
                        }
                    }

                    return eva.evaluationResponse.create({
                        data: {
                            evaluationId: evaluation?.id,
                            questionId,
                            optionId,
                            response: response || ''
                        }
                    });
                });

                await Promise.all(responsePromises);

                res.status(201).json({
                    message: "Evaluation submitted successfully",
                    data: evaluation
                });
            } else {
                res.status(500).json({ message: "Failed to submit evaluation" });
            }
        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    }

    // Get Evaluation Tracking Statistics
    async getEvaluationTrackingStats(req: Request, res: Response) {
        try {
            const { sessionId, courseId } = req.query;

            let whereClause: any = {};
            if (sessionId) whereClause.sessionId = sessionId;
            if (courseId) whereClause.courseId = courseId;

            const stats = await eva.courseEvaluation.groupBy({
                by: ['status'],
                where: whereClause,
                _count: {
                    id: true
                }
            });

            // Get total count
            const total = await eva.courseEvaluation.count({
                where: whereClause
            });

            // Get completion time statistics
            const completionStats = await eva.courseEvaluation.findMany({
                where: {
                    ...whereClause,
                    status: 'completed',
                    startedAt: { not: null },
                    completedAt: { not: null }
                },
                select: {
                    startedAt: true,
                    completedAt: true
                }
            });

            const avgCompletionTime = completionStats.length > 0
                ? completionStats.reduce((acc: number, stat: any) => {
                    const duration = new Date(stat.completedAt!).getTime() - new Date(stat.startedAt!).getTime();
                    return acc + duration;
                }, 0) / completionStats.length
                : 0;

            res.status(200).json({
                total,
                byStatus: stats,
                avgCompletionTimeMs: avgCompletionTime,
                avgCompletionTimeMinutes: Math.round(avgCompletionTime / (1000 * 60))
            });
        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    }

    // Fetch Evaluations (for admin/review)
    async fetchEvaluations(req: Request, res: Response) {
        const { page = 1, pageSize = 10, keyword = '' }: any = req.query;
        const offset = (page - 1) * pageSize;

        try {
            let searchCondition: any = {};

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

            const resp = await eva.$transaction([
                eva.courseEvaluation.count({
                    ...(searchCondition)
                }),
                eva.courseEvaluation.findMany({
                    ...(searchCondition),
                    skip: offset,
                    take: Number(pageSize),
                    include: {
                        course: true,
                        staff: true,
                        student: true,
                        session: true,
                        responses: {
                            include: {
                                question: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                })
            ]);

            if (resp && resp[1]?.length) {
                res.status(200).json({
                    totalPages: Math.ceil(resp[0] / pageSize) || 0,
                    totalData: resp[1]?.length,
                    data: resp[1]
                });
            } else {
                res.status(204).json({ message: "No evaluations found" });
            }
        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    }

    // Fetch Single Evaluation
    async fetchEvaluation(req: Request, res: Response) {
        try {
            const evaluation = await eva.courseEvaluation.findUnique({
                where: { id: paramStr(req.params.id) }
            });

            if (evaluation) {
                res.status(200).json(evaluation);
            } else {
                res.status(404).json({ message: "Evaluation not found" });
            }
        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    }

    // Delete Evaluation
    async deleteEvaluation(req: Request, res: Response) {
        try {
            const evaluation = await eva.courseEvaluation.delete({
                where: { id: paramStr(req.params.id) }
            });

            if (evaluation) {
                res.status(200).json({ message: "Evaluation deleted successfully" });
            } else {
                res.status(404).json({ message: "Evaluation not found" });
            }
        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    }

    // Get Evaluation Statistics
    async getEvaluationStats(req: Request, res: Response) {
        try {
            const totalEvaluations = await eva.courseEvaluation.count();

            // Get all evaluations for analysis
            const evaluations = await eva.courseEvaluation.findMany({
                include: {
                    course: true,
                    staff: true
                }
            });

            // Basic stats
            const courseStats: any = {};
            const lecturerStats: any = {};

            evaluations.forEach((evaluation: { course: { title: string }; staff: { fname: string; lname: string } | null }) => {
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
        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    }


    async loadData(req: Request, res: Response) {
        try {

            console.log('Seeding evaluation questions and options...');

            // Check if questions already exist
            // const existingCount = await prisma.evaluationQuestion.count();
            const existingCount = await eva.evaluationQuestion.count();
            console.log("count: ", existingCount)
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
                await eva.evaluationOption.create({
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
                await eva.evaluationQuestion.create({
                    data: q
                });
            }

            console.log('Seeded evaluation questions successfully!');


        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    }





}