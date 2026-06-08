const prisma = require('../config/db');

// Role-Based Access Control (RBAC) middleware
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User authentication required.' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. You do not have the required permissions.' });
    }
    
    next();
  };
};

// Data ownership / tenant protection middleware
// Ensures a tenant user cannot access other tenants' resource data
const checkTenantAccess = (resourceModel) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      if (!resourceId) return next();

      if (!req.user) {
        return res.status(401).json({ error: 'User authentication required.' });
      }

      // Super Admins bypass tenant checks
      if (req.user.role === 'SUPER_ADMIN') {
        return next();
      }

      const userClientId = req.user.clientId;
      if (!userClientId) {
        return res.status(403).json({ error: 'Access denied. Client profile not found.' });
      }

      // Query the resource database
      const resource = await prisma[resourceModel].findUnique({
        where: { id: resourceId },
        select: { clientId: true }
      });

      if (!resource) {
        return res.status(404).json({ error: `${resourceModel} not found.` });
      }

      if (resource.clientId !== userClientId) {
        return res.status(403).json({ error: 'Access denied. Resource belongs to another tenant.' });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  authorizeRoles,
  checkTenantAccess
};
