import { useState } from "react";
import { App, Button, Input, Space, Table, Upload } from "antd";
import type { ColumnsType } from "antd/es/table";
import { BonusAdminService } from "@/api/services/BonusAdminService";

type BatchItem = { userId: string; delta: string; reason: string; externalRef?: string };
type ResultItem = { ok: boolean; userId: string; delta?: string; error?: string };

function parseCsv(text: string): BatchItem[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  const header = lines[0].split(",").map((s) => s.trim().toLowerCase());
  const idxUser = header.indexOf("userid");
  const idxDelta = header.indexOf("delta");
  const idxReason = header.indexOf("reason");
  const idxRef = header.indexOf("externalref");
  const out: BatchItem[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    const userId = cols[idxUser]?.trim();
    const delta = cols[idxDelta]?.trim();
    const reason = cols[idxReason]?.trim();
    const externalRef = idxRef >= 0 ? cols[idxRef]?.trim() : undefined;
    if (userId && delta && reason) {
      out.push({ userId, delta, reason, externalRef });
    }
  }
  return out;
}

export default function BonusBatchAdjustPage() {
  const { message } = App.useApp();
  const [text, setText] = useState("");
  const [items, setItems] = useState<BatchItem[]>([]);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleParseCsv(file: File) {
    const content = await file.text();
    const parsed = parseCsv(content);
    setItems(parsed);
    message.success(`已解�?${parsed.length} 行`);
    return false;
  }

  function handleParseJson() {
    try {
      const arr: BatchItem[] = JSON.parse(text);
      if (Array.isArray(arr)) {
        setItems(arr);
        message.success(`已解�?JSON ${arr.length} 行`);
      } else {
        message.error("JSON 根必须是数组");
      }
    } catch {
      message.error("JSON 解析失败");
    }
  }

  async function handleSubmit() {
    if (!items.length) {
      message.warning("请先解析 CSV 或粘�?JSON");
      return;
    }
    setLoading(true);
    try {
      const resp = await BonusAdminService.bonusAccountControllerAdminBatchAdjust({ items });
      const data = resp?.data || {};
      setResults((data.results || []) as ResultItem[]);
      const ok = data.okCount || 0;
      const fail = data.failCount || 0;
      message.success(`批量完成：成�?${ok}，失�?${fail}`);
    } catch {
      message.error("批量调账失败");
    } finally {
      setLoading(false);
    }
  }

  const colsItems: ColumnsType<BatchItem> = [
    { title: "用户ID", dataIndex: "userId", width: 160 },
    { title: "变动�?, dataIndex: "delta", width: 140 },
    { title: "原因", dataIndex: "reason", width: 200 },
    { title: "externalRef", dataIndex: "externalRef", width: 220 },
  ];

  const colsResults: ColumnsType<ResultItem> = [
    { title: "用户ID", dataIndex: "userId", width: 160 },
    { title: "结果", dataIndex: "ok", width: 120, render: (v: boolean) => (v ? "成功" : "失败") },
    { title: "变动�?, dataIndex: "delta", width: 140 },
    { title: "错误", dataIndex: "error" },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 12 }}>
        <Upload beforeUpload={handleParseCsv} accept=".csv">
          <Button>上传并解�?CSV</Button>
        </Upload>
        <Button type="primary" onClick={handleSubmit} loading={loading}>
          提交批量调账
        </Button>
      </Space>
      <div style={{ marginBottom: 8, color: "#888" }}>
        建议为每条记录提供唯一 externalRef 以避免重复执行；冻结账户将拒绝负向记账�?
      </div>

      <Space align="start" style={{ gap: 24 }}>
        <div style={{ width: 520 }}>
          <div style={{ marginBottom: 8 }}>
            或：粘贴 JSON 数组（每行包�?userId/delta/reason/externalRef?�?
          </div>
          <Input.TextArea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='例如：[{"userId":"100","delta":"1000","reason":"campaign","externalRef":"batch-1-100"}]'
          />
          <Space style={{ marginTop: 8 }}>
            <Button onClick={handleParseJson}>解析 JSON</Button>
            <Button
              onClick={() => {
                setText("");
                setItems([]);
                setResults([]);
              }}
            >
              清空
            </Button>
          </Space>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 8 }}>待提交项目（解析结果�?/div>
          <Table
            bordered
            rowKey={(r) => `${r.userId}-${r.delta}-${r.reason}`}
            dataSource={items}
            pagination={false}
            columns={colsItems}
          />

          <div style={{ margin: "16px 0 8px" }}>执行结果</div>
          <Table
            bordered
            rowKey={(r) => `${r.userId}-${r.error || ""}`}
            dataSource={results}
            pagination={false}
            columns={colsResults}
          />
        </div>
      </Space>
    </div>
  );
}
