# Generated by Django 4.1 on 2024-05-27 17:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0016_alter_horario_seq'),
    ]

    operations = [
        migrations.AlterField(
            model_name='domicilio',
            name='cod_domiciliario',
            field=models.ForeignKey(db_column='cod_domiciliario', on_delete=django.db.models.deletion.CASCADE, to='polls.domiciliario'),
        ),
    ]
