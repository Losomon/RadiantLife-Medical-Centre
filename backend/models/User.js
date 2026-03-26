const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['doctor', 'nurse', 'admin', 'patient'], 
    default: 'patient' 
  },
  department: { type: String }, // For doctors and nurses
  specialization: { type: String }, // For doctors
  licenseNumber: { type: String }, // For doctors and nurses
  permissions: [{ type: String }], // Fine-grained permissions
  address: { type: String },
  active: { type: Boolean, default: true },
  lastLogin: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
