# C:\Users\nexon\hyundaiautoever_sideproject\parts_api\urls.py

from django.urls import path
from .views import GuestPartListView, AdminPartListView, AdminPartDetailView # <-- 뷰 임포트

urlpatterns = [
    # 게스트용 부품 목록 조회 (로그인 없이 접근 가능)
    path('guest-parts/', GuestPartListView.as_view(), name='guest-part-list'),

    # 관리자용 부품 목록 조회 및 생성 (관리자 권한 필요)
    path('admin-parts/', AdminPartListView.as_view(), name='admin-part-list'),

    # 관리자용 특정 부품 상세 조회, 수정, 삭제 (관리자 권한 필요, id로 접근)
    path('admin-parts/<int:pk>/', AdminPartDetailView.as_view(), name='admin-part-detail'),
]