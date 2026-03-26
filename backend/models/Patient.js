const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  medicalHistory: [{
    condition: String,
    dateAdded: { type: Date, default: Date.now }
  }],
  allergies: [{
    allergen: String,
    severity: { type: String, enum: ['Mild', 'Moderate', 'Severe'] },
    reaction: String
  }],
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  patientId: { type: String, unique: true, sparse: true }, // Auto-generated
  active: { type: Boolean, default: true }
}, { timestamps: true });

// Auto-generate patient ID before saving
patientSchema.pre('save', async function(next) {
  if (!this.patientId) {
    const count = await mongoose.model('Patient').countDocuments();
    this.patientId = `P${Date.now()}${count}`;
  }
  next();
});

module.exports = mongoose.model('Patient', patientSchema);
