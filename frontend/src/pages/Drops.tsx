import { useState } from "react";
import { Button, Form, Input, InputNumber, Modal, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";
import { useDrops } from "../hooks/useDrops";
import { useSocket } from "../hooks/useSocket";
import type { Drop } from "../store/dropStore";
import apiClient from "../api/client";
import { toast, ToastContainer } from "../components/Toast";
import { StockBadge } from "../components/StockBadge";

export default function Drops() {
  const { drops, loading, refetch } = useDrops();
  useSocket();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const handleCreate = async (values: {
    name: string;
    totalStock: number;
    startTime: string;
  }) => {
    setSubmitting(true);
    try {
      await apiClient.post("/drops", {
        ...values,
        startTime: values.startTime || new Date().toISOString(),
      });
      toast.success(`Drop "${values.name}" created!`);
      setModalOpen(false);
      form.resetFields();
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to create drop");
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnsType<Drop> = [
    {
      title: "Drop Name",
      dataIndex: "name",
      key: "name",
      render: (name) => <span className="font-medium">{name}</span>,
    },
    {
      title: "Total Stock",
      dataIndex: "totalStock",
      key: "totalStock",
      responsive: ["sm"],
    },
    {
      title: "Available",
      dataIndex: "availableStock",
      key: "availableStock",
      render: (availableStock, record) => (
        <StockBadge availableStock={availableStock} total={record.totalStock} />
      ),
    },
    {
      title: "Recent Buyers",
      dataIndex: "recentBuyers",
      key: "recentBuyers",
      render: (buyers: Drop["recentBuyers"]) => (
        <Space size={[0, 4]} wrap>
          {buyers.length === 0 ? (
            <span className="text-gray-400 text-xs">—</span>
          ) : (
            buyers.map((b) => <Tag key={b.userId}>{b.username}</Tag>)
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <ToastContainer />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="m-0 text-2xl font-semibold text-gray-900">Drops</h2>
          <p className="mt-1 text-sm text-gray-500">
            Live inventory. Stock updates automatically via WebSocket.
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalOpen(true)}
        >
          New Drop
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={drops}
        loading={loading}
        pagination={false}
        rowKey="id"
        scroll={{ x: true }}
      />

      <Modal
        title="Create New Drop"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate} className="mt-4">
          <Form.Item name="name" label="Sneaker Name" rules={[{ required: true }]}>
            <Input placeholder="Air Jordan 1 Retro High OG" />
          </Form.Item>
          <Form.Item
            name="totalStock"
            label="Total Stock"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} className="w-full" placeholder="100" />
          </Form.Item>
          <Form.Item name="startTime" label="Start Time (optional)">
            <Input type="datetime-local" />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Launch Drop
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
