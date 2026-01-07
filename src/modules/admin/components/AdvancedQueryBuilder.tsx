import { useMemo } from "react";
import { Space, Select, Input, Button, DatePicker, Divider } from "antd";
import { AdvancedRuleDto } from "@/api/models/AdvancedRuleDto";

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

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <div>逻辑组合：</div>
        <Select
          style={{ width: 160 }}
          value={logic}
          options={[
            { label: "且（AND）", value: "AND" },
            { label: "或（OR）", value: "OR" },
          ]}
          onChange={(v) => onChange(rules, v)}
        />
      </Space>
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
          <Space key={idx} style={{ width: "100%" }}>
            <Select
              style={{ width: 160 }}
              value={rule.field}
              options={fieldOptions.map((opt) => ({ label: opt.label, value: opt.value }))}
              onChange={(v) => {
                const metaNext = fieldMap[v];
                const defaultOp = operatorOptions(metaNext?.type || "text")[0].value;
                const next = [...rules];
                next[idx] = { field: v, op: defaultOp, value: undefined, range: undefined };
                onChange(next, logic);
              }}
              placeholder="选择字段"
            />
            <Select
              style={{ width: 180 }}
              value={rule.op}
              options={ops}
              onChange={(v) => {
                const next = [...rules];
                next[idx] = { ...next[idx], op: v, value: undefined, range: undefined };
                onChange(next, logic);
              }}
              placeholder="匹配"
            />
            {isDate && rule.op === AdvancedRuleDto.op.BETWEEN && (
              <DatePicker.RangePicker
                style={{ width: 320 }}
                showTime
                value={rule.range as any}
                onChange={(vals) => {
                  const next = [...rules];
                  next[idx] = { ...next[idx], range: vals as any, value: undefined };
                  onChange(next, logic);
                }}
              />
            )}
            {isDate &&
              (rule.op === AdvancedRuleDto.op.GREATER_THAN ||
                rule.op === AdvancedRuleDto.op.GREATER_THAN_OR_EQUAL ||
                rule.op === AdvancedRuleDto.op.LESS_THAN ||
                rule.op === AdvancedRuleDto.op.LESS_THAN_OR_EQUAL) && (
                <DatePicker
                  style={{ width: 240 }}
                  showTime
                  value={rule.value as any}
                  onChange={(val) => {
                    const next = [...rules];
                    next[idx] = { ...next[idx], value: val as any, range: undefined };
                    onChange(next, logic);
                  }}
                />
              )}
            {isEnum && !isNullishOp && (
              <Select
                style={{ width: 220 }}
                value={rule.value as any}
                options={meta?.enumOptions || []}
                mode={isInOp ? "multiple" : undefined}
                onChange={(v) => {
                  const next = [...rules];
                  next[idx] = { ...next[idx], value: v };
                  onChange(next, logic);
                }}
              />
            )}
            {isBool && (
              <Select
                style={{ width: 160 }}
                value={(rule.value as any) ?? undefined}
                options={[
                  { label: "是", value: true },
                  { label: "否", value: false },
                ]}
                onChange={(v) => {
                  const next = [...rules];
                  next[idx] = { ...next[idx], value: v };
                  onChange(next, logic);
                }}
              />
            )}
            {isArray && (
              <Input
                style={{ width: 300 }}
                value={
                  Array.isArray(rule.value)
                    ? (rule.value as any[]).join(",")
                    : typeof rule.value === "string"
                      ? rule.value
                      : ""
                }
                onChange={(e) => {
                  const val = e.target.value;
                  const parsed = String(val)
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                  const next = [...rules];
                  next[idx] = { ...next[idx], value: parsed };
                  onChange(next, logic);
                }}
                placeholder={"逗号分隔多个值"}
              />
            )}
            {isText && rule.op === AdvancedRuleDto.op.BETWEEN && (
              <Space>
                <Input
                  style={{ width: 150 }}
                  value={Array.isArray(rule.range) ? String(rule.range?.[0] ?? "") : ""}
                  onChange={(e) => {
                    const next = [...rules];
                    const r0 = e.target.value;
                    const r1 = Array.isArray(next[idx].range) ? next[idx].range?.[1] : undefined;
                    next[idx] = { ...next[idx], range: [r0, r1] as any, value: undefined };
                    onChange(next, logic);
                  }}
                  placeholder={"起始值"}
                />
                <Input
                  style={{ width: 150 }}
                  value={Array.isArray(rule.range) ? String(rule.range?.[1] ?? "") : ""}
                  onChange={(e) => {
                    const next = [...rules];
                    const r1 = e.target.value;
                    const r0 = Array.isArray(next[idx].range) ? next[idx].range?.[0] : undefined;
                    next[idx] = { ...next[idx], range: [r0, r1] as any, value: undefined };
                    onChange(next, logic);
                  }}
                  placeholder={"结束值"}
                />
              </Space>
            )}
            {isText && isInOp && (
              <Input
                style={{ width: 300 }}
                value={
                  Array.isArray(rule.value)
                    ? (rule.value as any[]).join(",")
                    : typeof rule.value === "string"
                      ? rule.value
                      : ""
                }
                onChange={(e) => {
                  const val = e.target.value;
                  const parsed = String(val)
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                  const next = [...rules];
                  next[idx] = { ...next[idx], value: parsed };
                  onChange(next, logic);
                }}
                placeholder={"逗号分隔多个值"}
              />
            )}
            {!isDate &&
              !isEnum &&
              !isBool &&
              !isArray &&
              !isInOp &&
              !isNullishOp &&
              rule.op !== AdvancedRuleDto.op.BETWEEN && (
                <Input
                  style={{ width: 300 }}
                  value={typeof rule.value === "string" ? rule.value : ""}
                  onChange={(e) => {
                    const next = [...rules];
                    next[idx] = { ...next[idx], value: e.target.value };
                    onChange(next, logic);
                  }}
                  placeholder={"输入查询值"}
                />
              )}
            <Button
              danger
              onClick={() =>
                onChange(
                  rules.filter((_, i) => i !== idx),
                  logic,
                )
              }
            >
              删除
            </Button>
          </Space>
        );
      })}
      <Button
        type="dashed"
        onClick={() => {
          const first = fieldOptions[0];
          const defaultOp = operatorOptions(first.type)[0].value;
          onChange([...rules, { field: first.value, op: defaultOp, value: "" }], logic);
        }}
        style={{ width: "100%" }}
      >
        添加条件
      </Button>
      <Divider style={{ margin: "8px 0" }} />
      <div style={{ color: "#888" }}>
        说明：可组合多字段与规则进行筛选；常用搜索框仅用于用户名或邮箱模糊查询，复杂查询请在此添加条件并选择逻辑（AND/OR）。
      </div>
    </Space>
  );
}
