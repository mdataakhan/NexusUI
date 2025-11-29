import { useEffect, useState, useRef } from "react";
import { getUserById } from "../api/user";
import { useNavigate } from "react-router-dom";

export default function ProfileMenu({ userId: propUserId }) {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUser = async (id) => {
      try {
        const res = await getUserById(id);
        setUser(res.data?.data || null);
      } catch (err) {
        console.warn("Failed to fetch profile user", err);
      }
    };

    let id = propUserId;
    if (!id) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          id = payload.id;
        } catch (e) {
          // ignore
        }
      }
    }
    if (id) fetchUser(id);
    // keep fetchUser in scope so we can reuse it when opening profile modal
    ref.currentFetchUser = fetchUser;
  }, [propUserId]);

  const initials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold shadow"
        title={user?.name || "User"}
      >
        {initials(user?.name)}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded shadow-lg z-50">
          <div className="p-3 border-b border-gray-100 dark:border-gray-700">
            <div className="font-semibold">{user?.name || "Unknown"}</div>
            <div className="text-sm text-gray-500 dark:text-gray-300">{user?.email}</div>
          </div>
          <div className="p-2">
            <button className="w-full text-left px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => { setOpen(false); setShowProfile(true); const token = localStorage.getItem('token'); let id = propUserId; if (!id && token) { try { const payload = JSON.parse(atob(token.split('.')[1])); id = payload.id; } catch(e) {} } if (id && ref.currentFetchUser) ref.currentFetchUser(id); }}>Profile</button>
            <button className="w-full text-left px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => { setOpen(false); navigate('/dashboard'); }}>Dashboard</button>
            <button className="w-full text-left px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700" onClick={logout}>Logout</button>
          </div>
        </div>
      )}

      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowProfile(false)} />
          <div className="relative bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg w-full max-w-md p-6 z-10">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">Profile</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">User details fetched from server</p>
              </div>
              <button onClick={() => setShowProfile(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">✕</button>
            </div>
            <div className="mt-4 space-y-2">
              <div><span className="text-sm text-gray-500 dark:text-gray-300">Name:</span> <span className="font-medium">{user?.name}</span></div>
              <div><span className="text-sm text-gray-500 dark:text-gray-300">Email:</span> <span className="font-medium">{user?.email}</span></div>
              <div><span className="text-sm text-gray-500 dark:text-gray-300">Roles:</span> <span className="font-medium">{user?.roles?.join(", ")}</span></div>
              <div><span className="text-sm text-gray-500 dark:text-gray-300">Wallet:</span> <span className="font-medium">{user?.walletBalance ?? "—"}</span></div>
              <div><span className="text-sm text-gray-500 dark:text-gray-300">Funding Requests:</span> <span className="font-medium">{user?.fundingRequestIds?.length ?? 0}</span></div>
              <div><span className="text-sm text-gray-500 dark:text-gray-300">Created:</span> <span className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleString() : "—"}</span></div>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setShowProfile(false)} className="px-4 py-2 rounded bg-gray-100 dark:bg-gray-700">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
