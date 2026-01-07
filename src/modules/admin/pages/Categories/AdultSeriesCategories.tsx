import CategoriesBase from "./CategoriesBase";
import { UpdateCategoryDto } from "@/api/models/UpdateCategoryDto";

export default function AdultSeriesCategories() {
  return (
    <CategoriesBase kind={UpdateCategoryDto.kind.SERIES} genre={UpdateCategoryDto.genre.ADULT} />
  );
}
