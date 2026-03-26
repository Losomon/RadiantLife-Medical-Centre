const express = require('express');
const Patient = require('../models/Patient');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const { 
  auth, 
  authorize, 
  canManagePatientRecords, 
  canManageStaff,
  isStaff 
} = require('../middleware/rbac');

const router = express.Router();

// ==================== PATIENT MANAGEMENT ====================

// Create new patient (Patient Registration)
router.post('/patients', auth, async (req, res) => {
  try {
    const { name, dob, age, gender, email, phone, address, allergies, medicalHistory, emergencyContact } = req.body;

    // Validate required fields
    if (!name || !dob || !age || !gender || !email || !phone) {
      return res.status(400).json({ error: 'Name, DOB, age, gender, email, and phone are required' });
    }

    // Check if patient already exists
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ error: 'Patient with this email already exists' });
    }

    const patient = new Patient({
      name,
      dob,
      age,
      gender,
      email,
      phone,
      address,
      allergies: allergies || [],
      medicalHistory: medicalHistory || [],
      emergencyContact
    });

    await patient.save();

    res.status(201).json({
      message: 'Patient registered successfully',
      patient
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all patients (Staff only)
router.get('/patients', auth, isStaff, async (req, res) => {
  try {
    const patients = await Patient.find({ active: true })
      .sort({ createdAt: -1 })
      .select('-medicalHistory -allergies'); // Basic info only

    res.json({
      count: patients.length,
      patients
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search patient by name or email
router.get('/patients/search/:query', auth, isStaff, async (req, res) => {
  try {
    const { query } = req.params;

    const patients = await Patient.find({
      active: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { patientId: query }
      ]
    });

    res.json({
      count: patients.length,
      patients
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get patient by ID (with full details - doctors only)
router.get('/patients/:patientId', auth, canManagePatientRecords, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update patient information
router.put('/patients/:patientId', auth, canManagePatientRecords, async (req, res) => {
  try {
    const { name, age, gender, phone, address, allergies, medicalHistory, emergencyContact } = req.body;

    const patient = await Patient.findByIdAndUpdate(
      req.params.patientId,
      {
        name,
        age,
        gender,
        phone,
        address,
        allergies,
        medicalHistory,
        emergencyContact
      },
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({
      message: 'Patient updated successfully',
      patient
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get patient's medical records (Doctors only)
router.get('/patients/:patientId/records', auth, canManagePatientRecords, async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient: req.params.patientId })
      .populate('doctor', 'name specialization')
      .sort({ recordDate: -1 });

    res.json({
      count: records.length,
      records
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== STAFF MANAGEMENT ====================

// Get all staff members (Admin only)
router.get('/staff', auth, canManageStaff, async (req, res) => {
  try {
    const staff = await User.find({ 
      role: { $in: ['doctor', 'nurse', 'admin'] },
      active: true 
    })
      .select('-password')
      .sort({ role: 1, name: 1 });

    res.json({
      count: staff.length,
      staff
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get staff by role
router.get('/staff/role/:role', auth, isStaff, async (req, res) => {
  try {
    const { role } = req.params;

    if (!['doctor', 'nurse', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const staff = await User.find({ 
      role,
      active: true 
    })
      .select('-password')
      .sort({ name: 1 });

    res.json({
      count: staff.length,
      staff
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get staff member details
router.get('/staff/:staffId', auth, isStaff, async (req, res) => {
  try {
    const staff = await User.findById(req.params.staffId)
      .select('-password');

    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update staff profile (Admin or self)
router.put('/staff/:staffId', auth, async (req, res) => {
  try {
    // Check if user is admin or updating their own profile
    if (req.user.role !== 'admin' && req.user.userId !== req.params.staffId) {
      return res.status(403).json({ error: 'You can only update your own profile' });
    }

    const { phone, department, specialization, address } = req.body;

    const staff = await User.findByIdAndUpdate(
      req.params.staffId,
      {
        phone,
        department,
        specialization,
        address
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      staff
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Deactivate staff member (Admin only)
router.patch('/staff/:staffId/deactivate', auth, canManageStaff, async (req, res) => {
  try {
    const staff = await User.findByIdAndUpdate(
      req.params.staffId,
      { active: false },
      { new: true }
    ).select('-password');

    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    res.json({
      message: 'Staff member deactivated',
      staff
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== APPOINTMENT MANAGEMENT ====================

// Get all appointments (Staff only)
router.get('/appointments', auth, isStaff, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name email patientId')
      .populate('doctor', 'name specialization')
      .sort({ date: 1 });

    res.json({
      count: appointments.length,
      appointments
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create appointment
router.post('/appointments', auth, isStaff, async (req, res) => {
  try {
    const { patient, doctor, date, endTime, reason, appointmentType, location } = req.body;

    if (!patient || !doctor || !date || !reason) {
      return res.status(400).json({ error: 'Patient, doctor, date, and reason are required' });
    }

    const appointment = new Appointment({
      patient,
      doctor,
      date,
      endTime,
      reason,
      appointmentType,
      location,
      status: 'scheduled'
    });

    await appointment.save();
    await appointment.populate('patient doctor');

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update appointment status
router.patch('/appointments/:appointmentId/status', auth, isStaff, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['scheduled', 'completed', 'cancelled', 'no-show'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.appointmentId,
      { status },
      { new: true }
    ).populate('patient doctor');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({
      message: 'Appointment status updated',
      appointment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== MEDICAL RECORDS ====================

// Create medical record (Doctors only)
router.post('/medical-records', auth, canManagePatientRecords, async (req, res) => {
  try {
    const { patient, appointment, vitals, diagnoses, prescriptions, labResults, clinicalNotes, treatmentPlan } = req.body;

    if (!patient) {
      return res.status(400).json({ error: 'Patient ID is required' });
    }

    const record = new MedicalRecord({
      patient,
      doctor: req.user.userId,
      appointment,
      vitals,
      diagnoses,
      prescriptions,
      labResults,
      clinicalNotes,
      treatmentPlan
    });

    await record.save();
    await record.populate('patient doctor');

    res.status(201).json({
      message: 'Medical record created',
      record
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
