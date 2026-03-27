import AlertModal from "@/components/modal/alert-modal";
import PostEditorModal from "@/components/modal/posts-editor-modal";
import ProfileEditorModal from "@/components/modal/profile-editor-modal";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * 모달 부모 컴포넌트
 * createPortal로 루트레벨의 DOM으로 이동시켜 앱의 다른부분과 격리
 * @param param0
 * @returns
 */
export default function ModalProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {createPortal(
        <>
          <PostEditorModal />
          <AlertModal />
          <ProfileEditorModal />
        </>,
        document.getElementById("modal-root")!,
      )}

      {children}
    </>
  );
}
