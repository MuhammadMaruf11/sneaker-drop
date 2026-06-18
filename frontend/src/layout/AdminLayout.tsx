import { Layout, Menu } from "antd";
import { Outlet, useNavigate } from "react-router-dom";

const { Sider, Header, Content } = Layout;

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        <div style={{ color: "white", padding: 16 }}>Sneaker Admin</div>

        <Menu
          theme="dark"
          onClick={(e) => {
            if (e.key === "dashboard") navigate("/");
            if (e.key === "drops") navigate("/drops");
            if (e.key === "users") navigate("/users");
            if (e.key === "purchases") navigate("/purchases");
          }}
          items={[
            { key: "dashboard", label: "Dashboard" },
            { key: "drops", label: "Drops" },
            { key: "users", label: "Users" },
            { key: "purchases", label: "Purchases" },
          ]}
        />
      </Sider>

      <Layout>
        <Header style={{ background: "#fff" }}>Admin Panel</Header>

        <Content style={{ padding: 20 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}