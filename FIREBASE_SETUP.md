# Firebase 프로젝트 설정 가이드

## 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름: `birthday-cake-app` (또는 원하는 이름)
4. Google Analytics는 선택사항 (비활성화해도 됩니다)
5. 프로젝트 생성 완료

## 2. 웹 앱 등록

1. 프로젝트 설정(톱니바퀴 아이콘) > 일반 > "앱 추가" > 웹(`</>`) 선택
2. 앱 닉네임: `birthday-cake-web`
3. Firebase SDK 설정 정보가 표시됨 → 이 값들을 `.env.local`에 복사

## 3. Firestore 데이터베이스 생성

1. 좌측 메뉴 > Firestore Database > "데이터베이스 만들기"
2. 위치: `asia-northeast3` (서울) 권장
3. 보안 규칙: "테스트 모드에서 시작" 선택 (나중에 아래 규칙으로 변경)

### Firestore 보안 규칙 (프로덕션용)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cakes/{cakeId} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if true;

      match /messages/{messageId} {
        allow read: if true;
        allow create: if true;
        allow update, delete: if true;
      }
    }
  }
}
```

## 4. `.env.local` 설정

프로젝트 루트에 `.env.local` 파일을 만들고 Firebase Console에서 복사한 값을 입력:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## 5. 확인

`npm run dev`로 개발 서버를 실행하고, 케이크를 생성하면 Firestore에 데이터가 저장되는지 확인합니다.
Firebase가 설정되지 않으면 자동으로 localStorage fallback이 작동합니다.
