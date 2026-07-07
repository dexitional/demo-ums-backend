import { Express, Request, Response, NextFunction} from 'express';
const jwt = require("jsonwebtoken");

const verifyToken = (req: Request | any, res: Response, next: NextFunction) => {
    
    let token = req.headers["x-access-token"];
    // console.log("headers: ", req.headers);
    
    if (!token) return res.status(403).send({ success: false, msg: "No token provided!"});
    
    jwt.verify(token, "miguelblayackah", (err: any, decoded: any) => {
        if (err) return res.status(401).send({ success: false, msg: "Unauthorized!",});
        req.userId = decoded?.user?.tag;
        next();
    });
};

module.exports = {
  verifyToken
}