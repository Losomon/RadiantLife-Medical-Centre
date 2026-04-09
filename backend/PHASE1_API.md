# RadiantLife Medical Center - Phase 1 API Documentation

## Overview
Phase 1 implements Core Data & Authentication for the RadiantLife Medical Center system.

**Base URL:** `http://localhost:5000/api`

---

## 🔐 Authentication Endpoints

### 1. User Registration
**Endpoint:** `POST /auth/register`  
**Description:** Register a new patient or user  
**Auth Required:** No

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "555-1234",
  "role": "patient" // Optional: patient (default), doctor, nurse, admin
}
```

**Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "userId": "userId123",
  "user": {
    "id": "userId123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

---

### 2. Staff Registration
**Endpoint:** `POST /auth/register-staff`  
**Description:** Register doctors, nurses (Admin only)  
**Auth Required:** Yes (Admin role)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "Dr. Sarah Smith",
  "email": "sarah.smith@hospital.com",
  "password": "securePassword123",
  "phone": "555-5678",
  "role": "doctor", // doctor or nurse
  "department": "Cardiology",
  "specialization": "Cardiac Surgery",
  "licenseNumber": "MED123456"
}
```

**Response:** `201 Created`
```json
{
  "message": "Staff member registered successfully",
  "userId": "staffId123",
  "user": {
    "id": "staffId123",
    "name": "Dr. Sarah Smith",
    "email": "sarah.smith@hospital.com",
    "role": "doctor",
    "department": "Cardiology"
  }
}
```

---

### 3. User Login
**Endpoint:** `POST /auth/login`  
**Description:** Authenticate user and get JWT token  
**Auth Required:** No

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "userId123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient",
    "department": null
  }
}
```

---

### 4. Get Current User
**Endpoint:** `GET /auth/me`  
**Description:** Get authenticated user details  
**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "_id": "userId123",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "role": "patient",
  "active": true,
  "createdAt": "2026-03-26T10:00:00Z"
}
```

---

## 👥 Patient Management Endpoints

### 1. Register New Patient
**Endpoint:** `POST /data/patients`  
**Description:** Create new patient profile  
**Auth Required:** Yes

**Request Body:**
```json
{
  "name": "Jane Doe",
  "dob": "1990-05-15",
  "age": 35,
  "gender": "Female",
  "email": "jane@example.com",
  "phone": "555-9999",
  "address": "123 Main St, City",
  "allergies": [
    {
      "allergen": "Penicillin",
      "severity": "Severe",
      "reaction": "Anaphylaxis"
    }
  ],
  "medicalHistory": [
    {
      "condition": "Hypertension",
      "dateAdded": "2025-01-01"
    }
  ],
  "emergencyContact": {
    "name": "John Doe",
    "phone": "555-1111",
    "relationship": "Spouse"
  }
}
```

**Response:** `201 Created`
```json
{
  "message": "Patient registered successfully",
  "patient": {
    "_id": "patientId123",
    "patientId": "P1711353600001",
    "name": "Jane Doe",
    "age": 35,
    "gender": "Female",
    "email": "jane@example.com",
    "phone": "555-9999",
    "allergies": [...],
    "medicalHistory": [...],
    "active": true,
    "createdAt": "2026-03-26T10:00:00Z"
  }
}
```

---

### 2. Get All Patients
**Endpoint:** `GET /data/patients`  
**Description:** Get list of all patients (Staff only)  
**Auth Required:** Yes (Doctor, Nurse, Admin)

**Response:** `200 OK`
```json
{
  "count": 15,
  "patients": [
    {
      "_id": "patientId123",
      "patientId": "P1711353600001",
      "name": "Jane Doe",
      "age": 35,
      "gender": "Female",
      "email": "jane@example.com",
      "phone": "555-9999",
      "active": true
    }
  ]
}
```

---

### 3. Search Patients
**Endpoint:** `GET /data/patients/search/:query`  
**Description:** Search patients by name, email, or patient ID  
**Auth Required:** Yes (Staff only)

**Example:** `GET /data/patients/search/Jane`

**Response:** `200 OK`
```json
{
  "count": 1,
  "patients": [
    {
      "_id": "patientId123",
      "patientId": "P1711353600001",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  ]
}
```

---

### 4. Get Patient Details
**Endpoint:** `GET /data/patients/:patientId`  
**Description:** Get full patient details (Doctors only)  
**Auth Required:** Yes (Doctor or higher)

**Response:** `200 OK`
```json
{
  "_id": "patientId123",
  "patientId": "P1711353600001",
  "name": "Jane Doe",
  "age": 35,
  "gender": "Female",
  "email": "jane@example.com",
  "phone": "555-9999",
  "address": "123 Main St, City",
  "allergies": [...],
  "medicalHistory": [...],
  "emergencyContact": {...},
  "active": true,
  "createdAt": "2026-03-26T10:00:00Z"
}
```

---

### 5. Update Patient Information
**Endpoint:** `PUT /data/patients/:patientId`  
**Description:** Update patient profile (Doctors only)  
**Auth Required:** Yes (Doctor)

**Request Body:**
```json
{
  "age": 36,
  "phone": "555-8888",
  "allergies": [
    {
      "allergen": "Penicillin",
      "severity": "Severe",
      "reaction": "Anaphylaxis"
    },
    {
      "allergen": "Sulfa",
      "severity": "Moderate",
      "reaction": "Rash"
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "message": "Patient updated successfully",
  "patient": {...}
}
```

---

### 6. Get Patient Medical Records
**Endpoint:** `GET /data/patients/:patientId/records`  
**Description:** Get all medical records for a patient (Doctors only)  
**Auth Required:** Yes (Doctor)

**Response:** `200 OK`
```json
{
  "count": 3,
  "records": [
    {
      "_id": "recordId123",
      "patient": "patientId123",
      "doctor": {
        "_id": "doctorId",
        "name": "Dr. Sarah Smith",
        "specialization": "Cardiology"
      },
      "vitals": {
        "temperature": 37.2,
        "bloodPressure": "120/80",
        "heartRate": 72
      },
      "diagnoses": [...],
      "recordDate": "2026-03-25T10:00:00Z"
    }
  ]
}
```

---

## 👨‍⚕️ Staff Management Endpoints

### 1. Get All Staff Members
**Endpoint:** `GET /data/staff`  
**Description:** Get list of all staff (Admin only)  
**Auth Required:** Yes (Admin)

**Response:** `200 OK`
```json
{
  "count": 5,
  "staff": [
    {
      "_id": "staffId123",
      "name": "Dr. Sarah Smith",
      "email": "sarah.smith@hospital.com",
      "role": "doctor",
      "department": "Cardiology",
      "specialization": "Cardiac Surgery",
      "phone": "555-5678",
      "active": true
    }
  ]
}
```

---

### 2. Get Staff by Role
**Endpoint:** `GET /data/staff/role/:role`  
**Description:** Get staff by role (doctor, nurse, admin)  
**Auth Required:** Yes (Staff)

**Example:** `GET /data/staff/role/doctor`

**Response:** `200 OK`
```json
{
  "count": 3,
  "staff": [
    {
      "_id": "staffId123",
      "name": "Dr. Sarah Smith",
      "email": "sarah.smith@hospital.com",
      "role": "doctor",
      "department": "Cardiology",
      "specialization": "Cardiac Surgery"
    }
  ]
}
```

---

### 3. Get Staff Member Details
**Endpoint:** `GET /data/staff/:staffId`  
**Description:** Get specific staff member details  
**Auth Required:** Yes (Staff)

**Response:** `200 OK`
```json
{
  "_id": "staffId123",
  "name": "Dr. Sarah Smith",
  "email": "sarah.smith@hospital.com",
  "phone": "555-5678",
  "role": "doctor",
  "department": "Cardiology",
  "specialization": "Cardiac Surgery",
  "licenseNumber": "MED123456",
  "address": "456 Hospital Ave",
  "active": true,
  "lastLogin": "2026-03-26T09:00:00Z"
}
```

---

### 4. Update Staff Profile
**Endpoint:** `PUT /data/staff/:staffId`  
**Description:** Update staff profile (Admin or self)  
**Auth Required:** Yes

**Request Body:**
```json
{
  "phone": "555-5679",
  "department": "Emergency",
  "specialization": "Trauma Surgery",
  "address": "789 Hospital Ave"
}
```

**Response:** `200 OK`
```json
{
  "message": "Profile updated successfully",
  "staff": {...}
}
```

---

### 5. Deactivate Staff Member
**Endpoint:** `PATCH /data/staff/:staffId/deactivate`  
**Description:** Deactivate staff member (Admin only)  
**Auth Required:** Yes (Admin)

**Response:** `200 OK`
```json
{
  "message": "Staff member deactivated",
  "staff": {
    "_id": "staffId123",
    "name": "Dr. Sarah Smith",
    "active": false
  }
}
```

---

## 📅 Appointment Management Endpoints

### 1. Get All Appointments
**Endpoint:** `GET /data/appointments`  
**Description:** Get all appointments (Staff only)  
**Auth Required:** Yes (Staff)

**Response:** `200 OK`
```json
{
  "count": 10,
  "appointments": [
    {
      "_id": "appointmentId123",
      "patient": {
        "_id": "patientId123",
        "name": "Jane Doe",
        "patientId": "P1711353600001"
      },
      "doctor": {
        "_id": "doctorId",
        "name": "Dr. Sarah Smith",
        "specialization": "Cardiology"
      },
      "date": "2026-04-01T10:00:00Z",
      "reason": "Follow-up Checkup",
      "status": "scheduled",
      "appointmentType": "follow-up"
    }
  ]
}
```

---

### 2. Create Appointment
**Endpoint:** `POST /data/appointments`  
**Description:** Create new appointment (Staff only)  
**Auth Required:** Yes (Staff)

**Request Body:**
```json
{
  "patient": "patientId123",
  "doctor": "doctorId",
  "date": "2026-04-01T10:00:00Z",
  "endTime": "2026-04-01T10:30:00Z",
  "reason": "Annual Checkup",
  "appointmentType": "consultation",
  "location": "Room 101"
}
```

**Response:** `201 Created`
```json
{
  "message": "Appointment created successfully",
  "appointment": {
    "_id": "appointmentId123",
    "patient": {...},
    "doctor": {...},
    "date": "2026-04-01T10:00:00Z",
    "reason": "Annual Checkup",
    "status": "scheduled",
    "appointmentType": "consultation"
  }
}
```

---

### 3. Update Appointment Status
**Endpoint:** `PATCH /data/appointments/:appointmentId/status`  
**Description:** Update appointment status  
**Auth Required:** Yes (Staff)

**Request Body:**
```json
{
  "status": "completed" // scheduled, completed, cancelled, no-show
}
```

**Response:** `200 OK`
```json
{
  "message": "Appointment status updated",
  "appointment": {
    "_id": "appointmentId123",
    "status": "completed"
  }
}
```

---

## 📋 Medical Records Endpoints

### 1. Create Medical Record
**Endpoint:** `POST /data/medical-records`  
**Description:** Create medical record for patient (Doctors only)  
**Auth Required:** Yes (Doctor)

**Request Body:**
```json
{
  "patient": "patientId123",
  "appointment": "appointmentId123",
  "vitals": {
    "temperature": 37.2,
    "bloodPressure": "120/80",
    "heartRate": 72,
    "respiratoryRate": 16,
    "weight": 70,
    "height": 175,
    "bmi": 22.9
  },
  "diagnoses": [
    {
      "condition": "Hypertension",
      "icd10Code": "I10",
      "dateOfDiagnosis": "2026-03-26",
      "notes": "Stage 1 hypertension"
    }
  ],
  "prescriptions": [
    {
      "medication": "Lisinopril",
      "dosage": "10mg",
      "frequency": "once daily",
      "duration": "30 days",
      "sideEffects": "Dry cough"
    }
  ],
  "labResults": [
    {
      "testName": "Blood Glucose",
      "testDate": "2026-03-26",
      "result": "95",
      "normalRange": "70-100",
      "unit": "mg/dL",
      "status": "Normal"
    }
  ],
  "clinicalNotes": "Patient presents with elevated blood pressure...",
  "treatmentPlan": "Start antihypertensive therapy, lifestyle modifications"
}
```

**Response:** `201 Created`
```json
{
  "message": "Medical record created",
  "record": {
    "_id": "recordId123",
    "patient": {...},
    "doctor": {...},
    "vitals": {...},
    "diagnoses": [...],
    "prescriptions": [...],
    "recordDate": "2026-03-26T10:00:00Z"
  }
}
```

---

## 🔐 Role-Based Access Control

### User Roles and Permissions

| Role | Permissions |
|------|------------|
| **Patient** | View own records, view appointments |
| **Nurse** | Update vitals, administer meds, view patient info |
| **Doctor** | Read/write patient records, prescribe, create appointments |
| **Admin** | Manage staff, system configuration, reports |

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided, authorization denied"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied. Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Testing Authentication

```bash
# Register a patient
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "555-1234"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Use token for authenticated requests
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/data/patients
```

---

## Environment Setup

Create a `.env` file in the backend directory:

```env
MONGO_URI=mongodb://localhost:27017/radiantlife
JWT_SECRET=your_super_secret_key_here
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

---

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your actual values

# Start server
npm start

# Or for development with auto-reload
npm run dev
```

---

## Next Steps - Phase 2

- [ ] Patient appointment scheduling UI
- [ ] Medical records viewing interface
- [ ] Staff dashboard
- [ ] Prescription management
- [ ] Lab results integration
- [ ] Reporting and analytics
