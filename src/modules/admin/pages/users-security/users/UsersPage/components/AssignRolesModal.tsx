import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/hooks/useLanguage";
import { Modal } from "@/modules/admin/components/ui/modal";
import { Input } from "@/modules/admin/components/ui/input";
import { Label } from "@/modules/admin/components/ui/label";
import { Textarea } from "@/modules/admin/components/ui/textarea";
import { Checkbox } from "@/modules/admin/components/ui/checkbox";
import { toast } from "sonner";
import { RolesService } from "@/api/services/RolesService";
import { PermissionsService } from "@/api/services/PermissionsService";

const formSchema = z.object({
  userId: z.string().min(1, "Missing user ID"),
  roles: z.array(z.string()).optional(),
  permissionKeys: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AssignRolesModalProps {
  open: boolean;
  onClose: (v: boolean) => void;
  assignData: { userId: string; roles: string[] };
  assigning: boolean;
  setAssigning: (v: boolean) => void;
  rolesOptions: { label: string; value: string }[];
  rolesLoading: boolean;
  onSuccess: () => void;
}

export const AssignRolesModal: React.FC<AssignRolesModalProps> = ({
  open,
  onClose,
  assignData,
  assigning,
  setAssigning,
  rolesOptions,
  rolesLoading,
  onSuccess,
}) => {
  const { t } = useLanguage();
  const { register, control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      roles: [],
      permissionKeys: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        userId: assignData.userId,
        roles: assignData.roles,
        permissionKeys: "",
      });
    }
  }, [open, assignData, reset]);

  const onSubmit = async (values: FormValues) => {
    setAssigning(true);
    try {
      const { userId, roles, permissionKeys } = values;
      const permKeysList = permissionKeys
        ? permissionKeys
            .split(/[,，\n]/)
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      if (roles && roles.length > 0) {
        await RolesService.rolesAclControllerAssignRoles({
          userId,
          roleKeys: roles,
        });
      }

      if (permKeysList.length > 0) {
        await PermissionsService.permissionsAssignmentControllerAssign({
          userId,
          permissionKeys: permKeysList,
        });
      }

      toast.success(t("admin.roles.assignSuccess"));
      onClose(false);
      onSuccess();
    } catch (e: any) {
      toast.error(e?.message || t("admin.roles.assignFailed"));
    } finally {
      setAssigning(false);
    }
  };

  return (
    <Modal
      title={t("admin.roles.assignRolesTitle")}
      open={open}
      onClose={() => onClose(false)}
      onOk={handleSubmit(onSubmit)}
      confirmLoading={assigning}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>{t("admin.roles.userId")}</Label>
          <Input {...register("userId")} disabled />
        </div>

        <div className="space-y-2">
          <Label>{t("admin.roles.rolesList")}</Label>
          <div className="max-h-48 overflow-y-auto rounded-md border p-2">
            {rolesLoading ? (
              <div className="p-2 text-sm text-gray-500">{t("app.loading")}</div>
            ) : (
              <Controller
                control={control}
                name="roles"
                render={({ field }) => (
                  <div className="flex flex-col gap-2">
                    {rolesOptions.map((opt) => {
                      const checked = field.value?.includes(opt.value);
                      return (
                        <div key={opt.value} className="flex items-center gap-2">
                          <Checkbox
                            id={`role-${opt.value}`}
                            checked={checked}
                            onCheckedChange={(c) => {
                              const current = field.value || [];
                              if (c) {
                                field.onChange([...current, opt.value]);
                              } else {
                                field.onChange(current.filter((v) => v !== opt.value));
                              }
                            }}
                          />
                          <Label
                            htmlFor={`role-${opt.value}`}
                            className="cursor-pointer font-normal"
                          >
                            {opt.label}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                )}
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t("admin.roles.permissionKeys")}</Label>
          <span className="ml-2 text-xs font-normal text-neutral-400">
            ({t("admin.roles.permissionOverwriteNote")})
          </span>
          <Textarea
            {...register("permissionKeys")}
            placeholder={t("admin.roles.permissionPlaceholder")}
            className="min-h-[100px]"
          />
        </div>
      </div>
    </Modal>
  );
};
