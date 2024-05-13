# cell2
> PTKOREA DSG-T6 Cell2의 형상관리 레포지토리입니다.

## 실행 방법
1. 터미널 경로 daily_capture 폴더에서 node testPool.js 입력 시 캡쳐 진행됨
2. 프로그램 실행 국가는 testPool.js 파일 내부의 site_code 변수
3. region.js 파일에서 모든 국가 리스트 참조 가능
4. 여러 국가 실행 시, testPool.js 내부 for문에서 batchSize 갯수만큼 병렬로 실행됨

## History
- 24.05 - humint front page & border capture 개발
- 24.04.17 - humint-front : 휴민트페이지 프론트 
- 24.04.02 - Buds2 hofix 0402 : 광고주 긴급요청건 -로고수정 진행  
- 24.03.29 - QA Automation 
- 24.03.20 - Buds2 hofix 2nd : Buds2 Pro 만 해당
- 24.02.16 - Buds2 hofix 1st : Buds2 / Buds2 Pro 두페이지 진행 
- 23.12.01 - Workflow

## Commint Convention
- __add__ : 새 코드 및 새 디렉토리 추가
- __feat__ : 새로운 기능 및 코드 추가
- __update__ : 전반적인 수정사항 반영
- __docs__ : 문서 (문서 추가, 수정, 삭제)
- __HOTFIX__ : 긴급 수정

## Git flow Command

1. <b>git add .</b> : 현재 변경 사항들을 모두 스테이지에 올리기
2. <b>git commit -m"message"</b> : 현재 스테이징된 변경 사항들을 모두 한 커밋에 등록
3. <b>git pull --rebase origin main</b> : 현재 remote 즉, github에 반영된 최신 사항들을 로컬 즉, 내 컴퓨터와 최신화 시켜주기
4. <b>git push origin main</b> : 저장소에 내 커밋 내역들을 업데이트
5. <b>git stash / git stash pop</b> : 임시 브랜치에 현재 변경사항들을 저장하기 / 저장한 변경사항 다시 불러오기
   현재는 브랜치가 main 한개라서 origin main는 생략해도 됩니다.
