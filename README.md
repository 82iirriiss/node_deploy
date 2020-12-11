# node_deploy

# AWS Lightseil 배포
1. 웹서버 인스턴스 생성
2. mysql 데이터베이스 인스턴스 생성
3. 고정 ip 생성
===============================
비용이 청구되므로, 배포시험 후 모두 정지 - 삭제 해야 함

# 배포시 소스 수정
1. ./config/config.js 의 'production' db 정보 aws 에서 생성한 정보로 변경
2. helmet, hpp 패키지 때문에 빌드 에러남. 사용부분 주석처리 할 것.
