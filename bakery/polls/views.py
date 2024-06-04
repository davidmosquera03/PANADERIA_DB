from django.http import HttpResponse
from polls.models import *
from rest_framework import viewsets,status, permissions
from rest_framework.response import Response
from .serializer import *
from django.shortcuts import render,get_object_or_404
from rest_framework.views import APIView
from django.db import connection
from .permissions import CustomReadOnly
from django.utils import timezone


#unidades vendidas por producto
query_unidprod = """
            SELECT p.nombre, SUM(d.cantidad) AS total_vendido
            FROM producto p
            JOIN detalle d ON p.cod = d.cod_producto_id
            GROUP BY p.nombre
            ORDER BY total_vendido DESC
        """

#tiempo de entrega H:M de domicilios
query_tiempoentrega = """
SELECT
  cod,
  EXTRACT(HOUR FROM (TO_TIMESTAMP(hora_entrega, 'HH24:MI') - TO_TIMESTAMP(hora_envio, 'HH24:MI'))) AS horas,
  EXTRACT(MINUTE FROM (TO_TIMESTAMP(hora_entrega, 'HH24:MI') - TO_TIMESTAMP(hora_envio, 'HH24:MI'))) AS minutos
FROM domicilio
"""

#domiciliario licencia vencida
query_vencidos = """
SELECT cod
FROM domiciliario
WHERE fecha_vencimiento < SYSDATE
"""
# no. pedidos por dia
query_pedxdia = """
select fecha,count(*)as pedidos from pedido group by fecha
"""

#domiciliario en horario disponible (no atendiendo)
query_domdisponible = """
    select asig.cod_dom from asignacion asig 
    join (select SEQ from horario  
    where TRIM(dia) = TRIM(TO_CHAR(SYSDATE, 'Day', 'NLS_DATE_LANGUAGE = ''SPANISH'''))
    AND TO_CHAR(SYSDATE, 'HH24:MI') BETWEEN hora_inicio AND hora_fin) sub
    on asig.seq_hor = sub.seq join domiciliario dom 
    on asig.cod_dom = dom.cod
    where dom.atendiendo='N'
"""

class ProductSalesAPIView(APIView):
    """
    Devuelve las unidades vendidas por producto
    """
    permission_classes = [CustomReadOnly]
    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute(query_unidprod)
            results = cursor.fetchall()

        product_sales = [{'nombre': row[0], 'total_vendido': row[1]} for row in results]
        serializer = ProductSalesSerializer(product_sales, many=True)
        return Response(serializer.data)
    
class DeliveryTimeAPIView(APIView):
    """
    Devuelve los tiempos de entrega de cada domicilio
    """
    permission_classes = [CustomReadOnly]
    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute(query_tiempoentrega)
            results = cursor.fetchall()

        delivery_times = [{'cod':row[0],'horas': row[1], 'minutos': row[2]} for row in results]
        serializer = DeliveryTimeSerializer(delivery_times, many=True)
        return Response(serializer.data)


class ExpiredAPIView(APIView):
    """
    Devuelve codigo de domiciliario con licencia vencida
    """
    permission_classes = [CustomReadOnly]
    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute(query_vencidos)
            results = cursor.fetchall()

        expired = [{'cod':row[0]} for row in results]
        serializer = DeliveryTimeSerializer(expired, many=True)
        return Response(serializer.data)
    
# No. pedidos por dia
class OrdersByDateAPIView(APIView):
    permission_classes = [CustomReadOnly]

    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute(query_pedxdia)
            results = cursor.fetchall()

        orders_by_date = [{'fecha': row[0], 'pedidos': row[1]} for row in results]
        serializer = OrdersByDateSerializer(orders_by_date, many=True)
        return Response(serializer.data)
    
# codigo de domiciliarios disponibles    
class AvailableAPIView(APIView):
    permission_classes = [CustomReadOnly]

    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute(query_domdisponible)
            results = cursor.fetchall()

        disponible = [{'cod':row[0]} for row in results]
        serializer = AvailableSerializer(disponible, many=True)
        return Response(serializer.data)

# cambia si un domiciliario puede atender o no
class DomiciliarioToggle(APIView):
    permission_classes = [CustomReadOnly]
    def get(self, request, dom_cod):
        domi = get_object_or_404(Domiciliario, cod=dom_cod)
        domi.atendiendo = 'N' if domi.atendiendo == 'Y' else 'Y'
        domi.save()
        serializer = DomiciliarioSerializer(domi)
        return Response(serializer.data, status=status.HTTP_200_OK)

# renovar licencia
class Renew(APIView):
    permission_classes = [CustomReadOnly]
    def get(self, request, dom_cod):
        domi = get_object_or_404(Domiciliario, cod=dom_cod)
        today = timezone.localtime(timezone.now()).date()
        future_date = today.replace(year=today.year + 10)
        domi.fecha_vencimiento = future_date
        domi.save()
        serializer = DomiciliarioSerializer(domi)
        return Response(serializer.data)

# cliente paga pedido
class PagarPedido(APIView):
    permission_classes = [CustomReadOnly]
    def get(self, request, cod_pedido):
        pedido:Pedido = get_object_or_404(Pedido, cod=cod_pedido)
        if pedido.tipo == 'Recogida': # asumo en recogida se paga al recoger
            pedido.estado = 'Completado'
        elif pedido.tipo == 'Domicilio': # por domicilio, falta enviar
            pedido.estado = 'Por enviar'
        pedido.save()
        serializer = PedidoSerializer(pedido)
        return Response(serializer.data)

# enviar pedido (poner hora de envio)
class EnviarPedido(APIView):
    permission_classes = [CustomReadOnly]
    def get(self, request, codigo):
        pedido:Pedido = get_object_or_404(Pedido, cod=codigo)
        domicilio:Domicilio = get_object_or_404(Domicilio, cod=codigo)

        if pedido.tipo == 'Domicilio' and pedido.estado == 'Por enviar': 
            hora,minuto= timezone.localtime(timezone.now()).hour,\
                        timezone.localtime(timezone.now()).minute
            minuto = str(minuto).zfill(2)
            domicilio.hora_envio = f"{hora}:{minuto}"

            domi_serializer = DomicilioSerializer(domicilio)
            pedido_serializer = PedidoSerializer(pedido)
            pedido.estado = 'Enviado'
            pedido.save()
            domicilio.save()
            return Response({
                        'domicilio': domi_serializer.data,'pedido': pedido_serializer.data
                    }, status=status.HTTP_200_OK)
        else:
            error_message = "No es domicilio por enviar"
            return Response({"error": error_message}, status=status.HTTP_400_BAD_REQUEST)

# completar domicilio (poner hora de entrega)

# valor total de pedido
class ValorTotalPedido(APIView):
    permission_classes = [CustomReadOnly]
    def get(self, request, codigo):
        pedido = Pedido.objects.filter(cod=codigo).annotate(
                valor_total=Sum(F('detalle__cantidad') *\
                                 F('detalle__cod_producto__precio'), 
                                 output_field=DecimalField())
            ).first()
        print(pedido.valor_total)
        serializer = ValorTotalPedidoSerializer

        if pedido:
            # Serialize the result
            serializer = ValorTotalPedidoSerializer({'cod': pedido.cod, 'valor_total': pedido.valor_total})
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': 'Pedido not found'}, status=status.HTTP_404_NOT_FOUND)

#PRE LLENADO DE BASE DE DATOS
class LoadSQLView(APIView):
    permission_classes = [CustomReadOnly]
    def get(self, request):
        try:
            Categoria.objects.create(cat_id=1, cat_nom='Panaderia', descripcion='Productos de panadería')
            Categoria.objects.create(cat_id=2, cat_nom='Reposteria', descripcion='Productos de repostería')
            Categoria.objects.create(cat_id=3, cat_nom='Bebidas', descripcion='Bebidas y refrescos')

            Producto.objects.create(cod=101, nombre='Pan Integral', descripcion='Pan integral fresco', precio=1.50, cat_id=1)
            Producto.objects.create(cod=102, nombre='Croissant', descripcion='Croissant de mantequilla', precio=0.80, cat_id=1)
            Producto.objects.create(cod=201, nombre='Pastel de Chocolate', descripcion='Delicioso pastel de chocolate', precio=15.00, cat_id=2)
            Producto.objects.create(cod=202, nombre='Muffin de Arándanos', descripcion='Muffin con arándanos frescos', precio=2.50, cat_id=2)
            Producto.objects.create(cod=301, nombre='Café Americano', descripcion='Café negro americano', precio=1.20, cat_id=3)
            Producto.objects.create(cod=302, nombre='Té Verde', descripcion='Té verde caliente', precio=1.00, cat_id=3)

            Persona.objects.create(cod=10001, nombre='Juan', apellido1='Pérez', apellido2='García', clave='claveJuan')
            Persona.objects.create(cod=10002, nombre='María', apellido1='López', apellido2='Martínez', clave='claveMaria')
            Persona.objects.create(cod=10003, nombre='Carlos', apellido1='Herrera', apellido2='Restrepo', clave='claveCarlos')
            Persona.objects.create(cod=10004, nombre='Juan Salvador', apellido1='Gaviota', apellido2='Bach', clave='claveJuanS')
            Persona.objects.create(cod=10005, nombre='Cristina', apellido1='Sanchez', apellido2='Salas', clave='claveCristina')
            
            Telefono.objects.create(cod_per_id=10001, telefono=555123456)
            Telefono.objects.create(cod_per_id=10002, telefono=555234567)
            Telefono.objects.create(cod_per_id=10003, telefono=555345678)
            Telefono.objects.create(cod_per_id=10004, telefono=3017046839)
            Telefono.objects.create(cod_per_id=10005, telefono=3108442011)
            Domiciliario.objects.create(cod_id=10001, vehiculo='Moto', fecha_vencimiento='2025-12-31', atendiendo='N')
            Domiciliario.objects.create(cod_id=10002, vehiculo='Bicicleta', fecha_vencimiento=None, atendiendo='N')
            Horario.objects.create(seq=1, dia='Domingo', hora_inicio='08:00', hora_fin='12:00')
            Horario.objects.create(seq=2, dia='Lunes', hora_inicio='07:30', hora_fin='12:30')
            Horario.objects.create(seq=3, dia='Lunes', hora_inicio='14:30', hora_fin='18:30')
            Horario.objects.create(seq=4, dia='Martes', hora_inicio='07:30', hora_fin='12:30')
            Horario.objects.create(seq=5, dia='Martes', hora_inicio='14:30', hora_fin='18:30')
            Horario.objects.create(seq=6, dia='Miércoles', hora_inicio='07:30', hora_fin='12:30')
            Horario.objects.create(seq=7, dia='Miércoles', hora_inicio='14:30', hora_fin='18:30')
            Horario.objects.create(seq=8, dia='Jueves', hora_inicio='07:30', hora_fin='12:30')
            Horario.objects.create(seq=9, dia='Jueves', hora_inicio='14:30', hora_fin='18:30')
            Horario.objects.create(seq=10, dia='Viernes', hora_inicio='07:30', hora_fin='12:30')
            Horario.objects.create(seq=11, dia='Viernes', hora_inicio='14:30', hora_fin='18:30')
            Horario.objects.create(seq=12, dia='Sábado', hora_inicio='07:30', hora_fin='12:30')
            Asignacion.objects.create(cod_dom_id=10001, seq_hor_id=1)
            Asignacion.objects.create(cod_dom_id=10001, seq_hor_id=2)
            Asignacion.objects.create(cod_dom_id=10001, seq_hor_id=3)
            Asignacion.objects.create(cod_dom_id=10001, seq_hor_id=4)
            Asignacion.objects.create(cod_dom_id=10001, seq_hor_id=5)
            Asignacion.objects.create(cod_dom_id=10001, seq_hor_id=6)
            Asignacion.objects.create(cod_dom_id=10002, seq_hor_id=1)
            Asignacion.objects.create(cod_dom_id=10002, seq_hor_id=2)
            Asignacion.objects.create(cod_dom_id=10002, seq_hor_id=7)
            Asignacion.objects.create(cod_dom_id=10002, seq_hor_id=8)
            Asignacion.objects.create(cod_dom_id=10002, seq_hor_id=9)
            Asignacion.objects.create(cod_dom_id=10002, seq_hor_id=10)
            Asignacion.objects.create(cod_dom_id=10002, seq_hor_id=11)
            Asignacion.objects.create(cod_dom_id=10002, seq_hor_id=12)
            Cliente.objects.create(cod_id=10004)
            Cliente.objects.create(cod_id=10005)
            Direccion.objects.create(dir='Calle 123, Ciudad', cod_per_id=10004)
            Direccion.objects.create(dir='Avenida 456, Ciudad', cod_per_id=10004)
            Direccion.objects.create(dir='Carrera 3a #64-56, Ciudad', cod_per_id=10005)
            Pedido.objects.create(cod=50001, cod_cliente_id=10004, dir_pedido='Calle 123, Ciudad', tipo='Domicilio', estado='Enviado', fecha='2023-05-20')
            Pedido.objects.create(cod=50002, cod_cliente_id=10005, dir_pedido='Avenida 456, Ciudad', tipo='Domicilio', estado='Completado', fecha='2023-05-20')
            Pedido.objects.create(cod=50003, cod_cliente_id=10004, dir_pedido='Local', tipo='Recogida', estado='Completado', fecha='2023-05-21')
            Domicilio.objects.create(cod_id=50001, cod_domiciliario_id=10001, hora_envio='08:44', hora_entrega=None)
            Domicilio.objects.create(cod_id=50002, cod_domiciliario_id=10002, hora_envio='07:00', hora_entrega='07:45')
            Detalle.objects.create(cod_pedido_id=50001, cod_producto_id=101, cantidad=2)
            Detalle.objects.create(cod_pedido_id=50001, cod_producto_id=301, cantidad=1)
            Detalle.objects.create(cod_pedido_id=50002, cod_producto_id=201, cantidad=1)
            Detalle.objects.create(cod_pedido_id=50002, cod_producto_id=302, cantidad=2)
            Administrador.objects.create(cod_id=10003)

            return Response({'status': 'success'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def index(request):
    hora,minuto= timezone.localtime(timezone.now()).hour,\
                        timezone.localtime(timezone.now()).minute
    print(hora,minuto)
    return HttpResponse("Hello, this is a test")
from django.db.models import Sum, F, DecimalField
def detail(request,cod):
    return HttpResponse(f"codigo:{cod} ") 

class PersonaViewSet(viewsets.ModelViewSet):
    queryset = Persona.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = PersonaSerializer

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ClienteSerializer

class AdministradorViewSet(viewsets.ModelViewSet):
    queryset = Administrador.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = AdministradorSerializer

class DomiciliarioViewSet(viewsets.ModelViewSet):
    queryset = Domiciliario.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = DomiciliarioSerializer

class DireccionViewSet(viewsets.ModelViewSet):
    queryset = Direccion.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = DireccionSerializer

class TelefonoViewSet(viewsets.ModelViewSet):
    queryset = Telefono.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = TelefonoSerializer

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = CategoriaSerializer

class HorarioViewSet(viewsets.ModelViewSet):
    queryset = Horario.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = HorarioSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ProductoSerializer

class AsignacionViewSet(viewsets.ModelViewSet):
    queryset = Asignacion.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = AsignacionSerializer

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = PedidoSerializer

class DetalleViewSet(viewsets.ModelViewSet):
    queryset = Detalle.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = DetalleSerializer

class DomicilioViewSet(viewsets.ModelViewSet):
    queryset = Domicilio.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = DomicilioSerializer


   