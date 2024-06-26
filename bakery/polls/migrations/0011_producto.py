# Generated by Django 4.1 on 2024-05-25 23:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0010_alter_categoria_cat_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='Producto',
            fields=[
                ('cod', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=50)),
                ('descripcion', models.CharField(blank=True, max_length=200, null=True)),
                ('precio', models.DecimalField(decimal_places=2, max_digits=10)),
                ('cat', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='polls.categoria')),
            ],
            options={
                'db_table': 'producto',
            },
        ),
    ]
