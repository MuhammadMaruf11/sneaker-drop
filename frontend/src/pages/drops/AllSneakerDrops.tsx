import { useDrops } from "../../hooks/useDrops";
import { useSocket } from "../../hooks/useSocket";
import { useUserStore } from "../../store/userStore";
import { useEffect } from "react";
import { DropCard } from "../../components/DropCard";
import { ToastContainer } from "../../components/Toast";

export function AllSneakerDrops() {
  const { drops, loading, error } = useDrops();
  const { connected } = useSocket();
  const { users, currentUser, fetchUsers, setCurrentUser } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <ToastContainer />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 m-0">Live Drops</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Stock updates in real-time.{" "}
            <span className={`inline-flex items-center gap-1 text-xs font-medium ${connected ? "text-green-600" : "text-red-500"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-green-500 animate-pulse" : "bg-red-400"}`} />
              {connected ? "Live" : "Disconnected"}
            </span>
          </p>
        </div>

        {/* User selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 shrink-0">Shopping as:</label>
          <select
            value={currentUser?.id || ""}
            onChange={(e) => {
              const user = users.find((u) => u.id === e.target.value);
              if (user) setCurrentUser(user);
            }}
            className="border border-gray-300 text-sm px-3 py-1.5 bg-white text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-gray-400 rounded"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Drops Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 animate-pulse">
              <div className="bg-gray-100 h-20" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-10 bg-gray-200 rounded mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500 text-sm">{error}</div>
      ) : drops.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">👟</p>
          <p className="text-sm">No active drops. Create one from the Drops page.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {drops.map((drop) => (
            <DropCard key={drop.id} drop={drop} />
          ))}
        </div>
      )}
    </div>
  );
}

export default AllSneakerDrops;
