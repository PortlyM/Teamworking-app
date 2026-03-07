from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # To mapuje adres ws://127.0.0.1:8000/ws/chat/ID_DRUZYNY/ na kod w consumers.py
    re_path(r'ws/chat/(?P<team_id>\w+)/$', consumers.ChatConsumer.as_view()),
]