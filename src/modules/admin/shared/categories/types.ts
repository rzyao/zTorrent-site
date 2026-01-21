import { UpdateCategoryDto } from "@/api/models/UpdateCategoryDto";

export type CategoryItem = {
  id?: string;
  key?: string;
  label?: string;
  description?: string | null;
  enabled?: boolean;
  isDefault?: boolean;
  sort?: number;
  createdAt?: string;
  updatedAt?: string;
  type?: "category" | "sub";
  parentId?: string;
  kind?: UpdateCategoryDto.kind;
  genre?: UpdateCategoryDto.genre;
  children?: CategoryItem[];
};

export type CreateCategoryFormValues = any;
