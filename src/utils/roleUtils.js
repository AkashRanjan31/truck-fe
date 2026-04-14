import { ROLES } from './constants';

export const isDriver = (role) => role === ROLES.DRIVER;
export const isStateAdmin = (role) => role === ROLES.STATE_ADMIN;
export const isSuperAdmin = (role) => role === ROLES.SUPER_ADMIN;
export const isAuthority = (role) => role === ROLES.AUTHORITY;
export const isAdmin = (role) => [ROLES.STATE_ADMIN, ROLES.SUPER_ADMIN].includes(role);

export const getDefaultRoute = (role) => {
  const routes = {
    [ROLES.DRIVER]: '/driver/map',
    [ROLES.STATE_ADMIN]: '/admin/state-dashboard',
    [ROLES.SUPER_ADMIN]: '/admin/dashboard',
    [ROLES.AUTHORITY]: '/authority/dashboard',
  };
  return routes[role] || '/auth';
};
