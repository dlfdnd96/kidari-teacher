# 봉사활동 통계 컴포넌트 구현 Task List

## 1. 기본 통계 카드 컴포넌트

### StatisticsCard

- [x] 기존 Card 컴포넌트 확장
- [x] props: title, value, change, icon, variant
- [x] 변화율 표시 (증가/감소 색상)
- [x] 아이콘 포함 (lucide-react 사용)

## 2. 차트 컴포넌트

### PieChart

- [x] recharts 라이브러리 설치
- [x] 카테고리별 비율 표시
- [x] 범례 및 툴팁 포함
- [x] props: data, colors

### LineChart

- [x] 월별 추이 표시용
- [x] 그리드 및 축 레이블
- [x] props: data, xKey, yKey, title

### BarChart

- [x] 간단한 막대 차트
- [x] props: data, xKey, yKey

## 3. 랭킹 컴포넌트

### RankingList

- [x] Card 기반 리스트
- [x] 순위, 이름, 점수 표시
- [x] props: rankings (배열)
- [x] 상위 3명 하이라이트

## 4. 필터 컴포넌트

### StatisticsFilter

- [x] 기간 선택 (월별)
- [x] 카테고리 선택
- [x] 지역 선택
- [x] props: onFilterChange

## 5. 레이아웃 컴포넌트

### StatisticsDashboard

- [x] Grid 레이아웃
- [x] 카드들 배치
- [x] 반응형 디자인 (2-3-4 컬럼)

### PersonalStatsView

- [x] 개인 통계 전용 레이아웃
- [x] 타임라인 영역 포함

## 6. 데이터 처리

### useStatistics Hook

- [ ] 기존 useStatisticsData 확장
- [ ] 집계 함수들 추가
- [ ] 총 횟수, 참여자 수, 지역 수 계산

### utils/statistics.ts

- [ ] calculateTotalActivities
- [ ] calculateParticipants
- [ ] calculateByCategory
- [ ] formatChartData

## 7. 타입 정의

### types/statistics.ts

- [ ] StatisticsData 인터페이스
- [ ] ChartData 인터페이스
- [ ] FilterOptions 인터페이스

## 구현 순서

1. StatisticsCard (가장 기본)
2. utils/statistics.ts (데이터 처리)
3. PieChart, LineChart (시각화)
4. StatisticsDashboard (레이아웃)
5. StatisticsFilter (필터링)
6. RankingList (랭킹)
7. PersonalStatsView (개인 통계)

## 주의사항

- 기존 Card, Button 등 UI 컴포넌트 재사용
- recharts만 추가 라이브러리로 사용
- 반응형 디자인 필수
- 로딩/에러 상태 처리
- TypeScript 타입 안정성 확보
