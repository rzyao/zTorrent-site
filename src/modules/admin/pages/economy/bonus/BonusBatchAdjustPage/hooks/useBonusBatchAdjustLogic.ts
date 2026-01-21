import { useState } from "react";
import { toast } from "sonner";
import { BonusAdminService } from "@/api/services/BonusAdminService";
import type { BatchItem, ResultItem } from "../types";
import { parseCsv, parseJson } from "../utils/parsers";

export function useBonusBatchAdjustLogic() {
  const [text, setText] = useState("");
  const [items, setItems] = useState<BatchItem[]>([]);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleParseCsv = async (file: any) => {
    try {
      const content = await file.text();
      const parsed = parseCsv(content);
      setItems(parsed);
      toast.success(`已解析 ${parsed.length} 行 CSV 数据`);
    } catch (e) {
      toast.error("解析 CSV 失败，请检查文件格式");
      console.error(e);
    }
    return false; // Prevent upload
  };

  const handleParseJson = () => {
    try {
      const arr = parseJson(text);
      setItems(arr);
      toast.success(`已解析 ${arr.length} 行 JSON 数据`);
    } catch (e: any) {
      if (e.message === "JSON root must be an array") {
        toast.error("JSON 必须是数组格式");
      } else {
        toast.error("JSON 解析失败: " + e.message);
      }
    }
  };

  const handleClear = () => {
    setText("");
    setItems([]);
    setResults([]);
  };

  const handleSubmit = async () => {
    if (!items.length) {
      toast.warning("请先导入数据");
      return;
    }

    setLoading(true);
    try {
      // API 只接受 items 数组
      const resp: any = await BonusAdminService.bonusAccountControllerAdminBatchAdjust({ items });
      // 兼容可能的不同响应结构
      const data = resp?.data || resp || {};

      setResults((data.results || []) as ResultItem[]);

      const ok = data.okCount || 0;
      const fail = data.failCount || 0;
      toast.success(`批量任务完成：成功 ${ok}，失败 ${fail}`);
    } catch (err) {
      console.error(err);
      toast.error("批量调账请求失败");
    } finally {
      setLoading(false);
    }
  };

  return {
    text,
    setText,
    items,
    results,
    loading,
    handleParseCsv,
    handleParseJson,
    handleClear,
    handleSubmit,
  };
}
