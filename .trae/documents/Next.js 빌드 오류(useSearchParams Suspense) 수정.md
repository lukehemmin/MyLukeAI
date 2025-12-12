`next build` 과정에서 발생한 `useSearchParams()` 관련 오류를 수정하겠습니다.

**문제 원인:**
- Next.js의 `useSearchParams()` 훅을 사용하는 페이지(`/verify-2fa`)는 반드시 `<Suspense>` 경계로 감싸져야 합니다. 그렇지 않으면 클라이언트 사이드 렌더링(CSR)으로 전환되면서 정적 빌드 시 오류가 발생할 수 있습니다.
- 현재 `/verify-2fa/page.tsx`에서 `useSearchParams`를 직접 사용하고 있는데, Suspense 감싸기가 누락되었습니다.

**해결 방안:**
1.  **`/verify-2fa/page.tsx` 리팩토링**:
    *   `useSearchParams`를 사용하는 로직을 별도의 클라이언트 컴포넌트(`Verify2FAForm`)로 분리합니다.
    *   메인 페이지 컴포넌트(`Verify2FAPage`)에서 `Suspense`로 `Verify2FAForm`을 감쌉니다.
2.  **재빌드 및 실행**: 수정 후 `lint`, `build`, `start` 명령어를 다시 실행하여 정상 작동을 확인합니다.

이 수정을 통해 빌드 오류를 해결하고 서버를 정상적으로 실행할 수 있습니다.