# Generated by Django 5.1.1 on 2024-10-04 13:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_remove_user_idmaquina_user_maquinas'),
    ]

    operations = [
        migrations.RenameField(
            model_name='questionario',
            old_name='alternativas',
            new_name='titulo',
        ),
        migrations.RemoveField(
            model_name='questionario',
            name='pergunta',
        ),
        migrations.RemoveField(
            model_name='questionario',
            name='respostas',
        ),
    ]
