
---

### 1. FSD(Feature-Sliced Design) 아키텍처란?

쉽게 말해 **"관심사에 따라 계층별로 폴더를 쪼개는 방식"**입니다. 안쪽(Shared)에서 바깥쪽(App)으로 갈수록 더 복잡하고 구체적인 기능을 담습니다.

| 계층 (Layer) | 역할 (쉽게 설명) | 이번 과제에서의 예시 |
| --- | --- | --- |
| **1. app** | 전체 설정 (Provider, Global CSS) | Tanstack Query 설정, Tailwind 설정 |
| **2. pages** | 개별 페이지 | 메인 날씨 페이지, 상세 페이지 |
| **3. widgets** | 독립적인 큰 덩어리 (Feature 조합) | 날씨 상세 정보 섹션, 즐겨찾기 목록 |
| **4. features** | 사용자의 **행동(Action)** | 장소 검색하기, 즐겨찾기 추가/삭제 |
| **5. entities** | 비즈니스 **데이터(Data)** | 날씨 정보 카드, 주소 데이터 처리 |
| **6. shared** | 공통 도구 (재사용 UI, API 통신) | 버튼, 입력창, OpenWeather API 호출 함수 |

---

### 2. 이번 과제용 FSD 폴더 구조 


```text
src/
 ├── app/              # 전역 설정 (Providers, Styles)
 ├── pages/            # 메인 페이지, 상세 페이지
 ├── widgets/          # Header, WeatherDetails, FavoritesList
 ├── features/         # SearchLocation, ManageFavorites, EditNickname
 ├── entities/         # WeatherCard, DistrictData (JSON 처리)
 ├── shared/           # UI(Button, Input), API(fetchWeather), Utils
 └── main.tsx

```

---

### 3. 실시간 문서화 시작 (README.md 초안)

프로젝트 루트에 `README.md` 파일을 만들고 아래 내용을 먼저 채워넣으세요. 작업하면서 업데이트하면 됩니다.

```markdown
# 🌦️ 리얼티쓰 프론트엔드 과제 - 날씨 앱

## 1. 프로젝트 소개
- 사용자의 현재 위치 및 검색 기반 날씨 정보 제공 서비스
- **기술 스택**: React, Next.js(혹은 Vite), TypeScript, Tailwind CSS, Tanstack Query

## 2. 아키텍처: FSD (Feature-Sliced Design)
본 프로젝트는 확장성과 유지보수성을 위해 FSD 아키텍처를 채택했습니다.
- **Shared**: 공통 UI 및 API 통신 로직
- **Entities**: 날씨 및 지역 데이터의 비즈니스 모델
- **Features**: 검색, 즐겨찾기 관리 등 사용자 액션 중심 로직
- **Widgets**: 기능적 단위의 UI 컴포넌트 조합

## 3. 핵심 구현 사항
- [ ] 현재 위치 기반 날씨 자동 조회
- [ ] 행정구역(시/군/구/동) 검색 및 자동완성
- [ ] 즐겨찾기(최대 6개) 로컬 스토리지 연동 및 별칭 수정
- [ ] 반응형 UI (Mobile/Desktop)

```

## 4. 기술 스택 선택 이유
- **Vite**: FSD 아키텍처의 레이어 구조를 명확히 구현하기 위해 파일 시스템 기반 라우팅 제약이 없는 Vite를 선택했습니다. 또한 Geolocation API와 LocalStorage 등 브라우저 API 활용이 잦은 프로젝트 특성상 클라이언트 사이드 렌더링(CSR) 방식이 효율적이라 판단했습니다.
- **Tanstack Query**: 서버 상태 관리(날씨 데이터)의 캐싱과 로딩/에러 핸들링을 선언적으로 처리하기 위해 도입했습니다.
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크를 통해 생산성을 높이고 반응형 UI를 빠르게 구현했습니다.

### 4.1 선정되지않은 기술 스택
- **Next** : 자체적으로 app 폴더를 라우팅용으로 사용하여 이름이 겹쳐서 폴더 구조에 문제를 일으키기 때문에 선정하지 않았습니다.

## 5. API 통신전략
- **OpenWeatherMap One Call API 3.0** (또는 2.5)를 사용하여 현재 날씨 및 예보 데이터를 통합 관리합니다.
- API Key는 환경변수로 관리하여 보안을 유지하며, 모든 통신은 TypeScript Interface를 통해 데이터 무결성을 보장합니다.

---

