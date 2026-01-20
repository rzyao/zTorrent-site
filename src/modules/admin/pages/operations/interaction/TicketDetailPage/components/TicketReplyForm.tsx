import { useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { ReplyFormValues, TicketAttachment } from "../hooks/useTicketDetailLogic";
import { Button } from "@/modules/admin/components/ui/button";
import { Textarea } from "@/modules/admin/components/ui/textarea";
import { Label } from "@/modules/admin/components/ui/label";
import { Paperclip, X } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface TicketReplyFormProps {
  form: UseFormReturn<ReplyFormValues>;
  files: TicketAttachment[];
  handleFileUpload: (file: File) => Promise<void>;
  onRemoveFile: (uid: string) => void;
  onReset: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  loading: boolean;
  disabled?: boolean;
}

export function TicketReplyForm({
  form,
  files,
  handleFileUpload,
  onRemoveFile,
  onReset,
  onSubmit,
  loading,
  disabled = false,
}: TicketReplyFormProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    formState: { errors },
  } = form;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        await handleFileUpload(selectedFiles[i]);
      }
      // Reset input value to allow selecting same file again
      e.target.value = "";
    }
  };

  return (
    <div className="bg-card text-card-foreground rounded-lg border shadow-sm">
      <div className="flex flex-col space-y-1.5 border-b p-6">
        <h3 className="leading-none font-semibold tracking-tight">{t("admin.ticket.replyTicket")}</h3>
      </div>
      <div className="p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">{t("admin.ticket.replyContent")}</Label>
            <Textarea
              id="content"
              rows={4}
              placeholder={disabled ? t("admin.ticket.ticketClosed") : t("admin.ticket.replyPlaceholder")}
              className={errors.content ? "border-destructive" : ""}
              disabled={disabled}
              {...register("content")}
            />
            {errors.content && (
              <p className="text-destructive text-sm font-medium">{errors.content.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t("admin.ticket.attachments")}</Label>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                disabled={disabled}
              />
              <Button
                type="button"
                variant="default"
                size="sm"
                className="w-fit"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
              >
                <Paperclip className="mr-2 h-4 w-4" /> {t("admin.ticket.selectAttachment")}
              </Button>

              {/* Custom File List Display */}
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {files.map((file) => (
                    <div
                      key={file.uid}
                      className="bg-secondary text-secondary-foreground flex items-center gap-2 rounded px-2 py-1 text-xs"
                    >
                      <span className="max-w-[150px] truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => onRemoveFile(file.uid)}
                        className="text-muted-foreground hover:text-destructive"
                        disabled={disabled}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="text" onClick={onReset} disabled={disabled}>
              {t("admin.ticket.clear")}
            </Button>
            <Button type="submit" variant="primary" loading={loading} disabled={disabled}>
              {t("admin.ticket.submitReply")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
