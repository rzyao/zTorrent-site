import { c as createLucideIcon, a as createContextScope, r as reactExports, b as createPopperScope, u as useCallbackRef, d as useDirection, j as jsxRuntimeExports, R as Root2$1, A as Anchor, P as Presence, e as Portal$1, f as createCollection, g as useComposedRefs, h as composeEventHandlers, i as hideOthers, k as Primitive, l as dispatchDiscreteCustomEvent, m as useFocusGuards, n as ReactRemoveScroll, o as createSlot, F as FocusScope, D as DismissableLayer, C as Content, p as Arrow, q as composeRefs, s as cn, t as ChevronDown, v as ChevronUp, w as useTorrentDownload, x as useParams, B as Badge, S as Star, I as Info, y as formatSize, z as Button, E as Download, G as Share2, H as Flag, J as Separator$1, U as Upload, K as ImageWithFallback, X, M as MessageSquare, T as ThumbsUp, L as Heart, N as TorrentsService } from "./index-CXPyGxWY.js";
import { c as createRovingFocusGroupScope, I as Item, R as Root, B as Bookmark } from "./index-BIiFL-Wd.js";
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }]
];
const File = createLucideIcon("file", __iconNode$2);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
      key: "1kt360"
    }
  ]
];
const Folder = createLucideIcon("folder", __iconNode$1);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M2 21a8 8 0 0 1 13.292-6", key: "bjp14o" }],
  ["circle", { cx: "10", cy: "8", r: "5", key: "o932ke" }],
  ["path", { d: "m16 19 2 2 4-4", key: "1b14m6" }]
];
const UserRoundCheck = createLucideIcon("user-round-check", __iconNode);
var SELECTION_KEYS = ["Enter", " "];
var FIRST_KEYS = ["ArrowDown", "PageUp", "Home"];
var LAST_KEYS = ["ArrowUp", "PageDown", "End"];
var FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
var SUB_OPEN_KEYS = {
  ltr: [...SELECTION_KEYS, "ArrowRight"],
  rtl: [...SELECTION_KEYS, "ArrowLeft"]
};
var SUB_CLOSE_KEYS = {
  ltr: ["ArrowLeft"],
  rtl: ["ArrowRight"]
};
var MENU_NAME = "Menu";
var [Collection, useCollection, createCollectionScope] = createCollection(MENU_NAME);
var [createMenuContext, createMenuScope] = createContextScope(MENU_NAME, [
  createCollectionScope,
  createPopperScope,
  createRovingFocusGroupScope
]);
var usePopperScope = createPopperScope();
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [MenuProvider, useMenuContext] = createMenuContext(MENU_NAME);
var [MenuRootProvider, useMenuRootContext] = createMenuContext(MENU_NAME);
var Menu = (props) => {
  const { __scopeMenu, open = false, children, dir, onOpenChange, modal = true } = props;
  const popperScope = usePopperScope(__scopeMenu);
  const [content, setContent] = reactExports.useState(null);
  const isUsingKeyboardRef = reactExports.useRef(false);
  const handleOpenChange = useCallbackRef(onOpenChange);
  const direction = useDirection(dir);
  reactExports.useEffect(() => {
    const handleKeyDown = () => {
      isUsingKeyboardRef.current = true;
      document.addEventListener("pointerdown", handlePointer, { capture: true, once: true });
      document.addEventListener("pointermove", handlePointer, { capture: true, once: true });
    };
    const handlePointer = () => isUsingKeyboardRef.current = false;
    document.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => {
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
      document.removeEventListener("pointerdown", handlePointer, { capture: true });
      document.removeEventListener("pointermove", handlePointer, { capture: true });
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2$1, { ...popperScope, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    MenuProvider,
    {
      scope: __scopeMenu,
      open,
      onOpenChange: handleOpenChange,
      content,
      onContentChange: setContent,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuRootProvider,
        {
          scope: __scopeMenu,
          onClose: reactExports.useCallback(() => handleOpenChange(false), [handleOpenChange]),
          isUsingKeyboardRef,
          dir: direction,
          modal,
          children
        }
      )
    }
  ) });
};
Menu.displayName = MENU_NAME;
var ANCHOR_NAME = "MenuAnchor";
var MenuAnchor = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, ...anchorProps } = props;
    const popperScope = usePopperScope(__scopeMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Anchor, { ...popperScope, ...anchorProps, ref: forwardedRef });
  }
);
MenuAnchor.displayName = ANCHOR_NAME;
var PORTAL_NAME$1 = "MenuPortal";
var [PortalProvider, usePortalContext] = createMenuContext(PORTAL_NAME$1, {
  forceMount: void 0
});
var MenuPortal = (props) => {
  const { __scopeMenu, forceMount, children, container } = props;
  const context = useMenuContext(PORTAL_NAME$1, __scopeMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PortalProvider, { scope: __scopeMenu, forceMount, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$1, { asChild: true, container, children }) }) });
};
MenuPortal.displayName = PORTAL_NAME$1;
var CONTENT_NAME$1 = "MenuContent";
var [MenuContentProvider, useMenuContentContext] = createMenuContext(CONTENT_NAME$1);
var MenuContent = reactExports.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME$1, props.__scopeMenu);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = useMenuContext(CONTENT_NAME$1, props.__scopeMenu);
    const rootContext = useMenuRootContext(CONTENT_NAME$1, props.__scopeMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeMenu, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeMenu, children: rootContext.modal ? /* @__PURE__ */ jsxRuntimeExports.jsx(MenuRootContentModal, { ...contentProps, ref: forwardedRef }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MenuRootContentNonModal, { ...contentProps, ref: forwardedRef }) }) }) });
  }
);
var MenuRootContentModal = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useMenuContext(CONTENT_NAME$1, props.__scopeMenu);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    reactExports.useEffect(() => {
      const content = ref.current;
      if (content) return hideOthers(content);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuContentImpl,
      {
        ...props,
        ref: composedRefs,
        trapFocus: context.open,
        disableOutsidePointerEvents: context.open,
        disableOutsideScroll: true,
        onFocusOutside: composeEventHandlers(
          props.onFocusOutside,
          (event) => event.preventDefault(),
          { checkForDefaultPrevented: false }
        ),
        onDismiss: () => context.onOpenChange(false)
      }
    );
  }
);
var MenuRootContentNonModal = reactExports.forwardRef((props, forwardedRef) => {
  const context = useMenuContext(CONTENT_NAME$1, props.__scopeMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    MenuContentImpl,
    {
      ...props,
      ref: forwardedRef,
      trapFocus: false,
      disableOutsidePointerEvents: false,
      disableOutsideScroll: false,
      onDismiss: () => context.onOpenChange(false)
    }
  );
});
var Slot = createSlot("MenuContent.ScrollLock");
var MenuContentImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeMenu,
      loop = false,
      trapFocus,
      onOpenAutoFocus,
      onCloseAutoFocus,
      disableOutsidePointerEvents,
      onEntryFocus,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      onDismiss,
      disableOutsideScroll,
      ...contentProps
    } = props;
    const context = useMenuContext(CONTENT_NAME$1, __scopeMenu);
    const rootContext = useMenuRootContext(CONTENT_NAME$1, __scopeMenu);
    const popperScope = usePopperScope(__scopeMenu);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenu);
    const getItems = useCollection(__scopeMenu);
    const [currentItemId, setCurrentItemId] = reactExports.useState(null);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef, context.onContentChange);
    const timerRef = reactExports.useRef(0);
    const searchRef = reactExports.useRef("");
    const pointerGraceTimerRef = reactExports.useRef(0);
    const pointerGraceIntentRef = reactExports.useRef(null);
    const pointerDirRef = reactExports.useRef("right");
    const lastPointerXRef = reactExports.useRef(0);
    const ScrollLockWrapper = disableOutsideScroll ? ReactRemoveScroll : reactExports.Fragment;
    const scrollLockWrapperProps = disableOutsideScroll ? { as: Slot, allowPinchZoom: true } : void 0;
    const handleTypeaheadSearch = (key) => {
      var _a, _b;
      const search = searchRef.current + key;
      const items = getItems().filter((item) => !item.disabled);
      const currentItem = document.activeElement;
      const currentMatch = (_a = items.find((item) => item.ref.current === currentItem)) == null ? void 0 : _a.textValue;
      const values = items.map((item) => item.textValue);
      const nextMatch = getNextMatch(values, search, currentMatch);
      const newItem = (_b = items.find((item) => item.textValue === nextMatch)) == null ? void 0 : _b.ref.current;
      (function updateSearch(value) {
        searchRef.current = value;
        window.clearTimeout(timerRef.current);
        if (value !== "") timerRef.current = window.setTimeout(() => updateSearch(""), 1e3);
      })(search);
      if (newItem) {
        setTimeout(() => newItem.focus());
      }
    };
    reactExports.useEffect(() => {
      return () => window.clearTimeout(timerRef.current);
    }, []);
    useFocusGuards();
    const isPointerMovingToSubmenu = reactExports.useCallback((event) => {
      var _a, _b;
      const isMovingTowards = pointerDirRef.current === ((_a = pointerGraceIntentRef.current) == null ? void 0 : _a.side);
      return isMovingTowards && isPointerInGraceArea(event, (_b = pointerGraceIntentRef.current) == null ? void 0 : _b.area);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuContentProvider,
      {
        scope: __scopeMenu,
        searchRef,
        onItemEnter: reactExports.useCallback(
          (event) => {
            if (isPointerMovingToSubmenu(event)) event.preventDefault();
          },
          [isPointerMovingToSubmenu]
        ),
        onItemLeave: reactExports.useCallback(
          (event) => {
            var _a;
            if (isPointerMovingToSubmenu(event)) return;
            (_a = contentRef.current) == null ? void 0 : _a.focus();
            setCurrentItemId(null);
          },
          [isPointerMovingToSubmenu]
        ),
        onTriggerLeave: reactExports.useCallback(
          (event) => {
            if (isPointerMovingToSubmenu(event)) event.preventDefault();
          },
          [isPointerMovingToSubmenu]
        ),
        pointerGraceTimerRef,
        onPointerGraceIntentChange: reactExports.useCallback((intent) => {
          pointerGraceIntentRef.current = intent;
        }, []),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollLockWrapper, { ...scrollLockWrapperProps, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          FocusScope,
          {
            asChild: true,
            trapped: trapFocus,
            onMountAutoFocus: composeEventHandlers(onOpenAutoFocus, (event) => {
              var _a;
              event.preventDefault();
              (_a = contentRef.current) == null ? void 0 : _a.focus({ preventScroll: true });
            }),
            onUnmountAutoFocus: onCloseAutoFocus,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              DismissableLayer,
              {
                asChild: true,
                disableOutsidePointerEvents,
                onEscapeKeyDown,
                onPointerDownOutside,
                onFocusOutside,
                onInteractOutside,
                onDismiss,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Root,
                  {
                    asChild: true,
                    ...rovingFocusGroupScope,
                    dir: rootContext.dir,
                    orientation: "vertical",
                    loop,
                    currentTabStopId: currentItemId,
                    onCurrentTabStopIdChange: setCurrentItemId,
                    onEntryFocus: composeEventHandlers(onEntryFocus, (event) => {
                      if (!rootContext.isUsingKeyboardRef.current) event.preventDefault();
                    }),
                    preventScrollOnEntryFocus: true,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Content,
                      {
                        role: "menu",
                        "aria-orientation": "vertical",
                        "data-state": getOpenState(context.open),
                        "data-radix-menu-content": "",
                        dir: rootContext.dir,
                        ...popperScope,
                        ...contentProps,
                        ref: composedRefs,
                        style: { outline: "none", ...contentProps.style },
                        onKeyDown: composeEventHandlers(contentProps.onKeyDown, (event) => {
                          const target = event.target;
                          const isKeyDownInside = target.closest("[data-radix-menu-content]") === event.currentTarget;
                          const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
                          const isCharacterKey = event.key.length === 1;
                          if (isKeyDownInside) {
                            if (event.key === "Tab") event.preventDefault();
                            if (!isModifierKey && isCharacterKey) handleTypeaheadSearch(event.key);
                          }
                          const content = contentRef.current;
                          if (event.target !== content) return;
                          if (!FIRST_LAST_KEYS.includes(event.key)) return;
                          event.preventDefault();
                          const items = getItems().filter((item) => !item.disabled);
                          const candidateNodes = items.map((item) => item.ref.current);
                          if (LAST_KEYS.includes(event.key)) candidateNodes.reverse();
                          focusFirst(candidateNodes);
                        }),
                        onBlur: composeEventHandlers(props.onBlur, (event) => {
                          if (!event.currentTarget.contains(event.target)) {
                            window.clearTimeout(timerRef.current);
                            searchRef.current = "";
                          }
                        }),
                        onPointerMove: composeEventHandlers(
                          props.onPointerMove,
                          whenMouse((event) => {
                            const target = event.target;
                            const pointerXHasChanged = lastPointerXRef.current !== event.clientX;
                            if (event.currentTarget.contains(target) && pointerXHasChanged) {
                              const newDir = event.clientX > lastPointerXRef.current ? "right" : "left";
                              pointerDirRef.current = newDir;
                              lastPointerXRef.current = event.clientX;
                            }
                          })
                        )
                      }
                    )
                  }
                )
              }
            )
          }
        ) })
      }
    );
  }
);
MenuContent.displayName = CONTENT_NAME$1;
var GROUP_NAME$1 = "MenuGroup";
var MenuGroup = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, ...groupProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { role: "group", ...groupProps, ref: forwardedRef });
  }
);
MenuGroup.displayName = GROUP_NAME$1;
var LABEL_NAME$1 = "MenuLabel";
var MenuLabel = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, ...labelProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { ...labelProps, ref: forwardedRef });
  }
);
MenuLabel.displayName = LABEL_NAME$1;
var ITEM_NAME$1 = "MenuItem";
var ITEM_SELECT = "menu.itemSelect";
var MenuItem = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { disabled = false, onSelect, ...itemProps } = props;
    const ref = reactExports.useRef(null);
    const rootContext = useMenuRootContext(ITEM_NAME$1, props.__scopeMenu);
    const contentContext = useMenuContentContext(ITEM_NAME$1, props.__scopeMenu);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const isPointerDownRef = reactExports.useRef(false);
    const handleSelect = () => {
      const menuItem = ref.current;
      if (!disabled && menuItem) {
        const itemSelectEvent = new CustomEvent(ITEM_SELECT, { bubbles: true, cancelable: true });
        menuItem.addEventListener(ITEM_SELECT, (event) => onSelect == null ? void 0 : onSelect(event), { once: true });
        dispatchDiscreteCustomEvent(menuItem, itemSelectEvent);
        if (itemSelectEvent.defaultPrevented) {
          isPointerDownRef.current = false;
        } else {
          rootContext.onClose();
        }
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuItemImpl,
      {
        ...itemProps,
        ref: composedRefs,
        disabled,
        onClick: composeEventHandlers(props.onClick, handleSelect),
        onPointerDown: (event) => {
          var _a;
          (_a = props.onPointerDown) == null ? void 0 : _a.call(props, event);
          isPointerDownRef.current = true;
        },
        onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
          var _a;
          if (!isPointerDownRef.current) (_a = event.currentTarget) == null ? void 0 : _a.click();
        }),
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          const isTypingAhead = contentContext.searchRef.current !== "";
          if (disabled || isTypingAhead && event.key === " ") return;
          if (SELECTION_KEYS.includes(event.key)) {
            event.currentTarget.click();
            event.preventDefault();
          }
        })
      }
    );
  }
);
MenuItem.displayName = ITEM_NAME$1;
var MenuItemImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, disabled = false, textValue, ...itemProps } = props;
    const contentContext = useMenuContentContext(ITEM_NAME$1, __scopeMenu);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenu);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const [isFocused, setIsFocused] = reactExports.useState(false);
    const [textContent, setTextContent] = reactExports.useState("");
    reactExports.useEffect(() => {
      const menuItem = ref.current;
      if (menuItem) {
        setTextContent((menuItem.textContent ?? "").trim());
      }
    }, [itemProps.children]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Collection.ItemSlot,
      {
        scope: __scopeMenu,
        disabled,
        textValue: textValue ?? textContent,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Item, { asChild: true, ...rovingFocusGroupScope, focusable: !disabled, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            role: "menuitem",
            "data-highlighted": isFocused ? "" : void 0,
            "aria-disabled": disabled || void 0,
            "data-disabled": disabled ? "" : void 0,
            ...itemProps,
            ref: composedRefs,
            onPointerMove: composeEventHandlers(
              props.onPointerMove,
              whenMouse((event) => {
                if (disabled) {
                  contentContext.onItemLeave(event);
                } else {
                  contentContext.onItemEnter(event);
                  if (!event.defaultPrevented) {
                    const item = event.currentTarget;
                    item.focus({ preventScroll: true });
                  }
                }
              })
            ),
            onPointerLeave: composeEventHandlers(
              props.onPointerLeave,
              whenMouse((event) => contentContext.onItemLeave(event))
            ),
            onFocus: composeEventHandlers(props.onFocus, () => setIsFocused(true)),
            onBlur: composeEventHandlers(props.onBlur, () => setIsFocused(false))
          }
        ) })
      }
    );
  }
);
var CHECKBOX_ITEM_NAME$1 = "MenuCheckboxItem";
var MenuCheckboxItem = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { checked = false, onCheckedChange, ...checkboxItemProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicatorProvider, { scope: props.__scopeMenu, checked, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuItem,
      {
        role: "menuitemcheckbox",
        "aria-checked": isIndeterminate(checked) ? "mixed" : checked,
        ...checkboxItemProps,
        ref: forwardedRef,
        "data-state": getCheckedState(checked),
        onSelect: composeEventHandlers(
          checkboxItemProps.onSelect,
          () => onCheckedChange == null ? void 0 : onCheckedChange(isIndeterminate(checked) ? true : !checked),
          { checkForDefaultPrevented: false }
        )
      }
    ) });
  }
);
MenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME$1;
var RADIO_GROUP_NAME$1 = "MenuRadioGroup";
var [RadioGroupProvider, useRadioGroupContext] = createMenuContext(
  RADIO_GROUP_NAME$1,
  { value: void 0, onValueChange: () => {
  } }
);
var MenuRadioGroup = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { value, onValueChange, ...groupProps } = props;
    const handleValueChange = useCallbackRef(onValueChange);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupProvider, { scope: props.__scopeMenu, value, onValueChange: handleValueChange, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MenuGroup, { ...groupProps, ref: forwardedRef }) });
  }
);
MenuRadioGroup.displayName = RADIO_GROUP_NAME$1;
var RADIO_ITEM_NAME$1 = "MenuRadioItem";
var MenuRadioItem = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { value, ...radioItemProps } = props;
    const context = useRadioGroupContext(RADIO_ITEM_NAME$1, props.__scopeMenu);
    const checked = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicatorProvider, { scope: props.__scopeMenu, checked, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuItem,
      {
        role: "menuitemradio",
        "aria-checked": checked,
        ...radioItemProps,
        ref: forwardedRef,
        "data-state": getCheckedState(checked),
        onSelect: composeEventHandlers(
          radioItemProps.onSelect,
          () => {
            var _a;
            return (_a = context.onValueChange) == null ? void 0 : _a.call(context, value);
          },
          { checkForDefaultPrevented: false }
        )
      }
    ) });
  }
);
MenuRadioItem.displayName = RADIO_ITEM_NAME$1;
var ITEM_INDICATOR_NAME = "MenuItemIndicator";
var [ItemIndicatorProvider, useItemIndicatorContext] = createMenuContext(
  ITEM_INDICATOR_NAME,
  { checked: false }
);
var MenuItemIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, forceMount, ...itemIndicatorProps } = props;
    const indicatorContext = useItemIndicatorContext(ITEM_INDICATOR_NAME, __scopeMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Presence,
      {
        present: forceMount || isIndeterminate(indicatorContext.checked) || indicatorContext.checked === true,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            ...itemIndicatorProps,
            ref: forwardedRef,
            "data-state": getCheckedState(indicatorContext.checked)
          }
        )
      }
    );
  }
);
MenuItemIndicator.displayName = ITEM_INDICATOR_NAME;
var SEPARATOR_NAME$1 = "MenuSeparator";
var MenuSeparator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, ...separatorProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        role: "separator",
        "aria-orientation": "horizontal",
        ...separatorProps,
        ref: forwardedRef
      }
    );
  }
);
MenuSeparator.displayName = SEPARATOR_NAME$1;
var ARROW_NAME$1 = "MenuArrow";
var MenuArrow = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, ...arrowProps } = props;
    const popperScope = usePopperScope(__scopeMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, { ...popperScope, ...arrowProps, ref: forwardedRef });
  }
);
MenuArrow.displayName = ARROW_NAME$1;
var SUB_NAME = "MenuSub";
var [MenuSubProvider, useMenuSubContext] = createMenuContext(SUB_NAME);
var SUB_TRIGGER_NAME$1 = "MenuSubTrigger";
var MenuSubTrigger = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useMenuContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
    const rootContext = useMenuRootContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
    const subContext = useMenuSubContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
    const contentContext = useMenuContentContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
    const openTimerRef = reactExports.useRef(null);
    const { pointerGraceTimerRef, onPointerGraceIntentChange } = contentContext;
    const scope = { __scopeMenu: props.__scopeMenu };
    const clearOpenTimer = reactExports.useCallback(() => {
      if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }, []);
    reactExports.useEffect(() => clearOpenTimer, [clearOpenTimer]);
    reactExports.useEffect(() => {
      const pointerGraceTimer = pointerGraceTimerRef.current;
      return () => {
        window.clearTimeout(pointerGraceTimer);
        onPointerGraceIntentChange(null);
      };
    }, [pointerGraceTimerRef, onPointerGraceIntentChange]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MenuAnchor, { asChild: true, ...scope, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuItemImpl,
      {
        id: subContext.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": context.open,
        "aria-controls": subContext.contentId,
        "data-state": getOpenState(context.open),
        ...props,
        ref: composeRefs(forwardedRef, subContext.onTriggerChange),
        onClick: (event) => {
          var _a;
          (_a = props.onClick) == null ? void 0 : _a.call(props, event);
          if (props.disabled || event.defaultPrevented) return;
          event.currentTarget.focus();
          if (!context.open) context.onOpenChange(true);
        },
        onPointerMove: composeEventHandlers(
          props.onPointerMove,
          whenMouse((event) => {
            contentContext.onItemEnter(event);
            if (event.defaultPrevented) return;
            if (!props.disabled && !context.open && !openTimerRef.current) {
              contentContext.onPointerGraceIntentChange(null);
              openTimerRef.current = window.setTimeout(() => {
                context.onOpenChange(true);
                clearOpenTimer();
              }, 100);
            }
          })
        ),
        onPointerLeave: composeEventHandlers(
          props.onPointerLeave,
          whenMouse((event) => {
            var _a, _b;
            clearOpenTimer();
            const contentRect = (_a = context.content) == null ? void 0 : _a.getBoundingClientRect();
            if (contentRect) {
              const side = (_b = context.content) == null ? void 0 : _b.dataset.side;
              const rightSide = side === "right";
              const bleed = rightSide ? -5 : 5;
              const contentNearEdge = contentRect[rightSide ? "left" : "right"];
              const contentFarEdge = contentRect[rightSide ? "right" : "left"];
              contentContext.onPointerGraceIntentChange({
                area: [
                  // Apply a bleed on clientX to ensure that our exit point is
                  // consistently within polygon bounds
                  { x: event.clientX + bleed, y: event.clientY },
                  { x: contentNearEdge, y: contentRect.top },
                  { x: contentFarEdge, y: contentRect.top },
                  { x: contentFarEdge, y: contentRect.bottom },
                  { x: contentNearEdge, y: contentRect.bottom }
                ],
                side
              });
              window.clearTimeout(pointerGraceTimerRef.current);
              pointerGraceTimerRef.current = window.setTimeout(
                () => contentContext.onPointerGraceIntentChange(null),
                300
              );
            } else {
              contentContext.onTriggerLeave(event);
              if (event.defaultPrevented) return;
              contentContext.onPointerGraceIntentChange(null);
            }
          })
        ),
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          var _a;
          const isTypingAhead = contentContext.searchRef.current !== "";
          if (props.disabled || isTypingAhead && event.key === " ") return;
          if (SUB_OPEN_KEYS[rootContext.dir].includes(event.key)) {
            context.onOpenChange(true);
            (_a = context.content) == null ? void 0 : _a.focus();
            event.preventDefault();
          }
        })
      }
    ) });
  }
);
MenuSubTrigger.displayName = SUB_TRIGGER_NAME$1;
var SUB_CONTENT_NAME$1 = "MenuSubContent";
var MenuSubContent = reactExports.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME$1, props.__scopeMenu);
    const { forceMount = portalContext.forceMount, ...subContentProps } = props;
    const context = useMenuContext(CONTENT_NAME$1, props.__scopeMenu);
    const rootContext = useMenuRootContext(CONTENT_NAME$1, props.__scopeMenu);
    const subContext = useMenuSubContext(SUB_CONTENT_NAME$1, props.__scopeMenu);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeMenu, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeMenu, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuContentImpl,
      {
        id: subContext.contentId,
        "aria-labelledby": subContext.triggerId,
        ...subContentProps,
        ref: composedRefs,
        align: "start",
        side: rootContext.dir === "rtl" ? "left" : "right",
        disableOutsidePointerEvents: false,
        disableOutsideScroll: false,
        trapFocus: false,
        onOpenAutoFocus: (event) => {
          var _a;
          if (rootContext.isUsingKeyboardRef.current) (_a = ref.current) == null ? void 0 : _a.focus();
          event.preventDefault();
        },
        onCloseAutoFocus: (event) => event.preventDefault(),
        onFocusOutside: composeEventHandlers(props.onFocusOutside, (event) => {
          if (event.target !== subContext.trigger) context.onOpenChange(false);
        }),
        onEscapeKeyDown: composeEventHandlers(props.onEscapeKeyDown, (event) => {
          rootContext.onClose();
          event.preventDefault();
        }),
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          var _a;
          const isKeyDownInside = event.currentTarget.contains(event.target);
          const isCloseKey = SUB_CLOSE_KEYS[rootContext.dir].includes(event.key);
          if (isKeyDownInside && isCloseKey) {
            context.onOpenChange(false);
            (_a = subContext.trigger) == null ? void 0 : _a.focus();
            event.preventDefault();
          }
        })
      }
    ) }) }) });
  }
);
MenuSubContent.displayName = SUB_CONTENT_NAME$1;
function getOpenState(open) {
  return open ? "open" : "closed";
}
function isIndeterminate(checked) {
  return checked === "indeterminate";
}
function getCheckedState(checked) {
  return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}
function focusFirst(candidates) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidate of candidates) {
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus();
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}
function wrapArray(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
function getNextMatch(values, search, currentMatch) {
  const isRepeated = search.length > 1 && Array.from(search).every((char) => char === search[0]);
  const normalizedSearch = isRepeated ? search[0] : search;
  const currentMatchIndex = currentMatch ? values.indexOf(currentMatch) : -1;
  let wrappedValues = wrapArray(values, Math.max(currentMatchIndex, 0));
  const excludeCurrentMatch = normalizedSearch.length === 1;
  if (excludeCurrentMatch) wrappedValues = wrappedValues.filter((v) => v !== currentMatch);
  const nextMatch = wrappedValues.find(
    (value) => value.toLowerCase().startsWith(normalizedSearch.toLowerCase())
  );
  return nextMatch !== currentMatch ? nextMatch : void 0;
}
function isPointInPolygon(point, polygon) {
  const { x, y } = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const ii = polygon[i];
    const jj = polygon[j];
    const xi = ii.x;
    const yi = ii.y;
    const xj = jj.x;
    const yj = jj.y;
    const intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
function isPointerInGraceArea(event, area) {
  if (!area) return false;
  const cursorPos = { x: event.clientX, y: event.clientY };
  return isPointInPolygon(cursorPos, area);
}
function whenMouse(handler) {
  return (event) => event.pointerType === "mouse" ? handler(event) : void 0;
}
var Root3 = Menu;
var Anchor2 = MenuAnchor;
var Portal = MenuPortal;
var Content2$1 = MenuContent;
var Group = MenuGroup;
var Label = MenuLabel;
var Item2$1 = MenuItem;
var CheckboxItem = MenuCheckboxItem;
var RadioGroup = MenuRadioGroup;
var RadioItem = MenuRadioItem;
var ItemIndicator = MenuItemIndicator;
var Separator = MenuSeparator;
var Arrow2 = MenuArrow;
var SubTrigger = MenuSubTrigger;
var SubContent = MenuSubContent;
var CONTEXT_MENU_NAME = "ContextMenu";
var [createContextMenuContext] = createContextScope(CONTEXT_MENU_NAME, [
  createMenuScope
]);
var useMenuScope = createMenuScope();
var [ContextMenuProvider, useContextMenuContext] = createContextMenuContext(CONTEXT_MENU_NAME);
var ContextMenu$1 = (props) => {
  const { __scopeContextMenu, children, onOpenChange, dir, modal = true } = props;
  const [open, setOpen] = reactExports.useState(false);
  const menuScope = useMenuScope(__scopeContextMenu);
  const handleOpenChangeProp = useCallbackRef(onOpenChange);
  const handleOpenChange = reactExports.useCallback(
    (open2) => {
      setOpen(open2);
      handleOpenChangeProp(open2);
    },
    [handleOpenChangeProp]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ContextMenuProvider,
    {
      scope: __scopeContextMenu,
      open,
      onOpenChange: handleOpenChange,
      modal,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Root3,
        {
          ...menuScope,
          dir,
          open,
          onOpenChange: handleOpenChange,
          modal,
          children
        }
      )
    }
  );
};
ContextMenu$1.displayName = CONTEXT_MENU_NAME;
var TRIGGER_NAME = "ContextMenuTrigger";
var ContextMenuTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeContextMenu, disabled = false, ...triggerProps } = props;
    const context = useContextMenuContext(TRIGGER_NAME, __scopeContextMenu);
    const menuScope = useMenuScope(__scopeContextMenu);
    const pointRef = reactExports.useRef({ x: 0, y: 0 });
    const virtualRef = reactExports.useRef({
      getBoundingClientRect: () => DOMRect.fromRect({ width: 0, height: 0, ...pointRef.current })
    });
    const longPressTimerRef = reactExports.useRef(0);
    const clearLongPress = reactExports.useCallback(
      () => window.clearTimeout(longPressTimerRef.current),
      []
    );
    const handleOpen = (event) => {
      pointRef.current = { x: event.clientX, y: event.clientY };
      context.onOpenChange(true);
    };
    reactExports.useEffect(() => clearLongPress, [clearLongPress]);
    reactExports.useEffect(() => void (disabled && clearLongPress()), [disabled, clearLongPress]);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Anchor2, { ...menuScope, virtualRef }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.span,
        {
          "data-state": context.open ? "open" : "closed",
          "data-disabled": disabled ? "" : void 0,
          ...triggerProps,
          ref: forwardedRef,
          style: { WebkitTouchCallout: "none", ...props.style },
          onContextMenu: disabled ? props.onContextMenu : composeEventHandlers(props.onContextMenu, (event) => {
            clearLongPress();
            handleOpen(event);
            event.preventDefault();
          }),
          onPointerDown: disabled ? props.onPointerDown : composeEventHandlers(
            props.onPointerDown,
            whenTouchOrPen((event) => {
              clearLongPress();
              longPressTimerRef.current = window.setTimeout(() => handleOpen(event), 700);
            })
          ),
          onPointerMove: disabled ? props.onPointerMove : composeEventHandlers(props.onPointerMove, whenTouchOrPen(clearLongPress)),
          onPointerCancel: disabled ? props.onPointerCancel : composeEventHandlers(props.onPointerCancel, whenTouchOrPen(clearLongPress)),
          onPointerUp: disabled ? props.onPointerUp : composeEventHandlers(props.onPointerUp, whenTouchOrPen(clearLongPress))
        }
      )
    ] });
  }
);
ContextMenuTrigger$1.displayName = TRIGGER_NAME;
var PORTAL_NAME = "ContextMenuPortal";
var ContextMenuPortal = (props) => {
  const { __scopeContextMenu, ...portalProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { ...menuScope, ...portalProps });
};
ContextMenuPortal.displayName = PORTAL_NAME;
var CONTENT_NAME = "ContextMenuContent";
var ContextMenuContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeContextMenu, ...contentProps } = props;
    const context = useContextMenuContext(CONTENT_NAME, __scopeContextMenu);
    const menuScope = useMenuScope(__scopeContextMenu);
    const hasInteractedOutsideRef = reactExports.useRef(false);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Content2$1,
      {
        ...menuScope,
        ...contentProps,
        ref: forwardedRef,
        side: "right",
        sideOffset: 2,
        align: "start",
        onCloseAutoFocus: (event) => {
          var _a;
          (_a = props.onCloseAutoFocus) == null ? void 0 : _a.call(props, event);
          if (!event.defaultPrevented && hasInteractedOutsideRef.current) {
            event.preventDefault();
          }
          hasInteractedOutsideRef.current = false;
        },
        onInteractOutside: (event) => {
          var _a;
          (_a = props.onInteractOutside) == null ? void 0 : _a.call(props, event);
          if (!event.defaultPrevented && !context.modal) hasInteractedOutsideRef.current = true;
        },
        style: {
          ...props.style,
          // re-namespace exposed content custom properties
          ...{
            "--radix-context-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
            "--radix-context-menu-content-available-width": "var(--radix-popper-available-width)",
            "--radix-context-menu-content-available-height": "var(--radix-popper-available-height)",
            "--radix-context-menu-trigger-width": "var(--radix-popper-anchor-width)",
            "--radix-context-menu-trigger-height": "var(--radix-popper-anchor-height)"
          }
        }
      }
    );
  }
);
ContextMenuContent$1.displayName = CONTENT_NAME;
var GROUP_NAME = "ContextMenuGroup";
var ContextMenuGroup = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeContextMenu, ...groupProps } = props;
    const menuScope = useMenuScope(__scopeContextMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Group, { ...menuScope, ...groupProps, ref: forwardedRef });
  }
);
ContextMenuGroup.displayName = GROUP_NAME;
var LABEL_NAME = "ContextMenuLabel";
var ContextMenuLabel = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeContextMenu, ...labelProps } = props;
    const menuScope = useMenuScope(__scopeContextMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { ...menuScope, ...labelProps, ref: forwardedRef });
  }
);
ContextMenuLabel.displayName = LABEL_NAME;
var ITEM_NAME = "ContextMenuItem";
var ContextMenuItem$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeContextMenu, ...itemProps } = props;
    const menuScope = useMenuScope(__scopeContextMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Item2$1, { ...menuScope, ...itemProps, ref: forwardedRef });
  }
);
ContextMenuItem$1.displayName = ITEM_NAME;
var CHECKBOX_ITEM_NAME = "ContextMenuCheckboxItem";
var ContextMenuCheckboxItem = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeContextMenu, ...checkboxItemProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CheckboxItem, { ...menuScope, ...checkboxItemProps, ref: forwardedRef });
});
ContextMenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME;
var RADIO_GROUP_NAME = "ContextMenuRadioGroup";
var ContextMenuRadioGroup = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeContextMenu, ...radioGroupProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroup, { ...menuScope, ...radioGroupProps, ref: forwardedRef });
});
ContextMenuRadioGroup.displayName = RADIO_GROUP_NAME;
var RADIO_ITEM_NAME = "ContextMenuRadioItem";
var ContextMenuRadioItem = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeContextMenu, ...radioItemProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RadioItem, { ...menuScope, ...radioItemProps, ref: forwardedRef });
});
ContextMenuRadioItem.displayName = RADIO_ITEM_NAME;
var INDICATOR_NAME = "ContextMenuItemIndicator";
var ContextMenuItemIndicator = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeContextMenu, ...itemIndicatorProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator, { ...menuScope, ...itemIndicatorProps, ref: forwardedRef });
});
ContextMenuItemIndicator.displayName = INDICATOR_NAME;
var SEPARATOR_NAME = "ContextMenuSeparator";
var ContextMenuSeparator = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeContextMenu, ...separatorProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { ...menuScope, ...separatorProps, ref: forwardedRef });
});
ContextMenuSeparator.displayName = SEPARATOR_NAME;
var ARROW_NAME = "ContextMenuArrow";
var ContextMenuArrow = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeContextMenu, ...arrowProps } = props;
    const menuScope = useMenuScope(__scopeContextMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow2, { ...menuScope, ...arrowProps, ref: forwardedRef });
  }
);
ContextMenuArrow.displayName = ARROW_NAME;
var SUB_TRIGGER_NAME = "ContextMenuSubTrigger";
var ContextMenuSubTrigger = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeContextMenu, ...triggerItemProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SubTrigger, { ...menuScope, ...triggerItemProps, ref: forwardedRef });
});
ContextMenuSubTrigger.displayName = SUB_TRIGGER_NAME;
var SUB_CONTENT_NAME = "ContextMenuSubContent";
var ContextMenuSubContent = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeContextMenu, ...subContentProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SubContent,
    {
      ...menuScope,
      ...subContentProps,
      ref: forwardedRef,
      style: {
        ...props.style,
        // re-namespace exposed content custom properties
        ...{
          "--radix-context-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
          "--radix-context-menu-content-available-width": "var(--radix-popper-available-width)",
          "--radix-context-menu-content-available-height": "var(--radix-popper-available-height)",
          "--radix-context-menu-trigger-width": "var(--radix-popper-anchor-width)",
          "--radix-context-menu-trigger-height": "var(--radix-popper-anchor-height)"
        }
      }
    }
  );
});
ContextMenuSubContent.displayName = SUB_CONTENT_NAME;
function whenTouchOrPen(handler) {
  return (event) => event.pointerType !== "mouse" ? handler(event) : void 0;
}
var Root2 = ContextMenu$1;
var Trigger = ContextMenuTrigger$1;
var Portal2 = ContextMenuPortal;
var Content2 = ContextMenuContent$1;
var Item2 = ContextMenuItem$1;
function ContextMenu({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { "data-slot": "context-menu", ...props });
}
function ContextMenuTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Trigger, { "data-slot": "context-menu-trigger", ...props });
}
function ContextMenuContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content2,
    {
      "data-slot": "context-menu-content",
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-context-menu-content-available-height) min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
        className
      ),
      ...props
    }
  ) });
}
function ContextMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Item2,
    {
      "data-slot": "context-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
const processDescription = (description) => {
  if (!description) return "";
  const brHeight = "2px";
  const brMargin = "2px 0";
  let processed = description;
  processed = processed.replace(
    /<a class=\"faqlink\" href=\"([^\"]+)\"[^>]*>([^<]+)<\/a>/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #fbbf24; text-decoration: underline;">$2</a>'
  );
  processed = processed.replace(
    /<span style="color: Blue;[^"]*">\s*<font size="5">\s*([^<]+)\s*<\/font>\s*<\/span>/g,
    '<span style="color: #fbbf24; word-break: break-word;"><font size="5">$1</font></span>'
  );
  processed = processed.replace(
    /<span style="color: ([^;"]+);([^"]*)"([^>]*)>/g,
    (match, color, otherStyles, otherAttrs) => {
      const newColor = color.toLowerCase() === "blue" ? "#fbbf24" : color;
      return `<span style="color: ${newColor};${otherStyles}"${otherAttrs}>`;
    }
  );
  processed = processed.replace(
    /<fieldset><legend>\s*([^<]+)\s*<\/legend>/g,
    '<fieldset style="border: 2px solid rgba(245, 158, 11, 0.3); border-radius: 0.5rem; padding: 1rem; background-color: rgba(245, 158, 11, 0.05); margin: 1rem 0; color: #d1d5db;"><legend style="color: #fbbf24; padding: 0 0.5rem;">$1</legend>'
  );
  processed = processed.replace(
    /<p>([^<]+)<\/p>/g,
    '<p style="margin: 0.5rem 0; line-height: 1.6;">$1</p>'
  );
  processed = processed.replace(/<br\s*\/?>/g, `<div class="custom-br" style="height: ${brHeight}; margin: ${brMargin};"></div>`);
  return processed;
};
const FileListItem = ({ item, depth = 0 }) => {
  var _a;
  const [isOpen, setIsOpen] = reactExports.useState(false);
  if (item.type === "folder") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-2 py-2 px-3 hover:bg-gray-800 cursor-pointer",
          style: { paddingLeft: `${depth * 20 + 12}px` },
          onClick: () => setIsOpen(!isOpen),
          children: [
            isOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4 text-gray-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-4 h-4 text-gray-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "w-4 h-4 text-amber-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: item.name })
          ]
        }
      ),
      isOpen && ((_a = item.children) == null ? void 0 : _a.map((child, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(FileListItem, { item: child, depth: depth + 1 }, index)))
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center justify-between py-2 px-3 hover:bg-gray-800",
      style: { paddingLeft: `${depth * 20 + 12}px` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(File, { className: "w-4 h-4 text-gray-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: item.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400 text-sm", children: item.size })
      ]
    }
  );
};
function TorrentDetailPage({ torrentId }) {
  const { downloadByTorrentId } = useTorrentDownload();
  const { id } = useParams();
  const effectiveId = torrentId ?? id;
  const [isDescExpanded, setIsDescExpanded] = reactExports.useState(true);
  const [isMediaInfoExpanded, setIsMediaInfoExpanded] = reactExports.useState(false);
  const [isFilesExpanded, setIsFilesExpanded] = reactExports.useState(false);
  const [activeTab, setActiveTab] = reactExports.useState("info");
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [torrentData, setTorrentData] = reactExports.useState({
    id: 0,
    title: "",
    subTitle: "",
    category: "",
    videoCodec: "",
    standard: "",
    audioCodec: "",
    medium: "",
    productionTeam: "",
    size: "",
    uploadDate: "",
    seeders: 0,
    leechers: 0,
    completed: 0,
    comments: 0,
    thanks: 0,
    rating: 0,
    imdb: "",
    douban: "",
    uploader: "",
    uploaderLevel: "",
    isFree: false,
    promotionEnd: "",
    views: 0,
    description: "",
    downloadUrl: ""
  });
  const [descriptionData, setDescriptionData] = reactExports.useState({
    SourceInfo: [],
    MovieInfo: {},
    Synopsis: ""
  });
  const [fileList, setFileList] = reactExports.useState([]);
  const [comments, setComments] = reactExports.useState([]);
  const [relatedTorrents, setRelatedTorrents] = reactExports.useState([]);
  const [mediaInfo, setMediaInfo] = reactExports.useState("");
  const [stills, setStills] = reactExports.useState([]);
  const preloadRefs = reactExports.useRef([]);
  const [carouselApi, setCarouselApi] = reactExports.useState(null);
  const [lightboxOpen, setLightboxOpen] = reactExports.useState(false);
  const [lightboxIndex, setLightboxIndex] = reactExports.useState(0);
  const [lightboxApi, setLightboxApi] = reactExports.useState(null);
  const imgRefs = reactExports.useRef([]);
  reactExports.useEffect(() => {
    if (!carouselApi) return;
    if (!Array.isArray(stills) || stills.length <= 1) return;
    const id2 = setInterval(() => {
      carouselApi == null ? void 0 : carouselApi.scrollNext();
    }, 3e3);
    return () => clearInterval(id2);
  }, [carouselApi, stills]);
  reactExports.useEffect(() => {
    if (!lightboxApi) return;
    lightboxApi.scrollTo(lightboxIndex);
  }, [lightboxApi, lightboxIndex]);
  reactExports.useEffect(() => {
    let cancelled = false;
    const num = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    };
    const str = (v) => String(v ?? "");
    const load = async () => {
      if (!effectiveId) return;
      try {
        setLoading(true);
        setError(null);
        const resp = await TorrentsService.torrentsControllerGet({ id: String(effectiveId) });
        const body = (resp == null ? void 0 : resp.code) !== void 0 ? resp : resp == null ? void 0 : resp.data;
        const data = (body == null ? void 0 : body.data) ?? body;
        const mapped = {
          id: data == null ? void 0 : data.id,
          title: str(data == null ? void 0 : data.title),
          subTitle: str(data == null ? void 0 : data.subTitle),
          category: str(data == null ? void 0 : data.category),
          videoCodec: str(data == null ? void 0 : data.videoCodec),
          standard: str(data == null ? void 0 : data.standard),
          audioCodec: str(data == null ? void 0 : data.audioCodec),
          medium: str(data == null ? void 0 : data.source),
          productionTeam: str(data == null ? void 0 : data.productionTeam),
          size: str(data == null ? void 0 : data.size),
          uploadDate: str(data == null ? void 0 : data.uploadDate),
          seeders: num(data == null ? void 0 : data.seeders),
          leechers: num(data == null ? void 0 : data.leechers),
          completed: num(data == null ? void 0 : data.completed),
          comments: num(data == null ? void 0 : data.comments),
          thanks: num(data == null ? void 0 : data.thanks),
          rating: num(data == null ? void 0 : data.rating),
          imdb: str(data == null ? void 0 : data.imdb),
          douban: str(data == null ? void 0 : data.douban),
          uploader: str(data == null ? void 0 : data.uploader),
          uploaderLevel: str(data == null ? void 0 : data.uploaderLevel),
          isFree: Boolean(data == null ? void 0 : data.isFree),
          promotionEnd: str(data == null ? void 0 : data.promotionEnd),
          views: num(data == null ? void 0 : data.views),
          description: str(data == null ? void 0 : data.description),
          // 字段重命名兼容：后端可能将 downloadUrl 重命名为 downloadURL / download_link / download
          // 这里进行多键回退以确保下载按钮可用
          downloadUrl: str(
            (data == null ? void 0 : data.downloadUrl) ?? (data == null ? void 0 : data.downloadURL) ?? (data == null ? void 0 : data.download_link) ?? (data == null ? void 0 : data.download)
          )
        };
        if (!cancelled) setTorrentData(mapped);
        const files = Array.isArray(data == null ? void 0 : data.fileList) ? data.fileList.map((f) => ({ name: str(f == null ? void 0 : f.name), size: str(f == null ? void 0 : f.size), type: "file" })) : fileList;
        if (!cancelled) setFileList(files);
        const mi = str((data == null ? void 0 : data.mediaInfo) ?? mediaInfo);
        if (!cancelled) setMediaInfo(mi);
        const cmts = Array.isArray(data == null ? void 0 : data.comments) ? data.comments.map((c, i) => ({
          id: (c == null ? void 0 : c.id) ?? i,
          user: str((c == null ? void 0 : c.user) ?? (c == null ? void 0 : c.username) ?? ""),
          userLevel: str((c == null ? void 0 : c.userLevel) ?? ""),
          avatar: str((c == null ? void 0 : c.avatar) ?? ""),
          date: str((c == null ? void 0 : c.date) ?? ""),
          content: str((c == null ? void 0 : c.content) ?? ""),
          thanks: num((c == null ? void 0 : c.thanks) ?? 0)
        })) : comments;
        if (!cancelled) setComments(cmts);
        const rel = Array.isArray(data == null ? void 0 : data.relatedTorrents) ? data.relatedTorrents.map((t) => ({
          id: t == null ? void 0 : t.id,
          title: str((t == null ? void 0 : t.title) ?? ""),
          size: str((t == null ? void 0 : t.size) ?? ""),
          seeders: num((t == null ? void 0 : t.seeders) ?? 0),
          leechers: num((t == null ? void 0 : t.leechers) ?? 0),
          isFree: Boolean((t == null ? void 0 : t.isFree) ?? false)
        })) : relatedTorrents;
        if (!cancelled) setRelatedTorrents(rel);
        const stillsData = Array.isArray(data == null ? void 0 : data.stills) ? data.stills.map((s) => str(s)) : [];
        if (!cancelled) setStills(stillsData);
      } catch (e) {
        if (!cancelled) setError(String((e == null ? void 0 : e.message) ?? ""));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [effectiveId]);
  reactExports.useEffect(() => {
    if (!Array.isArray(stills) || stills.length === 0) return;
    const arr = [];
    for (const url of stills) {
      const img = new Image();
      img.referrerPolicy = "no-referrer";
      img.src = url;
      if (typeof img.decode === "function") {
        img.decode().catch(() => {
        });
      }
      arr.push(img);
    }
    preloadRefs.current = arr;
  }, [stills]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ContextMenu, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ContextMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-[#0F171E] pt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-4 md:px-8 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-white text-2xl md:text-3xl mb-2", children: torrentData.title }),
          torrentData.subTitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-lg", children: torrentData.subTitle }),
          loading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 text-sm", children: "加载中..." }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-500 text-sm", children: error })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-amber-600 text-white", children: torrentData.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-orange-600 text-white", children: torrentData.standard }),
          torrentData.isFree && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-green-500 text-white", children: "FREE" }),
          Number.isFinite(torrentData.rating) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-yellow-400 ml-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-4 h-4 fill-yellow-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: torrentData.rating })
          ] }),
          torrentData.isFree && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-2 flex items-center gap-1 text-green-400 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-3 h-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "限时免费至 ",
              torrentData.promotionEnd
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-200", children: "分类" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-200", children: torrentData.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600", children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-200", children: "媒介" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-200", children: torrentData.medium }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600", children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-200", children: "编码" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-200", children: torrentData.videoCodec }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600", children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-200", children: "分辨率" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-200", children: torrentData.standard }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600", children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-200", children: "音频" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-200", children: torrentData.audioCodec }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600", children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-200", children: "制作组" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-200", children: torrentData.productionTeam }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600", children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-200", children: "大小" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-200", children: formatSize(torrentData.size) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600", children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-200", children: "发布时间" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-200", children: torrentData.uploadDate }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600", children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-200", children: "发布者" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-200", children: torrentData.uploader }),
          torrentData.uploaderLevel && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-1 bg-orange-500 text-white text-xs", children: torrentData.uploaderLevel }),
          torrentData.imdb && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600", children: "|" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: `https://www.imdb.com/title/${torrentData.imdb}/`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-amber-400 hover:underline",
                children: [
                  "IMDb: ",
                  torrentData.imdb
                ]
              }
            )
          ] }),
          torrentData.douban && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600", children: "|" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: `https://movie.douban.com/subject/${torrentData.douban}/`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-amber-400 hover:underline",
                children: [
                  "豆瓣: ",
                  torrentData.douban
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "bg-amber-600 hover:bg-amber-700 text-white h-9",
              onClick: () => downloadByTorrentId(String(torrentData.id), String(torrentData.title || "download")),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 mr-1" }),
                "下载种子"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { className: "w-4 h-4 mr-1" }),
                "收藏"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-4 h-4 mr-1" }),
                "分享"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "w-4 h-4 mr-1" }),
                "举报"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator$1, { orientation: "vertical", className: "h-6 bg-gray-700 mx-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4 text-green-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400", children: torrentData.seeders })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 text-red-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400", children: torrentData.leechers })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserRoundCheck, { className: "w-4 h-4 text-gray-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: torrentData.completed })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "bg-gray-800/50 px-4 py-3 border-b border-gray-700 flex items-center justify-between cursor-pointer",
                onClick: () => setIsDescExpanded(!isDescExpanded),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-white", children: "简介" }),
                  isDescExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-5 h-5 text-gray-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-5 h-5 text-gray-400" })
                ]
              }
            ),
            isDescExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: torrentData.description ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "space-y-4 text-gray-300 leading-relaxed description-content",
                dangerouslySetInnerHTML: {
                  __html: processDescription(torrentData.description)
                }
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 text-gray-300 leading-relaxed", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "border-2 border-amber-500/30 rounded p-4 bg-amber-500/5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "text-amber-400 px-2", children: "引用" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-amber-400 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: "暂无简介信息" }) })
            ] }) }) })
          ] }),
          Array.isArray(stills) && stills.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 border-b border-gray-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-white", children: "剧照" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: stills.map((url, index) => {
              const isActive = lightboxOpen && lightboxIndex === index;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: isActive ? "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] w-full h-full" : "relative aspect-video rounded-lg overflow-hidden group cursor-pointer",
                  onClick: () => {
                    const i = preloadRefs.current[index];
                    if (i && typeof i.decode === "function") {
                      i.decode().catch(() => {
                      });
                    }
                    setLightboxIndex(index);
                    setLightboxOpen(true);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ImageWithFallback,
                      {
                        src: url,
                        alt: `剧照 ${index + 1}`,
                        ref: (el) => {
                          imgRefs.current[index] = el;
                        },
                        className: isActive ? "w-full h-full object-contain" : "w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      }
                    ),
                    isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        className: "absolute top-4 right-4 bg-gray-900/70 border border-gray-600 text-white hover:bg-gray-800 w-6 h-6 rounded-md flex items-center justify-center",
                        onClick: (e) => {
                          e.stopPropagation();
                          setLightboxOpen(false);
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" })
                      }
                    )
                  ]
                },
                index
              );
            }) }) })
          ] }),
          lightboxOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/95 z-[900]", onClick: () => setLightboxOpen(false) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "bg-gray-800/50 px-4 py-3 border-b border-gray-700 flex items-center justify-between cursor-pointer",
                onClick: () => setIsMediaInfoExpanded(!isMediaInfoExpanded),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-white", children: "MediaInfo" }),
                  isMediaInfoExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-5 h-5 text-gray-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-5 h-5 text-gray-400" })
                ]
              }
            ),
            isMediaInfoExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "text-xs text-gray-300 font-mono overflow-x-auto bg-gray-950 p-4 rounded", children: mediaInfo }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "bg-gray-800/50 px-4 py-3 border-b border-gray-700 flex items-center justify-between cursor-pointer",
                onClick: () => setIsFilesExpanded(!isFilesExpanded),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-white", children: "文件列表" }),
                  isFilesExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-5 h-5 text-gray-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-5 h-5 text-gray-400" })
                ]
              }
            ),
            isFilesExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-gray-800", children: fileList.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(FileListItem, { item }, index)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-800/50 px-4 py-3 border-b border-gray-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-white", children: [
              "评论 (",
              comments.length,
              ")"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    rows: 4,
                    placeholder: "发表你的看法...",
                    className: "w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-3 text-white placeholder:text-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none resize-none"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "bg-amber-600 hover:bg-amber-700 text-white", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-4 h-4 mr-2" }),
                  "发表评论"
                ] }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: comments.map((comment) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ImageWithFallback,
                  {
                    src: comment.avatar,
                    alt: comment.user,
                    className: "w-10 h-10 rounded-full"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: comment.user }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-purple-500 text-white text-xs", children: comment.userLevel }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 text-sm", children: comment.date })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300 mb-3", children: comment.content }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "flex items-center gap-1 text-gray-400 hover:text-amber-400", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ThumbsUp, { className: "w-4 h-4" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "赞" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "flex items-center gap-1 text-gray-400 hover:text-gray-300", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-4 h-4" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "回复" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-gray-400", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-4 h-4 text-red-400" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        comment.thanks,
                        " 感谢"
                      ] })
                    ] })
                  ] })
                ] })
              ] }, comment.id)) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-800/50 px-4 py-3 border-b border-gray-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white", children: "种子信息" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("table", { className: "w-full text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-800", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-gray-400", children: "分类" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-white", children: torrentData.category })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-800", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-gray-400", children: "媒介" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-white", children: torrentData.medium })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-800", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-gray-400", children: "编码" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-white", children: torrentData.videoCodec })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-800", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-gray-400", children: "分辨率" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-white", children: torrentData.standard })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-800", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-gray-400", children: "音频" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-white", children: torrentData.audioCodec })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-800", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-gray-400", children: "制作组" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-white", children: torrentData.productionTeam })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-800", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-gray-400", children: "大小" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-white", children: formatSize(torrentData.size) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-800", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-gray-400", children: "发布时间" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-white text-xs", children: torrentData.uploadDate })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-800", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-gray-400", children: "发布者" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: torrentData.uploader }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-2 bg-orange-500 text-white text-xs", children: torrentData.uploaderLevel })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-800", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-gray-400", children: "IMDb" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: `https://www.imdb.com/title/${torrentData.imdb}/`,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "text-amber-400 hover:underline text-xs",
                    children: torrentData.imdb
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-gray-400", children: "豆瓣" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: `https://movie.douban.com/subject/${torrentData.douban}/`,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "text-amber-400 hover:underline text-xs",
                    children: torrentData.douban
                  }
                ) })
              ] })
            ] }) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-800/50 px-4 py-3 border-b border-gray-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white", children: "相关种子" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-4", children: relatedTorrents.map((torrent) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-gray-800 rounded-lg p-3 hover:border-gray-700 transition-colors cursor-pointer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-white text-sm mb-2 line-clamp-2", children: torrent.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400", children: torrent.size }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400", children: torrent.seeders }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "/" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400", children: torrent.leechers })
                ] })
              ] })
            ] }, torrent.id)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-900/50 rounded-lg border border-gray-800 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full border-gray-700 text-white hover:bg-gray-800 justify-start", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-4 h-4 mr-2" }),
              "感谢发布者"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full border-gray-700 text-white hover:bg-gray-800 justify-start", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { className: "w-4 h-4 mr-2" }),
              "收藏种子"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full border-gray-700 text-white hover:bg-gray-800 justify-start", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "w-4 h-4 mr-2" }),
              "举报问题"
            ] })
          ] }) })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ContextMenuContent, { className: "w-48", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      ContextMenuItem,
      {
        disabled: !torrentData.id,
        onSelect: (e) => {
          e.preventDefault();
          if (torrentData.id) {
            downloadByTorrentId(String(torrentData.id), String(torrentData.title || "download"));
          }
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 mr-2" }),
          " 下载种子"
        ]
      }
    ) })
  ] });
}
export {
  TorrentDetailPage as default
};
//# sourceMappingURL=index-DxjNMdEv.js.map
