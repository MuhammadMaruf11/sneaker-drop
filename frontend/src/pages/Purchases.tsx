import { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import apiClient from "../api/client";
import { useUserStore } from "../store/userStore";

type Purchase = {
  id: string;
  userId: string;
  dropId: string;
  createdAt: string;
  user?: { username: string };
  drop?: { name: string };
};

export default function Purchases() {
  const currentUser = useUserStore((s) => s.currentUser);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    apiClient
      .get(`/purchases/user/${currentUser.id}`)
      .then((r) => setPurchases(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentUser]);

  const columns = [
    { title: "Drop", dataIndex: ["drop", "name"], key: "drop",
      render: (_: any, r: Purchase) => r.drop?.name || r.dropId },
    { title: "Purchased At", dataIndex: "createdAt", key: "createdAt",
      render: (v: string) => new Date(v).toLocaleString() },
    { title: "Status", key: "status",
      render: () => <Tag color="green">Completed</Tag> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="m-0 text-2xl font-semibold text-gray-900">Purchases</h2>
        <p className="mt-1 text-sm text-gray-500">
          {currentUser ? `Showing purchases for ${currentUser.username}` : "Select a user to view purchases"}
        </p>
      </div>
      <Table columns={columns} dataSource={purchases} rowKey="id" loading={loading} pagination={false} />
    </div>
  );
}
