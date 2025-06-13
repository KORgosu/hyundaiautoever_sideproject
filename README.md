## 웹 디자인 예상도

![현대자동차그룹 통합 재고관리 데이터베이스](https://github.com/user-attachments/assets/314a8b02-30db-4d3f-9322-26e162ca7bd3)

<br>

## 초기 아키텍처 구조

![image](https://github.com/user-attachments/assets/afa2992b-92e5-4dea-84b7-0a9a2784b585)

<br>

# hyundaiautoever_sideproject 구동 매뉴얼
이 문서는 hyundaiautoever_sideproject 프로젝트를 처음부터 다시 실행하기 위한 가이드입니다.

개발 환경이 이미 설정되어 있고, 필요한 파일들이 올바른 위치에 있다고 가정합니다.

<br>

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
### 📁 프로젝트 디렉토리 구조 및 설명
| 경로                               | 설명                                                 |
| -------------------------------- | -------------------------------------------------- |
| `hyundaiautoever_sideproject/`   | 프로젝트 루트 디렉토리                                       |
| `manage.py`                      | Django 명령 실행 스크립트 (서버 실행, 마이그레이션 등)                |
| `venv_project/`                  | Python 가상 환경 디렉토리 (패키지 격리 설치)                      |
| `hyundai-fe/`                    | React 프런트엔드 루트 디렉토리 (UI/UX 구현)                     |
| `project_settings/`              | Django 프로젝트 설정 디렉토리                                |
| `project_settings/settings.py`   | 앱 등록, 미들웨어, CORS, MySQL+MongoDB 설정, DRF, JWT 설정 포함 |
| `project_settings/urls.py`       | Django 전체 URL 라우팅 정의                               |
| `project_settings/wsgi.py`       | WSGI 서버 진입점 (운영 환경용)                               |
| `project_settings/db_routers.py` | 읽기(MongoDB)/쓰기(MySQL) DB 라우팅 설정                    |
| `parts_api/`                     | 부품 관련 Django 앱 (API 제공)                            |
| `parts_api/models.py`            | 부품 데이터 모델 정의                                       |
| `parts_api/views.py`             | 부품 정보 CRUD 등의 REST API 처리                          |
| `parts_api/urls.py`              | 부품 API의 URL 경로 정의                                  |
| `users_api/`                     | 사용자 인증 관련 Django 앱                                 |
| `users_api/models.py`            | 사용자 데이터 모델 정의                                      |
| `users_api/views.py`             | 로그인, 회원가입, JWT 인증 처리                               |
| `users_api/urls.py`              | 사용자 API의 URL 경로 정의                                 |

<br>

## 1️⃣ 백엔드 구동 (Django + MySQL + MongoDB)
#### 1.1 MongoDB 서버 실행

GUI 도구 사용 시:

MongoDB Compass에서 서버 연결 상태 확인


CLI 사용 시 (예시 경로 기준):
``cd "C:\Program Files\MongoDB\Server\6.0\bin"``
``mongod.exe --dbpath C:\path\to\your\mongodb\data``
waiting for connections on port 27017 메시지가 뜨면 정상입니다. 해당 창은 닫지 마세요.


#### 1.2 MySQL 서버 실행
XAMPP: XAMPP Control Panel에서 Apache와 MySQL 시작

Docker: MySQL 컨테이너 실행 확인

직접 설치: MySQL 서비스가 실행 중인지 확인

<br>

#### 1.3 Django 서버 실행
터미널을 열고 프로젝트 루트로 이동: ``cd C:\Users\nexon\hyundaiautoever_sideproject``

Python 가상 환경 활성화: ``.\venv_project\Scripts\activate``

프롬프트에 (venv_project)가 보이면 활성화 완료

<br>

Django 개발 서버 시작: ``python manage.py runserver``

http://127.0.0.1:8000/에서 서버가 정상 실행되는지 확인. 이 창도 닫지 마세요.

<br>

## 2️⃣ 프런트엔드 구동 (React)
새 터미널을 열고 React 프로젝트 디렉토리로 이동 : ``cd C:\Users\nexon\hyundaiautoever_sideproject\hyundai-fe``

React 개발 서버 시작: ``npm start``

npm이 없다면 ``yarn start``로 시도

브라우저에서 http://localhost:3000/ 자동 실행

<br>

## 3️⃣ 기능 테스트
웹 브라우저에서 http://localhost:3000/ 접속 후 다음 사항을 확인:

olyn 계정 로그인 → 관리자 대시보드로 이동:

http://localhost:3000/admin-dashboard

여기서 ID는 olyn, Password는 0960

<br>

게스트 사용자 로그인 또는 미로그인 → 게스트 페이지로 이동:

http://localhost:3000/guest-page

각 페이지에서 부품 목록 정상 표시 및 관리자 대시보드의 추가/수정/삭제 기능 확인

<br>

## 🔁 참고 사항
각 서버(MongoDB, MySQL, Django, React)는 각기 다른 터미널에서 실행되어야 합니다.

서버 재시작이 필요할 경우: 해당 터미널에서 ``Ctrl + C`` → 다시 시작

``settings.py`` 등 중요 파일 수정 시 관련 서버 재시작 필수

<br>

## 📌 기타
``.env``, ``settings.py``, ``config.js`` 등 환경 설정 파일의 보안에 유의하세요.

운영 배포 시에는 ``DEBUG=False``, ``CORS`` 설정 등을 점검하세요.

