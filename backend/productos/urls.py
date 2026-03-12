from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet, exportar_productos_excel, cargar_productos_excel, ficha_producto_pdf


router = DefaultRouter()
router.register(r'productos', ProductoViewSet)

urlpatterns = [
    path("productos/exportar_excel/", exportar_productos_excel, name="exportar_productos_excel"),
    path("productos/cargar_excel/", cargar_productos_excel, name="cargar_productos_excel"),
    path("productos/<int:pk>/pdf/", ficha_producto_pdf, name="ficha_producto_pdf"),
]

urlpatterns += router.urls