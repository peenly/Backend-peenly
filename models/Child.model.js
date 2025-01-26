const mongoose = require('mongoose')


const ChildSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  hobbies: [String],
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to parent
});

const Child = mongoose.model('ChildProfile', ChildSchema);

module.exports = Child;
