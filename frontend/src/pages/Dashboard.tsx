import {
  ClockCircleOutlined,
  ShoppingCartOutlined,
  TagsOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import { Card, Col, Row, Statistic } from 'antd'

const stats = [
  {
    title: 'Total Drops',
    value: 12,
    icon: <TagsOutlined className="text-blue-500" />,
  },
  {
    title: 'Active Stock',
    value: 248,
    icon: <TrophyOutlined className="text-green-500" />,
  },
  {
    title: 'Reservations',
    value: 37,
    icon: <ClockCircleOutlined className="text-amber-500" />,
  },
  {
    title: 'Purchases',
    value: 96,
    icon: <ShoppingCartOutlined className="text-purple-500" />,
  },
]

function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="m-0 text-2xl font-semibold text-gray-900">Dashboard</h2>
        <p className="mt-1 text-sm text-gray-500">
          Static overview placeholders for admin metrics.
        </p>
      </div>

      <Row gutter={[16, 16]}>
        {stats.map((stat) => (
          <Col key={stat.title} xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                prefix={stat.icon}
                title={stat.title}
                value={stat.value}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default Dashboard
