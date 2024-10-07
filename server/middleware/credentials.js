import {origins} from '../config/allowed-origins.js';
export const credentials = (req,res,next)=>{
    const origin = req.headers.origin
    if(origins.includes(origin)){
        res.header('Access-control-Allow-Origin',true);
        res.header('Access-Control-Allow-Credentials',true);
    }
    next();
}
