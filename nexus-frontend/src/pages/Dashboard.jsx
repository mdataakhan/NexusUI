import { useLocation } from "react-router-dom";

export default function Dashboard() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userId = params.get("user");

  return (
    <div className="h-screen flex items-center justify-center text-3xl">
      Welcome! Your User ID: {userId}
    </div>
  );
}
