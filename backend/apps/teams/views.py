from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

class TeamListView(APIView):
    permission_classes = [IsAuthenticated] # Tylko zalogowani z ważnym tokenem JWT

    def get(self, request):
        content = {'message': f'Cześć {request.user.email}, to są Twoje drużyny!'}
        return Response(content)

def teams_test(request):
    return HttpResponse('teams test')