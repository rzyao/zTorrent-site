import CategoriesBase from "./CategoriesBase";
import { UpdateCategoryDto } from "@/api/models/UpdateCategoryDto";

export default function PlaylistCategories() {
  return (
    <CategoriesBase
      kind={UpdateCategoryDto.kind.PLAYLIST}
      genre={UpdateCategoryDto.genre.GENERAL}
    />
  );
}
