import CategoriesBase from "./CategoriesBase";
import { UpdateCategoryDto } from "@/api/models/UpdateCategoryDto";

export default function AdultMovieCategories() {
  return (
    <CategoriesBase kind={UpdateCategoryDto.kind.MOVIE} genre={UpdateCategoryDto.genre.ADULT} />
  );
}
