const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  
  // Vitals
  vitals: {
    temperature: Number, // Celsius
    bloodPressure: String, // e.g., "120/80"
    heartRate: Number, // BPM
    respiratoryRate: Number, // breaths per minute
    weight: Number, // kg
    height: Number, // cm
    bmi: Number
  },
  
  // Diagnoses
  diagnoses: [{
    condition: String,
    icd10Code: String,
    dateOfDiagnosis: Date,
    notes: String
  }],
  
  // Prescriptions
  prescriptions: [{
    medication: String,
    dosage: String,
    frequency: String, // e.g., "twice daily"
    duration: String,
    sideEffects: String,
    prescribedDate: { type: Date, default: Date.now },
    expiryDate: Date,
    isActive: { type: Boolean, default: true }
  }],
  
  // Lab Results
  labResults: [{
    testName: String,
    testDate: Date,
    result: String,
    normalRange: String,
    unit: String,
    status: { type: String, enum: ['Normal', 'Abnormal', 'Critical'] }
  }],
  
  // Clinical Notes
  clinicalNotes: String,
  followUpNotes: String,
  
  // Treatment Plan
  treatmentPlan: String,
  
  recordDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
