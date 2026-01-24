import { useState } from "react";
import { Upload, X, Award, AlertCircle, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { useRequestActions } from "@/modules/app/pages/Requests/hooks/useRequestActions";

import { ImageUpload } from "@/components/ImageUpload";
import { extractErrorMessage } from "@/utils/errorMessage";

export function CreateRequest() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    bounty: "",
    deadline: 7,
  });

  const [attachmentIds, setAttachmentIds] = useState<string[]>([]);
  const [attachmentUrls, setAttachmentUrls] = useState<string[]>([]);
  const [agreedToRules, setAgreedToRules] = useState(false);

  const userBalance = 50000; // 模拟用户余额

  const categories = ["电影", "剧集", "纪录片", "音乐", "动漫", "综艺", "体育", "其他"];
  const deadlineOptions = [
    { value: 3, label: "3天" },
    { value: 7, label: "7天" },
    { value: 14, label: "14天" },
    { value: 30, label: "30天" },
  ];

  const actions = useRequestActions();

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const created = await actions.create.mutateAsync({
        title: formData.title,
        category: formData.category,
        description: formData.description,
        bounty: Number(formData.bounty || 0),
        deadlineDays: Number(formData.deadline || 7),
        attachments: attachmentIds,
      } as any);
      const newId = (created as any)?.id ?? (created as any)?.data?.id;
      if (newId) await actions.publish.mutateAsync({ id: String(newId) });
    } catch (err: any) {
      setError(extractErrorMessage(err, "发布求种失败"));
    }
  };

  const handleSaveDraft = async () => {
    setError(null);
    try {
      await actions.saveDraft.mutateAsync({
        title: formData.title,
        category: formData.category,
        description: formData.description,
        bounty: Number(formData.bounty || 0),
        deadlineDays: Number(formData.deadline || 7),
        attachments: attachmentIds,
      } as any);
    } catch (err: any) {
      setError(extractErrorMessage(err, "保存草稿失败"));
    }
  };

  const isFormValid =
    formData.title &&
    formData.category &&
    formData.description &&
    formData.bounty &&
    parseInt(formData.bounty) > 0 &&
    parseInt(formData.bounty) <= userBalance &&
    agreedToRules;

  // 发布流程：create → publish；已在 handleSubmit 中实现

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="rounded-lg border border-amber-500/20 bg-linear-to-br from-amber-600/10 to-orange-600/10 p-6">
        <h2 className="mb-2 text-amber-50">发布求种</h2>
        <p className="text-amber-200/70">
          详细描述您的资源需求，设置合理的悬赏金额，让社区帮您找到想要的资源
        </p>
      </div>

      {/* Balance Display */}
      <div className="rounded-lg border border-amber-400/30 bg-linear-to-r from-amber-500/20 to-orange-500/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-300">
            <Award className="h-5 w-5" />
            <span>当前余额</span>
          </div>
          <div className="text-amber-50">{userBalance.toLocaleString()} 积分</div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-6 rounded-lg border border-amber-500/20 bg-linear-to-br from-amber-600/5 to-orange-600/5 p-6">
          <h3 className="text-amber-50">基本信息</h3>

          {/* Title */}
          <div className="grid grid-cols-4 items-start gap-4">
            <label className="pt-2 text-amber-300">
              求种标题 <span className="text-red-400">*</span>
            </label>
            <div className="col-span-3 space-y-2">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="简洁明确地描述您需要的资源"
                className="w-full rounded-lg border border-amber-500/30 bg-[#0F171E]/50 px-4 py-2.5 text-amber-50 placeholder-amber-400/40 transition-colors focus:border-amber-400 focus:outline-none"
              />
              <p className="text-sm text-amber-400/50">例如：求《星际穿越》4K HDR REMUX版本</p>
            </div>
          </div>

          {/* Category */}
          <div className="grid grid-cols-4 items-start gap-4">
            <label className="pt-2 text-amber-300">
              资源分类 <span className="text-red-400">*</span>
            </label>
            <div className="col-span-3">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`rounded-lg px-4 py-2 transition-all ${
                      formData.category === cat
                        ? "bg-linear-to-r from-amber-500 to-orange-500 text-white"
                        : "border border-amber-500/30 bg-[#0F171E]/50 text-amber-300 hover:bg-amber-500/10"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-4 items-start gap-4">
            <label className="pt-2 text-amber-300">
              详细描述 <span className="text-red-400">*</span>
            </label>
            <div className="col-span-3 space-y-2">
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="详细说明资源的具体要求，包括格式、分辨率、音轨、字幕等"
                rows={6}
                className="w-full resize-none rounded-lg border border-amber-500/30 bg-[#0F171E]/50 px-4 py-2.5 text-amber-50 placeholder-amber-400/40 transition-colors focus:border-amber-400 focus:outline-none"
              />
              <p className="text-sm text-amber-400/50">
                建议包含：格式要求、质量要求、音轨字幕要求、特殊说明等
              </p>
            </div>
          </div>

          {/* Attachments */}
          <div className="grid grid-cols-4 items-start gap-4">
            <label className="pt-2 text-amber-300">参考图片</label>
            <div className="col-span-3 space-y-3">
              <ImageUpload
                value={attachmentIds}
                defaultPreview={attachmentUrls}
                onChange={(ids, urls) => {
                  setAttachmentIds(Array.isArray(ids) ? ids : [ids]);
                  setAttachmentUrls(Array.isArray(urls) ? urls : [urls]);
                }}
                maxCount={9}
                attachableType="request"
                placeholder="上传参考图片"
              />
              <p className="text-sm text-amber-400/50">
                可上传封面图、截图等参考资料，帮助应答者更好地理解需求
              </p>
            </div>
          </div>
        </div>

        {/* Bounty Settings */}
        <div className="space-y-6 rounded-lg border border-amber-500/20 bg-linear-to-br from-amber-600/5 to-orange-600/5 p-6">
          <h3 className="text-amber-50">悬赏设置</h3>

          {/* Bounty Amount */}
          <div className="grid grid-cols-4 items-start gap-4">
            <label className="pt-2 text-amber-300">
              悬赏金额 <span className="text-red-400">*</span>
            </label>
            <div className="col-span-3 space-y-2">
              <div className="relative">
                <input
                  type="number"
                  value={formData.bounty}
                  onChange={(e) => setFormData({ ...formData, bounty: e.target.value })}
                  placeholder="输入悬赏积分"
                  min="100"
                  max={userBalance}
                  className="w-full rounded-lg border border-amber-500/30 bg-[#0F171E]/50 px-4 py-2.5 pr-16 text-amber-50 placeholder-amber-400/40 transition-colors focus:border-amber-400 focus:outline-none"
                />
                <span className="absolute top-1/2 right-4 -translate-y-1/2 text-amber-400/60">
                  积分
                </span>
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex flex-wrap gap-2">
                {[1000, 3000, 5000, 10000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setFormData({ ...formData, bounty: amount.toString() })}
                    className="rounded border border-amber-500/30 bg-[#0F171E]/50 px-3 py-1.5 text-sm text-amber-300 transition-all hover:border-amber-400"
                  >
                    {amount.toLocaleString()}
                  </button>
                ))}
              </div>

              {formData.bounty && parseInt(formData.bounty) > userBalance && (
                <div className="flex items-start gap-2 text-sm text-red-400">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>余额不足，请降低悬赏金额</span>
                </div>
              )}

              <p className="text-sm text-amber-400/50">
                建议悬赏: 普通资源 1000-3000，稀缺资源 5000-10000，极度稀缺 10000+
              </p>
            </div>
          </div>

          {/* Deadline */}
          <div className="grid grid-cols-4 items-start gap-4">
            <label className="pt-2 text-amber-300">
              截止时间 <span className="text-red-400">*</span>
            </label>
            <div className="col-span-3">
              <div className="flex flex-wrap gap-2">
                {deadlineOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, deadline: option.value })}
                    className={`rounded-lg px-4 py-2 transition-all ${
                      formData.deadline === option.value
                        ? "bg-linear-to-r from-amber-500 to-orange-500 text-white"
                        : "border border-amber-500/30 bg-[#0F171E]/50 text-amber-300 hover:bg-amber-500/10"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-sm text-amber-400/50">
                超过截止时间未完成，悬赏积分将自动退回
              </p>
            </div>
          </div>
        </div>

        {/* Rules Confirmation */}
        <div className="space-y-4 rounded-lg border border-amber-500/20 bg-linear-to-br from-amber-600/5 to-orange-600/5 p-6">
          <h3 className="text-amber-50">发布规则</h3>

          <div className="space-y-2 rounded-lg bg-[#0F171E]/50 p-4 text-sm text-amber-300/70">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <span>发布后将立即从您的账户扣除悬赏积分，作为担保金冻结</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <span>任务完成后，悬赏积分将自动发放给认领者</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <span>如果超过截止时间无人完成，积分将自动退回</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <span>恶意求种、虚假描述将受到警告或封禁处罚</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <span>请合理设置悬赏金额，过高或过低都可能影响认领率</span>
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={agreedToRules}
              onChange={(e) => setAgreedToRules(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-amber-500/30 bg-[#0F171E]/50 text-amber-500 focus:ring-amber-400 focus:ring-offset-0"
            />
            <span className="text-amber-300">
              我已阅读并同意以上规则，确认发布求种后将扣除
              <span className="mx-1 text-amber-400">
                {formData.bounty ? parseInt(formData.bounty).toLocaleString() : "0"}
              </span>
              积分作为悬赏
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 transition-all ${
              isFormValid
                ? "bg-linear-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                : "cursor-not-allowed bg-gray-500/20 text-gray-400"
            }`}
          >
            <CheckCircle2 className="h-5 w-5" />
            发布求种
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="rounded-lg border border-amber-500/30 bg-linear-to-br from-amber-600/20 to-orange-600/20 px-6 py-3 text-amber-300 transition-all hover:border-amber-400"
          >
            保存草稿
          </button>

          <button
            type="button"
            className="rounded-lg border border-amber-500/30 bg-linear-to-br from-amber-600/20 to-orange-600/20 px-6 py-3 text-amber-300 transition-all hover:border-amber-400"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
}
