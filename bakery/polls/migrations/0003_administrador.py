# Generated by Django 4.1 on 2024-05-25 21:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0002_alter_cliente_cod'),
    ]

    operations = [
        migrations.CreateModel(
            name='Administrador',
            fields=[
                ('cod', models.OneToOneField(db_column='cod', on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='polls.persona')),
            ],
            options={
                'db_table': 'administrador',
            },
        ),
    ]