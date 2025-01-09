const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({

    
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    dateOfBirth: { type: Date, required: false },
    otpCode: { type: String, required: false},
    
},
    {
        timestamps: true
    }
);

const UserModel = mongoose.model('user', UserSchema)
module.exports = UserModel;