/**
 * useAsyncAction Hook 使用示例
 *
 * 这个文件展示了如何在不同场景下使用 useAsyncAction Hook
 */

import { useAsyncAction } from "@/hooks/useAsyncAction";
import { UsersService } from "@/api/services/UsersService";

// ============================================
// 示例 1: 基础用法 - 保存用户偏好
// ============================================
export function Example1_BasicUsage() {
  const { execute, loading } = useAsyncAction({
    successMessage: "保存成功",
    loadingMessage: "正在保存...",
  });

  const handleSave = async () => {
    await execute(async () => {
      const UsersServiceInstance = await UsersService;
      await UsersServiceInstance.usersPreferencesControllerSave({
        showAdult: true,
        defaultTorrentCategories: ["Movie", "TV Series"],
      });
    });
  };

  return (
    <button onClick={handleSave} disabled={loading}>
      {loading ? "保存中..." : "保存设置"}
    </button>
  );
}

// ============================================
// 示例 2: 自定义错误处理
// ============================================
export function Example2_CustomErrorHandling() {
  const { execute } = useAsyncAction({
    successMessage: "删除成功",
    errorMessage: "删除失败，请稍后重试", // 自定义错误消息
    onSuccess: () => {
      // 成功后刷新列表
      console.log("刷新列表");
    },
    onError: (error) => {
      // 自定义错误处理
      console.error("删除失败:", error);
    },
  });

  const handleDelete = async (id: string) => {
    await execute(async () => {
      // 执行删除操作
      await deleteItem(id);
    });
  };

  return <button onClick={() => handleDelete("123")}>删除</button>;
}

// ============================================
// 示例 3: 不显示 loading toast
// ============================================
export function Example3_NoLoadingToast() {
  const { execute, loading } = useAsyncAction({
    showLoading: false, // 不显示 loading toast
    successMessage: "操作成功",
  });

  const handleAction = async () => {
    await execute(async () => {
      await someQuickAction();
    });
  };

  return (
    <div>
      {loading && <span>加载中...</span>}
      <button onClick={handleAction}>执行操作</button>
    </div>
  );
}

// ============================================
// 示例 4: 获取返回值
// ============================================
export function Example4_WithReturnValue() {
  const { execute } = useAsyncAction({
    successMessage: "获取成功",
  });

  const handleFetch = async () => {
    const result = await execute(async () => {
      const response = await fetchData();
      return response.data;
    });

    if (result) {
      console.log("获取到的数据:", result);
      // 使用返回的数据
    }
  };

  return <button onClick={handleFetch}>获取数据</button>;
}

// ============================================
// 示例 5: 表单提交
// ============================================
export function Example5_FormSubmit() {
  const { execute, loading } = useAsyncAction({
    successMessage: "提交成功",
    loadingMessage: "正在提交表单...",
    onSuccess: () => {
      // 提交成功后重置表单
      resetForm();
    },
  });

  const handleSubmit = async (formData: any) => {
    await execute(async () => {
      await submitForm(formData);
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit({ name: "test" });
      }}
    >
      <button type="submit" disabled={loading}>
        {loading ? "提交中..." : "提交"}
      </button>
    </form>
  );
}

// ============================================
// 示例 6: 在控制面板中使用
// ============================================
export function Example6_ControlPanel() {
  const savePreferences = useAsyncAction({
    successMessage: "偏好设置已保存",
    loadingMessage: "正在保存偏好设置...",
  });

  const saveNotifications = useAsyncAction({
    successMessage: "通知设置已保存",
    loadingMessage: "正在保存通知设置...",
  });

  const handleSavePreferences = async () => {
    await savePreferences.execute(async () => {
      // 保存偏好设置
    });
  };

  const handleSaveNotifications = async () => {
    await saveNotifications.execute(async () => {
      // 保存通知设置
    });
  };

  return (
    <div>
      <button
        onClick={handleSavePreferences}
        disabled={savePreferences.loading}
      >
        保存偏好设置
      </button>

      <button
        onClick={handleSaveNotifications}
        disabled={saveNotifications.loading}
      >
        保存通知设置
      </button>
    </div>
  );
}

// ============================================
// 辅助函数（示例用）
// ============================================
async function deleteItem(id: string) {
  // 模拟 API 调用
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

async function someQuickAction() {
  await new Promise((resolve) => setTimeout(resolve, 500));
}

async function fetchData() {
  return { data: { id: 1, name: "test" } };
}

async function submitForm(data: any) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

function resetForm() {
  console.log("表单已重置");
}
