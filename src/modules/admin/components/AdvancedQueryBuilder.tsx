import { useMemo } from "react";
import { AdvancedRuleDto } from "@/api/models/AdvancedRuleDto";
import { Button } from "@/modules/admin/components/ui/button";
import { Input } from "@/modules/admin/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/admin/components/ui/select";
import { cn } from "@/utils/cn"; // Assuming this exists or use standard class string
import { X, Plus } from "lucide-react";

type Logic = "AND" | "OR";
type FieldType = "text" | "enum" | "bool" | "date" | "array";
type FieldOption = {
  label: string;
  value: string;
  type: FieldType;
  enumOptions?: { label: string; value: string }[];
};
type Rule = { field: string; op: AdvancedRuleDto.op; value?: any; range?: [any, any] };

function operatorOptions(type: FieldType) {
  if (type === "text") {
    return [
      { label: "包含", value: AdvancedRuleDto.op.LIKE },
      { label: "不包含", value: AdvancedRuleDto.op.NOT_LIKE },
      { label: "等于", value: AdvancedRuleDto.op.EQUAL },
      { label: "不等于", value: AdvancedRuleDto.op.NOT_EQUAL },
      { label: "前缀匹配", value: AdvancedRuleDto.op.LIKE_RIGHT },
      { label: "后缀匹配", value: AdvancedRuleDto.op.LIKE_LEFT },
      { label: "区间", value: AdvancedRuleDto.op.BETWEEN },
      { label: "在集合中", value: AdvancedRuleDto.op.IN },
      { label: "不在集合中", value: AdvancedRuleDto.op.NOT_IN },
      { label: "为空", value: AdvancedRuleDto.op.IS_NULL },
      { label: "非空", value: AdvancedRuleDto.op.IS_NOT_NULL },
    ];
  }
  if (type === "enum") {
    return [
      { label: "等于", value: AdvancedRuleDto.op.EQUAL },
      { label: "不等于", value: AdvancedRuleDto.op.NOT_EQUAL },
      { label: "在集合中", value: AdvancedRuleDto.op.IN },
      { label: "不在集合中", value: AdvancedRuleDto.op.NOT_IN },
      { label: "为空", value: AdvancedRuleDto.op.IS_NULL },
      { label: "非空", value: AdvancedRuleDto.op.IS_NOT_NULL },
    ];
  }
  if (type === "bool") {
    return [{ label: "等于", value: AdvancedRuleDto.op.EQUAL }];
  }
  if (type === "date") {
    return [
      { label: "范围", value: AdvancedRuleDto.op.BETWEEN },
      { label: "大于", value: AdvancedRuleDto.op.GREATER_THAN },
      { label: "大于等于", value: AdvancedRuleDto.op.GREATER_THAN_OR_EQUAL },
      { label: "小于", value: AdvancedRuleDto.op.LESS_THAN },
      { label: "小于等于", value: AdvancedRuleDto.op.LESS_THAN_OR_EQUAL },
      { label: "为空", value: AdvancedRuleDto.op.IS_NULL },
      { label: "非空", value: AdvancedRuleDto.op.IS_NOT_NULL },
    ];
  }
  return [
    { label: "在集合中", value: AdvancedRuleDto.op.IN },
    { label: "不在集合中", value: AdvancedRuleDto.op.NOT_IN },
    { label: "为空", value: AdvancedRuleDto.op.IS_NULL },
    { label: "非空", value: AdvancedRuleDto.op.IS_NOT_NULL },
  ];
}

export default function AdvancedQueryBuilder({
  fieldOptions,
  rules,
  logic,
  opsByField,
  onChange,
}: {
  fieldOptions: FieldOption[];
  rules: Rule[];
  logic: Logic;
  opsByField?: Record<string, { label: string; value: AdvancedRuleDto.op }[]>;
  onChange: (nextRules: Rule[], nextLogic: Logic) => void;
}) {
  const fieldMap = useMemo(() => {
    const m: Record<string, FieldOption> = {};
    for (const f of fieldOptions) m[f.value] = f;
    return m;
  }, [fieldOptions]);

  // Helper to update a rule at index
  const updateRule = (idx: number, newRule: Rule) => {
    const next = [...rules];
    next[idx] = newRule;
    onChange(next, logic);
  };

  const removeRule = (idx: number) => {
    onChange(
      rules.filter((_, i) => i !== idx),
      logic,
    );
  };

  const addRule = () => {
    const first = fieldOptions[0];
    if (!first) return;
    const defaultOp = operatorOptions(first.type)[0].value;
    onChange([...rules, { field: first.value, op: defaultOp, value: "" }], logic);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full items-center justify-between rounded-md border bg-slate-50 p-3 dark:bg-slate-900">
        <span className="text-sm font-medium">逻辑组合</span>
        <div className="w-[160px]">
          <Select value={logic} onValueChange={(v) => onChange(rules, v as Logic)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AND">且（AND）</SelectItem>
              <SelectItem value="OR">或（OR）</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {rules.map((rule, idx) => {
          const meta = fieldMap[rule.field];
          const ops =
            opsByField && opsByField[rule.field]
              ? opsByField[rule.field]!
              : operatorOptions(meta?.type || "text");
          const isDate = meta?.type === "date";
          const isEnum = meta?.type === "enum";
          const isBool = meta?.type === "bool";
          const isArray = meta?.type === "array";
          const isText = meta?.type === "text";
          const isNullishOp =
            rule.op === AdvancedRuleDto.op.IS_NULL || rule.op === AdvancedRuleDto.op.IS_NOT_NULL;
          const isInOp = rule.op === AdvancedRuleDto.op.IN || rule.op === AdvancedRuleDto.op.NOT_IN;

          return (
            <div
              key={idx}
              className="flex flex-wrap items-center gap-2 rounded-md border p-2 shadow-sm"
            >
              {/* Field Select */}
              <div className="w-[160px]">
                <Select
                  value={rule.field}
                  onValueChange={(v) => {
                    const metaNext = fieldMap[v];
                    const defaultOp = operatorOptions(metaNext?.type || "text")[0].value;
                    updateRule(idx, {
                      field: v,
                      op: defaultOp,
                      value: undefined,
                      range: undefined,
                    });
                  }}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="选择字段" />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Op Select */}
              <div className="w-[140px]">
                <Select
                  value={rule.op}
                  onValueChange={(v) => {
                    updateRule(idx, {
                      ...rule,
                      op: v as AdvancedRuleDto.op,
                      value: undefined,
                      range: undefined,
                    });
                  }}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="匹配" />
                  </SelectTrigger>
                  <SelectContent>
                    {ops.map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Value Inputs */}
              <div className="flex flex-1 items-center gap-2">
                {/* Date Range */}
                {isDate && rule.op === AdvancedRuleDto.op.BETWEEN && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="datetime-local"
                      className="h-9 w-[220px]"
                      value={Array.isArray(rule.range) ? rule.range[0] || "" : ""}
                      onChange={(e) =>
                        updateRule(idx, {
                          ...rule,
                          range: [e.target.value, Array.isArray(rule.range) ? rule.range[1] : null],
                        })
                      }
                    />
                    <span className="text-gray-400">-</span>
                    <Input
                      type="datetime-local"
                      className="h-9 w-[220px]"
                      value={Array.isArray(rule.range) ? rule.range[1] || "" : ""}
                      onChange={(e) =>
                        updateRule(idx, {
                          ...rule,
                          range: [Array.isArray(rule.range) ? rule.range[0] : null, e.target.value],
                        })
                      }
                    />
                  </div>
                )}

                {/* Single Date */}
                {isDate && !isNullishOp && rule.op !== AdvancedRuleDto.op.BETWEEN && (
                  <Input
                    type="datetime-local"
                    className="h-9 w-[220px]"
                    value={String(rule.value || "")}
                    onChange={(e) => updateRule(idx, { ...rule, value: e.target.value })}
                  />
                )}

                {/* Enum Single */}
                {isEnum && !isNullishOp && !isInOp && (
                  <div className="w-[200px]">
                    <Select
                      value={String(rule.value || "")}
                      onValueChange={(v) => updateRule(idx, { ...rule, value: v })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="选择值" />
                      </SelectTrigger>
                      <SelectContent>
                        {meta?.enumOptions?.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Enum Multiple / In Op */}
                {isEnum && !isNullishOp && isInOp && (
                  <Input
                    className="h-9 min-w-[200px] flex-1"
                    placeholder="请输入值，用逗号分隔"
                    value={Array.isArray(rule.value) ? rule.value.join(",") : rule.value || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      const parsed = val
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      // Store as-is string for typing, parse when needed?
                      // Or parse immediately. Logic expects array.
                      // If I store as array, I need to join back for display.
                      // I'll stick to array storage logic from previous component.
                      updateRule(idx, { ...rule, value: parsed });
                    }}
                  />
                )}

                {/* Bool */}
                {isBool && (
                  <div className="w-[120px]">
                    <Select
                      value={String(rule.value ?? "")}
                      onValueChange={(v) => updateRule(idx, { ...rule, value: v === "true" })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="选择" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">是</SelectItem>
                        <SelectItem value="false">否</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Array (Text or otherwise) */}
                {isArray && (
                  <Input
                    className="h-9 min-w-[200px] flex-1"
                    placeholder="逗号分隔多个值"
                    value={
                      Array.isArray(rule.value)
                        ? rule.value.join(",")
                        : typeof rule.value === "string"
                          ? rule.value
                          : ""
                    }
                    onChange={(e) => {
                      const parsed = e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      updateRule(idx, { ...rule, value: parsed });
                    }}
                  />
                )}

                {/* Text Range */}
                {isText && rule.op === AdvancedRuleDto.op.BETWEEN && (
                  <div className="flex items-center gap-2">
                    <Input
                      className="h-9 w-[150px]"
                      placeholder="起始值"
                      value={Array.isArray(rule.range) ? rule.range[0] || "" : ""}
                      onChange={(e) =>
                        updateRule(idx, {
                          ...rule,
                          range: [e.target.value, Array.isArray(rule.range) ? rule.range[1] : null],
                        })
                      }
                    />
                    <span className="text-gray-400">-</span>
                    <Input
                      className="h-9 w-[150px]"
                      placeholder="结束值"
                      value={Array.isArray(rule.range) ? rule.range[1] || "" : ""}
                      onChange={(e) =>
                        updateRule(idx, {
                          ...rule,
                          range: [Array.isArray(rule.range) ? rule.range[0] : null, e.target.value],
                        })
                      }
                    />
                  </div>
                )}

                {/* Text / Default Input */}
                {!isDate &&
                  !isEnum &&
                  !isBool &&
                  !isArray &&
                  !isInOp &&
                  !isNullishOp &&
                  rule.op !== AdvancedRuleDto.op.BETWEEN && (
                    <Input
                      className="h-9 min-w-[200px] flex-1"
                      placeholder="输入查询值"
                      value={typeof rule.value === "string" ? rule.value : ""}
                      onChange={(e) => updateRule(idx, { ...rule, value: e.target.value })}
                    />
                  )}
              </div>

              {/* Actions */}
              <Button
                variant="text"
                danger
                size="small"
                className="h-9 w-9 p-0"
                onClick={() => removeRule(idx)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>

      <Button variant="dashed" className="w-full" onClick={addRule}>
        <Plus className="mr-2 h-4 w-4" />
        添加条件
      </Button>

      <div className="bg-border h-px w-full" />
      <div className="text-muted-foreground text-sm">
        说明：可组合多字段与规则进行筛选；常用搜索框仅用于用户名或邮箱模糊查询，复杂查询请在此添加条件并选择逻辑（AND/OR）。
      </div>
    </div>
  );
}
