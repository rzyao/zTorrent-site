import { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Upload,
  Heading1,
  Heading2,
  Heading3,
  Eye,
  X,
} from 'lucide-react';
import { ImagesService } from '@/api/services/ImagesService';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  onUploadImage?: (file: File) => Promise<string>;
  maxImageSizeMB?: number;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = '输入内容...',
  minHeight = '300px',
  onUploadImage,
  maxImageSizeMB = 5,
}: RichTextEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const insertText = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholder;

    const newValue =
      value.substring(0, start) + before + textToInsert + after + value.substring(end);

    onChange(newValue);

    // 设置新的光标位置
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + textToInsert.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newValue = value.substring(0, start) + text + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      const newPosition = start + text.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleBold = () => insertText('**', '**', '粗体文字');
  const handleItalic = () => insertText('*', '*', '斜体文字');
  const handleUnderline = () => insertText('<u>', '</u>', '下划线文字');
  const handleStrikethrough = () => insertText('~~', '~~', '删除线文字');
  const handleCode = () => insertText('`', '`', '代码');
  const handleCodeBlock = () => insertText('\n```\n', '\n```\n', '代码块');
  const handleQuote = () => insertText('\n> ', '', '引用文字');
  const handleUnorderedList = () => insertText('\n- ', '', '列表项');
  const handleOrderedList = () => insertText('\n1. ', '', '列表项');
  const handleHeading1 = () => insertText('\n# ', '', '一级标题');
  const handleHeading2 = () => insertText('\n## ', '', '二级标题');
  const handleHeading3 = () => insertText('\n### ', '', '三级标题');

  const handleInsertImage = () => {
    if (imageUrl.trim()) {
      insertAtCursor(`\n![图片](${imageUrl})\n`);
      setImageUrl('');
      setShowImageModal(false);
    }
  };

  const handleInsertLink = () => {
    if (linkUrl.trim()) {
      const text = linkText.trim() || linkUrl;
      insertAtCursor(`[${text}](${linkUrl})`);
      setLinkUrl('');
      setLinkText('');
      setShowLinkModal(false);
    }
  };

  const doUploadImage = async (file: File) => {
    setUploadError(null);
    if (!file || !file.type.startsWith('image/')) {
      setUploadError('请选择图片文件');
      return;
    }
    if (file.size > (maxImageSizeMB || 5) * 1024 * 1024) {
      setUploadError(`图片过大，最大支持 ${maxImageSizeMB}MB`);
      return;
    }
    setUploading(true);
    try {
      const uploader = onUploadImage || (async (f: File) => {
        const res = await ImagesService.imagesControllerUpload({ file: f });
        const url = (res as any)?.data?.url || (res as any)?.url;
        if (!url) throw new Error('上传失败');
        return url as string;
      });
      const url = await uploader(file);
      insertAtCursor(`\n![图片](${url})\n`);
    } catch (e: any) {
      setUploadError(e?.message || '上传失败');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUploadButtonClick = () => {
    setUploadError(null);
    fileInputRef.current?.click();
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await doUploadImage(file);
  };

  // 渲染Markdown预览
  const renderPreview = (text: string) => {
    let html = text;

    // 标题
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-white mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-white mt-4 mb-2">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-semibold text-white mt-4 mb-2">$1</h1>');

    // 粗体
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');

    // 斜体
    html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');

    // 删除线
    html = html.replace(/~~(.+?)~~/g, '<del class="line-through text-neutral-400">$1</del>');

    // 下划线
    html = html.replace(/<u>(.+?)<\/u>/g, '<u class="underline">$1</u>');

    // 行内代码
    html = html.replace(/`([^`]+)`/g, '<code class="bg-neutral-800 text-amber-400 px-1.5 py-0.5 rounded text-sm">$1</code>');

    // 代码块
    html = html.replace(/```\n?([\s\S]*?)\n?```/g, '<pre class="bg-neutral-800 text-neutral-300 p-4 rounded-lg overflow-x-auto my-3"><code>$1</code></pre>');

    // 引用
    html = html.replace(/^> (.+$)/gim, '<blockquote class="border-l-4 border-amber-500 pl-4 py-2 my-3 text-neutral-300 bg-neutral-800/50 rounded">$1</blockquote>');

    // 无序列表
    html = html.replace(/^\- (.+$)/gim, '<li class="ml-4">• $1</li>');

    // 有序列表
    html = html.replace(/^\d+\. (.+$)/gim, '<li class="ml-4 list-decimal">$1</li>');

    // 图片
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg my-3" />');

    // 链接
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-amber-400 hover:text-amber-300 underline" target="_blank" rel="noopener noreferrer">$1</a>');

    // 换行
    html = html.replace(/\n/g, '<br />');

    return html;
  };

  return (
    <div className="space-y-3">
      {/* 工具栏 */}
      <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-2">
        <div className="flex items-center gap-1 flex-wrap">
          {/* 标题 */}
          <div className="flex items-center gap-1 pr-2 border-r border-neutral-700">
            <button
              type="button"
              onClick={handleHeading1}
              className="p-2 hover:bg-neutral-700 rounded transition-colors text-neutral-300 hover:text-white"
              title="一级标题"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleHeading2}
              className="p-2 hover:bg-neutral-700 rounded transition-colors text-neutral-300 hover:text-white"
              title="二级标题"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleHeading3}
              className="p-2 hover:bg-neutral-700 rounded transition-colors text-neutral-300 hover:text-white"
              title="三级标题"
            >
              <Heading3 className="w-4 h-4" />
            </button>
          </div>

          {/* 文本样式 */}
          <div className="flex items-center gap-1 pr-2 border-r border-neutral-700">
            <button
              type="button"
              onClick={handleBold}
              className="p-2 hover:bg-neutral-700 rounded transition-colors text-neutral-300 hover:text-white"
              title="粗体"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleItalic}
              className="p-2 hover:bg-neutral-700 rounded transition-colors text-neutral-300 hover:text-white"
              title="斜体"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleUnderline}
              className="p-2 hover:bg-neutral-700 rounded transition-colors text-neutral-300 hover:text-white"
              title="下划线"
            >
              <Underline className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleStrikethrough}
              className="p-2 hover:bg-neutral-700 rounded transition-colors text-neutral-300 hover:text-white"
              title="删除线"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
          </div>

          {/* 列表和引用 */}
          <div className="flex items-center gap-1 pr-2 border-r border-neutral-700">
            <button
              type="button"
              onClick={handleUnorderedList}
              className="p-2 hover:bg-neutral-700 rounded transition-colors text-neutral-300 hover:text-white"
              title="无序列表"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleOrderedList}
              className="p-2 hover:bg-neutral-700 rounded transition-colors text-neutral-300 hover:text-white"
              title="有序列表"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleQuote}
              className="p-2 hover:bg-neutral-700 rounded transition-colors text-neutral-300 hover:text-white"
              title="引用"
            >
              <Quote className="w-4 h-4" />
            </button>
          </div>

          {/* 代码 */}
          <div className="flex items-center gap-1 pr-2 border-r border-neutral-700">
            <button
              type="button"
              onClick={handleCode}
              className="p-2 hover:bg-neutral-700 rounded transition-colors text-neutral-300 hover:text-white"
              title="行内代码"
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleCodeBlock}
              className="p-2 hover:bg-neutral-700 rounded transition-colors text-neutral-300 hover:text-white text-xs px-2"
              title="代码块"
            >
              {'</>'}
            </button>
          </div>

          {/* 插入 */}
          <div className="flex items-center gap-1 pr-2 border-r border-neutral-700">
            <button
              type="button"
              onClick={() => setShowLinkModal(true)}
              className="p-2 hover:bg-neutral-700 rounded transition-colors text-neutral-300 hover:text-white"
              title="插入链接"
            >
              <Link className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowImageModal(true)}
              className="p-2 hover:bg-neutral-700 rounded transition-colors text-neutral-300 hover:text-white"
              title="插入图片"
            >
              <Image className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleUploadButtonClick}
              className={`p-2 rounded transition-colors ${uploading ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed' : 'text-neutral-300 hover:bg-neutral-700 hover:text-white'}`}
              title="上传图片"
              disabled={uploading}
            >
              <Upload className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInputChange}
            />
          </div>

          {/* 预览 */}
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`p-2 hover:bg-neutral-700 rounded transition-colors ${showPreview ? 'bg-amber-500/20 text-amber-400' : 'text-neutral-300 hover:text-white'
              }`}
            title="预览"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 编辑器/预览区域 */}
      {showPreview ? (
        <div
          className="w-full bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-4 py-3 text-neutral-300 overflow-y-auto"
          style={{ minHeight }}
          dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none resize-none transition-all"
          style={{ minHeight }}
          onDrop={async (e) => {
            if (uploading) return;
            if (e.dataTransfer?.files?.length) {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              await doUploadImage(file);
            }
          }}
          onPaste={async (e) => {
            if (uploading) return;
            const files = e.clipboardData?.files;
            if (files && files.length) {
              const file = files[0];
              await doUploadImage(file);
            }
          }}
        />
      )}

      {/* 格式说明 */}
      <div className="text-xs text-neutral-500">
        支持 Markdown 格式：**粗体** *斜体* ~~删除线~~ `代码` [链接](URL) ![图片](URL)
      </div>
      {uploadError && (
        <div className="text-xs text-red-400">{uploadError}</div>
      )}

      {/* 插入图片模态框 */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl max-w-md w-full mx-4">
            <div className="p-4 border-b border-neutral-700 flex items-center justify-between">
              <h3 className="text-white">插入图片</h3>
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setImageUrl('');
                }}
                className="p-1 hover:bg-neutral-800 rounded transition-colors"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-neutral-300 text-sm mb-2 block">图片URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleInsertImage();
                    }
                  }}
                />
              </div>
              {imageUrl && (
                <div>
                  <label className="text-neutral-300 text-sm mb-2 block">预览</label>
                  <img
                    src={imageUrl}
                    alt="预览"
                    className="max-w-full rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            <div className="p-4 border-t border-neutral-700 flex gap-3">
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setImageUrl('');
                }}
                className="flex-1 py-2 bg-neutral-700 text-neutral-300 rounded-lg hover:bg-neutral-600 transition-all"
              >
                取消
              </button>
              <button
                onClick={handleInsertImage}
                disabled={!imageUrl.trim()}
                className={`flex-1 py-2 rounded-lg transition-all ${imageUrl.trim()
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-lg hover:shadow-amber-500/25'
                  : 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
                  }`}
              >
                插入
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 插入链接模态框 */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl max-w-md w-full mx-4">
            <div className="p-4 border-b border-neutral-700 flex items-center justify-between">
              <h3 className="text-white">插入链接</h3>
              <button
                onClick={() => {
                  setShowLinkModal(false);
                  setLinkUrl('');
                  setLinkText('');
                }}
                className="p-1 hover:bg-neutral-800 rounded transition-colors"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-neutral-300 text-sm mb-2 block">链接文字</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="点击这里"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none"
                />
              </div>
              <div>
                <label className="text-neutral-300 text-sm mb-2 block">
                  链接地址 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleInsertLink();
                    }
                  }}
                />
              </div>
            </div>
            <div className="p-4 border-t border-neutral-700 flex gap-3">
              <button
                onClick={() => {
                  setShowLinkModal(false);
                  setLinkUrl('');
                  setLinkText('');
                }}
                className="flex-1 py-2 bg-neutral-700 text-neutral-300 rounded-lg hover:bg-neutral-600 transition-all"
              >
                取消
              </button>
              <button
                onClick={handleInsertLink}
                disabled={!linkUrl.trim()}
                className={`flex-1 py-2 rounded-lg transition-all ${linkUrl.trim()
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-lg hover:shadow-amber-500/25'
                  : 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
                  }`}
              >
                插入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
