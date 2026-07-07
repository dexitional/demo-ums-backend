import { Request, Response, NextFunction } from "express";
import HrsModel from '../model/hrsModel'
import AuthModel from '../model/authModel'
import moment from "moment";
import { paramStr } from "../util/paramStr";

const hrs = new HrsModel();
const Auth = new AuthModel();
const sha1 = require('sha1');

export default class HrsController {


    /* NSS Module */
     
      // NSS
      async fetchNSSAll(req: Request,res: Response) {
        const { page = 1, pageSize = 6, keyword = '' } :any = req.query;
        const offset = (page - 1) * pageSize;
        try {
           const resp = await hrs.fetchNSSAll(keyword,offset,pageSize)
           if(resp){
            console.log(resp,page,offset,pageSize)
        
             res.status(200).json(resp)
           } else {
             res.status(204).json({ message: `no record found` })
           }
         } catch (error: any) {
            console.log(error)
            return res.status(500).json({ message: error.message }) 
         }
      }
  
      async fetchNSS(req: Request,res: Response) {
        try {
           const resp = await await hrs.fetchNSS(paramStr(req.params.id))
           if(resp){
              res.status(200).json(resp)
           } else {
              res.status(204).json({ message: `no records found` })
           }
         } catch (error: any) {
            console.log(error)
            return res.status(500).json({ message: error.message }) 
         }
      }

      async fetchNSSByPin(req: Request,res: Response) {
         try {
            const resp = await hrs.fetchNSSByPin(paramStr(req.params.pin))
            if(resp){
               res.status(200).json(resp)
            } else {
               res.status(204).json({ message: `no records found` })
            }
          } catch (error: any) {
             console.log(error)
             return res.status(500).json({ message: error.message }) 
          }
       }
  
      async postNSS(req: Request,res: Response) {
        try {
           delete req.body.photo;
           delete req.body.password;
           delete req.body.repassword;
           delete req.body.nss_form;

           const resp = await await hrs.postNSS(req.body)
           if(resp){
             res.status(200).json(resp)
           } else {
             res.status(204).json({ message: `no records found` })
           }
         } catch (error: any) {
           console.log(error)
           return res.status(500).json({ message: error.message }) 
         }
      }

      async postNSSRegister(req: Request,res: Response) {
         try {
            
            const password = sha1(req.body.password);
            const nss = await hrs.fetchNSSByPin(req.body.nss_no)
            console.log(nss)
            delete req.body.photo;
            delete req.body.password;
            delete req.body.repassword;
            delete req.body.nss_form;
            delete req.body.id;

            // req.body.start_date = moment().format('YYYY-11-01');
            // req.body.end_date = moment(moment().format('YYYY-11-01')).add(1,'year');

            // req.body.start_date = '2023-11-01';
            // req.body.end_date = '2024-10-31';
            
            req.body.start_date = moment('2023-11-01','YYYY-MM-DD').format('YYYY-MM-DD');
            req.body.end_date = moment('2024-10-31','YYYY-MM-DD').format('YYYY-MM-DD');

            if(!nss){
               const sso_data = { group_id: 3, tag: req.body.nss_no?.toLowerCase(), username: req.body.nss_no?.toLowerCase(), password }
               const resp = await hrs.postNSS(req.body)
               if(resp){
                  await Auth.insertSSOUser(sso_data)
                  res.status(200).json(resp)
               } else {
                  res.status(204).json({ message: `No records found` })
               }

            } else {
               res.status(200).json(nss)
            }
            
          } catch (error: any) {
            console.log(error)
            return res.status(500).json({ message: error.message }) 
          }
       }
  
      async updateNSS(req: Request,res: Response) {
        try {
           delete req.body.photo;
           delete req.body.password;
           delete req.body.repassword;
           delete req.body.nss_form;

           console.log(paramStr(req.params.id),req.body)

           const resp = await hrs.updateNSS(paramStr(req.params.id), req.body);
           console.log(resp)
           if(resp){
              res.status(200).json(resp)
           } else {
              res.status(204).json({ message: `no records found` })
           }
        } catch (error: any) {
           console.log(error)
           return res.status(500).json({ message: error.message }) 
        }
      }
  
      async deleteNSS(req: Request,res: Response) {
        try {
           const resp = await hrs.deleteNSS(paramStr(req.params.id))
           if(resp){
              res.status(200).json(resp)
           } else {
              res.status(204).json({ message: `no records found` })
           }
         } catch (error: any) {
           console.log(error)
           return res.status(500).json({ message: error.message }) 
         }
      }


      // NOTICES & CIRCULARS
      async fetchNotices(req: Request,res: Response) {
         try {
            const resp = await hrs.fetchNotices()
            if(resp.length > 0){
              res.status(200).json(resp)
            } else {
              res.status(204).json({ message: `no record found` })
            }
          } catch (error: any) {
             console.log(error)
             return res.status(500).json({ message: error.message }) 
          }
       }

       async fetchNSSNotices(req: Request,res: Response) {
         try {
            const resp = await hrs.fetchNSSNotices()
            if(resp.length > 0){
              res.status(200).json(resp)
            } else {
              res.status(204).json({ message: `no record found` })
            }
          } catch (error: any) {
             console.log(error)
             return res.status(500).json({ message: error.message }) 
          }
       }
   
       async fetchNotice(req: Request,res: Response) {
         try {
            const resp = await await hrs.fetchNotice(paramStr(req.params.id))
            if(resp){
               res.status(200).json(resp)
            } else {
               res.status(204).json({ message: `no records found` })
            }
          } catch (error: any) {
             console.log(error)
             return res.status(500).json({ message: error.message }) 
          }
       }
 
       async postNotice(req: Request,res: Response) {
         try {
            
            req.body.start_date = new Date();
            req.body.end_date = `${new Date().getFullYear()+1}-10-01`;
            
            const resp = await await hrs.postNotice(req.body)
            if(resp){
              res.status(200).json(resp)
            } else {
              res.status(204).json({ message: `no records found` })
            }
          } catch (error: any) {
            console.log(error)
            return res.status(500).json({ message: error.message }) 
          }
       }
 
       async updateNotice(req: Request,res: Response) {
         try {
            const resp = await hrs.updateNotice(paramStr(req.params.id), req.body);
            console.log(resp)
            if(resp){
               res.status(200).json(resp)
            } else {
               res.status(204).json({ message: `no records found` })
            }
         } catch (error: any) {
            console.log(error)
            return res.status(500).json({ message: error.message }) 
         }
       }
   
       async deleteNotice(req: Request,res: Response) {
         try {
            const resp = await hrs.deleteNotice(paramStr(req.params.id))
            if(resp){
               res.status(200).json(resp)
            } else {
               res.status(204).json({ message: `no records found` })
            }
          } catch (error: any) {
            console.log(error)
            return res.status(500).json({ message: error.message }) 
          }
       }


        // NSS SERVICE REQUEST
      async fetchServices(req: Request,res: Response) {
         try {
            const resp = await hrs.fetchServices()
            if(resp.length > 0){
              res.status(200).json(resp)
            } else {
              res.status(204).json({ message: `no record found` })
            }
          } catch (error: any) {
             console.log(error)
             return res.status(500).json({ message: error.message }) 
          }
       }

       async fetchService(req: Request,res: Response) {
         try {
            const resp = await await hrs.fetchService(paramStr(req.params.id))
            if(resp){
               res.status(200).json(resp)
            } else {
               res.status(204).json({ message: `no records found` })
            }
          } catch (error: any) {
             console.log(error)
             return res.status(500).json({ message: error.message }) 
          }
       }
 
       async postService(req: Request,res: Response) {
         try {
            const resp = await await hrs.postService(req.body)
            if(resp){
              res.status(200).json(resp)
            } else {
              res.status(204).json({ message: `no records found` })
            }
          } catch (error: any) {
            console.log(error)
            return res.status(500).json({ message: error.message }) 
          }
       }
 
       async updateService(req: Request,res: Response) {
         try {
            const resp = await hrs.updateNotice(paramStr(req.params.id), req.body);
            console.log(resp)
            if(resp){
               res.status(200).json(resp)
            } else {
               res.status(204).json({ message: `no records found` })
            }
         } catch (error: any) {
            console.log(error)
            return res.status(500).json({ message: error.message }) 
         }
       }
   
       async deleteService(req: Request,res: Response) {
         try {
            const resp = await hrs.deleteService(paramStr(req.params.id))
            if(resp){
               res.status(200).json(resp)
            } else {
               res.status(204).json({ message: `no records found` })
            }
          } catch (error: any) {
            console.log(error)
            return res.status(500).json({ message: error.message }) 
          }
       }


       // NSS PASSWORD CHANGE
       async postNSSPassword(req: Request,res: Response) {
         try {
            const oldp = req.body.oldpassword;
            const newp = req.body.newpassword;
            const rnewp = req.body.rnewpassword;
            const nss_no = req.body.nss_no;

            if(newp != rnewp) res.status(204).json({ message: `new password mismatch` })

            const user = Auth.withCredential(nss_no,oldp)
            if(!user) res.status(204).json({ message: `old password doesnt exist` })
            const resp = await await Auth.updateSSOPassword(nss_no, { password: sha1(rnewp) })
            if(resp){
              res.status(200).json(resp)
            } else {
              res.status(204).json({ message: `no records found` })
            }
          } catch (error: any) {
            console.log(error)
            return res.status(500).json({ message: error.message }) 
          }
       }

       // HR UNITS
       async fetchUnits(req: Request,res: Response) {
         try {
            const resp = await hrs.fetchUnits()
            if(resp.length > 0){
              res.status(200).json(resp)
            } else {
              res.status(204).json({ message: `no record found` })
            }
          } catch (error: any) {
             console.log(error)
             return res.status(500).json({ message: error.message }) 
          }
       }
 
   
}