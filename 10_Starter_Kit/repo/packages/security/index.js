const rolePermissions = {
  admin: ["matter:create", "matter:view", "document:import", "document:process", "fact:review", "draft:create", "draft:edit", "draft:verify", "draft:review", "draft:export"],
  lawyer: ["matter:create", "matter:view", "document:import", "document:process", "draft:create", "draft:edit", "draft:verify"],
  reviewer: ["matter:view", "fact:review", "draft:verify", "draft:review", "draft:export"],
  viewer: ["matter:view"],
  worker: ["document:process"]
};

export function can(role, action) {
  return Boolean(rolePermissions[role]?.includes(action));
}

export function assertCan(role, action) {
  if (can(role, action)) return;
  const error = new Error(`Role ${role || "anonymous"} cannot perform ${action}.`);
  error.code = "permission_denied";
  error.status = 403;
  throw error;
}

export function roleFromRequest(request) {
  return request.headers["x-evida-role"] ?? "viewer";
}

export { rolePermissions };
