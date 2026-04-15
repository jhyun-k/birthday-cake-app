# Vercel 배포 가이드

## 1. Vercel 계정 연결

1. [vercel.com](https://vercel.com) 접속
2. **"Sign Up"** → **"Continue with GitHub"** 선택
3. `jhyun-k` GitHub 계정으로 로그인

## 2. 프로젝트 Import

1. 대시보드에서 **"Add New..."** → **"Project"** 클릭
2. **"Import Git Repository"** 에서 `birthday-cake-app` 선택
3. Framework Preset이 **Next.js** 로 자동 감지되는지 확인

## 3. 환경변수 설정

Import 화면의 **"Environment Variables"** 섹션에서 아래 값들을 추가:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyAOEkH_OUHkOJKeRIIiUsp2nCF2jE2IcWE` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `birthday-cake-app.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `birthday-cake-app` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `birthday-cake-app.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `327707041573` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:327707041573:web:d1f34fbf4a27fdc18544cc` |

> 카카오톡 공유 기능을 사용하려면 추가:
> `NEXT_PUBLIC_KAKAO_JS_KEY` = (카카오 개발자 사이트에서 발급)

## 4. 배포

1. **"Deploy"** 버튼 클릭
2. 빌드 완료까지 약 1~2분 소요
3. 완료되면 `https://birthday-cake-app-xxx.vercel.app` 형태의 URL 제공

## 5. 배포 후 확인사항

- [ ] 메인 페이지에서 케이크 생성이 되는지 확인
- [ ] 생성된 케이크가 Firebase Firestore에 저장되는지 확인
- [ ] 토핑 올리기 + 메시지 작성이 동작하는지 확인
- [ ] 공유 링크가 배포된 URL로 정상 생성되는지 확인

## 6. 커스텀 도메인 (선택)

1. Vercel 프로젝트 → **Settings** → **Domains**
2. 원하는 도메인 입력 후 DNS 설정 안내에 따라 연결

## 참고

- `main` 브랜치에 push하면 자동으로 재배포됩니다
- PR을 올리면 Preview 배포가 자동 생성됩니다
