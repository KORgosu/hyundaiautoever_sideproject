# C:\Users\nexon\hyundaiautoever_sideproject\parts_api\serializers.py

from rest_framework import serializers
from .models import Part

class PartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Part
        # 변경된 MariaDB 컬럼명에 맞는 필드 이름을 여기에 작성합니다.
        fields = [
            'part_code', 'name', 'manufacturer', 'model',
            'quantity', 'price', 'location', 'description',
            'created_at', 'updated_at'
        ]
        # 자동으로 생성되는 필드는 read_only_fields에 추가하여 POST/PUT 시 제외합니다.
        read_only_fields = ['created_at', 'updated_at']