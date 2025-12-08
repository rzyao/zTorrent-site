import { useState } from 'react';
import { Upload, X, Award, AlertCircle, CheckCircle2, Image as ImageIcon } from 'lucide-react';

export function CreateRequest() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    bounty: '',
    deadline: 7,
  });

  const [attachments, setAttachments] = useState<string[]>([]);
  const [agreedToRules, setAgreedToRules] = useState(false);

  const userBalance = 50000; // 模拟用户余额

  const categories = ['电影', '剧集', '纪录片', '音乐', '动漫', '综艺', '体育', '其他'];
  const deadlineOptions = [
    { value: 3, label: '3天' },
    { value: 7, label: '7天' },
    { value: 14, label: '14天' },
    { value: 30, label: '30天' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('发布求种', formData);
  };

  const handleSaveDraft = () => {
    console.log('保存草稿', formData);
  };

  const addAttachment = () => {
    setAttachments([...attachments, `attachment-${attachments.length + 1}.jpg`]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const isFormValid = formData.title && formData.category && formData.description &&
    formData.bounty && parseInt(formData.bounty) > 0 &&
    parseInt(formData.bounty) <= userBalance && agreedToRules;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-600/10 to-orange-600/10 border border-amber-500/20 rounded-lg p-6">
        <h2 className="text-amber-50 mb-2">发布求种</h2>
        <p className="text-amber-200/70">
          详细描述您的资源需求，设置合理的悬赏金额，让社区帮您找到想要的资源
        </p>
      </div>

      {/* Balance Display */}
      <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-300">
            <Award className="w-5 h-5" />
            <span>当前余额</span>
          </div>
          <div className="text-amber-50">{userBalance.toLocaleString()} 积分</div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-gradient-to-br from-amber-600/5 to-orange-600/5 border border-amber-500/20 rounded-lg p-6 space-y-6">
          <h3 className="text-amber-50">基本信息</h3>

          {/* Title */}
          <div className="grid grid-cols-4 gap-4 items-start">
            <label className="text-amber-300 pt-2">
              求种标题 <span className="text-red-400">*</span>
            </label>
            <div className="col-span-3 space-y-2">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="简洁明确地描述您需要的资源"
                className="w-full px-4 py-2.5 bg-[#0F171E]/50 border border-amber-500/30 rounded-lg text-amber-50 placeholder-amber-400/40 focus:outline-none focus:border-amber-400 transition-colors"
              />
              <p className="text-amber-400/50 text-sm">例如：求《星际穿越》4K HDR REMUX版本</p>
            </div>
          </div>

          {/* Category */}
          <div className="grid grid-cols-4 gap-4 items-start">
            <label className="text-amber-300 pt-2">
              资源分类 <span className="text-red-400">*</span>
            </label>
            <div className="col-span-3">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`px-4 py-2 rounded-lg transition-all ${formData.category === cat
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                        : 'bg-[#0F171E]/50 border border-amber-500/30 text-amber-300 hover:bg-amber-500/10'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-4 gap-4 items-start">
            <label className="text-amber-300 pt-2">
              详细描述 <span className="text-red-400">*</span>
            </label>
            <div className="col-span-3 space-y-2">
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="详细说明资源的具体要求，包括格式、分辨率、音轨、字幕等"
                rows={6}
                className="w-full px-4 py-2.5 bg-[#0F171E]/50 border border-amber-500/30 rounded-lg text-amber-50 placeholder-amber-400/40 focus:outline-none focus:border-amber-400 transition-colors resize-none"
              />
              <p className="text-amber-400/50 text-sm">
                建议包含：格式要求、质量要求、音轨字幕要求、特殊说明等
              </p>
            </div>
          </div>

          {/* Attachments */}
          <div className="grid grid-cols-4 gap-4 items-start">
            <label className="text-amber-300 pt-2">参考图片</label>
            <div className="col-span-3 space-y-3">
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {attachments.map((att, index) => (
                    <div
                      key={index}
                      className="relative group bg-[#0F171E]/50 border border-amber-500/30 rounded-lg p-3 flex items-center gap-2"
                    >
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-300 text-sm">{att}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="ml-2 p-1 hover:bg-red-500/20 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={addAttachment}
                className="px-4 py-2 bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 hover:border-amber-400 text-amber-300 rounded-lg transition-all flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                上传图片
              </button>
              <p className="text-amber-400/50 text-sm">
                可上传封面图、截图等参考资料，帮助应答者更好地理解需求
              </p>
            </div>
          </div>
        </div>

        {/* Bounty Settings */}
        <div className="bg-gradient-to-br from-amber-600/5 to-orange-600/5 border border-amber-500/20 rounded-lg p-6 space-y-6">
          <h3 className="text-amber-50">悬赏设置</h3>

          {/* Bounty Amount */}
          <div className="grid grid-cols-4 gap-4 items-start">
            <label className="text-amber-300 pt-2">
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
                  className="w-full px-4 py-2.5 pr-16 bg-[#0F171E]/50 border border-amber-500/30 rounded-lg text-amber-50 placeholder-amber-400/40 focus:outline-none focus:border-amber-400 transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400/60">
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
                    className="px-3 py-1.5 bg-[#0F171E]/50 border border-amber-500/30 hover:border-amber-400 text-amber-300 rounded text-sm transition-all"
                  >
                    {amount.toLocaleString()}
                  </button>
                ))}
              </div>

              {formData.bounty && parseInt(formData.bounty) > userBalance && (
                <div className="flex items-start gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>余额不足，请降低悬赏金额</span>
                </div>
              )}

              <p className="text-amber-400/50 text-sm">
                建议悬赏: 普通资源 1000-3000，稀缺资源 5000-10000，极度稀缺 10000+
              </p>
            </div>
          </div>

          {/* Deadline */}
          <div className="grid grid-cols-4 gap-4 items-start">
            <label className="text-amber-300 pt-2">
              截止时间 <span className="text-red-400">*</span>
            </label>
            <div className="col-span-3">
              <div className="flex flex-wrap gap-2">
                {deadlineOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, deadline: option.value })}
                    className={`px-4 py-2 rounded-lg transition-all ${formData.deadline === option.value
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                        : 'bg-[#0F171E]/50 border border-amber-500/30 text-amber-300 hover:bg-amber-500/10'
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <p className="text-amber-400/50 text-sm mt-2">
                超过截止时间未完成，悬赏积分将自动退回
              </p>
            </div>
          </div>
        </div>

        {/* Rules Confirmation */}
        <div className="bg-gradient-to-br from-amber-600/5 to-orange-600/5 border border-amber-500/20 rounded-lg p-6 space-y-4">
          <h3 className="text-amber-50">发布规则</h3>

          <div className="bg-[#0F171E]/50 rounded-lg p-4 space-y-2 text-sm text-amber-300/70">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>发布后将立即从您的账户扣除悬赏积分，作为担保金冻结</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>任务完成后，悬赏积分将自动发放给认领者</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>如果超过截止时间无人完成，积分将自动退回</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>恶意求种、虚假描述将受到警告或封禁处罚</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>请合理设置悬赏金额，过高或过低都可能影响认领率</span>
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToRules}
              onChange={(e) => setAgreedToRules(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-amber-500/30 bg-[#0F171E]/50 text-amber-500 focus:ring-amber-400 focus:ring-offset-0"
            />
            <span className="text-amber-300">
              我已阅读并同意以上规则，确认发布求种后将扣除
              <span className="text-amber-400 mx-1">
                {formData.bounty ? parseInt(formData.bounty).toLocaleString() : '0'}
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
            className={`flex-1 py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${isFormValid
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
                : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
              }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            发布求种
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-6 py-3 bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 hover:border-amber-400 text-amber-300 rounded-lg transition-all"
          >
            保存草稿
          </button>

          <button
            type="button"
            className="px-6 py-3 bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 hover:border-amber-400 text-amber-300 rounded-lg transition-all"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
}
