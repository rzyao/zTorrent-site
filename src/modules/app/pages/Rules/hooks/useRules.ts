import { useEffect, useState } from 'react';
import type { RuleContent, RuleSection } from '../types';
import { defaultRuleSections } from '../constants';

/**
 * 规则页业务逻辑 Hook
 *
 * 职责：
 * - 管理编辑模式、展开的章节、规则数据与备份
 * - 提供对规则数据的所有增删改操作
 * - 管理 localStorage 持久化
 */
export function useRules() {
  /** 当前展开的章节 id（空字符串表示全部折叠） */
  const [expandedSection, setExpandedSection] = useState<string>('general');
  /** 编辑模式开关 */
  const [isEditMode, setIsEditMode] = useState(false);
  /** 管理员权限（真实项目应来自用户上下文，这里保持与旧代码一致） */
  const [isAdmin] = useState(true);

  /** 从 localStorage 加载初始规则数据 */
  const getInitialRules = (): RuleSection[] => {
    const stored = localStorage.getItem('ptRules');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultRuleSections;
      }
    }
    return defaultRuleSections;
  };

  /** 当前规则数据 */
  const [ruleSections, setRuleSections] = useState<RuleSection[]>(getInitialRules());
  /** 进入编辑模式时的备份，用于撤销 */
  const [backupRules, setBackupRules] = useState<RuleSection[]>([]);

  /** 切换某个章节的展开/折叠 */
  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? '' : id);
  };

  /** 切换编辑模式；进入编辑模式会创建规则数据的深拷贝备份，退出编辑模式不做持久化 */
  const handleEditModeToggle = () => {
    if (!isEditMode) {
      setBackupRules(JSON.parse(JSON.stringify(ruleSections)));
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  };

  /** 保存编辑后的规则至 localStorage，并退出编辑模式 */
  const handleSave = () => {
    localStorage.setItem('ptRules', JSON.stringify(ruleSections));
    setIsEditMode(false);
  };

  /** 取消编辑：恢复备份并退出编辑模式 */
  const handleCancel = () => {
    setRuleSections(backupRules);
    setIsEditMode(false);
  };

  /** 更新章节标题 */
  const updateSectionTitle = (sectionId: string, newTitle: string) => {
    setRuleSections((prev) =>
      prev.map((section) => (section.id === sectionId ? { ...section, title: newTitle } : section))
    );
  };

  /** 更新某一内容块的任意字段（title/description/warning） */
  const updateContentField = (
    sectionId: string,
    contentIndex: number,
    field: keyof RuleContent,
    value: string
  ) => {
    setRuleSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          const newContent = [...section.content];
          newContent[contentIndex] = { ...newContent[contentIndex], [field]: value } as RuleContent;
          return { ...section, content: newContent };
        }
        return section;
      })
    );
  };

  /** 更新列表项内容 */
  const updateItem = (
    sectionId: string,
    contentIndex: number,
    itemIndex: number,
    value: string
  ) => {
    setRuleSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          const newContent = [...section.content];
          const items = [...(newContent[contentIndex].items || [])];
          items[itemIndex] = value;
          newContent[contentIndex] = { ...newContent[contentIndex], items } as RuleContent;
          return { ...section, content: newContent };
        }
        return section;
      })
    );
  };

  /** 添加一个列表项 */
  const addItem = (sectionId: string, contentIndex: number) => {
    setRuleSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          const newContent = [...section.content];
          const items = [...(newContent[contentIndex].items || []), '新项目'];
          newContent[contentIndex] = { ...newContent[contentIndex], items } as RuleContent;
          return { ...section, content: newContent };
        }
        return section;
      })
    );
  };

  /** 删除一个列表项；当删除后 items 为空时置为 undefined */
  const deleteItem = (sectionId: string, contentIndex: number, itemIndex: number) => {
    setRuleSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          const newContent = [...section.content];
          const items = (newContent[contentIndex].items || []).filter((_, i) => i !== itemIndex);
          newContent[contentIndex] = {
            ...newContent[contentIndex],
            items: items.length > 0 ? items : undefined,
          } as RuleContent;
          return { ...section, content: newContent };
        }
        return section;
      })
    );
  };

  /** 添加一个内容块 */
  const addContent = (sectionId: string) => {
    setRuleSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            content: [
              ...section.content,
              { title: '新内容', description: '请输入描述', items: ['新项目'] },
            ],
          };
        }
        return section;
      })
    );
  };

  /** 删除一个内容块 */
  const deleteContent = (sectionId: string, contentIndex: number) => {
    setRuleSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          return { ...section, content: section.content.filter((_, i) => i !== contentIndex) };
        }
        return section;
      })
    );
  };

  /** 添加一个章节，并自动展开该章节 */
  const addSection = () => {
    const newId = `section-${Date.now()}`;
    setRuleSections((prev) => [
      ...prev,
      {
        id: newId,
        title: '新章节',
        content: [{ title: '新内容', description: '请输入描述', items: ['新项目'] }],
      },
    ]);
    setExpandedSection(newId);
  };

  /** 删除一个章节 */
  const deleteSection = (sectionId: string) => {
    setRuleSections((prev) => prev.filter((section) => section.id !== sectionId));
  };

  return {
    expandedSection,
    isEditMode,
    isAdmin,
    ruleSections,
    // actions
    setExpandedSection,
    toggleSection,
    handleEditModeToggle,
    handleSave,
    handleCancel,
    updateSectionTitle,
    updateContentField,
    updateItem,
    addItem,
    deleteItem,
    addContent,
    deleteContent,
    addSection,
    deleteSection,
  };
}

