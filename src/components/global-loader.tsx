import chzzk from "@/assets/chzzk.png";

/**
 * 메인 로딩 화면 컴포넌트
 * @returns
 */
export default function GlobalLoader() {
  return (
    <div className="bg-muted flex h-[100vh] w-[100vw] flex-col items-center justify-center">
      <div className="mb-15 flex animate-bounce items-center gap-4">
        <img src={chzzk} alt="치지직" className="w-10" />
        <div className="text-2xl font-bold">치지직</div>
      </div>
    </div>
  );
}
