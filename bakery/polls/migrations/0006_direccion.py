# Generated by Django 4.1 on 2024-05-25 23:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0005_rename_disponible_domiciliario_atendiendo'),
    ]

    operations = [
        migrations.CreateModel(
            name='Direccion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dir', models.CharField(max_length=100)),
                ('cod_cliente', models.ForeignKey(db_column='cod_cliente', on_delete=django.db.models.deletion.CASCADE, to='polls.persona')),
            ],
            options={
                'db_table': 'direccion',
                'unique_together': {('cod_cliente', 'dir')},
            },
        ),
    ]
