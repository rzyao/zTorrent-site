import { useForm } from "react-hook-form";
import { Search } from "lucide-react";
import { useEffect } from "react";
import { Input } from "@/modules/admin/components/ui/input";
import { Button } from "@/modules/admin/components/ui/button";

interface LedgerFilterProps {
  onSearch: (values: any) => void;
  initUserId?: string;
}

interface FilterFormValues {
  userId: string;
  type: string;
  reason: string;
  externalRef: string;
  correlationId: string;
  rangeStart: string;
  rangeEnd: string;
}

export function LedgerFilter({ onSearch, initUserId }: LedgerFilterProps) {
  const { register, handleSubmit, reset, setValue } = useForm<FilterFormValues>({
    defaultValues: {
      userId: initUserId || "",
      type: "",
      reason: "",
      externalRef: "",
      correlationId: "",
      rangeStart: "",
      rangeEnd: "",
    },
  });

  useEffect(() => {
    if (initUserId) {
      setValue("userId", initUserId);
    }
  }, [initUserId, setValue]);

  const onSubmit = (data: FilterFormValues) => {
    // 转换日期范围以兼容现有的逻辑（toISOString 将在 hook 中调用）
    const payload = {
      ...data,
      range:
        data.rangeStart || data.rangeEnd
          ? [
              data.rangeStart ? new Date(data.rangeStart) : null,
              data.rangeEnd ? new Date(data.rangeEnd) : null,
            ]
          : undefined,
    };
    onSearch(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-center gap-2">
      <Input {...register("userId")} placeholder="用户ID" className="w-[120px]" />
      <Input {...register("type")} placeholder="类型" className="w-[160px]" />
      <Input {...register("reason")} placeholder="原因" className="w-[140px]" />
      <Input {...register("externalRef")} placeholder="幂等键" className="w-[160px]" />
      <Input {...register("correlationId")} placeholder="关联ID" className="w-[160px]" />

      <div className="flex items-center gap-1 overflow-hidden rounded-md border bg-white px-2 dark:bg-stone-950">
        <input
          type="datetime-local"
          {...register("rangeStart")}
          className="w-[135px] bg-transparent py-1 text-xs focus:outline-none"
        />
        <span className="text-muted-foreground text-xs">-</span>
        <input
          type="datetime-local"
          {...register("rangeEnd")}
          className="w-[135px] bg-transparent py-1 text-xs focus:outline-none"
        />
      </div>

      <div className="flex -space-x-px">
        <Button type="submit" className="rounded-r-none" variant="primary">
          <Search className="mr-2 h-4 w-4" />
          查询
        </Button>
        <Button
          variant="default"
          type="button"
          className="rounded-l-none"
          onClick={() => {
            reset();
            onSearch({});
          }}
        >
          重置
        </Button>
      </div>
    </form>
  );
}
