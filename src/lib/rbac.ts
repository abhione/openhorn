type UserRole = "ADMIN" | "MANAGER" | "RECRUITER";

// Role hierarchy: ADMIN > MANAGER > RECRUITER
const roleHierarchy: Record<UserRole, number> = {
  ADMIN: 3,
  MANAGER: 2,
  RECRUITER: 1,
};

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export function isAdmin(role: UserRole): boolean {
  return role === "ADMIN";
}

export function isManager(role: UserRole): boolean {
  return hasRole(role, "MANAGER");
}

export function isRecruiter(role: UserRole): boolean {
  return hasRole(role, "RECRUITER");
}

// Permissions map
export const permissions = {
  "users.list": ["ADMIN"] as UserRole[],
  "users.create": ["ADMIN"] as UserRole[],
  "users.update": ["ADMIN"] as UserRole[],
  "users.deactivate": ["ADMIN"] as UserRole[],
  "workspace.update": ["ADMIN", "MANAGER"] as UserRole[],
  "reports.view": ["ADMIN", "MANAGER"] as UserRole[],
  "candidates.create": ["ADMIN", "MANAGER", "RECRUITER"] as UserRole[],
  "candidates.view": ["ADMIN", "MANAGER", "RECRUITER"] as UserRole[],
};

export type Permission = keyof typeof permissions;

export function hasPermission(
  userRole: UserRole,
  permission: Permission
): boolean {
  return permissions[permission].includes(userRole);
}
