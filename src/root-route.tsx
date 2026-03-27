import { Navigate, Route, Routes } from "react-router";
import SignInPage from "./pages/sign-in-page";
import SignupPage from "./pages/sign-up-page";
import ForgetPasswordPage from "./pages/forget-password-page";
import PostDetailPage from "./pages/post-detail-page";
import ProfileDetailPage from "./pages/profile-detail-page";
import ResetPasswordPage from "./pages/reset-password-page";
import GlobalLayout from "./components/layout/global-layout";
import GuestOnlyLayout from "./components/layout/guest-only-layout";
import IndexPage from "./pages/index-page";
import MemberOnlyLayout from "./components/layout/member-only-layout";
/**
 * 사용자 인증 상태에 따라 구분 guestOnlyLayout, MemberOnlyLayout
 * sign-in : 로그인 페이지
 * sign-up : 회원가입 페이지
 * forget-password: 비밀번호 찾기 페이지
 * --------
 * postId : 게시글 상세 페이지
 * userId : 사용자 페이지
 * @returns
 */
export default function RootRoute() {
  return (
    <Routes>
      <Route element={<GlobalLayout />}>
        <Route element={<GuestOnlyLayout />}>
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignupPage />} />
          <Route path="/forget-password" element={<ForgetPasswordPage />} />
        </Route>
        <Route element={<MemberOnlyLayout />}>
          <Route path="/" element={<IndexPage />} />
          <Route path="/post/:postId" element={<PostDetailPage />} />
          <Route path="/profile/:userId" element={<ProfileDetailPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
        <Route path="*" element={<Navigate to={"/"} />} />
      </Route>
    </Routes>
  );
}
