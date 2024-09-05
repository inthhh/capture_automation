### Branch 설명

1. main : puppeteer 최신 버전 (클라이언트 실행)
2. deploy : selenium 배포용 최신 버전 (서버팜 업로드 예정)

# 📸 글로벌 OO닷컴 모니터링 툴 - Capture Program

- code는 현재 브랜치(no_search)가 아닌, main/deploy 브랜치에서 열람이 가능합니다.
- 아래 노션에 주요 커밋의 내용이 정리되어 있습니다.
- https://suuuhyeon.notion.site/Global-Capture-log-249a16ed0e85443996a3b8ad0c171c41

### ⚠️ 주의사항

- 실제 개발에는 gittea를 사용하였으며, 해당 파일 내부의 모든 url은 방화벽 설정으로 인해 특정 사내망에서만 접속이 가능합니다.
- 취업 준비 및 포트폴리오 정리 용도로 github 개인 브랜치에 코드 초안의 '일부'를 '일시적으로' 공개해두었습니다.

# 개요

- 목적 : 글로벌 92개국 웹페이지 모니터링을 위한 QA자동화 프로젝트 중, fail Data 시각화 단계에서 사용되는 캡쳐 프로그램
- 도구 : Javascript
- QA 완료 후, Css를 조작하여 fail Data를 웹 상에 표시하고 캡쳐합니다.
- 역할 : 기획, 개발 진행

## daily_capture 실행 방법

1. 터미널 경로 daily_capture 폴더에서 node testPool.js 입력 시 캡쳐 진행됨
2. 프로그램 실행 국가는 testPool.js 파일 내부의 site_code 변수
3. region.js 파일에서 모든 국가 리스트 참조 가능
4. 여러 국가 실행 시, testPool.js 내부 for문에서 batchSize 갯수만큼 병렬로 실행됨
5. 실행 시, 각 국가의 웹사이트에 자동으로 접속하여 팝업, 케로쉘 hidden 해제
6. fail Data를 크롤링 후 CSS 변경으로 시각적 표시하여 캡쳐
