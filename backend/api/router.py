from django.urls import path 
from api.consumer import CompilerConsumer
  
websocket_urlpatterns = [ 
    path('ws/iostream', CompilerConsumer.as_asgi()), 
] 
