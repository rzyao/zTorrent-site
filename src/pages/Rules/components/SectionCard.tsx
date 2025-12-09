import React from 'react';
import { ChevronDown, ChevronUp, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { RuleContent, RuleSection } from '../types';
import { getIconBySection } from '../utils';

/**
 * 单个章节卡片组件
 *
 * 说明：包含章节头部（标题、展开按钮、删除）与章节内容（文本、列表、警告、增删操作）。
 * 通过 props 注入所有业务动作，保持组件自身无状态，便于测试与复用。
 */
export const SectionCard: React.FC<{
  section: RuleSection;
  expandedSection: string;
  isEditMode: boolean;
  onToggle: (id: string) => void;
  onDeleteSection: (id: string) => void;
  onUpdateSectionTitle: (id: string, title: string) => void;
  onUpdateContentField: (sectionId: string, contentIndex: number, field: keyof RuleContent, value: string) => void;
  onUpdateItem: (sectionId: string, contentIndex: number, itemIndex: number, value: string) => void;
  onAddItem: (sectionId: string, contentIndex: number) => void;
  onDeleteItem: (sectionId: string, contentIndex: number, itemIndex: number) => void;
  onAddContent: (sectionId: string) => void;
  onDeleteContent: (sectionId: string, contentIndex: number) => void;
}> = ({
  section,
  expandedSection,
  isEditMode,
  onToggle,
  onDeleteSection,
  onUpdateSectionTitle,
  onUpdateContentField,
  onUpdateItem,
  onAddItem,
  onDeleteItem,
  onAddContent,
  onDeleteContent,
}) => {
    const isExpanded = expandedSection === section.id;
    return (
      <div
        className={`bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 overflow-hidden transition-all ${isExpanded ? 'border-amber-500/30 shadow-lg shadow-amber-500/10' : ''}`}
      >
        {/* 章节标题 */}
        <div className="flex items-center justify-between p-6 hover:bg-neutral-700/20 transition-colors">
          <button onClick={() => onToggle(section.id)} className="flex items-center gap-4 flex-1">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isExpanded ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30' : 'bg-neutral-700/50'}`}>
              {getIconBySection(section.id)}
            </div>
            {isEditMode ? (
              <input
                type="text"
                value={section.title}
                onChange={(e) => onUpdateSectionTitle(section.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="text-xl text-white bg-neutral-700/50 px-3 py-1 rounded border border-amber-500/30 focus:outline-none focus:border-amber-500"
              />
            ) : (
              <h2 className={`text-xl ${isExpanded ? 'text-white' : 'text-neutral-300'}`}>{section.title}</h2>
            )}
          </button>
          <div className="flex items-center gap-2">
            {isEditMode && (
              <button
                onClick={() => onDeleteSection(section.id)}
                className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => onToggle(section.id)}>
              {isExpanded ? <ChevronUp className="w-5 h-5 text-amber-400" /> : <ChevronDown className="w-5 h-5 text-neutral-500" />}
            </button>
          </div>
        </div>

        {/* 章节内容 */}
        {isExpanded && (
          <div className="px-6 pb-6 space-y-6">
            {section.content.map((item, contentIndex) => (
              <div key={contentIndex}>
                {contentIndex > 0 && <Separator className="bg-neutral-700/50 mb-6" />}
                <div className="relative">
                  {isEditMode && (
                    <button
                      onClick={() => onDeleteContent(section.id, contentIndex)}
                      className="absolute top-0 right-0 p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* 标题 */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    {isEditMode ? (
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => onUpdateContentField(section.id, contentIndex, 'title', e.target.value)}
                        className="text-amber-400 bg-neutral-700/50 px-2 py-1 rounded border border-amber-500/30 focus:outline-none focus:border-amber-500 flex-1"
                      />
                    ) : (
                      <h3 className="text-amber-400">{item.title}</h3>
                    )}
                  </div>

                  {/* 描述 */}
                  {isEditMode ? (
                    <textarea
                      value={item.description}
                      onChange={(e) => onUpdateContentField(section.id, contentIndex, 'description', e.target.value)}
                      rows={2}
                      className="w-full text-neutral-300 text-sm leading-relaxed mb-3 bg-neutral-700/50 p-2 rounded border border-amber-500/30 focus:outline-none focus:border-amber-500 resize-none"
                    />
                  ) : (
                    <p className="text-neutral-300 text-sm leading-relaxed mb-3">{item.description}</p>
                  )}

                  {/* 列表项 */}
                  {item.items && (
                    <ul className="space-y-2 mb-3">
                      {item.items.map((listItem, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3 text-neutral-400 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          {isEditMode ? (
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="text"
                                value={listItem}
                                onChange={(e) => onUpdateItem(section.id, contentIndex, itemIndex, e.target.value)}
                                className="flex-1 bg-neutral-700/50 px-2 py-1 rounded border border-amber-500/30 focus:outline-none focus:border-amber-500 text-neutral-300"
                              />
                              <button
                                onClick={() => onDeleteItem(section.id, contentIndex, itemIndex)}
                                className="p-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <span>{listItem}</span>
                          )}
                        </li>
                      ))}
                      {isEditMode && (
                        <li className="flex items-start gap-3">
                          <button
                            onClick={() => onAddItem(section.id, contentIndex)}
                            className="flex items-center gap-2 text-green-400 hover:text-green-300 text-sm"
                          >
                            {/* 使用与原页面一致的 Plus 图标大小与样式 */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                              <path d="M12 5v14" />
                              <path d="M5 12h14" />
                            </svg>
                            添加项目
                          </button>
                        </li>
                      )}
                    </ul>
                  )}

                  {/* 警告 */}
                  {isEditMode ? (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <textarea
                          value={item.warning || ''}
                          onChange={(e) => onUpdateContentField(section.id, contentIndex, 'warning', e.target.value)}
                          placeholder="警告内容（可选）"
                          rows={2}
                          className="flex-1 text-red-400 text-sm bg-red-500/10 p-2 rounded border border-red-500/30 focus:outline-none focus:border-red-500 resize-none"
                        />
                      </div>
                    </div>
                  ) : (
                    item.warning && (
                      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-red-400 text-sm">{item.warning}</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}

            {/* 添加新内容按钮 */}
            {isEditMode && (
              <button
                onClick={() => onAddContent(section.id)}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-green-500/30 text-green-400 hover:bg-green-500/10 transition-colors"
              >
                {/* Plus 图标（与原页面保持一致的视觉大小） */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
                添加新内容
              </button>
            )}
          </div>
        )}
      </div>
    );
  };
