import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
from core.middleware import JWTAuthMiddleware
import apps.chat.routing # <--- Upewnij się, że to importuje Twój plik routing.py

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": JWTAuthMiddleware(
        URLRouter(
            apps.chat.routing.websocket_urlpatterns # <--- Tutaj podpinasz ścieżki WS
        )
    ),
})