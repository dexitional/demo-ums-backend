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
exports.clearCache = exports.getOrSetCache = exports.apiLogger = exports.rotateImage = exports.decodeBase64Image = exports.getSemesterFromCode = exports.getBillCodePrisma = exports.getClass = exports.getGradePoint = exports.getGrade = void 0;
const redis_1 = require("../config/redis");
const CACHE_TTL = 3600; // 1 hour
const getGrade = (num, grades) => {
    if (num == null)
        return 'I';
    num = parseFloat(num);
    const vs = grades && grades.find((row) => parseFloat(row.min) <= parseFloat(num) && parseFloat(num) <= parseFloat(row.max));
    console.log(num, vs);
    return (vs && vs.grade) || 'I';
};
exports.getGrade = getGrade;
const getGradePoint = (num, grades) => {
    if (num == null)
        return 0;
    num = parseFloat(num);
    const vs = grades && grades.find((row) => parseFloat(row.min) <= parseFloat(num) && parseFloat(num) <= parseFloat(row.max));
    return (vs && vs.gradepoint) || 0;
};
exports.getGradePoint = getGradePoint;
const getClass = (num, classes) => {
    if (num == null || classes == null)
        return 'No Class';
    num = parseFloat(num);
    const vs = classes && classes.find((row) => parseFloat(row.min) <= parseFloat(num) && parseFloat(num) <= parseFloat(row.max));
    return (vs && vs.class) || 'No Class';
};
exports.getClass = getClass;
const getBillCodePrisma = (semesterNum) => {
    if ([1, 2].includes(semesterNum))
        return [{ mainGroupCode: { contains: '1000' } }, { mainGroupCode: { contains: '1001' } }, { mainGroupCode: { contains: '1010' } }, { mainGroupCode: { contains: '1100' } }, { mainGroupCode: { contains: '1101' } }, { mainGroupCode: { contains: '1110' } }, { mainGroupCode: { contains: '1111' } }];
    if ([3, 4].includes(semesterNum))
        return [{ mainGroupCode: { contains: '0100' } }, { mainGroupCode: { contains: '0101' } }, { mainGroupCode: { contains: '0110' } }, { mainGroupCode: { contains: '0111' } }, { mainGroupCode: { contains: '1111' } }, { mainGroupCode: { contains: '1110' } }, { mainGroupCode: { contains: '1100' } }];
    if ([5, 6].includes(semesterNum))
        return [{ mainGroupCode: { contains: '0010' } }, { mainGroupCode: { contains: '0011' } }, { mainGroupCode: { contains: '1010' } }, { mainGroupCode: { contains: '1011' } }, { mainGroupCode: { contains: '1111' } }, { mainGroupCode: { contains: '0110' } }, { mainGroupCode: { contains: '0111' } }];
};
exports.getBillCodePrisma = getBillCodePrisma;
const getSemesterFromCode = (semester, code) => {
    const levels = code.split("");
    const lvs = [];
    if (levels.length) {
        for (let i = 0; i < levels.length; i++) {
            if (semester == 'SEM1') {
                if (levels[i] == 1 && i == 0)
                    lvs.push(1);
                if (levels[i] == 1 && i == 1)
                    lvs.push(3);
                if (levels[i] == 1 && i == 2)
                    lvs.push(5);
                if (levels[i] == 1 && i == 3)
                    lvs.push(7);
            }
            else {
                if (levels[i] == 1 && i == 0)
                    lvs.push(2);
                if (levels[i] == 1 && i == 1)
                    lvs.push(4);
                if (levels[i] == 1 && i == 2)
                    lvs.push(6);
                if (levels[i] == 1 && i == 3)
                    lvs.push(8);
            }
        }
    }
    return lvs === null || lvs === void 0 ? void 0 : lvs.join(',');
};
exports.getSemesterFromCode = getSemesterFromCode;
const decodeBase64Image = (dataString) => {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/), response = {};
    if (matches.length !== 3)
        return new Error('Invalid input string');
    response.type = matches[1];
    // response.data = new Buffer(matches[2], 'base64');
    response.data = Buffer.from(matches[2], 'base64');
    return response;
};
exports.decodeBase64Image = decodeBase64Image;
const rotateImage = (imageFile) => __awaiter(void 0, void 0, void 0, function* () {
    const Jimp = require('jimp');
    // Reading Image
    const image = yield Jimp.read(imageFile);
    // Checking if any error occurs while rotating image
    image.rotate(90, Jimp.RESIZE_BEZIER, function (err) {
        if (err)
            throw err;
    }).write(imageFile);
});
exports.rotateImage = rotateImage;
const apiLogger = (action) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const api = req.query.api;
        const refno = req.params.refno;
        const dm = req.body;
        let dt = {};
        if (refno)
            dt.studentId = refno;
        if (api)
            dt.apiToken = api;
        if (dm && Object.keys(dm).length > 0)
            dt.data = dm;
        //const log = await SSO.apilogger(parseIp(req),action,dt)
        return next();
    });
};
exports.apiLogger = apiLogger;
const getOrSetCache = (key, cb) => __awaiter(void 0, void 0, void 0, function* () {
    const cachedData = yield redis_1.redisClient.get(key);
    if (cachedData) {
        return JSON.parse(cachedData);
    }
    const freshData = yield cb();
    if (freshData) {
        yield redis_1.redisClient.setEx(key, CACHE_TTL, JSON.stringify(freshData));
    }
    return freshData;
});
exports.getOrSetCache = getOrSetCache;
const clearCache = (key) => __awaiter(void 0, void 0, void 0, function* () {
    const keys = yield redis_1.redisClient.keys(key);
    if (keys.length > 0)
        yield redis_1.redisClient.del(keys);
});
exports.clearCache = clearCache;
