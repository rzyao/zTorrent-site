import CategoriesView from "@/modules/admin/shared/categories/CategoriesView";
import { UpdateCategoryDto } from "@/api/models/UpdateCategoryDto";

export default function TorrentCategories() {
  return (
    <CategoriesView kind={UpdateCategoryDto.kind.TORRENT} genre={UpdateCategoryDto.genre.GENERAL} />
  );
}
