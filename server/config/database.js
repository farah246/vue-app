import mongoose from 'mongoose';

export async function connect (){
    try{
        await mongoose.connect("mongodb://localhost:27017/mevn_auth");
        console.log("Connected to database");
    }catch(err){
        console.log(err);
    }
}
