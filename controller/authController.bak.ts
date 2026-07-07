import { Request, Response } from "express";
import AuthModel from '../model/authModel'

const jwt = require('jsonwebtoken');
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwzyx", 8);
const sha1 = require('sha1')
const Auth = new AuthModel();
export default class AuthController {
    
    async authenticateWithCredential(req: Request,res: Response) {
        try {
           const { username, password }:{ username: string, password: string } = req.body;
           if(!username) throw new Error('No username provided!');
           if(!password) throw new Error('No password provided!');
           // Locate Single-Sign-On Record or Student account
           const isUser = await Auth.withCredential(username, password);
           if (isUser) {
                let { uid, tag, group_id: gid } = isUser;
                // Get University User Record and Category
                const user = await Auth.fetchUser(uid,gid)
                if(!user && gid == 1){
                  const ins = await Auth.insertSSOUser({
                    username: username,
                    password: sha1(password),
                    group_id: gid, 
                    tag: tag,
                  });
                }
                
                const photo = `https://cdn.ucc.edu.gh/photos/?tag=${encodeURIComponent(tag)}`;
                let roles = uid ? await Auth.fetchRoles(uid) : []; // All App Roles
                let evsRoles = await Auth.fetchEvsRoles(tag); // Only Electa Roles
                // Construct UserData
                const userdata: any = {
                    user: uid 
                    ? { tag: user?.tag, fname: user?.fname, mname: user?.mname, lname: user?.lname, mail: user?.username, descriptor: user?.descriptor, department: user?.unitname, group_id: gid, group_name: user?.group_name } // SSO Record
                    : { tag: isUser.tag, fname: isUser.fname, mname: isUser.mname, lname: isUser.lname, mail: isUser.username, descriptor: isUser.descriptor, department: isUser.unitname, group_id: gid, group_name: isUser.group_name }, // Student Record
                    roles: [...roles, ...evsRoles ],
                    photo
                }
                console.log(userdata)
                // Generate Session Token & 
                const token = jwt.sign(userdata || {}, process.env.SECRET, { expiresIn: 60 * 60});
                // Send Response to Client
                res.status(200).json({ success: true, data: userdata, token });
            
            } else {
                res.status(401).json({
                    success: false,
                    message: "Invalid Username or Password!",
                });
            }
        
        } catch (error: any) {
            console.log(error)
            res.status(401).json({
              success: false,
              message: error.message,
            });
        }
    }

    async authenticateWithGoogle(req: Request,res: Response) {

        const { providerId, email }:{ providerId: string, email: string } = req.body;
        console.log(req.body)
        try {
            if(!email) throw new Error('No identity Email provided!');
            // Get University User Record and Category
            var user = await Auth.fetchUserByVerb(email);
            if (user) {
                // Locate Single-Sign-On Record
                const isUser = await Auth.fetchSSOUser(user.tag);
                if (isUser) {
                    const photo = `https://cdn.ucc.edu.gh/photos/?tag=${encodeURIComponent(user?.tag)}`;
                    const { uid, group_id: gid } = isUser;
                    let roles = uid ? await Auth.fetchRoles(uid) : []; // All App Roles
                    let evsRoles = await Auth.fetchEvsRoles(user.tag); // Only Electa Roles
                    // Construct UserData
                    const userdata: any = {
                       user: { tag: user.tag, fname: user.fname, mname: user.mname, lname: user.lname, mail: user.username, descriptor: user.descriptor, department: user.unitname, group_id: gid, group_name: user.group_name },
                       roles: [...roles, ...evsRoles ],
                       photo
                    }
                    // Generate Session Token & 
                    const token = jwt.sign(userdata || {}, process.env.SECRET, { expiresIn: 60 * 60});
                    // Send Response to Client
                    res.status(200).json({ success: true, data: userdata, token });

                
                } else {
                    const pwd = nanoid();
                    const photo = `https://cdn.ucc.edu.gh/photos/?tag=${encodeURIComponent(user?.tag)}`;
                    // Create Single-Sign-On Account or Record
                    const ins = await Auth.insertSSOUser({
                        username: email,
                        password: sha1(pwd),
                        group_id: user.gid, 
                        tag: user.tag,
                    });
                    if (ins?.insertId) {
                        const uid = ins.insertId;
                        let evsRoles = await Auth.fetchEvsRoles(user.tag); // EVS Roles
                        // Construct UserData
                        const userdata: any = {
                           user: { tag: user.tag, fname: user.fname, mname: user.mname, lname: user.lname, mail: user.username, descriptor: user.descriptor, department: user.unitname, group_id: user.gid, group_name: user.group_name },
                            roles: [...evsRoles ],
                            photo
                        }
                        // Generate Session Token & 
                        const token = jwt.sign(userdata || {}, process.env.SECRET, { expiresIn: 60 * 60});
                        // Send Response to Client
                        res.status(200).json({ success: true, data: userdata, token });
                    
                    } else {
                        res.status(500).json({
                          success: false,
                          message: "Account not Staged!",
                        });
                    }
                }
            } else {
                res.status(401).json({
                    success: false,
                    message: "Invalid email account!",
                });
            }
        } catch (e: any) {
            console.log(e);
            res.status(401).json({ success: false, message: e.message });
        }
    }

    
    async authenticateWithKey(req: Request,res: Response) {}

   

}
   