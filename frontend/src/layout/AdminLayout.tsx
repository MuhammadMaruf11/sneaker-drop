import { Layout, Menu } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const { Sider, Header, Content } = Layout;

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey =
    location.pathname === "/" ? "dashboard"
    : location.pathname === "/live" ? "live"
    : location.pathname.replace("/", "");

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        <div style={{ color: "white", padding: "16px", fontWeight: "bold", fontSize: 15 }}>
          👟 Sneaker Drop
        </div>
        <Menu
          theme="dark"
          selectedKeys={[selectedKey]}
          onClick={(e) => {
            if (e.key === "dashboard") navigate("/");
            else navigate(`/${e.key}`);
          }}
          items={[
            { key: "dashboard", label: "Dashboard" },
            { key: "live", label: "🔴 Live Drops" },
            { key: "drops", label: "Manage Drops" },
            { key: "users", label: "Users" },
            { key: "purchases", label: "Purchases" },
          ]}
        />
      </Sider>

      <Layout>
        <Header style={{ background: "#fff", paddingLeft: 24, display: "flex", alignItems: "center" }}>
          <span className="font-semibold text-gray-700">Sneaker Drop Admin</span>
        </Header>
        <Content style={{ padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
