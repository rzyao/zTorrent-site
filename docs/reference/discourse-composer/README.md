# Discourse Composer 组件参考

本目录包含从 Discourse 项目复制的 Composer 相关组件，用作开发参考。

## 文件列表

| 文件名                      | 功能描述                                         | 对应本项目组件                    |
| --------------------------- | ------------------------------------------------ | --------------------------------- |
| `composer-container.gjs`    | Composer 主容器，包含整体布局、grippie、消息区等 | `ForumComposer.tsx`               |
| `composer-editor.gjs`       | 编辑器核心，包含预览、上传、mention 等           | `ComposerEditor.tsx`              |
| `composer-toggles.gjs`      | 右上角控制按钮（最小化、全屏、关闭）             | 集成在 `ForumComposer.tsx`        |
| `composer-action-title.gjs` | 显示当前操作类型（创建话题、回复等）             | 集成在 `ForumComposer.tsx` header |
| `composer-body.js`          | Composer 主体容器逻辑                            | -                                 |
| `composer-title.gjs`        | 标题输入组件                                     | `ComposerInputs.tsx`              |
| `composer-save-button.gjs`  | 保存/发布按钮                                    | `ForumComposer.tsx` footer        |
| `d-editor.gjs`              | 通用编辑器组件（Markdown + 富文本切换）          | `ComposerEditor.tsx`              |
| `d-editor-preview.gjs`      | 预览组件                                         | `ComposerPreview.tsx`             |
| `toggle-switch.gjs`         | Markdown/富文本切换开关                          | `EditorToggleSwitch.tsx`          |
| `toolbar-buttons.gjs`       | 工具栏按钮                                       | 集成在 `ComposerEditor.tsx`       |
| `textarea-editor.gjs`       | Textarea 编辑器                                  | 集成在 `ComposerEditor.tsx`       |

## Discourse 编辑器切换实现细节

### 关键代码位置 (d-editor.gjs)

1.  **状态判断** (L690-692):

    ```javascript
    get isRichEditorEnabled() {
      return this.editorComponent !== TextareaEditor;
    }
    ```

2.  **ToggleSwitch 渲染** (L811-818):

    ```gjs
    {{#if this.showEditorModeToggle}}
      <ToggleSwitch
        @preventFocus={{true}}
        @disabled={{@disableSubmit}}
        @state={{this.isRichEditorEnabled}}
        {{on "click" this.toggleRichEditor}}
        {{on "keydown" this.rovingButtonBar}}
      />
    {{/if}}
    ```

3.  **切换逻辑** (L638-658):

    ```javascript
    @action
    async toggleRichEditor() {
      // 切换编辑器组件
      this.editorComponent = this.isRichEditorEnabled
        ? TextareaEditor
        : await loadRichEditor();

      // 保存用户偏好
      const preference = this.isRichEditorEnabled
        ? USER_OPTION_COMPOSITION_MODES.rich
        : USER_OPTION_COMPOSITION_MODES.markdown;

      this.currentUser.set("user_option.composition_mode", preference);
      this.#debounceSaveRichEditorPreference(preference);
    }
    ```

4.  **动态编辑器组件** (L830-846):

    ```gjs
    <this.editorComponent
      @class="d-editor-input"
      @onSetup={{this.setupEditor}}
      @markdownOptions={{this.markdownOptions}}
      @keymap={{this.keymap}}
      @value={{this.value}}
      @placeholder={{this.placeholderTranslated}}
      ...
    />
    ```

5.  **快捷键** (L244-246):
    ```javascript
    if (this.siteSettings.rich_editor && isNone(this.forceEditorMode)) {
      keymap["ctrl+m"] = () => this.toggleRichEditor();
    }
    ```

### 本项目实现对照

| Discourse 实现                         | 本项目实现                                |
| -------------------------------------- | ----------------------------------------- |
| `this.editorComponent` (动态组件)      | `isRichText` 状态 + 条件渲染              |
| `TextareaEditor`                       | Markdown textarea                         |
| `loadRichEditor()` → ProseMirror       | TODO: TipTap/ProseMirror                  |
| `@state={{this.isRichEditorEnabled}}`  | `isRichText={isRichText}`                 |
| `{{on "click" this.toggleRichEditor}}` | `onToggle={toggleEditorMode}`             |
| `keymap["ctrl+m"]`                     | `useEffect + addEventListener("keydown")` |

## 开发进度

### 已完成

- [x] `ForumComposer.tsx` - 主容器（grippie、最小化、全屏、关闭）
- [x] `ComposerStore.ts` - 状态管理（Zustand）+ isRichText 状态
- [x] `ComposerInputs.tsx` - 标题和分类输入
- [x] `ComposerEditor.tsx` - Markdown 编辑器 + 工具栏 + 切换开关
- [x] `ComposerPreview.tsx` - 预览组件
- [x] `EditorToggleSwitch.tsx` - 模式切换开关（参考 toggle-switch.gjs）
- [x] 富文本模式隐藏预览（带动画）
- [x] Ctrl+M 快捷键切换

### 待开发

- [ ] 富文本编辑器集成 (TipTap/ProseMirror) - 需要安装依赖
- [ ] 图片上传功能
- [ ] @mention 功能
- [ ] Emoji 选择器
- [ ] 草稿自动保存指示器

## 核心差异

| Discourse (Ember.js)              | 本项目 (React)                                        |
| --------------------------------- | ----------------------------------------------------- |
| `@service composer`               | `useComposerStore()`                                  |
| `.gjs` 模板                       | `.tsx` JSX                                            |
| `@action` 装饰器                  | `const handleXxx = () => {}`                          |
| `@tracked`                        | `useState` / Zustand state                            |
| `{{#if}}` / `{{#unless}}`         | `{condition && ...}` / 三元表达式                     |
| 动态组件 `<this.editorComponent>` | 条件渲染 `{isRichText ? <RichEditor/> : <Textarea/>}` |
