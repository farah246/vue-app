import {origins} from '../config/allowed-origins.js';
export const credentials = (req,res,next)=>{
    const origin = req.headers.origins
    if(origins.includes(origin)){
        res.header('Access-control-Allow-Origin',true)
    }
    next();
}
