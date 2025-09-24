export default function RoleGate({ allow = [], user, children, fallback = null }) {
  if (!user) return fallback
  if (allow.includes(user.role)) return children
  return fallback
}
