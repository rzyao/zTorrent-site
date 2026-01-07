import CategoriesBase from "./CategoriesBase";
import { UpdateCategoryDto } from "@/api/models/UpdateCategoryDto";

export default function MovieCategories() {
  return (
    <CategoriesBase kind={UpdateCategoryDto.kind.MOVIE} genre={UpdateCategoryDto.genre.GENERAL} />
  );
}
