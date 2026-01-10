import { Card, Col, Row, Statistic } from "antd";
import {
  UserOutlined,
  CloudOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

export default function Dashboard() {
  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card className="metric-card">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="metric-icon success">
                <UserOutlined />
              </span>
              <Statistic title="在线用户" value={128} suffix="�? />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="metric-card">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="metric-icon info">
                <CloudOutlined />
              </span>
              <Statistic title="今日访问" value={4521} suffix="�? />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="metric-card">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="metric-icon warning">
                <ThunderboltOutlined />
              </span>
              <Statistic title="待处理任�? value={17} suffix="�? />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
