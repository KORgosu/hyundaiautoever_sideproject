# C:\Users\nexon\hyundaiautoever_sideproject\parts_api\views.py

from rest_framework import generics, permissions
from .models import Part
from .serializers import PartSerializer

# 모든 사용자 (로그인하지 않은 게스트 포함)가 부품 목록을 볼 수 있는 뷰
class GuestPartListView(generics.ListAPIView):
    queryset = Part.objects.all()
    serializer_class = PartSerializer
    permission_classes = [permissions.AllowAny] # 누구나 접근 허용

# 관리자만 부품 목록을 관리 (생성, 목록 조회)할 수 있는 뷰
class AdminPartListView(generics.ListCreateAPIView): # List와 Create 가능
    queryset = Part.objects.all()
    serializer_class = PartSerializer
    # is_staff 또는 is_superuser 권한이 있는 사용자만 접근 허용
    permission_classes = [permissions.IsAdminUser] # Django admin (is_staff=True) 권한 필요

# 관리자만 특정 부품을 상세 조회, 수정, 삭제할 수 있는 뷰
class AdminPartDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Part.objects.all()
    serializer_class = PartSerializer
    permission_classes = [permissions.IsAdminUser]
