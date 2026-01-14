import { Button } from "@/modules/forum/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ForumNotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full bg-neutral-100 p-6 dark:bg-neutral-800">
        <span className="text-4xl">🤔</span>
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
        话题走丢了
      </h1>
      <p className="mt-3 max-w-md text-neutral-500 dark:text-neutral-400">
        看起来您要找的帖子或板块已经去流浪了。
      </p>
      <div className="mt-8 flex gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          返回
        </Button>
        <Button onClick={() => navigate("/forum")}>去论坛首页看看</Button>
      </div>
    </div>
  );
}
