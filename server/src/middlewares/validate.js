const { validationResult, body } = require('express-validator');

// Validation runner helper
const validateInputs = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Input validation failed. Please check your parameters.', 
      details: errors.array().map(err => ({ field: err.path, message: err.msg })) 
    });
  }
  next();
};

// Auth validation rules
const loginRules = [
  body('email').trim().notEmpty().withMessage('Provide a valid email address or username.'),
  body('password').trim().notEmpty().withMessage('Password cannot be empty.'),
  validateInputs
];

const registerRules = [
  body('email').trim().notEmpty().withMessage('Provide a valid email address or username.'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
  body('name').trim().escape().notEmpty().withMessage('Name is required.'),
  body('role').isIn(['PARTNER_MAIN', 'PARTNER_SUB', 'CLIENT_OWNER']).withMessage('Invalid registration role.'),
  body('phone').optional().trim().escape().isMobilePhone().withMessage('Invalid phone number format.'),
  validateInputs
];

// Lead validation rules
const createLeadRules = [
  body('name').trim().escape().notEmpty().withMessage('Lead name is required.'),
  body('contact').trim().escape().notEmpty().withMessage('Contact info is required.'),
  body('value').optional().isFloat({ min: 0 }).withMessage('Value must be a positive number.'),
  body('stage').optional().isIn(['NEW', 'CONTACTED', 'OFFER', 'WON', 'LOST']).withMessage('Invalid CRM stage.'),
  validateInputs
];

module.exports = {
  loginRules,
  registerRules,
  createLeadRules,
  validateInputs
};
