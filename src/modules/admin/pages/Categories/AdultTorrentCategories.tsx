import CategoriesBase from "./CategoriesBase";
import { UpdateCategoryDto } from "@/api/models/UpdateCategoryDto";

export default function AdultTorrentCategories() {
  return (
    <CategoriesBase kind={UpdateCategoryDto.kind.TORRENT} genre={UpdateCategoryDto.genre.ADULT} />
  );
}
