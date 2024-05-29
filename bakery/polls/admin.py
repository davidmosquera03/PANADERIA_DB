from django.contrib import admin

# Register your models here.

from .models import *
admin.site.register(Persona)
admin.site.register(Cliente)
admin.site.register(Domiciliario)
admin.site.register(Administrador)
admin.site.register(Telefono)
admin.site.register(Direccion)
admin.site.register(Categoria)
admin.site.register(Horario)
admin.site.register(Producto)
admin.site.register(Asignacion)
admin.site.register(Pedido)
admin.site.register(Detalle)
admin.site.register(Domicilio)