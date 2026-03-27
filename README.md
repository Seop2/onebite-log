## 리액트 SNS 클론코딩

- supabase 연결
- 글 추가
- 글 삭제
- 글 수정
- 이미지 업로드 (supabase storage)
- 로그인 /회원가입 (supabase auth)
- 소셜 로그인 (supabase auth providers github 연결)
- 무한 스크롤 (react-query)
- RLS (행 권한 설정 : 해당 사용자만 수정 삭제 가능하도록 인가 적용)
  - 조회는 누구나 가능
  - 포스트 추가시 (select auth.uid())=author_id (해당 사용자만 추가가능하도록)
  - 업데이트시 using은 사용자의 권한 조건 with check는 사용자가 본인인지 확인
  - 삭제시에도 동일하게 적용
- 좋아요 기능
  - 동시성 이슈 => supabase RPC(원격으로 데이터베이스 함수 호출)
- 프로필 기능
- 댓글 기능
  -
- 테마 변경
  - zustand로 테마 상태값 스토리지에 저장한 후 index.html에서 맨처음 실행시 스토리지에서 가져와서 html 클래스에 추가

---

### 추가 예정

- 비디오 업로드 (v)
- 구글 로그인 (v)
- 댓글 수 렌더링 (v)

---

### 폴더별 역할

> store: 클라이언트 전역 상태값 관리 **zustand**

> api : 외부 비동기 함수

> provider : 세션, 모달

> pages : 페이지별 라우터

> lib : 자주쓰는 상수값

> hook > mutation : 서버에서 불러오는 데이터 수정 및 삭제

---

## DB구조

![DB](/public/onebiteDB.png)
