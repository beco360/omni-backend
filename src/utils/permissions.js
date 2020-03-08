/**
 * Validate access of a user
 * @param {Array} allowedPermissions Array of allowed permissions
 * @param {Object} userPermissions Array of user permissions
 * @return {boolean} Has access
 */
function validateAccess(allowedPermissions, userPermissions) {
  if (!allowedPermissions || !userPermissions) {
    return false;
  }

  return allowedPermissions
    .map(allowedPermission => userPermissions.includes(allowedPermission))
    .find(allowed => Boolean(allowed));
    
}

module.exports = {
  validateAccess
};
