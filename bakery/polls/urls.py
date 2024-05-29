from django.urls import path,include
from polls import views
from rest_framework import routers, serializers, viewsets

router = routers.DefaultRouter()
router.register(r'personas', views.PersonaViewSet)
router.register(r'clientes', views.ClienteViewSet)
router.register(r'administradores', views.AdministradorViewSet)
router.register(r'domiciliarios', views.DomiciliarioViewSet)
router.register(r'direcciones', views.DireccionViewSet)
router.register(r'telefonos', views.TelefonoViewSet)
router.register(r'categorias', views.CategoriaViewSet)
router.register(r'horarios', views.HorarioViewSet)
router.register(r'productos', views.ProductoViewSet)
router.register(r'asignaciones', views.AsignacionViewSet)
router.register(r'pedidos', views.PedidoViewSet)
router.register(r'detalles', views.DetalleViewSet)
router.register(r'domicilios', views.DomicilioViewSet)

urlpatterns = [
    path("", views.index, name="index"),
    #ex polls/1001/
    path("<int:cod>/", views.detail, name="detail"),
    path("api/v1/",include(router.urls)),
    path('api/product-sales/', views.ProductSalesAPIView.as_view()),
    path('api/delivery-times/', views.DeliveryTimeAPIView.as_view()),
    path('api/expired/', views.ExpiredAPIView.as_view()),
    path('api/orders-by-date/', views.OrdersByDateAPIView.as_view()),
    path('api/available/', views.AvailableAPIView.as_view()),
    path('toggledom/<int:dom_cod>/', views.DomiciliarioToggle.as_view()),
    path('renew/<int:dom_cod>/', views.Renew.as_view()),
    path('pay/<int:cod_pedido>/', views.PagarPedido.as_view()),
    path('send/<int:codigo>/', views.EnviarPedido.as_view()),
    path('totalpedido/<int:codigo>/', views.ValorTotalPedido.as_view())
]