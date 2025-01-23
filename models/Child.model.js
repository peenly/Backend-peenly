const mongoose = require('mongoose')


const childProfileSchema = new mongoose.Schema({


    name: String,
    age: Number,
    guardianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    privacy: { type: String, enum: ['public', 'private'], default: 'private' },
    achievements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' }],
    milestones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Milestone' }],

  },
    {
    timestamps: true
    }

);
  
  const ChildProfile = mongoose.model('ChildProfile', childProfileSchema);
  module.exports = ChildProfile;
// const mongoose = require('mongoose')


// const childProfileSchema = new mongoose.Schema({


//     name: String,
//     age: Number,
//     guardianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     privacy: { type: String, enum: ['private', 'public'], default: 'private' },

//   },
//     {
//     timestamps: true
//     }

// );
  
//   const ChildProfile = mongoose.model('ChildProfile', childProfileSchema);
//   module.exports = ChildProfile;
