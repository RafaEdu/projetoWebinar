from django.shortcuts import render
from rest_framework import viewsets, status 
from rest_framework.response import Response  
from rest_framework import serializers  
from .models import Aula, Video, Slide, User, Maquina, Area, Questionario, Curso, Pergunta, Alternativa
from .serializers import UserSerializer, MaquinaSerializer, AreaSerializer, QuestionarioSerializer, CursoSerializer, AulaSerializer, VideoSerializer, SlideSerializer


class MaquinaViewSet(viewsets.ModelViewSet):
    queryset = Maquina.objects.all()
    serializer_class = MaquinaSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class AreaViewSet(viewsets.ModelViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer

    from rest_framework import viewsets


class QuestionarioViewSet(viewsets.ModelViewSet):
    queryset = Questionario.objects.all()
    serializer_class = QuestionarioSerializer

    def update(self, request, *args, **kwargs):
        questionario = self.get_object()  # Obtém o questionário pelo ID passado na URL

        # Exclui todas as perguntas e alternativas associadas ao questionário atual
        Pergunta.objects.filter(questionario_id=questionario.idquestionario).delete()

        # Atualiza o título do questionário com o dado recebido
        questionario.titulo = request.data.get('titulo', questionario.titulo)
        questionario.save()

        # Recria as perguntas e alternativas com os novos dados
        for pergunta_data in request.data.get('perguntas', []):
            nova_pergunta = Pergunta.objects.create(
                texto=pergunta_data['texto'],
                questionario=questionario
            )
            for alternativa_data in pergunta_data['alternativas']:
                Alternativa.objects.create(
                    texto=alternativa_data['texto'],
                    is_correta=alternativa_data['is_correta'],
                    pergunta=nova_pergunta
                )

        # Serializa e retorna o questionário atualizado
        serializer = self.get_serializer(questionario)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CursoViewSet(viewsets.ModelViewSet):
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer  


class AulaViewSet(viewsets.ModelViewSet):
    queryset = Aula.objects.all()
    serializer_class = AulaSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        video_data = request.FILES.get('video', None)
        slide_data = request.FILES.get('slide', None)

        if video_data:
            video = Video.objects.create(arquivo_video=video_data)
            serializer.save(idvideo=video)
        elif slide_data:
            slide = Slide.objects.create(arquivo_pdf=slide_data)
            serializer.save(idslide=slide)
        else:
            return Response({"error": "Você deve anexar um vídeo ou um slide."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        aula = self.get_object()  # Obtém a instância da aula a ser atualizada
        serializer = self.get_serializer(aula, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # Verifica se o novo vídeo ou slide foi enviado
        video_data = request.FILES.get('video', None)
        slide_data = request.FILES.get('slide', None)

        if video_data:
            # Se já houver um vídeo, o excluímos antes de criar um novo
            if aula.idvideo:
                aula.idvideo.delete()  # Remove o vídeo antigo
            video = Video.objects.create(arquivo_video=video_data)
            aula.idvideo = video  # Atribui o novo vídeo

        if slide_data:
            # Se já houver um slide, o excluímos antes de criar um novo
            if aula.idslide:
                aula.idslide.delete()  # Remove o slide antigo
            slide = Slide.objects.create(arquivo_pdf=slide_data)
            aula.idslide = slide  # Atribui o novo slide

        # Salva a aula atualizada
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    def list_by_curso(self, request, idcurso=None):
        if idcurso is None:
            return Response({"error": "idcurso é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        aulas = Aula.objects.filter(idcurso=idcurso)
        serializer = self.get_serializer(aulas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer

class SlideViewSet(viewsets.ModelViewSet):
    queryset = Slide.objects.all()
    serializer_class = SlideSerializer
 
