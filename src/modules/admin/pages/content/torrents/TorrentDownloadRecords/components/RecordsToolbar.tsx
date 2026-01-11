import { Button, Card, Input, Space, Typography } from "antd";

interface RecordsToolbarProps {
  torrentId: string;
  setTorrentId: (v: string) => void;
  userId: string;
  setUserId: (v: string) => void;
  onSearch: () => void;
}

export const RecordsToolbar = ({
  torrentId,
  setTorrentId,
  userId,
  setUserId,
  onSearch,
}: RecordsToolbarProps) => {
  return (
    <Card>
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Space>
          <Typography.Text type="secondary">下载记录</Typography.Text>
          <Input
            size="large"
            allowClear
            placeholder="按种子ID"
            value={torrentId}
            onChange={(e) => setTorrentId(e.target.value)}
            style={{ width: 180 }}
          />
          <Input
            size="large"
            allowClear
            placeholder="按用户ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{ width: 180 }}
          />
          <Button type="primary" onClick={onSearch}>
            查询
          </Button>
        </Space>
      </Space>
    </Card>
  );
};
