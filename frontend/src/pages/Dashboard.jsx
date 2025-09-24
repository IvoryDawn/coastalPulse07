import DashboardUser from "./DashboardUser";
import DashboardOfficer from "./DashboardOfficer";
import DashboardAnalyst from "./DashboardAnalyst";

export default function Dashboard() {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch (err) {
    console.error("Error parsing user from localStorage:", err);
  }

  if (!user) return <p className="card">⚠️ Please login.</p>;

  switch (user.role) {
    case "officer":
      return <DashboardOfficer />;
    case "analyst":
      return <DashboardAnalyst />;
    default:
      return <DashboardUser />;
  }
}
