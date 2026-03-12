from rest_framework.routers import DefaultRouter
from .views import MarcaViewSet, ModeloViewSet, ColorViewSet, TallaViewSet

router = DefaultRouter()
router.register(r'marcas', MarcaViewSet)
router.register(r'modelos', ModeloViewSet)
router.register(r'colores', ColorViewSet)
router.register(r'tallas', TallaViewSet)

urlpatterns = router.urls