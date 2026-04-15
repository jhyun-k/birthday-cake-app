# 생일케이크를 꾸며줘! - 개발 체크리스트

## 프로젝트 설정
- [x] Next.js 16 + TypeScript 프로젝트 생성
- [x] Tailwind CSS 설정
- [x] Firebase SDK 설치
- [x] 프로젝트 디렉토리 구조 설정

## 데이터 레이어
- [x] 타입 정의 (Cake, Message, Topping, CakeType)
- [x] 케이크 종류 데이터 (생크림, 초코, 딸기, 바닐라)
- [x] 토핑 데이터 (과일 5종 + 과자 5종 + 장식 8종 = 18종)
- [x] Firebase Firestore 연동
- [x] localStorage 폴백 (Firebase 미설정 시)

## UI 컴포넌트
- [x] Header - 상단 네비게이션
- [x] CakeCreator - 케이크 생성 폼 (이름, 생일, 케이크 종류)
- [x] CakeView - 케이크 시각화 (사이드뷰, 토핑 배치)
- [x] ToppingSelector - 토핑 선택 (카테고리별 탭)
- [x] MessageForm - 메시지 작성 폼 (익명, 비밀글, 비밀번호)
- [x] MessageModal - 메시지 보기 모달 (비밀번호 입력)
- [x] MessageList - 메시지 목록
- [x] ShareButton - 링크 공유 (클립보드, SNS)

## 페이지
- [x] `/` - 홈페이지 (케이크 생성)
- [x] `/cake/[id]` - 케이크 보기 (토핑 클릭 → 메시지)
- [x] `/cake/[id]/decorate` - 케이크 꾸미기 (토핑 선택 + 메시지 작성)

## 기능
- [x] 케이크 생성 및 고유 링크 생성
- [x] 공유 기능 (링크 복사, 카카오스토리, 트위터, 네이티브 공유)
- [x] 토핑 선택 (카테고리: 과일/과자/장식)
- [x] 축하 메시지 작성
- [x] 익명/실명 선택
- [x] 비밀글/공개글 선택 (비밀번호 4자리)
- [x] 비밀번호 입력 후 비밀글 열람
- [x] 생일 D-day 카운트다운
- [x] 메시지 목록 보기
- [x] 토핑 클릭 시 메시지 팝업

## 스타일/디자인
- [x] 반응형 디자인
- [x] 그라데이션 배경
- [x] 커스텀 애니메이션 (float, wiggle, modal-pop)
- [x] Tailwind CSS 유틸리티

## 배포 준비
- [x] Production 빌드 확인 (`next build` 성공)
- [x] 정적/동적 라우트 최적화 확인
- [ ] Firebase 프로젝트 생성 및 `.env.local` 설정
- [ ] Vercel/기타 플랫폼 배포

## 향후 개선 가능 사항
- [ ] 카카오톡 공유 API (JavaScript SDK)
- [ ] 케이크 삭제/수정 기능
- [ ] 토핑 위치 드래그 앤 드롭
- [ ] 메시지 알림 기능
- [ ] 케이크 이미지 다운로드/캡처
- [ ] 사용자 인증 (구글/카카오 로그인)
