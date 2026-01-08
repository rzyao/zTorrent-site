import CategoriesView from "@/modules/admin/shared/categories/CategoriesView";
import { UpdateCategoryDto } from "@/api/models/UpdateCategoryDto";

export default function AdultPlaylistCategories() {
  return (
    <CategoriesView kind={UpdateCategoryDto.kind.PLAYLIST} genre={UpdateCategoryDto.genre.ADULT} />
  );
}
