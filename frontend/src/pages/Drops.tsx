import { Button, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'

type DropRow = {
  id: string
  name: string
  totalStock: number
  availableStock: number
  recentBuyers: string[]
}

const drops: DropRow[] = [
  {
    id: 'air-jordan-1-retro',
    name: 'Air Jordan 1 Retro High',
    totalStock: 120,
    availableStock: 42,
    recentBuyers: ['Alex', 'Maya', 'Jordan'],
  },
  {
    id: 'yeezy-boost-350',
    name: 'Yeezy Boost 350 V2',
    totalStock: 90,
    availableStock: 18,
    recentBuyers: ['Sam', 'Nina'],
  },
  {
    id: 'dunk-low-panda',
    name: 'Nike Dunk Low Panda',
    totalStock: 150,
    availableStock: 63,
    recentBuyers: ['Chris', 'Taylor', 'Rafi'],
  },
]

const columns: ColumnsType<DropRow> = [
  {
    title: 'Drop Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Total Stock',
    dataIndex: 'totalStock',
    key: 'totalStock',
    responsive: ['sm'],
  },
  {
    title: 'Available Stock',
    dataIndex: 'availableStock',
    key: 'availableStock',
  },
  {
    title: 'Recent Buyers',
    dataIndex: 'recentBuyers',
    key: 'recentBuyers',
    render: (buyers: string[]) => (
      <Space size={[0, 8]} wrap>
        {buyers.map((buyer) => (
          <Tag key={buyer}>{buyer}</Tag>
        ))}
      </Space>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: () => (
      <Button disabled type="primary">
        Reserve
      </Button>
    ),
  },
]

function Drops() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="m-0 text-2xl font-semibold text-gray-900">Drops</h2>
        <p className="mt-1 text-sm text-gray-500">
          Placeholder inventory table prepared for future API data.
        </p>
      </div>

      <Table
        columns={columns}
        dataSource={drops}
        pagination={false}
        rowKey="id"
        scroll={{ x: true }}
      />
    </div>
  )
}

export default Drops
