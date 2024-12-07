const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({

    
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    dateOfBirth: { type: Date, required: false }
    
},
    {
        timestamps: true
    }
);

const UserModel = mongoose.model('user', UserSchema)
module.exports = UserModel;