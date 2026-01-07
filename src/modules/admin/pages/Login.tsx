import { useState } from "react";
import { Button, Card, Checkbox, Form, Input, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/api/services/AuthService";
import type { LoginDto } from "@/api/models/LoginDto";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<LoginDto>();

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const res = await AuthService.authLoginControllerLogin(values);
      const token = res?.data?.accessToken;
      if (!token) {
        message.error("登录失败：未返回令牌");
        return;
      }
      localStorage.setItem("accessToken", token);
      message.success("登录成功");
      navigate("/", { replace: true });
    } catch (e: any) {
      if (e?.status === 401) {
        message.error("用户名或密码错误");
      } else {
        message.error(e?.message || "登录失败");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fb",
      }}
    >
      <Card style={{ width: 360, boxShadow: "0 8px 16px rgba(115,103,240,0.08)" }}>
        <Typography.Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
          管理员登录
        </Typography.Title>
        <Form form={form} layout="vertical" initialValues={{ idleLogout30m: false }}>
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input placeholder="用户名" autoFocus />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password placeholder="密码" />
          </Form.Item>
          <Form.Item name="idleLogout30m" valuePropName="checked">
            <Checkbox>启用30分钟无操作自动退出</Checkbox>
          </Form.Item>
          <Button type="primary" block loading={loading} onClick={onSubmit}>
            登录
          </Button>
        </Form>
      </Card>
    </div>
  );
}
