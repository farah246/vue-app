import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
      type: String,
       required: true,
       lowercase: true,
        trim : true,
        unique: true,
        validate: [
            (val) => /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(val),
        ]
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required:true,
        min:6
    },
    refreshToken :String
},
    {timestamps:true},
    {
        virtuals:{
            fullName: {
                get() {
                    return this.first_name + " " + this.last_name;
                }
            },
            id: {
                get() {
                    return this._id;
                }
            }
        }

    }
    );
export default mongoose.model('User', UserSchema);
