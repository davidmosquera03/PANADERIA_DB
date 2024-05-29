from django.db import models

# Create your models here.
class Persona(models.Model):
    cod = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=50)
    apellido1 = models.CharField(max_length=50)
    apellido2 = models.CharField(max_length=50, blank=True, null=True)
    clave = models.CharField(max_length=200)

    class Meta:
        db_table = 'persona'

    def __str__(self):
        return f"{self.cod}"
    
class Cliente(models.Model):
    cod = models.OneToOneField(Persona, models.CASCADE, db_column='cod', primary_key=True)

    class Meta:
        db_table = 'cliente'
        
    def __str__(self):
        return f"{self.cod}"
    
class Administrador(models.Model):
    cod = models.OneToOneField(Persona, models.CASCADE, db_column='cod', primary_key=True)
    class Meta:
        db_table = 'administrador'
    def __str__(self):
        return f"{self.cod}"
    
class Domiciliario(models.Model):
    cod = models.OneToOneField(Persona, models.DO_NOTHING, db_column='cod', primary_key=True)
    vehiculo = models.CharField(max_length=20, blank=True, null=True) # carro, moto, bicicleta,etc
    fecha_vencimiento = models.DateField(blank=True, null=True)
    atendiendo = models.CharField(max_length=1, blank=True, null=True) # Y or N

    class Meta:
        db_table = 'domiciliario'

    def __str__(self):
        return f"{self.cod}"
    
class Direccion(models.Model):
    dir = models.CharField(max_length=100,null=False,blank=False)
    cod_per = models.ForeignKey(Persona, models.CASCADE, db_column='cod_cliente',null=False,blank=False)

    class Meta:
        db_table = 'direccion'
        unique_together = (('cod_per', 'dir'),)
    def __str__(self):
        return f"{self.cod_per}:{self.dir}"

class Telefono(models.Model):
    cod_per = models.ForeignKey(Persona, models.CASCADE, db_column='cod_per',null=False,blank=False)
    telefono = models.BigIntegerField(null=False,blank=False)
    class Meta:
        db_table = 'telefono'
        unique_together = (('cod_per', 'telefono'),)
    def __str__(self):
        return f"{self.cod_per}:{self.telefono}"

class Categoria(models.Model):
    cat_id = models.AutoField(primary_key=True)
    cat_nom = models.CharField(max_length=50, blank=False, null=False)
    descripcion = models.CharField(max_length=200, blank=False, null=False)
    class Meta:
        db_table = 'categoria'
    def __str__(self):
        return f"{self.cat_id}:{self.cat_nom}"

class Horario(models.Model):
    seq = models.IntegerField(primary_key=True)
    dia = models.CharField(max_length=10)
    hora_inicio = models.CharField(max_length=5, blank=False, null=False)
    hora_fin = models.CharField(max_length=5, blank=False, null=False)
    domiciliarios = models.ManyToManyField(Domiciliario,through='Asignacion')

    class Meta:
        db_table = 'horario'
    def __str__(self):
        return f"{self.seq}"
    
class Producto(models.Model):
    cod = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=200, blank=True, null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    cat = models.ForeignKey(Categoria, models.CASCADE)
    
    class Meta:
        db_table = 'producto'

    def __str__(self):
        return f"{self.cod}"
    

class Asignacion(models.Model):
    cod_dom = models.ForeignKey(Domiciliario,models.CASCADE, db_column='cod_dom',null=False,blank=False)
    seq_hor = models.ForeignKey(Horario, models.CASCADE, db_column='seq_hor',null=False,blank=False)

    class Meta:
    
        db_table = 'asignacion'
        unique_together = (('cod_dom', 'seq_hor'),)

    def __str__(self):
        return f"{self.cod_dom}:{self.seq_hor}" 
    
class Pedido(models.Model):
    cod = models.IntegerField(primary_key=True)
    cod_cliente = models.ForeignKey(Cliente, models.CASCADE, db_column='cod_cliente', blank=False, null=False)
    dir_pedido = models.CharField(max_length=100, blank=True, null=True)
    tipo = models.CharField(max_length=100, blank=True, null=True)
    estado = models.CharField(max_length=100, blank=True, null=True)
    fecha = models.DateField(blank=True, null=True)
    products = models.ManyToManyField(Producto,through='Detalle')
    class Meta:
        db_table = 'pedido'

    def __str__(self):
        return f"{self.cod}"
    
class Detalle(models.Model):
    cod_pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    cod_producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField(blank=False, null=False)

    class Meta:
        db_table = 'detalle'
        unique_together = (('cod_pedido', 'cod_producto'))

    def __str__(self):
        return f"{self.cod_pedido} {self.cod_producto}"
    
class Domicilio(models.Model):
    cod = models.OneToOneField(Pedido, models.CASCADE, db_column='cod', primary_key=True)
    cod_domiciliario = models.ForeignKey(Domiciliario, models.CASCADE, 
                                            db_column='cod_domiciliario', blank=False, null=False)
    hora_envio = models.CharField(max_length=5, blank=True, null=True)
    hora_entrega = models.CharField(max_length=5, blank=True, null=True)
    class Meta:
        db_table = 'domicilio'

    def __str__(self):
        return f"{self.cod} {self.cod_domiciliario}"