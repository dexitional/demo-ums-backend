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
// SMS 
var axios = require('axios');
module.exports = function (phone, msg, from) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = {
            //key : 'pgC2DPZTwdbe68qPkuo4G36bV', // Bulksmsgh
            //key : 'B8pRALyxDgt4l5nRLOYVPoIm1', // Mnotify Kobby
            key: 'TFkrdSQimG3aMBcBmCqaiwhsH', // Mnotify AUCC
            from: from || 'AUCB',
            to: phone,
            content: msg,
        };
        //const url = `http://clientlogin.bulksmsgh.com/smsapi?key=${data.key}&to=${escape(data.to)}&msg=${data.content}&sender_id=${data.from}`
        const url = `https://apps.mnotify.net/smsapi?key=${data.key}&to=${data.to}&msg=${data.content}&sender_id=${data.from}`;
        const options = {
            method: 'get',
            url: encodeURI(url),
            responseType: 'json',
        };
        const res = yield axios(options);
        const resp = yield res.data;
        //console.log(resp);
        return resp; // mnotify
        //return {code:resp} // bulksmgh
    });
};
