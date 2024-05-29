from django.http import HttpResponse
from polls.models import *
from rest_framework import viewsets,status
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
    serializer_class = PersonaSerializer

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

class AdministradorViewSet(viewsets.ModelViewSet):
    queryset = Administrador.objects.all()
    serializer_class = AdministradorSerializer

class DomiciliarioViewSet(viewsets.ModelViewSet):
    queryset = Domiciliario.objects.all()
    serializer_class = DomiciliarioSerializer

class DireccionViewSet(viewsets.ModelViewSet):
    queryset = Direccion.objects.all()
    serializer_class = DireccionSerializer

class TelefonoViewSet(viewsets.ModelViewSet):
    queryset = Telefono.objects.all()
    serializer_class = TelefonoSerializer

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class HorarioViewSet(viewsets.ModelViewSet):
    queryset = Horario.objects.all()
    serializer_class = HorarioSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

class AsignacionViewSet(viewsets.ModelViewSet):
    queryset = Asignacion.objects.all()
    serializer_class = AsignacionSerializer

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer

class DetalleViewSet(viewsets.ModelViewSet):
    queryset = Detalle.objects.all()
    serializer_class = DetalleSerializer

class DomicilioViewSet(viewsets.ModelViewSet):
    queryset = Domicilio.objects.all()
    serializer_class = DomicilioSerializer

#  QUERIES
   