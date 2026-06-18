import { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Table, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useUserStore } from "../store/userStore";
import apiClient from "../api/client";
import { toast, ToastContainer } from "../components/Toast";

export default function Users() {
  const { users, fetchUsers } = useUserStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async (values: { username: string }) => {
    setSubmitting(true);
    try {
      await apiClient.post("/users", values);
      toast.success(`User "${values.username}" created!`);
      setModalOpen(false);
      form.resetFields();
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { title: "Username", dataIndex: "username", key: "username",
      render: (v: string) => <Tag>{v}</Tag> },
    { title: "ID", dataIndex: "id", key: "id",
      render: (v: string) => <span className="text-xs text-gray-400 font-mono">{v}</span> },
  ];

  return (
    <div className="space-y-6">
      <ToastContainer />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="m-0 text-2xl font-semibold text-gray-900">Users</h2>
          <p className="mt-1 text-sm text-gray-500">Demo users for testing reservations.</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          Add User
        </Button>
      </div>

      <Table columns={columns} dataSource={users} rowKey="id" pagination={false} />

      <Modal title="Add User" open={modalOpen} onCancel={() => setModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleCreate} className="mt-4">
          <Form.Item name="username" label="Username" rules={[{ required: true, min: 2 }]}>
            <Input placeholder="sneaker_fan_01" />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={submitting}>Create</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
