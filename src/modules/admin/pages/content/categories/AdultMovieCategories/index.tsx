import CategoriesView from "@/modules/admin/shared/categories/CategoriesView";
import { UpdateCategoryDto } from "@/api/models/UpdateCategoryDto";

export default function AdultMovieCategories() {
  return (
    <CategoriesView kind={UpdateCategoryDto.kind.MOVIE} genre={UpdateCategoryDto.genre.ADULT} />
  );
}
