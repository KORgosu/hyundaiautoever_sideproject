class PrimaryReplicaRouter:
    """
    데이터베이스 작업을 제어하는 라우터입니다.
    parts_api 모델의 읽기 작업은 MongoDB로, 쓰기 작업은 MySQL로 라우팅합니다.
    users_api 및 Django 기본 앱은 모두 MySQL을 사용합니다.
    """
    route_app_labels = {'parts_api', 'users_api'} # MySQL에 저장될 앱들 (여기서는 쓰기만 해당)

    def db_for_read(self, model, **hints):
        """
        모델을 읽을 때 사용할 데이터베이스를 결정합니다.
        parts_api 모델은 MongoDB에서 읽습니다.
        그 외 모든 모델은 default (MySQL)에서 읽습니다.
        """
        if model._meta.app_label == 'parts_api':
            return 'mongodb' # parts_api 모델은 읽기 시 mongodb 사용
        return 'default' # 그 외는 default (MySQL) 사용

    def db_for_write(self, model, **hints):
        """
        모델을 쓸 때 사용할 데이터베이스를 결정합니다.
        parts_api 및 users_api 모델은 default (MySQL)에 씁니다.
        """
        if model._meta.app_label in self.route_app_labels:
            return 'default' # parts_api와 users_api 모델은 쓰기 시 default (MySQL) 사용
        return 'default' # 그 외도 default 사용 (혹은 None으로 다른 라우터에 위임)

    def allow_relation(self, obj1, obj2, **hints):
        """
        두 객체 간의 관계를 허용할지 여부를 결정합니다.
        기본적으로 모든 관계는 default(MySQL) 안에서 허용합니다.
        """
        # 예를 들어, parts_api 모델과 users_api 모델 간의 관계가 있다면,
        # 이들은 모두 MySQL에 쓰여지므로 관계를 허용합니다.
        if obj1._meta.app_label in self.route_app_labels and \
           obj2._meta.app_label in self.route_app_labels:
            return True
        # 다른 앱 간의 관계도 default DB 내에서 허용
        if obj1._meta.app_label not in self.route_app_labels and \
           obj2._meta.app_label not in self.route_app_labels and \
           'default' in (self.db_for_read(obj1), self.db_for_read(obj2)):
            return True
        return None # Django 기본 라우터에 위임하거나 관계 불허

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        어떤 앱의 모델이 어떤 데이터베이스에 마이그레이션될지 결정합니다.
        Django 기본 앱 (admin, auth 등), users_api, parts_api는 'default' (MySQL)에만 마이그레이션합니다.
        MongoDB에는 어떤 마이그레이션도 수행하지 않습니다 (스키마리스이므로).
        """
        # parts_api, users_api는 default (MySQL)에만 마이그레이션되어야 합니다.
        # MySQL에 있는 users 테이블과 parts 테이블을 관리할 것이므로.
        if app_label in self.route_app_labels:
            return db == 'default'

        # Django의 기본 앱들도 default (MySQL)에 마이그레이션되어야 합니다.
        if app_label in ['admin', 'auth', 'contenttypes', 'sessions']:
            return db == 'default'

        # MongoDB에는 어떤 테이블도 마이그레이션하지 않습니다.
        if db == 'mongodb':
            return False

        # 그 외의 앱이나 경우 (예: 테스트 데이터베이스 등)는 Django의 기본 동작에 맡김
        return None