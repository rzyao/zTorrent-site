import PageContainer from "@/modules/admin/components/PageContainer";
import PageHeader from "@/modules/admin/components/PageHeader";
import { MovieCategoriesView } from "./components/MovieCategoriesView";

export default function MovieCategories() {
  return (
    <PageContainer>
      <PageHeader />
      <div className="flex-1 overflow-hidden p-1">
        <MovieCategoriesView />
      </div>
    </PageContainer>
  );
}
