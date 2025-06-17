## 웹 디자인 예상도

![현대자동차그룹 통합 재고관리 데이터베이스](https://github.com/user-attachments/assets/314a8b02-30db-4d3f-9322-26e162ca7bd3)

<br>

## 초기 아키텍처 구조

![image](https://github.com/user-attachments/assets/afa2992b-92e5-4dea-84b7-0a9a2784b585)

<br>

## 🚀 서비스 운영 시나리오 및 아키텍처 개요

이 프로젝트는 부품 정보를 효율적으로 관리하고 제공하는 웹 서비스로, React 프런트엔드, Django 백엔드 API 서버, 그리고 실시간 데이터 동기화가 이루어지는 이중화된 데이터베이스 시스템을 기반으로 구축됩니다. 
사용자 역할(Admin/Guest)에 따른 명확한 권한 분리와 데이터 흐름 최적화를 통해 안정적이고 빠른 서비스 경험을 제공합니다.

<br>

### 1. 초기 설정 및 배포
서비스 시작을 위한 핵심 구성 요소들의 초기 설정 과정은 다음과 같습니다.

데이터베이스 설정:

``MySQL (쓰기 전용)``: 부품 정보 (parts) 및 사용자 인증 정보 (users)를 관리하는 주 데이터베이스 스키마를 정의하고 생성합니다. 모든 데이터 쓰기 작업(생성, 수정, 삭제)은 이 MySQL을 통해 이루어집니다.

``MongoDB (읽기 전용``): MySQL의 부품 데이터를 실시간으로 동기화하여 저장할 컬렉션을 준비합니다. 서비스의 모든 부품 정보 조회 요청은 이 MongoDB를 통해 처리됩니다.

``Kafka Connect (CDC 도구 활용)``:

Debezium MySQL Connector: MySQL의 변경 로그(Binlog)를 실시간으로 감지하여, 데이터 변경 이벤트(Create, Update, Delete)를 Kafka 토픽으로 발행합니다.

MongoDB Sink Connector: 해당 Kafka 토픽을 구독하여 MySQL에서 발생한 변경 이벤트를 MongoDB로 실시간 동기화합니다. 이를 통해 MySQL과 MongoDB 간의 데이터 일관성을 유지합니다.

Django 백엔드 API 서버 구축:

데이터베이스 연결 설정: settings.py에서 MySQL (쓰기 전용)과 MongoDB (읽기 전용) 연결을 각각 설정하고, 데이터베이스 라우터를 통해 읽기/쓰기 작업을 분리 처리하도록 구성합니다.

사용자 인증 및 권한 관리:

Admin (현대 블루핸즈 지점): 지점명(ID)과 전화번호(PW)를 이용한 인증을 통해 로그인하며, 데이터베이스에 대한 모든 수정, 삭제, 속성 추가 권한을 가집니다. JWT(JSON Web Token) 기반 인증을 사용합니다.

Guest (일반 클라이언트): 특정 ID(예: 'a', 'b', 'c')로 비밀번호 없이 로그인하며, 부품 정보 읽기만 가능한 제한된 권한을 가집니다.

API 엔드포인트 구현:

Admin용 API: 부품 추가(POST), 수정(PUT/PATCH), 삭제(DELETE) 등 MySQL에 직접 접근하는 쓰기 작업을 위한 RESTful API를 제공합니다.

공통 조회 API: Admin과 Guest 모두를 위한 부품 정보 조회(GET) API를 구현하며, 이는 MongoDB에서 데이터를 조회하여 빠른 응답을 보장합니다.

React 프런트엔드 구축 (hyundai-fe/):

로그인 페이지: Admin과 Guest 사용자를 위한 직관적인 로그인 인터페이스를 구현합니다.

Admin 대시보드: 로그인한 Admin 사용자를 위한 부품 목록 조회, 추가, 수정, 삭제 기능을 제공하는 관리자 UI를 구현합니다. 백엔드의 Admin용 쓰기 API와 연동됩니다.

Guest 페이지: 부품 목록 조회 기능을 제공하는 사용자 UI를 구현합니다. 백엔드의 읽기 전용 API와 연동됩니다.

### 2. 서비스 운영
배포 후 실제 서비스 운영 시나리오는 다음과 같은 데이터 흐름을 따릅니다.

사용자 인증 및 권한 부여:

Admin: React 로그인 페이지에서 지점명과 전화번호로 인증하면, JWT 토큰을 발급받아 이후 관리자 페이지에서 모든 API 요청에 사용합니다.

Guest: 주어진 ID로 로그인하면, 읽기 전용 권한을 가진 토큰을 발급받아 부품 조회 페이지에 접근합니다.

데이터 흐름 (Admin 작업 시 - 데이터 쓰기):

Admin이 React UI에서 부품 정보를 추가/수정/삭제합니다.

React는 Django 백엔드의 쓰기 전용 API로 요청을 보냅니다.

Django 백엔드는 데이터베이스 라우터를 통해 요청을 MySQL로 라우팅하고, MySQL에 해당 변경 사항을 반영합니다.

MySQL에서 데이터 변경 이벤트가 발생하면 Debezium MySQL Connector가 이를 감지하여 Kafka 토픽으로 변경 메시지를 발행합니다.

MongoDB Sink Connector가 해당 Kafka 토픽을 구독하고, 메시지 내용을 파싱하여 MongoDB에 동일한 변경 사항을 실시간으로 적용(동기화)합니다.

데이터 흐름 (클라이언트 조회 시 - 데이터 읽기):

Admin 또는 Guest가 React UI에서 부품 정보 조회를 요청합니다.

React는 Django 백엔드의 읽기 전용 API로 요청을 보냅니다.

Django 백엔드는 데이터베이스 라우터를 통해 요청을 MongoDB로 라우팅하고, MongoDB에서 부품 데이터를 조회하여 클라이언트에 빠르게 응답합니다.
모니터링 및 테스트:

API 테스트: 개발 및 운영 중 Postman과 같은 도구를 사용하여 Django 백엔드의 모든 API 엔드포인트가 예상대로 작동하는지 지속적으로 테스트하고 검증합니다.

데이터 일관성 모니터링: Kafka와 데이터베이스 동기화 상태를 상시 모니터링하여 MySQL과 MongoDB 간의 데이터 일관성이 유지되는지 확인합니다.


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

