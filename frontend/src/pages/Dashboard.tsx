import { Card, Col, Row, Statistic } from "antd";
import {
  ClockCircleOutlined,
  ShoppingCartOutlined,
  TagsOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { useDropStore } from "../store/dropStore";
import { useDrops } from "../hooks/useDrops";
import { useSocket } from "../hooks/useSocket";
import { AllSneakerDrops } from "./drops/AllSneakerDrops";

export default function Dashboard() {
  useDrops();
  useSocket();
  const drops = useDropStore((s) => s.drops);

  const totalStock = drops.reduce((a, d) => a + d.totalStock, 0);
  const availableStock = drops.reduce((a, d) => a + d.availableStock, 0);
  const soldUnits = totalStock - availableStock;

  const stats = [
    { title: "Active Drops", value: drops.length, icon: <TagsOutlined className="text-blue-500" /> },
    { title: "Available Stock", value: availableStock, icon: <TrophyOutlined className="text-green-500" /> },
    { title: "Units Sold", value: soldUnits, icon: <ShoppingCartOutlined className="text-purple-500" /> },
    { title: "Total Drops", value: drops.length, icon: <ClockCircleOutlined className="text-amber-500" /> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="m-0 text-2xl font-semibold text-gray-900">Dashboard</h2>
        <p className="mt-1 text-sm text-gray-500">Live sneaker drop overview.</p>
      </div>

      <Row gutter={[16, 16]}>
        {stats.map((stat) => (
          <Col key={stat.title} xs={24} sm={12} lg={6}>
            <Card>
              <Statistic prefix={stat.icon} title={stat.title} value={stat.value} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Live drops grid right on dashboard */}
      <AllSneakerDrops />
    </div>
  );
}
