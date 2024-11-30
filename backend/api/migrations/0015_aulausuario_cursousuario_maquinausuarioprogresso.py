# Generated by Django 5.1.1 on 2024-11-28 11:13

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_user_groups_user_is_superuser_user_last_login_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='AulaUsuario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('concluida', models.BooleanField(default=False)),
                ('data_conclusao', models.DateTimeField(blank=True, null=True)),
                ('aula', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='usuarios_aula', to='api.aula')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='aulas_usuario', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='CursoUsuario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('progresso', models.FloatField(default=0)),
                ('curso', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='usuarios_curso', to='api.curso')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cursos_usuario', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='MaquinaUsuarioProgresso',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('progresso', models.FloatField(default=0)),
                ('maquina', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='usuarios_maquina_progresso', to='api.maquina')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='maquinas_usuario_progresso', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]