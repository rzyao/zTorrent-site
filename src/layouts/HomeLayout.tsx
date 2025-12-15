import { CategoryNav } from "@/layouts/CategoryNav";
import { Outlet, useParams } from "react-router-dom";

export default function HomeLayout() {
  const { category } = useParams();
  // 如果没有 category 参数，默认为 'home' (全部)
  const activeKey = category || "home";

  return (
    <>
      <CategoryNav activeKey={activeKey} />
      <Outlet />
    </>
  );
}
