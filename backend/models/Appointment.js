const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  endTime: { type: Date },
  reason: { type: String, required: true },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled', 'no-show'], default: 'scheduled' },
  notes: { type: String },
  appointmentType: { type: String, enum: ['consultation', 'follow-up', 'procedure'], default: 'consultation' },
  location: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
