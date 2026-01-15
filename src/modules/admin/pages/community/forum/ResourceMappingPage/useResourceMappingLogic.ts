import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ForumAdminService } from "@/api/services/ForumAdminService";
import { UpdateMappingDto } from "@/api/models/UpdateMappingDto";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export interface ResourceMapping {
  id?: string;
  resourceType: string;
  categoryId: string;
}

const mappingSchema = z.object({
  resourceType: z.string().min(1, "请输入资源类型 (如 movie)"),
  categoryId: z.string().min(1, "请输入论坛版块ID"),
});

export type MappingFormValues = z.infer<typeof mappingSchema>;

export function useResourceMappingLogic() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ResourceMapping | null>(null);
  const queryClient = useQueryClient();

  // React Hook Form
  const form = useForm<MappingFormValues>({
    resolver: zodResolver(mappingSchema),
    defaultValues: {
      resourceType: "",
      categoryId: "",
    },
  });

  const { data: mappings = [], isLoading } = useQuery({
    queryKey: ["admin", "forum", "mappings"],
    queryFn: async () => {
      const res = await ForumAdminService.forumAdminMappingControllerFindAll();
      // 类型断言：API 生成的模型目前为空，暂时手动处理
      return (res.data as unknown as ResourceMapping[]) || [];
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: MappingFormValues) => {
      // MappingFormValues matches UpdateMappingDto structure but might be inferred as having optional fields by some tools
      // Cast to UpdateMappingDto to satisfy the strict signature of the service
      await ForumAdminService.forumAdminMappingControllerUpsert(values as UpdateMappingDto);
    },
    onSuccess: () => {
      toast.success("保存成功");
      setIsModalOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["admin", "forum", "mappings"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "保存失败");
    },
  });

  const openCreate = () => {
    setEditingItem(null);
    form.reset({
      resourceType: "",
      categoryId: "",
    });
    setIsModalOpen(true);
  };

  const openEdit = (record: ResourceMapping) => {
    setEditingItem(record);
    form.reset({
      resourceType: record.resourceType,
      categoryId: record.categoryId,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    form.reset();
  };

  const onSubmit = (data: MappingFormValues) => {
    mutation.mutate(data);
  };

  return {
    mappings,
    isLoading,
    isModalOpen,
    editingItem,
    form,
    isSubmitting: mutation.isPending,
    openCreate,
    openEdit,
    closeModal,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
