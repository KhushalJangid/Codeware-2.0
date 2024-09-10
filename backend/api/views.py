import base64
from os import listdir, path, remove
import subprocess
from subprocess import Popen,PIPE
from uuid import uuid4
from django.shortcuts import render
from django.contrib.auth import authenticate
from django.core.files.base import ContentFile
from rest_framework.views import APIView
from rest_framework.decorators import api_view,permission_classes,authentication_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from codeware.settings import BASE_DIR
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import Files
from io import BytesIO

@api_view(['post'])
@permission_classes([])
def get_token(request):
    data = request.data
    user = authenticate(email=data['email'],password=data['password'])
    if user:
        refresh = RefreshToken.for_user(user)

        return Response({
            'id':user.id,
            'first_name':user.first_name,
            'last_name':user.last_name,
            'email':user.email,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    else:
        return Response({"error":"Incorrect email/password"},status=status.HTTP_401_UNAUTHORIZED)

# Create your views here.

@api_view(['get'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def list_files(request):
    user = request.user
    files = Files.objects.filter(user=user)
    if len(files) == 0:
        return Response({"data":[]})
    else:
        return Response({"data":[{"id":file.id,"name":file.name} for file in files]})
    
@api_view(['post'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def run(request):
    user = request.user
    lang = request.POST.get('lang')
    code = request.POST.get('code')
    stdin = request.POST.get('stdin')
    _filename = f'test_{uuid4()}.{lang}'
    _fileloc = path.join(BASE_DIR,"media",_filename)
    with open(_fileloc, 'w') as fp:
        # fp.write(code)
        fp.write(r'{}'.format(code))
        fp.close()
    try :
        if lang == "py": 
            _output  = subprocess.run(["python3",_fileloc],input=stdin.encode('utf-8'),timeout=5,capture_output=True)
            _output  = Popen(["python3",_fileloc],input=stdin.encode('utf-8'),timeout=5,capture_output=True)
            _output.pid
            _output = Popen()
            remove(_fileloc)
        elif lang == "js": 
            _output  = subprocess.run(["node",_fileloc],input=stdin.encode('utf-8'),timeout=5,capture_output=True)
            remove(_fileloc)
        elif lang == "cpp": 
            _output  = subprocess.run(["g++",_fileloc],timeout=5,capture_output=True)
            remove(_fileloc)
            if _output.returncode != 0:
                ctx = _output.stderr.decode('utf-8')
                return Response(ctx,status=status.HTTP_400_BAD_REQUEST)
            _output = subprocess.run([f'./a.out'],input=stdin.encode('utf-8'),timeout=5,capture_output=True)
            remove('./a.out')
        elif lang == "c": 
            _output  = subprocess.run(["gcc",_fileloc],timeout=5,capture_output=True)
            remove(_fileloc)
            if _output.returncode != 0:
                ctx = _output.stderr.decode('utf-8')
                return Response(ctx,status=status.HTTP_400_BAD_REQUEST)
            _output = subprocess.run([f'./a.out'],input=stdin.encode('utf-8'),timeout=5,capture_output=True)
            remove('./a.out')
        elif lang == "dart": 
            _output  = subprocess.run(["dart",_fileloc],input=stdin.encode('utf-8'),timeout=5,capture_output=True)
            remove(_fileloc)
        else:
            return Response('Language not supported.',status=status.HTTP_403_FORBIDDEN)
    except Exception as e:
        print("Error : ",e.__str__())
        return Response(f'Error : {e.__str__()}',status=status.HTTP_400_BAD_REQUEST)
    ctx = _output.stdout.decode('utf-8')
    if _output.returncode != 0:
        ctx = _output.stderr.decode('utf-8')
        return Response(ctx,status=status.HTTP_400_BAD_REQUEST)
    return Response(ctx)
    

class FilesView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        file_id = request.GET.get('file_id')
        try:
            query = Files.objects.get(user=self.request.user,id=file_id)
            return Response({
                "data":{
                    "id":query.id,
                    "name":query.name,
                    "contents":query.file.read()
                }
            })
        except Files.DoesNotExist:
            return Response({"error":"File not found"},status=status.HTTP_403_FORBIDDEN)
        
    def post(self,request):
        data = request.data
        f = Files.objects.create(
            user=request.user,
            name=data['name'],
            file=ContentFile(
                bytes(data['file']),
                data['name']
                )
            )
        return Response({"file_id":f.id})
    
    def put(self,request):
        file_id = request.data.get('file_id')
        try:
            if file_id != -1:
                query = Files.objects.get(user=request.user,id=file_id)
                query.file.open("w").write(bytes(request.data['file']).decode())
                query.save()
                return Response({"file_id":file_id,"updated":True})
            else:
                data = request.data
                f = Files.objects.create(
                    user=request.user,
                    name=data['name'],
                    file=ContentFile(
                        bytes(data['file']),
                        data['name']
                        )
                    )
                return Response({"file_id":f.id,"created":True})
        except Files.DoesNotExist:
            return Response({"error":"File not found"},status=status.HTTP_403_FORBIDDEN)
    def patch(self,request):
        file_id = request.data.get('file_id')
        try:
            query = Files.objects.get(user=request.user,id=file_id)
            query.name = request.data['name']
            query.save()
            return Response({"file_id":file_id,"updated":True})
        except Files.DoesNotExist:
            return Response({"error":"File not found"},status=status.HTTP_403_FORBIDDEN)
        
    def delete(self,request):
        file_id = request.data.get('file_id')
        try:
            query = Files.objects.get(user=request.user,id=file_id)
            query.delete()
            return Response({"file_id":file_id,"deleted":True})
        except Files.DoesNotExist:
            return Response({"error":"File not found"},status=status.HTTP_403_FORBIDDEN)
