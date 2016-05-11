'use strict';

/**
* Module dependencies
*/
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
* Invoke Focus Permissions
*/
exports.invokeRolesPolicies = function() {
  acl.allow([{
    roles: ['guest'],
    allows: [{
      resources: '/mustCancers',
      permissions: '*'
    },{
      resources: '/test',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/mustCancers',
      permissions: '*'
    },{
      resources: '/test',
      permissions: '*'
    }]
  }]);
};

/**
* Check If Focus Policy Allows
*/
exports.isAllowed = function(req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Focu is being processed and the current user created it then allow any manipulation
  if (req.focu && req.user && req.focu.user && req.focu.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function(err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
