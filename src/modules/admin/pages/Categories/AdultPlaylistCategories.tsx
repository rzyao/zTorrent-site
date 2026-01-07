import CategoriesBase from "./CategoriesBase";
import { UpdateCategoryDto } from "@/api/models/UpdateCategoryDto";

export default function AdultPlaylistCategories() {
  return (
    <CategoriesBase kind={UpdateCategoryDto.kind.PLAYLIST} genre={UpdateCategoryDto.genre.ADULT} />
  );
}
