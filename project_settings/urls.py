# C:\Users\nexon\hyundaiautoever_sideproject\project_settings\urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from users_api.views import MyTokenObtainPairView # <-- MyTokenObtainPairView import 확인

urlpatterns = [
    path('admin/', admin.site.urls),
    # 더 구체적인 토큰 관련 API 경로를 먼저 배치
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # 그 다음에 각 앱의 API 경로를 포함
    path('api/', include('parts_api.urls')),
    path('api/', include('users_api.urls')),
]
