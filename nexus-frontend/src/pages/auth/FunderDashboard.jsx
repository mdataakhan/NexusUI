import { useEffect, useState } from "react";
import { getUserById } from "../../api/user";
import { getFundingRequestById, getFundingRequestsByUser, createFundingRequest, getMyFundingRequests } from "../../api/fundingRequests";
import ProfileMenu from "../../components/ProfileMenu";

export default function FunderDashboard({ userId: propUserId }) {
  const [userId, setUserId] = useState(propUserId || null);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  // form state for creating a funding request
  const [title, setTitle] = useState("");
  const [requiredAmount, setRequiredAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [committedReturnAmount, setCommittedReturnAmount] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // use /mine endpoint to fetch funding requests created by logged-in user
        const r = await getMyFundingRequests();
        const list = r.data || [];
        setRequests(list);
        setCount(Array.isArray(list) ? list.length : 0);
      } catch (err) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading funder dashboard...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  const handleCreate = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setCreating(true);
    try {
      const body = {
        title,
        requiredAmount: Number(requiredAmount),
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
        committedReturnAmount: Number(committedReturnAmount),
        description,
      };

      const res = await createFundingRequest(body);
      const created = res.data || res;
      // push created item to list
      setRequests((prev) => [created, ...prev]);
      setCount((c) => c + 1);
      setSuccessMessage("Funding request created successfully.");
      // reset form
      setTitle("");
      setRequiredAmount("");
      setDeadline("");
      setCommittedReturnAmount("");
      setDescription("");
    } catch (err) {
      console.error("Create failed", err);
      setSuccessMessage("Failed to create funding request.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 w-full">
      <div className="w-full">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Funder Dashboard</h2>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-gray-500 dark:text-gray-300">Welcome back</div>
            <ProfileMenu userId={userId} />
          </div>
        </div>

        <div className="grid gap-6 lg:[grid-template-columns:1fr_360px]">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 rounded shadow">
                <div className="text-sm text-gray-500 dark:text-gray-300">Funding Requests Created</div>
                <div className="text-3xl font-bold">{count}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 rounded shadow md:col-span-2">
                <div className="text-sm text-gray-500 dark:text-gray-300">Wallet Balance</div>
                <div className="text-2xl font-semibold">—</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded shadow">
              <h3 className="text-xl font-medium mb-3 text-gray-900 dark:text-white">Create Funding Request</h3>
              <form onSubmit={handleCreate} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <input
                  className="col-span-1 lg:col-span-2 p-3 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

                <input
                  className="p-3 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Required Amount"
                  type="number"
                  step="0.01"
                  value={requiredAmount}
                  onChange={(e) => setRequiredAmount(e.target.value)}
                  required
                />

                <input
                  className="p-3 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Deadline"
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />

                <input
                  className="p-3 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Committed Return Amount"
                  type="number"
                  step="0.01"
                  value={committedReturnAmount}
                  onChange={(e) => setCommittedReturnAmount(e.target.value)}
                />

                <textarea
                  className="col-span-1 lg:col-span-3 p-3 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <div className="col-span-1 lg:col-span-3 flex items-center justify-between">
                  <div className="text-sm text-green-600">{successMessage}</div>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 ${creating ? 'opacity-80' : ''}`}
                    disabled={creating}
                  >
                    {creating ? "Creating..." : "Create Funding Request"}
                  </button>
                </div>
              </form>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">Funding Requests</h3>
              {requests.length === 0 ? (
                <div className="text-gray-600 dark:text-gray-300">No funding requests to display.</div>
              ) : (
                <ul className="space-y-3">
                  {requests.map((r, idx) => {
                    const item = r.data || r;
                    const title = item?.title || item?.name || `Request ${idx + 1}`;
                    const amount = item?.requiredAmount || item?.amount || item?.requestedAmount || "—";
                    const status = item?.status || item?.state || "—";
                    const id = item?.id || item?.requestId || item?._id || idx;
                    return (
                      <li key={id} className="p-4 bg-white dark:bg-gray-800 rounded shadow flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{title}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-300">ID: {id}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900 dark:text-white">{amount}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-300">{status}</div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-6 space-y-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                <div className="text-sm text-gray-500 dark:text-gray-300">Quick Actions</div>
                <div className="mt-3 flex flex-col gap-2">
                  <button className="text-left px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">Create New Request</button>
                  <button className="text-left px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">View Analytics</button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                <div className="text-sm text-gray-500 dark:text-gray-300">About</div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">Keep this area to show tips, links, or other filler content to avoid large empty spaces.</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
