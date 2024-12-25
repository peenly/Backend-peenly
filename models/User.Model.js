const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({

    
    email: {type: String, unique: true},
    password: String,
    fullname: String,
    dateOfBirth: String,
    mfaEnabled: { type: Boolean, default: false },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChildProfile' }], // Reference to child profiles
    
},
    {
        timestamps: true
    }
);

const User = mongoose.model('User', UserSchema)
module.exports = User;