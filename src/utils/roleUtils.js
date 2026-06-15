import { USER_ROLES } from './constants';

export const isAdmin = (role) => {
  return [USER_ROLES.SUPER_ADMIN, USER_ROLES.STATE_ADMIN].includes(role);
};

export const isAuthority = (role) => {
  return role === USER_ROLES.AUTHORITY;
};

export const isDriver = (role) => {
  return role === USER_ROLES.DRIVER;
};

export const isSuperAdmin = (role) => {
  return role === USER_ROLES.SUPER_ADMIN;
};

export const isStateAdmin = (role) => {
  return role === USER_ROLES.STATE_ADMIN;
};

export const can = (userRole, action) => {
  const rolePermissions = {
    [USER_ROLES.SUPER_ADMIN]: ['*'], // All permissions
    [USER_ROLES.STATE_ADMIN]: ['view_state_data', 'manage_reports', 'manage_alerts', 'view_analytics'],
    [USER_ROLES.AUTHORITY]: ['view_assigned_alerts', 'respond_to_alerts', 'view_reports'],
    [USER_ROLES.DRIVER]: ['report_incident', 'view_map', 'view_history', 'emergency_sos', 'view_profile']
  };

  const permissions = rolePermissions[userRole] || [];
  return permissions.includes('*') || permissions.includes(action);
};
