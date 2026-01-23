import { ImagesService } from "@/api/services/ImagesService";

/**
 * 将文件转换为 Base64 字符串
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * 验证是否为图片 URL
 */
export const isImageUrl = (url: string): boolean => {
  return /^https?:\/\//.test(url);
};

/**
 * 处理图片上传或链接保存
 * - 如果是 File 对象，走内部上传接口
 * - 如果是 URL 字符串，走外部链接保存接口
 */
export const processImage = async (
  input: File | string,
  options?: {
    attachableType?: string;
    attachableId?: string;
    field?: string;
  },
): Promise<{ attachmentId: string; url: string }> => {
  // 1. 处理外部 URL
  if (typeof input === "string") {
    if (!isImageUrl(input)) {
      throw new Error("无效的图片链接");
    }

    // 调用 POST /images/external (使用生成的 Service)
    const res = await ImagesService.imagesControllerCreateExternal({
      url: input,
      attachableType: options?.attachableType,
      attachableId: options?.attachableId,
      field: options?.field,
    });

    // 兼容后端返回结构
    return {
      attachmentId: res.data?.attachmentId || "",
      url: res.data?.url || "",
    };
  }

  // 2. 处理本地文件上传
  if (input instanceof File) {
    const base64 = await fileToBase64(input);

    // 调用 POST /images/upload (使用生成的 Service)
    const res = await ImagesService.imagesControllerUpload({
      filename: input.name,
      content: base64,
      attachableType: options?.attachableType,
      attachableId: options?.attachableId,
      field: options?.field,
    });

    if (!res.data?.attachmentId) {
      throw new Error("上传失败，未返回附件ID");
    }

    return {
      attachmentId: res.data.attachmentId,
      url: res.data.url || "",
    };
  }

  throw new Error("不支持的输入类型");
};
