import React from "react";
import { SidebarNav } from "./components/SidebarNav";
import { RulesHeader } from "./components/Header";
import { ImportantNotice } from "./components/ImportantNotice";
import { SectionCard } from "./components/SectionCard";
import { FooterNote } from "./components/FooterNote";
import { useRules } from "./hooks/useRules";
import { PageContainer } from "@/layouts/PageContainer";

/**
 * 规则页容器
 *
 * 说明：组合拆分后的子组件与业务 Hook，保持原有页面布局与交互。
 */
export function RulesPage() {
  const {
    expandedSection,
    isEditMode,
    isAdmin,
    ruleSections,
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
  } = useRules();

  return (
    <PageContainer>
      {/* <RulesHeader
        isAdmin={isAdmin}
        isEditMode={isEditMode}
        onToggleEdit={handleEditModeToggle}
        onSave={handleSave}
        onCancel={handleCancel}
      /> */}

      {isEditMode && (
        <div className="mb-6 p-4 rounded-xl bg-linear-to-r from-amber-500/10 to-orange-600/10 border border-amber-500/30">
          <div className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-amber-400"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
            <div>
              <p className="text-amber-400 text-sm">
                编辑模式已启用 - 您可以修改规则内容、添加或删除章节和项目
              </p>
              <p className="text-neutral-400 text-xs mt-1">
                完成后请点击"保存更改"按钮保存您的修改
              </p>
            </div>
          </div>
        </div>
      )}

      <ImportantNotice
        isEditMode={isEditMode}
        onSave={handleSave}
        onCancel={handleCancel}
        onToggleEdit={handleEditModeToggle}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <SidebarNav
            sections={ruleSections}
            expandedSection={expandedSection}
            isEditMode={isEditMode}
            onToggle={toggleSection}
            onAddSection={addSection}
          />
        </div>
        <div className="lg:col-span-3">
          <div className="space-y-6">
            {ruleSections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                expandedSection={expandedSection}
                isEditMode={isEditMode}
                onToggle={toggleSection}
                onDeleteSection={deleteSection}
                onUpdateSectionTitle={updateSectionTitle}
                onUpdateContentField={updateContentField}
                onUpdateItem={updateItem}
                onAddItem={addItem}
                onDeleteItem={deleteItem}
                onAddContent={addContent}
                onDeleteContent={deleteContent}
              />
            ))}
          </div>
          <FooterNote />
        </div>
      </div>
    </PageContainer>
  );
}
