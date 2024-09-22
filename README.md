# Next.js QR Scanner

## 프로젝트 개요

이 프로젝트는 Next.js, WebAssembly, 그리고 Web Worker를 활용하여 구현한 QR 코드 스캐너입니다. OpenCV.js(WebAssembly 버전)를 사용하여 브라우저에서 직접 실행하며, Web Worker를 통해 메인 스레드의 부하를 줄이고 UI의 반응성을 향상시켰습니다.

![QR Scanner Demo](https://i.imgur.com/sxrnChU.gif)

## 주요 기능

- WebAssembly로 컴파일된 OpenCV.js를 사용한 고성능 이미지 처리
- Web Worker를 통한 비동기 QR 코드 감지로 UI 블로킹 방지

## 기술 스택

- **Frontend**: Next.js, React, TypeScript
- **WebAssembly**: OpenCV.js
- **병렬 처리**: Web Workers
- **스타일링**: TailwindCSS

## 프로젝트 구조

```
next-qr-scanner/
├─ app/                 # Next.js 14 app 디렉토리
├─ components/          # 재사용 가능한 컴포넌트
├─ hooks/               # Custom hooks
├─ public/              # 정적 파일 (OpenCV.js WebAssembly 포함)
├─ types/               # TypeScript 타입 정의
├─ workers/             # Web Worker 스크립트
└─ ...                  # 기타 설정 파일
```

## 주요 구현 사항

1. **WebAssembly를 통한 고성능 컴퓨터 비전**: OpenCV.js의 WebAssembly 버전을 사용하여 브라우저에서 직접 고성능 이미지 처리 및 QR 코드 감지를 수행합니다.

2. **Web Worker를 이용한 비동기 처리**: QR 코드 감지 및 디코딩 작업을 별도의 Worker 스레드에서 수행하여 메인 UI 스레드의 블로킹을 방지하고 애플리케이션의 반응성을 크게 향상시켰습니다.

3. **효율적인 카메라 스트림 처리**: `useCamera` 훅을 통해 브라우저의 카메라 API를 추상화하고, 실시간 비디오 스트림을 효율적으로 처리합니다.

4. **QR 코드 스캐너 컴포넌트**: `QRScanner` 컴포넌트에서 카메라 스트림을 표시하고, Web Worker를 통해 처리된 QR 코드 정보를 실시간으로 렌더링합니다.

## 실행 방법

1. 저장소 클론:
   ```
   git clone https://github.com/hsskey/next-qr-scanner.git
   ```

2. 의존성 설치:
   ```
   pnpm install
   ```

3. 개발 서버 실행:
   ```
   pnpm dev
   ```

4. 로컬구동 확인 `http://localhost:3000`

