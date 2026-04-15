# 생일케이크를 꾸며줘! - 개발 히스토리

## 2026-04-15 - 프로젝트 초기 구축

### 기술 스택 결정
- **프레임워크**: Next.js 16 (App Router) + TypeScript
- **스타일링**: Tailwind CSS
- **데이터베이스**: Firebase Firestore (localStorage 폴백 지원)
- **ID 생성**: nanoid

### 프로젝트 생성 및 초기 설정
- `create-next-app`으로 프로젝트 스캐폴딩
- Firebase, nanoid 패키지 설치
- 디렉토리 구조 설계:
  ```
  src/
  ├── app/           # 페이지 라우팅
  ├── components/    # UI 컴포넌트
  ├── data/          # 정적 데이터 (케이크종류, 토핑)
  └── lib/           # 유틸리티 (Firebase, 스토어, 타입)
  ```

### 데이터 모델 설계
- `Cake`: id, ownerName, birthday, cakeType, createdAt
- `Message`: id, cakeId, author, content, isAnonymous, isSecret, password, toppingId, positionX, positionY, createdAt
- 케이크 종류 4가지: 생크림, 초코, 딸기, 바닐라
- 토핑 18종: 과일(5) + 과자(5) + 장식(8)

### 스토리지 레이어 구현
- Firebase Firestore를 메인 DB로 사용
- `.env.local`에 Firebase 설정이 없으면 자동으로 localStorage 사용
- 개발 환경에서 Firebase 설정 없이 즉시 테스트 가능

### UI 컴포넌트 개발 (8개)
1. **Header**: 상단 로고 + 네비게이션
2. **CakeCreator**: 이름/생일/케이크 종류 입력 폼
3. **CakeView**: CSS로 구현한 케이크 시각화 (사이드뷰, 크림 드립, 레이어)
4. **ToppingSelector**: 카테고리별 탭으로 토핑 선택
5. **MessageForm**: 축하 메시지 작성 (익명, 비밀글, 비밀번호)
6. **MessageModal**: 토핑 클릭 시 메시지 보기 (비밀글은 비밀번호 입력)
7. **MessageList**: 전체 메시지 목록 표시
8. **ShareButton**: 링크 복사, SNS 공유, 네이티브 공유 API

### 페이지 개발 (3개)
1. **홈(`/`)**: 히어로 섹션 + 사용 가이드 + 케이크 생성 폼
2. **케이크 보기(`/cake/[id]`)**: 케이크 시각화 + 토핑 클릭 + 메시지 목록 + 공유
3. **꾸미기(`/cake/[id]/decorate`)**: 2단계 프로세스 (토핑 선택 → 메시지 작성)

### 스타일링
- Tailwind CSS 유틸리티 클래스 활용
- 핑크/오렌지 그라데이션 테마
- 커스텀 애니메이션: float, wiggle, modal-pop
- 반응형 디자인 (모바일 우선)

### 빌드 및 테스트
- `next build` 프로덕션 빌드 성공
- 정적 라우트: `/`, `/_not-found`
- 동적 라우트: `/cake/[id]`, `/cake/[id]/decorate`
- 개발 서버: `http://localhost:3000` 정상 동작 확인

### 주요 기술적 결정 사항
- **Next.js 15+ params Promise 대응**: `use()` 훅으로 params 언래핑
- **저장소 추상화**: Firebase/localStorage 자동 전환으로 개발 편의성 확보
- **CSS 기반 케이크**: 외부 이미지 없이 순수 CSS로 케이크 시각화 구현
- **이모지 토핑**: 별도 에셋 없이 유니코드 이모지로 토핑 표현
