import { Card, CardContent } from "@/modules/admin/components/ui/card";
import { Users, Cloud, Zap } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">在线用户</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">128</span>
                <span className="text-muted-foreground text-sm">人</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Cloud className="h-6 w-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">今日访问</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">4,521</span>
                <span className="text-muted-foreground text-sm">次</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">待处理任务</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">17</span>
                <span className="text-muted-foreground text-sm">个</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
