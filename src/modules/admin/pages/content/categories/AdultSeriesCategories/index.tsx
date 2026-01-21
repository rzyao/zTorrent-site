import CategoriesView from "@/modules/admin/shared/categories/CategoriesView";
import { UpdateCategoryDto } from "@/api/models/UpdateCategoryDto";

export default function AdultSeriesCategories() {
  return (
    <CategoriesView kind={UpdateCategoryDto.kind.SERIES} genre={UpdateCategoryDto.genre.ADULT} />
  );
}
