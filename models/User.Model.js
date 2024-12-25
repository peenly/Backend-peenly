const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({

    
<<<<<<< HEAD
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    dateOfBirth: { type: Date, required: false },
    otpCode: { type: String, required: false},
=======
    email: {type: String, unique: true},
    password: String,
    fullname: String,
    dateOfBirth: String,
    mfaEnabled: { type: Boolean, default: false },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChildProfile' }], // Reference to child profiles
>>>>>>> e93c86f (parent)
    
},
    {
        timestamps: true
    }
);

const User = mongoose.model('User', UserSchema)
module.exports = User;