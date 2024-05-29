# Generated by Django 4.1 on 2024-05-25 22:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0003_administrador'),
    ]

    operations = [
        migrations.CreateModel(
            name='Domiciliario',
            fields=[
                ('cod', models.OneToOneField(db_column='cod', on_delete=django.db.models.deletion.DO_NOTHING, primary_key=True, serialize=False, to='polls.persona')),
                ('vehiculo', models.CharField(blank=True, max_length=20, null=True)),
                ('fecha_vencimiento', models.DateField(blank=True, null=True)),
                ('disponible', models.CharField(blank=True, max_length=1, null=True)),
            ],
            options={
                'db_table': 'domiciliario',
            },
        ),
    ]