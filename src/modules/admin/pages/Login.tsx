import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/admin/components/ui/card";
import { Button } from "@/modules/admin/components/ui/button";
import { Input } from "@/modules/admin/components/ui/input";
import { Label } from "@/modules/admin/components/ui/label";
import { Checkbox } from "@/modules/admin/components/ui/checkbox";
import { AuthService } from "@/api/services/AuthService";

const loginSchema = z.object({
  username: z.string().min(1, "请输入用户名"),
  password: z.string().min(1, "请输入密码"),
  idleLogout30m: z.boolean().default(false),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      idleLogout30m: false,
    },
  });

  const idleLogout = watch("idleLogout30m");

  const onSubmit = async (data: LoginValues) => {
    try {
      setLoading(true);
      const res = await AuthService.authLoginControllerLogin({
        username: data.username,
        password: data.password,
        idleLogout30m: data.idleLogout30m,
      });
      const token = res?.data?.accessToken;
      if (!token) {
        toast.error("登录失败：未返回令牌");
        return;
      }
      // 凭证已由后端写入 HttpOnly Cookie，前端不再持有令牌
      toast.success("登录成功");
      window.dispatchEvent(new Event("authChange"));
      navigate("/", { replace: true });
    } catch (e: any) {
      if (e?.status === 401) {
        toast.error("用户名或密码错误");
      } else {
        toast.error(e?.message || "登录失败");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <Card className="w-full max-w-[380px] border-none shadow-[0_8px_24px_rgba(149,157,165,0.15)]">
        <CardHeader className="space-y-1 pt-8 pb-4">
          <CardTitle className="text-center text-2xl font-bold tracking-tight">
            管理员登录
          </CardTitle>
          <p className="text-muted-foreground text-center text-sm">请输入您的凭据以进入系统</p>
        </CardHeader>
        <CardContent className="pb-8">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                placeholder="用户名"
                autoFocus
                {...register("username")}
                className={errors.username ? "border-red-500" : ""}
              />
              {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="密码"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="idleLogout30m"
                checked={idleLogout}
                onCheckedChange={(checked) => setValue("idleLogout30m", !!checked)}
              />
              <Label
                htmlFor="idleLogout30m"
                className="text-muted-foreground hover:text-foreground cursor-pointer text-sm leading-none font-normal transition-colors"
              >
                启用30分钟无操作自动退出
              </Label>
            </div>

            <Button
              variant="primary"
              className="w-full py-6 text-base shadow-lg transition-transform active:scale-[0.98]"
              loading={loading}
              type="submit"
            >
              登录系统
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
