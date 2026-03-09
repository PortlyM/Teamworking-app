from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import EmailTokenObtainPairSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status

def users_test(request):
    return HttpResponse('users test')

User = get_user_model()

class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,) # Tylko zalogowani mogą się wylogować

    def post(self, request):
        try:
            # Pobieramy token refresh z danych wysłanych przez frontend
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)

            # Wrzucamy go na czarną listę
            token.blacklist()

            return Response({"message": "Wylogowano pomyślnie."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "Błędny token."}, status=status.HTTP_400_BAD_REQUEST)