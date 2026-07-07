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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
// import { PrismaClient } from "../prisma/client";
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Seeding evaluation questions and options...');
        // Check if questions already exist
        // const existingCount = await prisma.evaluationQuestion.count();
        const existingCount = yield prisma.evaluationQuestion.count();
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
            yield prisma.evaluationOption.create({
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
            yield prisma.evaluationQuestion.create({
                data: q
            });
        }
        console.log('Seeded evaluation questions successfully!');
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
