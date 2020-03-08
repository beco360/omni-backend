const boom = require("@hapi/boom");
const permissionsUtilities = require("../permissions");

function permissionsValidationHandler(allowedPermissions) {
  return function(req, res, next) {
    if (!allowedPermissions) {
      next(boom.unauthorized());
    }
    if (!req.user || (req.user && !req.user.permissions)) {
      next(boom.unauthorized("Missing permissions"));
    }

    const hasAccess = permissionsUtilities.validateAccess(
      allowedPermissions,
      req.user.permissions
    );

    if (hasAccess) {
      next();
    } else {
      next(boom.unauthorized("Insufficient permissions"));
    }
  };
}

module.exports = permissionsValidationHandler;
