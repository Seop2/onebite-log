import { useSession } from "@/store/session";
import { Navigate, Outlet } from "react-router";

export default function AuthLayout() {
  const session = useSession();
  if (session) return <Navigate to="/" replace />;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] px-4 py-12 dark:bg-zinc-950">
      <Outlet />
    </div>
  );
}
