# Connect Workflow

## Convention

## Git flow Command

1. <b>git add .</b> : 현재 변경 사항들을 모두 스테이지에 올리기
2. <b>git commit -m"message"</b> : 현재 스테이징된 변경 사항들을 모두 한 커밋에 등록
3. <b>git pull --rebase origin master</b> : 현재 remote 즉, github에 반영된 최신 사항들을 로컬 즉, 내 컴퓨터와 최신화 시켜주기
4. <b>git push origin master</b> : 저장소에 내 커밋 내역들을 업데이트
5. <b>git stash / git stash pop</b> : 임시 브랜치에 현재 변경사항들을 저장하기 / 저장한 변경사항 다시 불러오기
   현재는 브랜치가 master 한개라서 origin master는 생략해도 됩니다.

### 기본 설정

1. vscode 확장 프로그램에서 "<b>Prettier</b>" 설치 후, vscode 다시 시작
   ![one](https://github.com/jewdri-kim/workflow/assets/69615320/2b882abd-94d6-460d-bb79-c76e0a253a5b)

2. 우측 하단 "<b>공백</b>" 클릭해서 들여쓰기 칸 <b>2</b>로 변경<br/>
   ![two](https://github.com/jewdri-kim/workflow/assets/69615320/a5a1e359-0ce4-4fe7-a70b-e0e20b54bee0)
   ![three](https://github.com/jewdri-kim/workflow/assets/69615320/07aec3c0-08a4-4618-b9bc-19044b2a6730)

### class 명

> <b>명사-feature </b>

- 명사-wrap
- 명사-group
- 명사-box
- 명사-item
- ex) form-wrap, form-group, form-box, form-item
