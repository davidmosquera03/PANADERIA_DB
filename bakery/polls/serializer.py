from rest_framework import serializers
from polls.models import *
from datetime import datetime, date
class PersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Persona
        fields = '__all__'

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

class AdministradorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrador
        fields = '__all__'

class DomiciliarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Domiciliario
        fields = '__all__'

class DireccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direccion
        fields = '__all__'

class TelefonoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Telefono
        fields = '__all__'

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class HorarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Horario
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

class AsignacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asignacion
        fields = '__all__'

class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = '__all__'

class DetalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Detalle
        fields = '__all__'

class DomicilioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Domicilio
        fields = '__all__'

# QUERIES

class ProductSalesSerializer(serializers.Serializer):
    nombre = serializers.CharField(max_length=255)
    total_vendido = serializers.IntegerField()

class DeliveryTimeSerializer(serializers.Serializer):
    cod = serializers.IntegerField()
    horas  = serializers.IntegerField()
    minutos  = serializers.IntegerField()

class ExpiredSerializer(serializers.Serializer):
    cod = serializers.IntegerField()

class DateField(serializers.Field):
    def to_representation(self, value):
        if isinstance(value, datetime):
            return value.date()
        elif isinstance(value, date):
            return value
        return value

class OrdersByDateSerializer(serializers.Serializer):
    fecha = DateField()
    pedidos = serializers.IntegerField()

class AvailableSerializer(serializers.Serializer):
    cod = serializers.IntegerField()

class ValorTotalPedidoSerializer(serializers.Serializer):
    cod = serializers.IntegerField
    valor_total = serializers.DecimalField(max_digits=12, decimal_places=2)