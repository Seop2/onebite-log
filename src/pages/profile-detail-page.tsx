import PostFeed from "@/components/posts/posts-feed";
import ProfileInfo from "@/components/profile/profile-info";
import { useEffect } from "react";
import { Navigate, useParams } from "react-router";

/**
 * 프로필 상세 페이지
 * @returns
 */
export default function ProfileDetailPage() {
  //페이지 url 파라미터 값 사용시 useParams
  const params = useParams();
  const userId = params.userId;

  //마운트시 스크롤 최상단
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  if (!userId) return <Navigate to={"/"} replace />;
  return (
    <div className="flex flex-col gap-10">
      <ProfileInfo userId={userId} />
      <div className="border-b"></div>
      <PostFeed authorId={userId} />
    </div>
  );
}
