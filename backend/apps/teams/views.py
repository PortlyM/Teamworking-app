from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from .models import Team
from .serializers import TeamSerializer
from apps.users.serializers import UserSerializer 

class TeamListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        content = {'message': f'Cześć {request.user.email}, to są Twoje drużyny!'}
        return Response(content)

def teams_test(request):
    return HttpResponse('teams test')

class TeamListCreateView(generics.ListCreateAPIView):
    """
    GET: Zwraca listę zespołów, do których należysz.
    POST: Tworzy nowy zespół.
    """
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.joined_teams.all()

    def perform_create(self, serializer):
        team = serializer.save(leader=self.request.user)
        team.members.add(self.request.user)

class TeamMemberListView(APIView):
    """
    GET: Zwraca listę członków zespołu i ID lidera.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        team = get_object_or_404(Team, pk=pk)
        
        if request.user not in team.members.all():
            return Response({"detail": "Nie masz dostępu do tego zespołu."}, status=status.HTTP_403_FORBIDDEN)
        
        members = team.members.all()
        serializer = UserSerializer(members, many=True)
        
        return Response({
            "leader_id": team.leader.id if team.leader else None,
            "members": serializer.data
        })

class TeamLeaveView(APIView):
    """
    POST: Opuszczanie zespołu przez aktualnie zalogowanego użytkownika.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        team = get_object_or_404(Team, pk=pk)
        
        if request.user in team.members.all():
            team.members.remove(request.user)
            return Response({"detail": "Pomyślnie opuszczono zespół."}, status=status.HTTP_200_OK)
            
        return Response({"detail": "Nie jesteś członkiem tego zespołu."}, status=status.HTTP_400_BAD_REQUEST)