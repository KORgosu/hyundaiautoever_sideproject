# C:\Users\nexon\hyundaiautoever_sideproject\parts_api\admin.py

from django.contrib import admin
from .models import Part # Part 모델 임포트 확인

@admin.register(Part)
class PartAdmin(admin.ModelAdmin):
    # 'part_id' -> 'part_code'
    # 'part_name' -> 'name'
    # 'category' 삭제 (모델에 없으므로)
    # 'stock_quantity' -> 'quantity'
    list_display = (
        'part_code',      # 이전 'part_id'
        'name',           # 이전 'part_name'
        'manufacturer',
        'model',          # 'model' 추가 (MariaDB 컬럼에 있으므로)
        'quantity',       # 이전 'stock_quantity'
        'price',
        'location',
        'created_at',
        'updated_at'
    )
    # 'category' 필터 삭제 (모델에 없으므로)
    list_filter = (
        'manufacturer',
        'model',          # 'model'로 필터링 가능하도록 추가 (선택 사항)
        'location',
        # 'category', # 이 줄은 삭제
    )
    search_fields = (
        'part_code',
        'name',
        'manufacturer',
        'model',
        'description'
    )
    ordering = ('part_code',) # 정렬 기준도 part_id -> part_code로 변경
    readonly_fields = ('created_at', 'updated_at') # 생성 및 수정일은 읽기 전용으로 설정