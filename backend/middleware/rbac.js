const jwt = require('jsonwebtoken');

// Basic auth middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalid' });
  }
};

// Role-based access control middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions' });
    }
    next();
  };
};

// Specific role middlewares
const isDoctor = (req, res, next) => authorize('doctor')(req, res, next);
const isNurse = (req, res, next) => authorize('nurse')(req, res, next);
const isAdmin = (req, res, next) => authorize('admin')(req, res, next);
const isPatient = (req, res, next) => authorize('patient')(req, res, next);
const isStaff = (req, res, next) => authorize('doctor', 'nurse', 'admin')(req, res, next);

// Doctor can read/write patient records and prescribe
const canManagePatientRecords = (req, res, next) => {
  authorize('doctor', 'admin')(req, res, next);
};

// Nurse can update vitals and administer meds
const canUpdateVitals = (req, res, next) => {
  authorize('nurse', 'doctor', 'admin')(req, res, next);
};

// Admin can manage staff and finances
const canManageStaff = (req, res, next) => {
  authorize('admin')(req, res, next);
};

module.exports = {
  auth,
  authorize,
  isDoctor,
  isNurse,
  isAdmin,
  isPatient,
  isStaff,
  canManagePatientRecords,
  canUpdateVitals,
  canManageStaff
};
