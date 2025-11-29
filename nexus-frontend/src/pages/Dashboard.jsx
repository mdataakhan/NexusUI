import { useLocation } from "react-router-dom";
import FunderDashboard from "./auth/FunderDashboard";
import ProfileMenu from "../components/ProfileMenu";

export default function Dashboard() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const qsUserId = params.get("user");

  // try to extract role & id from token as primary source
  let role = null;
  let tokenUserId = null;
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      role = payload.roles?.[0] || null;
      tokenUserId = payload.id;
    }
  } catch (e) {
    // ignore
  }

  const userId = tokenUserId || qsUserId;

  if (role === "FUNDER") {
    return <FunderDashboard userId={userId} />;
  }

  if (role === "SUPPLIER") {
    return (
      <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 w-full">
        <div className="w-full flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Supplier Dashboard</h2>
          <ProfileMenu userId={userId} />
        </div>
        <div className="w-full p-8">
          <p className="mt-4 text-gray-600 dark:text-gray-300">Supplier-specific dashboard will be implemented here.</p>
        </div>
      </div>
    );
  }

  if (role === "INVESTOR") {
    return (
      <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 w-full">
          <div className="w-full flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Investor Dashboard</h2>
          <ProfileMenu userId={userId} />
        </div>
          <div className="w-full p-8">
          <p className="mt-4 text-gray-600 dark:text-gray-300">Investor-specific dashboard will be implemented here.</p>
        </div>
      </div>
    );
  }

  // fallback: show minimal info with profile
  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 w-full">
      <div className="w-full flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Welcome</h2>
        <ProfileMenu userId={userId} />
      </div>
      <div className="h-[60vh] flex items-center justify-center text-3xl text-gray-900 dark:text-white">Welcome! Your User ID: {userId}</div>
    </div>
  );
}
