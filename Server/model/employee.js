const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  age: { type: Number, required: true },
  role: { type: String, enum: ['Developer', 'Tester', 'Designer'], required: true },
  phoneNumber: { type: String, required: true },
  joiningDate: { type: String, required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Employee', employeeSchema);
