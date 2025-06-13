# C:\Users\nexon\hyundaiautoever_sideproject\users_api\serializers.py

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # 사용자 정의 클레임 추가
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser
        token['email'] = user.email # 필요하다면 이메일도 추가 (예: AdminDashboard에 사용자 이메일 표시 등)
        token['username'] = user.username # 필요하다면 사용자 이름도 추가

        return token