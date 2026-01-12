import { useTicketDetailLogic } from "./hooks/useTicketDetailLogic";
import { TicketInfo } from "./components/TicketInfo";
import { TicketReplyList } from "./components/TicketReplyList";
import { TicketReplyForm } from "./components/TicketReplyForm";

export default function TicketDetailPage() {
  const {
    id,
    navigate,
    loading,
    detail,
    replies,
    form,
    files,
    setFiles,
    handleFileUpload,
    onRemoveFile,
    resolveTicket,
    closeTicket,
    handleReply,
    replying,
  } = useTicketDetailLogic();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-4 duration-500">
      <TicketInfo
        id={id}
        detail={detail}
        loading={loading}
        onBack={() => navigate(-1)}
        onClose={closeTicket}
        onResolve={resolveTicket}
      />

      <TicketReplyList replies={replies} />

      <TicketReplyForm
        form={form}
        files={files}
        handleFileUpload={handleFileUpload}
        onRemoveFile={onRemoveFile}
        loading={replying}
        onSubmit={handleReply}
        onReset={() => {
          form.reset();
          setFiles([]);
        }}
      />
    </div>
  );
}
