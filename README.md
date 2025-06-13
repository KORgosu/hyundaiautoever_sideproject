
# hyundaiautoever_sideproject - 초기 구동 매뉴얼
이 문서는 hyundaiautoever_sideproject 프로젝트를 처음부터 다시 실행하기 위한 가이드입니다.

개발 환경이 이미 설정되어 있고, 필요한 파일들이 올바른 위치에 있다고 가정합니다.

## 🛠 전제 조건
```
다음 프로그램들이 사전에 설치되어 있어야 합니다:

- Python (3.9 이상 권장)
- Node.js & npm (또는 Yarn)
- MySQL Server (XAMPP, Docker, 또는 직접 설치)
- MongoDB Server (MongoDB Community Server 등)
- hyundaiautoever_sideproject 폴더 내 프로젝트 파일
```
<br>

## 🛠 hyundaiautoever_sideproject 프로젝트 구조
```
hyundaiautoever_sideproject/
├── project_settings/
│   ├── settings.py           # 프로젝트의 모든 설정 정의 (데이터베이스, 앱, 미들웨어 등)
│   ├── urls.py               # 프로젝트의 메인 URL 라우팅 정의
│   ├── wsgi.py               # WSGI 서버 진입점
│   └── db_routers.py         # 데이터베이스 라우터 (읽기/쓰기 분리 로직)
├── parts_api/                # Django 앱: 부품 관련 API
│   ├── __init__.py           # Python 패키지임을 나타냄
│   ├── admin.py              # Django Admin 사이트 등록
│   ├── apps.py               # 앱 설정
│   ├── models.py             # 부품 데이터베이스 모델 정의
│   ├── views.py              # 부품 관련 HTTP 요청 처리 로직 (REST API 뷰)
│   ├── urls.py               # 부품 API 앱 내의 URL 패턴 정의
│   └── tests.py              # 부품 API 테스트 코드
└── users_api/                # Django 앱: 사용자 관련 API 및 인증
    ├── __init__.py           # Python 패키지임을 나타냄
    ├── admin.py              # Django Admin 사이트 등록
    ├── apps.py               # 앱 설정
    ├── models.py             # 사용자 데이터베이스 모델 정의
    ├── views.py              # 사용자 관련 HTTP 요청 처리 로직 (인증, 가입 등)
    ├── urls.py               # 사용자 API 앱 내의 URL 패턴 정의
    └── tests.py              # 사용자 API 테스트 코드
 ```
### 주요 파일/폴더 및 기능 설명
```
``hyundaiautoever_sideproject/`` (프로젝트 루트 디렉토리)

``manage.py`` : Django 프로젝트를 관리하는 핵심 스크립트입니다. 서버 실행, 데이터베이스 마이그레이션 등 Django 명령을 수행합니다.
``venv_project/``: 이 프로젝트의 Python 가상 환경이 위치하는 디렉토리입니다. 프로젝트에 필요한 Python 패키지들이 여기에 격리되어 설치됩니다.
``hyundai-fe/``: React 프런트엔드 애플리케이션의 루트 디렉토리입니다. 사용자가 웹 브라우저를 통해 상호작용하는 UI/UX 부분이 여기에 구현됩니다. 내부에는 package.json, src/, public/ 등 React 프로젝트 관련 파일들이 있을 것입니다.
``project_settings/`` (메인 Django 프로젝트 설정 디렉토리)

``settings.py`` : 프로젝트의 모든 전역 설정을 정의하는 파일입니다. 설치된 앱 목록, 미들웨어, CORS 설정, 그리고 MySQL/MariaDB 및 MongoDB를 포함한 데이터베이스 연결 정보가 정의되어 있습니다. 또한 Django REST Framework 및 Simple JWT 인증 관련 설정도 포함합니다.
``urls.py`` : 전체 Django 프로젝트의 URL 라우팅을 담당합니다. 각 개별 앱(parts_api, users_api)의 URL 패턴을 이곳에서 연결합니다.
``wsgi.py`` : 웹 서버 게이트웨이 인터페이스(WSGI) 파일로, 웹 서버가 Django 애플리케이션을 실행하기 위한 진입점 역할을 합니다.
``db_routers.py`` : settings.py에 DATABASE_ROUTERS로 설정되어 있는 파일입니다. Django ORM이 데이터베이스 작업을 수행할 때, 읽기 작업은 MongoDB로, 쓰기 작업은 MySQL/MariaDB로 분리하여 라우팅하는 로직이 구현되어 있을 것으로 예상됩니다.
``parts_api/`` (Django 앱)

자동차 부품과 관련된 데이터를 처리하는 API를 구현한 Django 애플리케이션입니다.

models.py: 부품(Parts)에 대한 데이터베이스 스키마(모델)가 정의되어 있습니다.
views.py: 부품 정보 조회, 추가, 수정, 삭제 등의 RESTful API 로직이 구현되어 있습니다.
urls.py: parts_api 앱 내의 URL 경로를 정의합니다.
users_api/ (Django 앱)

사용자 계정 및 인증(로그인, 회원가입 등) 기능을 처리하는 API를 구현한 Django 애플리케이션입니다.
models.py: 사용자(User) 관련 데이터 모델이 정의되어 있습니다.
views.py: 사용자 인증, 토큰 발급 및 갱신, 회원가입 등 사용자 관련 RESTful API 로직이 구현되어 있습니다. Simple JWT를 활용한 인증 메커니즘이 포함될 것입니다.
urls.py: users_api 앱 내의 URL 경로를 정의합니다.
```
<br>

### 1️⃣ 백엔드 구동 (Django + MySQL + MongoDB)
#### 1.1 MongoDB 서버 실행
GUI 도구 사용 시:

MongoDB Compass에서 서버 연결 상태 확인

CLI 사용 시 (예시 경로 기준):

bash
cd "C:\Program Files\MongoDB\Server\6.0\bin"
mongod.exe --dbpath C:\path\to\your\mongodb\data
waiting for connections on port 27017 메시지가 뜨면 정상입니다. 해당 창은 닫지 마세요.

1.2 MySQL 서버 실행
XAMPP: XAMPP Control Panel에서 Apache와 MySQL 시작

Docker: MySQL 컨테이너 실행 확인

직접 설치: MySQL 서비스가 실행 중인지 확인

1.3 Django 서버 실행
터미널을 열고 프로젝트 루트로 이동:

bash
복사
편집
cd C:\Users\nexon\hyundaiautoever_sideproject
Python 가상 환경 활성화:

bash
복사
편집
.\venv_project\Scripts\activate
프롬프트에 (venv_project)가 보이면 활성화 완료

Django 개발 서버 시작:

bash
복사
편집
python manage.py runserver
http://127.0.0.1:8000/에서 서버가 정상 실행되는지 확인. 이 창도 닫지 마세요.

2️⃣ 프런트엔드 구동 (React)
새 터미널을 열고 React 프로젝트 디렉토리로 이동:

bash
복사
편집
cd C:\Users\nexon\hyundaiautoever_sideproject\hyundai-fe
React 개발 서버 시작:

bash
복사
편집
npm start
npm이 없다면 yarn start로 시도
브라우저에서 http://localhost:3000/ 자동 실행

3️⃣ 기능 테스트
웹 브라우저에서 http://localhost:3000/ 접속 후 다음 사항을 확인:

olyn 계정 로그인 → 관리자 대시보드로 이동:
http://localhost:3000/admin-dashboard

게스트 사용자 로그인 또는 미로그인 → 게스트 페이지로 이동:
http://localhost:3000/guest-page

각 페이지에서 부품 목록 정상 표시 및
관리자 대시보드의 추가/수정/삭제 기능 확인

🔁 참고 사항
각 서버(MongoDB, MySQL, Django, React)는 각기 다른 터미널에서 실행되어야 합니다.

서버 재시작이 필요할 경우: 해당 터미널에서 Ctrl + C → 다시 시작

settings.py 등 중요 파일 수정 시 관련 서버 재시작 필수

📌 기타
.env, settings.py, config.js 등 환경 설정 파일의 보안에 유의하세요.

운영 배포 시에는 DEBUG=False, CORS 설정 등을 점검하세요.

<br>

## 프리뷰

![현대자동차그룹 통합 재고관리 데이터베이스](https://github.com/user-attachments/assets/314a8b02-30db-4d3f-9322-26e162ca7bd3)

<br>

## 아키텍처 구조

![image](https://github.com/user-attachments/assets/afa2992b-92e5-4dea-84b7-0a9a2784b585)
