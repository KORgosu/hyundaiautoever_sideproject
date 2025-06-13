from django.db import models
from djongo import models as djongo_models # MongoDB 모델을 위한 djongo.models 임포트

# C:\Users\nexon\hyundaiautoever_sideproject\parts_api\models.py

from django.db import models

class Part(models.Model):
    # MariaDB 컬럼명에 맞춥니다.
    # 'id'는 Django가 자동으로 생성하는 기본 키이므로 별도 정의가 없다면 그대로 사용합니다.
    # Part ID는 MariaDB의 'part_code' 컬럼에 매핑됩니다.
    part_code = models.CharField(max_length=50, unique=True, verbose_name="부품 코드")
    name = models.CharField(max_length=100, verbose_name="부품명") # React의 part_name -> name
    manufacturer = models.CharField(max_length=100, null=True, blank=True, verbose_name="제조사")
    model = models.CharField(max_length=100, null=True, blank=True, verbose_name="모델") # MariaDB에 'model' 컬럼이 있으니 추가
    quantity = models.IntegerField(verbose_name="재고 수량") # React의 stock_quantity -> quantity
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="가격")
    location = models.CharField(max_length=255, null=True, blank=True, verbose_name="보관 위치")
    description = models.TextField(null=True, blank=True, verbose_name="설명")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="생성일")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="수정일")

    # 'category'는 MariaDB 컬럼에 없으므로, 필요 없으면 제거하거나 다른 방식으로 처리해야 합니다.
    # 현재는 제거합니다.

    class Meta:
        db_table = 'parts' # 실제 MariaDB 테이블 이름이 'parts'인 경우
        verbose_name = '부품'
        verbose_name_plural = '부품들'

    def __str__(self):
        return self.name

# Kafka를 통해 동기화된 MongoDB의 읽기 전용 부품 데이터를 위한 모델
# 이 모델은 마이그레이션되지 않고, 단지 읽기 전용으로 사용됩니다.
class PartRead(djongo_models.Model):
    # MongoDB의 _id는 자동으로 처리되므로 별도로 정의하지 않습니다.
    part_id = djongo_models.CharField(max_length=50, unique=True) # MongoDB의 part_id는 unique
    part_name = djongo_models.CharField(max_length=255)
    description = djongo_models.TextField(blank=True, null=True)
    price = djongo_models.FloatField() # MongoDB는 DecimalField 대신 FloatField 사용
    stock_quantity = djongo_models.IntegerField()
    manufacturer = djongo_models.CharField(max_length=100)
    category = djongo_models.CharField(max_length=100)
    location = djongo_models.CharField(max_length=100, blank=True, null=True)
    created_at = djongo_models.DateTimeField()
    updated_at = djongo_models.DateTimeField()

    class Meta:
        # 이 모델은 MongoDB의 'parts_collection'과 연결됩니다.
        # Djongo가 자동으로 _id를 처리하므로 primary_key=True를 설정할 필요 없습니다.
        db_table = 'parts_collection' # MongoDB의 컬렉션 이름
        managed = False # 이 모델은 Django 마이그레이션이 관리하지 않음을 명시 (Kafka로 동기화되므로)
        verbose_name = 'Part (Read-Only)'
        verbose_name_plural = 'Parts (Read-Only)'

    def __str__(self):
        return f"{self.part_name} (R/O)"
