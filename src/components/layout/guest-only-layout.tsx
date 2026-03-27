import { useSession } from "@/store/session";
import { Navigate, Outlet } from "react-router";

/**
 * 비회원시
 * @returns
 */
export default function GuestOnlyLayout() {
  const session = useSession();
  //replace:  뒤로 가기 방지
  if (session) return <Navigate to={"/"} replace={true} />;
  //자식라우트 렌더링
  return <Outlet />;
}
