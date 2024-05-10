# Buds2 hotfix 2nd

## Rules
1. 브랜드사이트 작업시, 글꼴 "sssB" 확인하기.
2. 로컬에서 브랜드사이트와 같은 작업환경 맞추기. ( 브랜드 사이트의 common css, js, 폰트 등)
3. 작업시, 전체 페이지 가이드 맞추기. ( 여백, font size, line height 등)
4. 브랜드사이트 같은 경우 stg와 global URL 둘 다 받아서 확인하기.
5. <strong>코드 업로드시, css와 js는 git 추적을 위해 unminified(비압축) 상태로 업로드하기. 타 팀에 코드 공유시에만 압축해서 전달할 것. -</strong>

## History
- 03.25 | 모바일 상단 여백 반영 사항 아직 PVI등록 전, 추후 꼭 등록할 것.
- 03.25 | 웹 접근성 수정 사항 반영.
- 03.20 | pvi 버전 신규 피처 작업, 웹 접근성 테스트 링크 전달 완료.

##PVI URL
- edit : https://p6-ap-author.samsung.com/editor.html/content/samsung/test/mobile/2022-2h/galaxy-buds2-pro.html
- qa : https://p6-qa.samsung.com/test/mobile/2022-2h/galaxy-buds2-pro/

##PVI Image URL 
- index_pim-test.html : https://images.samsung.com/is/image/samsung/assets/test/mobile/2022-2h/galaxy-buds2/galaxy-buds2-ai-facetoface-0305.png
- codes/index_pim.html : https://images.samsung.com/is/image/samsung/assets/[site-code]/mobile/2022-2h/galaxy-buds2/galaxy-buds2-ai-facetoface-0305.png
- buds2_pro-html-pvi\index_pim.html : https://images.samsung.com/is/image/samsung/assets/[site-code]/mobile/2022-2h/galaxy-buds2/galaxy-buds2-ai-facetoface-0305.png
- buds2_pro-html-pvi\index.html : ./images/galaxy-buds2-ai-facetoface-0305.png

##Brand Site QA URL 
- 브랜드사이트(ORG) : https://org-glx.samsung.com/global/galaxy/galaxy-buds2/
- 브랜드사이트(STG) : https://stg-glx.samsung.com/global/galaxy/galaxy-buds2/
- 브랜드사이트 : https://www.samsung.com/global/galaxy/galaxy-buds2/#galaxyBuds2
- https://www.samsung.com/global/galaxy/galaxy-buds2-pro/

##Buds2 브랜드사이트
- 2번째 디스크립션 17px 뺴야함 : .sc-buds-ai-list__description font-size:17px



 ##브랜드사이트 Replace

 https://images.samsung.com/is/image/samsung/assets/[site-code]/mobile/2022-2h/galaxy-buds2/
 =>
/global/galaxy/galaxy-buds2-pro/images/


https://images.samsung.com/is/image/samsung/assets/[site-code]/unpacked/2022-2h/galaxy-buds2-pro/
=>
/global/galaxy/galaxy-buds2-pro/images/

https://images.samsung.com/is/content/samsung/assets/[site-code]/unpacked/2022-2h/galaxy-buds2-pro/
=>

type="video/webm

/global/galaxy/galaxy-buds2-pro/videos/

##브랜드사이트 TEST
- index_sample.html <!--
TEST SAMPLE
  
-->  주석 사이 넣기 

- asset URL Replace
/global/galaxy/galaxy-buds2-pro/images/
=>
https://www.samsung.com/global/galaxy/galaxy-buds2-pro/images/


global/galaxy/galaxy-buds2-pro/videos/

https://www.samsung.com/global/galaxy/galaxy-buds2-pro/videos/