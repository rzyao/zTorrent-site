export const scrollToPost = (targetId: string) => {
  // 纠正：我们需要找到带有 data-post-db-id="${targetId}" 的元素。
  // 我们已经在 Post 组件渲染时添加了这个属性。
  const targetElement = document.querySelector(`[data-post-db-id="${targetId}"]`);

  if (targetElement) {
    targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
    targetElement.classList.add("ring-2", "ring-blue-500", "transition-all", "duration-500");
    setTimeout(() => {
      targetElement.classList.remove("ring-2", "ring-blue-500");
    }, 2000);
  } else {
    // 以后可以处理未加载的情况
    console.warn(`Post ${targetId} not found in current view.`);
  }
};
