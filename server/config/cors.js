import { origins } from './allowed-origins.js';
export const corsOptions = {
    origin : (origin,callback)=>{
        if(origins.includes(origin)|| !origin){
            callback(null,true);
        }else{
            callback(new Error('Origin not allowed by CORS'));
        }
    }
}
