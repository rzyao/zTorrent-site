import CategoriesBase from "./CategoriesBase";
import { UpdateCategoryDto } from "@/api/models/UpdateCategoryDto";

export default function SeriesCategories() {
  return (
    <CategoriesBase kind={UpdateCategoryDto.kind.SERIES} genre={UpdateCategoryDto.genre.GENERAL} />
  );
}
