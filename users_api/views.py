from django.shortcuts import render

# Create your views here.
# C:\Users\nexon\hyundaiautoever_sideproject\users_api\views.py

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer