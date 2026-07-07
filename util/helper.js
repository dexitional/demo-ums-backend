export const getGrade = (num, grades) => {
    if (num == null)
        return 'I';
    num = parseFloat(num);
    const vs = grades && grades.find((row) => parseFloat(row.min) <= parseFloat(num) && parseFloat(num) <= parseFloat(row.max));
    console.log(num, vs);
    return (vs && vs.grade) || 'I';
};
export const getGradePoint = (num, grades) => {
    if (num == null)
        return 0;
    num = parseFloat(num);
    const vs = grades && grades.find((row) => parseFloat(row.min) <= parseFloat(num) && parseFloat(num) <= parseFloat(row.max));
    return (vs && vs.gradepoint) || 0;
};
export const getBillCodePrisma = (semesterNum) => {
    if ([1, 2].includes(semesterNum))
        return [{ mainGroupCode: { contains: '1000' } }, { mainGroupCode: { contains: '1001' } }, { mainGroupCode: { contains: '1010' } }, { mainGroupCode: { contains: '1100' } }, { mainGroupCode: { contains: '1101' } }, { mainGroupCode: { contains: '1110' } }, { mainGroupCode: { contains: '1111' } }];
    if ([3, 4].includes(semesterNum))
        return [{ mainGroupCode: { contains: '0100' } }, { mainGroupCode: { contains: '0101' } }, { mainGroupCode: { contains: '0110' } }, { mainGroupCode: { contains: '0111' } }, { mainGroupCode: { contains: '1111' } }, { mainGroupCode: { contains: '1110' } }, { mainGroupCode: { contains: '1100' } }];
    if ([5, 6].includes(semesterNum))
        return [{ mainGroupCode: { contains: '0010' } }, { mainGroupCode: { contains: '0011' } }, { mainGroupCode: { contains: '1010' } }, { mainGroupCode: { contains: '1011' } }, { mainGroupCode: { contains: '1111' } }, { mainGroupCode: { contains: '0110' } }, { mainGroupCode: { contains: '0111' } }];
};
export const getSemesterFromCode = (semester, code) => {
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
    return lvs?.join(',');
};
export const decodeBase64Image = (dataString) => {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/), response = {};
    if (matches.length !== 3)
        return new Error('Invalid input string');
    response.type = matches[1];
    // response.data = new Buffer(matches[2], 'base64');
    response.data = Buffer.from(matches[2], 'base64');
    return response;
};
export const rotateImage = async (imageFile) => {
    const Jimp = require('jimp');
    // Reading Image
    const image = await Jimp.read(imageFile);
    // Checking if any error occurs while rotating image
    image.rotate(90, Jimp.RESIZE_BEZIER, function (err) {
        if (err)
            throw err;
    }).write(imageFile);
};
export const apiLogger = (action) => {
    return async (req, res, next) => {
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
    };
};
