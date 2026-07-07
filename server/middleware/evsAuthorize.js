"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const isEvsAdmin = (req, res, next) => {
    // Loop and Check if role exist -- next(); return; [ Pass parameter req.userId ]
    // Return res.status(403).send({message: "Require Admin Role!"}); return 
};
const isEvsVoter = (req, res, next) => {
    // Loop and Check if role exist -- next(); return; [ Pass parameter req.userId ]
    // Return res.status(403).send({message: "Require Admin Role!"}); return 
};
const isEvsVoterOrAdmin = (req, res, next) => {
    // Loop and Check if role exist -- next(); return; [ Pass parameter req.userId ]
    // Return res.status(403).send({message: "Require Admin Role!"}); return 
};
const evsAuthorize = {
    isEvsAdmin,
    isEvsVoter,
    isEvsVoterOrAdmin
};
module.exports = evsAuthorize;
