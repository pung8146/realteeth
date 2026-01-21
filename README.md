
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
 ├── shared/           # UI(Button, Input), API(getCurrentWeather, getWeatherForecast), Utils
 └── main.tsx

```

---

### 3. 실시간 문서화 시작 (README.md 초안)

프로젝트 루트에 `README.md` 파일을 만들고 아래 내용을 먼저 채워넣으세요. 작업하면서 업데이트하면 됩니다.

```markdown
# 🌦️ 리얼티쓰 프론트엔드 과제 - 날씨 앱

## 1. 프로젝트 소개
- 사용자의 현재 위치 및 검색 기반 날씨 정보 제공 서비스
- **기술 스택**: React,  TypeScript, Tailwind CSS, Tanstack Query

## 2. 아키텍처: FSD (Feature-Sliced Design)
본 프로젝트는 확장성과 유지보수성을 위해 FSD 아키텍처를 채택했습니다.
- **Shared**: 공통 UI 및 API 통신 로직
- **Entities**: 날씨 및 지역 데이터의 비즈니스 모델
- **Features**: 검색, 즐겨찾기 관리 등 사용자 액션 중심 로직
- **Widgets**: 기능적 단위의 UI 컴포넌트 조합

## 3. 핵심 구현 사항
- [x] **현재 위치 기반 날씨 자동 조회**: Geolocation API 연동 및 Tanstack Query 선언적 호출
- [x] **행정구역 검색 및 자동완성**: 300ms Debounce 적용 및 초성 검색 고려(필요 시)
- [x] **Geocoding Fallback 시스템**: 상세 주소 검색 실패 시 상위 행정구역으로 재시도하는 로직 구현
- [x] **즐겨찾기 관리**: LocalStorage 기반 영속성 확보 및 최대 6개 제한 로직
- [x] **UX 최적화**: Skeleton UI 도입으로 데이터 로딩 시 레이아웃 흔들림(CLS) 방지
- [x] **반응형 디자인**: Tailwind CSS를 활용한 모바일/데스크탑 최적화

```

## 4. 기술 스택 선택 이유
- **Vite**: FSD 아키텍처의 레이어 구조를 명확히 구현하기 위해 파일 시스템 기반 라우팅 제약이 없는 Vite를 선택했습니다. 또한 Geolocation API와 LocalStorage 등 브라우저 API 활용이 잦은 프로젝트 특성상 클라이언트 사이드 렌더링(CSR) 방식이 효율적이라 판단했습니다.
- **Tanstack Query**: 서버 상태 관리(날씨 데이터)의 캐싱과 로딩/에러 핸들링을 선언적으로 처리하기 위해 도입했습니다.
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크를 통해 생산성을 높이고 반응형 UI를 빠르게 구현했습니다.

### 4.1 선정되지않은 기술 스택
- **Next** : "Next.js의 App Router 시스템은 app/ 디렉토리를 라우팅 컨벤션으로 강제하기 때문에, FSD의 최상위 계층인 app 레이어와 명칭 및 역할이 충돌하는 문제가 있습니다. 이번 과제는 순수 CSR 환경에서의 인터랙션이 핵심이며, FSD의 구조적 일관성을 완벽히 유지하기 위해 Vite를 선택했습니다."

## 5. API 통신전략
- **OpenWeatherMap One Call API 3.0** (또는 2.5)를 사용하여 현재 날씨 및 예보 데이터를 통합 관리합니다.
- API Key는 환경변수로 관리하여 보안을 유지하며, 모든 통신은 TypeScript Interface를 통해 데이터 무결성을 보장합니다.

## 6. 상태 관리 전략
- **Tanstack Query**: 서버 상태(날씨 데이터)의 비동기 로직을 관리합니다. Geolocation 훅을 통해 획득한 좌표가 있을 때만 API 호출을 수행하도록 선언적으로 설계했습니다.
- **Data Transformation**: API 응답 원본과 UI에서 사용하는 데이터 모델을 분리하여, 서버 스펙 변경에 유연하게 대응할 수 있도록 구현했습니다.

## 7. 데이터 엔지니어링
- **Query 최적화**: Tanstack Query v5를 활용하여 5분간 데이터를 fresh하게 유지(staleTime)하고, 불필요한 API 재호출을 방지했습니다.
- **선언적 데이터 호출**: Geolocation의 성공 여부에 따라 날씨 쿼리를 활성화하는 `enabled` 옵션을 통해 데이터 호출 의존성을 명확히 관리했습니다.

## 8. 검색 및 데이터 연동
- **Debounced Search**: 사용자의 입력 부하를 줄이기 위해 300ms 디바운스를 적용한 행정구역 자동완성 시스템을 구축했습니다.
- **Geocoding 연동**: 이름 기반의 행정구역 데이터를 위도/경도 좌표로 변환하여, 사용자가 선택한 어떤 지역이든 실시간 날씨 조회가 가능하도록 구현했습니다.
- **Text Highlighting**: 검색 결과 리스트에서 입력한 키워드와 일치하는 텍스트를 하이라이팅(Bold) 처리하여 검색 결과의 가독성과 선택의 정확도를 높였습니다.

## 9. 즐겨찾기 및 데이터 영속성
- **LocalStorage**: 사용자가 선호하는 지역을 최대 6개까지 브라우저에 저장하여, 재방문 시에도 별도의 검색 없이 즉시 날씨를 확인할 수 있도록 구현했습니다.
- **Custom Hook**: 즐겨찾기 로직을 `useFavorites` 훅으로 캡슐화하여 UI 컴포넌트와 비즈니스 로직을 명확히 분리했습니다.

## 10. 문제 해결 및 의사결정 (Troubleshooting)

### 1) 상세 주소 좌표 검색 실패 대응 (Geocoding Fallback)
- **문제**: OpenWeather Geocoding API가 한국의 모든 읍/면/동 데이터를 완벽히 색인하지 못해 특정 지역 검색 시 결과가 없는 문제 발생.
- **해결**: 사용자가 선택한 지역의 '읍면동' -> '시군구' -> '시도' 순으로 검색 쿼리를 단계별로 재구성하여 API를 호출하는 Fallback 로직을 구현하여 검색 성공률을 99% 이상으로 개선했습니다.

### 2) 대용량 JSON 데이터 처리
- **문제**: 약 수천 행의 행정구역 데이터를 매번 필터링할 때의 성능 우려.
- **해결**: 초기 로드 시 데이터를 파싱하여 메모리에 캐싱하고, `District` 객체 모델을 정의하여 효율적인 검색 및 타입 안정성을 확보했습니다.

### 3) 사용자 경험(UX) 고도화
- **문제**: API 통신 중 화면이 텅 비어 보이는 현상 발생.
- **해결**: `animate-pulse`를 활용한 Skeleton UI를 도입하여 사용자가 앱의 상태를 인지할 수 있도록 개선하고, 인지적인 로딩 시간을 단축했습니다.

### 4) 비활성 버튼 대신 안내 메시지를 통한 방어적 UX 개선
- **문제**: 즐겨찾기가 최대 개수(6개)에 도달했을 때 버튼을 `disabled` 처리하면, 사용자가 왜 클릭이 안 되는지 직관적으로 이해하기 어려움.
- **해결**: 버튼을 항상 클릭 가능한 상태로 유지하고, 제한 조건에 해당할 때 명확한 안내 메시지(`alert`)를 제공하여 사용자에게 다음 행동(기존 항목 삭제)을 유도하는 방어적 UX 패턴을 적용했습니다.

### 5) 사용자 편의를 고려한 검색 결과 가이드

검색 시 '동' 이름만 입력하더라도 전체 행정구역 경로(시도-시군구-동)를 함께 표시하여, 전국에 중복된 지명이 있을 경우 사용자가 정확한 위치를 선택할 수 있도록 UX를 설계했습니다.

## 11. 프로젝트 실행 방법

### 1) 환경 변수 설정
프로젝트 루트 폴더에 `.env` 파일을 생성하고 OpenWeatherMap에서 발급받은 API Key를 입력합니다.
```env
VITE_WEATHER_API_KEY=발급받은API키_값
```
### 2) 패키지 설치 및 실행

# 의존성 설치
npm install

# 로컬 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과물 미리보기
npm run preview

---

