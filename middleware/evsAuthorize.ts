import { Express, Request, Response, NextFunction} from 'express';

const jwt = require("jsonwebtoken");


const isEvsAdmin = (req: Request | any, res: Response, next: NextFunction) => {
  // Loop and Check if role exist -- next(); return; [ Pass parameter req.userId ]
  // Return res.status(403).send({message: "Require Admin Role!"}); return 
};

const isEvsVoter = (req: Request, res: Response, next: NextFunction) => {
   // Loop and Check if role exist -- next(); return; [ Pass parameter req.userId ]
  // Return res.status(403).send({message: "Require Admin Role!"}); return 
};

const isEvsVoterOrAdmin = (req: Request, res: Response, next: NextFunction) => {
   // Loop and Check if role exist -- next(); return; [ Pass parameter req.userId ]
  // Return res.status(403).send({message: "Require Admin Role!"}); return 
};


const evsAuthorize = {
  isEvsAdmin,
  isEvsVoter,
  isEvsVoterOrAdmin
};
module.exports = evsAuthorize;