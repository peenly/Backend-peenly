const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({

    


    
    otpCode: { type: String, required: false},

    email: {type: String, unique: true},
    password: String,
    fullname: String,
    dateOfBirth: String,
    mfaEnabled: { type: Boolean, default: false },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChildProfile' }], // Reference to child profiles
    guardians: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    dateOfBirth: { type: Date, required: false },
    otpCode: { type: String, required: false},
    resetToken: String,
    resetTokenExpiration: Date,
    mfaEnabled: { type: Boolean, default: false },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChildProfile' }], 

    
},
    {
        timestamps: true
    }
);

const User = mongoose.model('User', UserSchema)
module.exports = User;