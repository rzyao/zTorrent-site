import CategoriesView from "@/modules/admin/shared/categories/CategoriesView";
import { UpdateCategoryDto } from "@/api/models/UpdateCategoryDto";

export default function AdultTorrentCategories() {
  return (
    <CategoriesView kind={UpdateCategoryDto.kind.TORRENT} genre={UpdateCategoryDto.genre.ADULT} />
  );
}
