import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/hooks/useLanguage";
import { Modal } from "@/modules/admin/components/ui/modal";
import { Input } from "@/modules/admin/components/ui/input";
import { Switch } from "@/modules/admin/components/ui/switch";
import { Textarea } from "@/modules/admin/components/ui/textarea"; // Using ui/textarea if available
import { Label } from "@/modules/admin/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/admin/components/ui/select";
import { UpdateCategoryDto } from "@/api/models/UpdateCategoryDto";
import type { CategoryItem } from "../types";

// --- Schemas ---

const createSchema = z.object({
  key: z.string().optional(),
  keySuffix: z.string().optional(),
  label: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  sort: z.coerce.number().min(0).default(0),
  enabled: z.boolean().default(true),
  genre: z.nativeEnum(UpdateCategoryDto.genre).default(UpdateCategoryDto.genre.GENERAL),
});

const editSchema = z.object({
  label: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  sort: z.coerce.number().min(0).default(0),
  enabled: z.boolean().default(true),
  genre: z.nativeEnum(UpdateCategoryDto.genre).default(UpdateCategoryDto.genre.GENERAL),
});

type CreateFormValues = z.infer<typeof createSchema>;
type EditFormValues = z.infer<typeof editSchema>;

// --- Props ---

interface CategoryModalsProps {
  // Create
  createOpen: boolean;
  createInitial?: any;
  createKeyPrefix?: string;
  onCancelCreate: () => void;
  handleCreate: (data: any) => void;
  // Edit
  editOpen: boolean;
  editInitial?: any;
  editing: CategoryItem | null;
  onCancelEdit: () => void;
  handleEdit: (data: any) => void;
}

// --- Components ---

function CreateCategoryModal({
  open,
  onClose,
  onOk,
  initial,
  keyPrefix,
}: {
  open: boolean;
  onClose: () => void;
  onOk: (data: any) => void;
  initial?: any;
  keyPrefix?: string;
}) {
  const { t } = useLanguage();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      key: "",
      keySuffix: "",
      label: "",
      description: "",
      sort: 0,
      enabled: true,
      genre: UpdateCategoryDto.genre.GENERAL,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        key: "",
        keySuffix: "",
        label: "",
        description: "",
        sort: 0,
        enabled: true,
        genre: UpdateCategoryDto.genre.GENERAL,
        ...initial,
      });
    }
  }, [open, initial, reset]);

  const onSubmit = (data: CreateFormValues) => {
    onOk(data);
  };

  return (
    <Modal
      title={keyPrefix ? t("admin.category.addSubCategory") : t("admin.category.addCategory")}
      open={open}
      onClose={onClose}
      onOk={handleSubmit(onSubmit)}
      confirmLoading={isSubmitting}
      width={480}
    >
      <div className="space-y-4">
        {keyPrefix ? (
          <div className="space-y-1.5">
            <Label>
              {t("admin.category.keySuffix")} <span className="text-muted-foreground font-normal">({t("admin.category.parent")}: {keyPrefix})</span>
            </Label>
            <Input placeholder={t("admin.category.keySuffixPlaceholder")} {...register("keySuffix")} />
          </div>
        ) : (
          <div className="space-y-1.5">
            <Label>
              {t("admin.category.uniqueKey")} <span className="text-red-500">*</span>
            </Label>
            <Input placeholder={t("admin.category.keyPlaceholder")} {...register("key")} />
            {errors.key && <p className="text-sm text-red-500">{errors.key.message}</p>}
          </div>
        )}
  
        <div className="space-y-1.5">
          <Label>
            {t("admin.category.name")} <span className="text-red-500">*</span>
          </Label>
          <Input placeholder={t("admin.category.namePlaceholder")} {...register("label")} />
          {errors.label && <p className="text-sm text-red-500">{errors.label.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>{t("admin.category.sort")}</Label>
            <Input type="number" min={0} {...register("sort")} />
          </div>
          <div className="space-y-1.5">
            <Label>{t("admin.category.enabled")}</Label>
            <div className="flex h-10 items-center">
              <Controller
                control={control}
                name="enabled"
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>
            {t("admin.category.genre")} <span className="text-red-500">*</span>
          </Label>
          <Controller
            control={control}
            name="genre"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t("admin.category.selectGenre")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UpdateCategoryDto.genre.GENERAL}>{t("admin.category.genreGeneral")}</SelectItem>
                  <SelectItem value={UpdateCategoryDto.genre.ADULT}>{t("admin.category.genreAdult")}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label>{t("admin.category.description")}</Label>
          <Textarea placeholder={t("admin.category.descriptionPlaceholder")} {...register("description")} />
        </div>
      </div>
    </Modal>
  );
}

function EditCategoryModal({
  open,
  onClose,
  onOk,
  initial,
  editing,
}: {
  open: boolean;
  onClose: () => void;
  onOk: (data: any) => void;
  initial?: any;
  editing: CategoryItem | null;
}) {
  const { t } = useLanguage();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      label: "",
      description: "",
      sort: 0,
      enabled: true,
      genre: UpdateCategoryDto.genre.GENERAL,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        label: initial?.label || "",
        description: initial?.description || "",
        sort: initial?.sort || 0,
        enabled: initial?.enabled ?? true,
        genre: initial?.genre || UpdateCategoryDto.genre.GENERAL,
      });
    }
  }, [open, initial, reset]);

  return (
    <Modal
      title={t("admin.category.editCategory")}
      open={open}
      onClose={onClose}
      onOk={handleSubmit(onOk)}
      confirmLoading={isSubmitting}
      width={480}
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>{t("admin.category.uniqueKey")}</Label>
          <Input value={editing?.key || ""} disabled />
        </div>

        <div className="space-y-1.5">
          <Label>
            {t("admin.category.name")} <span className="text-red-500">*</span>
          </Label>
          <Input placeholder={t("admin.category.namePlaceholder")} {...register("label")} />
          {errors.label && <p className="text-sm text-red-500">{errors.label.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>{t("admin.category.sort")}</Label>
            <Input type="number" min={0} {...register("sort")} />
          </div>
          <div className="space-y-1.5">
            <Label>{t("admin.category.enabled")}</Label>
            <div className="flex h-10 items-center">
              <Controller
                control={control}
                name="enabled"
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>{t("admin.category.genre")}</Label>
          <Controller
            control={control}
            name="genre"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t("admin.category.selectGenre")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UpdateCategoryDto.genre.GENERAL}>{t("admin.category.genreGeneral")}</SelectItem>
                  <SelectItem value={UpdateCategoryDto.genre.ADULT}>{t("admin.category.genreAdult")}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label>{t("admin.category.description")}</Label>
          <Textarea placeholder={t("admin.category.descriptionPlaceholder")} {...register("description")} />
        </div>
      </div>
    </Modal>
  );
}

export function CategoryModals({
  createOpen,
  createInitial,
  createKeyPrefix,
  onCancelCreate,
  handleCreate,
  editOpen,
  editInitial,
  editing,
  onCancelEdit,
  handleEdit,
}: CategoryModalsProps) {
  return (
    <>
      <CreateCategoryModal
        open={createOpen}
        onClose={onCancelCreate}
        onOk={handleCreate}
        initial={createInitial}
        keyPrefix={createKeyPrefix}
      />
      <EditCategoryModal
        open={editOpen}
        onClose={onCancelEdit}
        onOk={handleEdit}
        initial={editInitial}
        editing={editing}
      />
    </>
  );
}
