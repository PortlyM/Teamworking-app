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
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Team.objects.prefetch_related('members').all()

    def perform_create(self, serializer):
        team = serializer.save(leader=self.request.user)
        team.members.add(self.request.user)

class TeamMemberListView(APIView):
    """
    GET: Zwraca nazwę, listę członków zespołu i ID lidera.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        team = get_object_or_404(Team, pk=pk)
        
        if request.user not in team.members.all():
            return Response({"detail": "You don't have access to this team."}, status=status.HTTP_403_FORBIDDEN)
        
        members = team.members.all()
        serializer = UserSerializer(members, many=True)
        
        return Response({
            "name": team.name,
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
            return Response({"detail": "Successfully exited the team."}, status=status.HTTP_200_OK)
            
        return Response({"detail": "You're not a member of this team."}, status=status.HTTP_400_BAD_REQUEST)
    
class TeamJoinView(APIView):
    """
    POST: Dołączanie do istniejącego zespołu.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        team = get_object_or_404(Team, pk=pk)
        
        if team.members.filter(id=request.user.id).exists():
            return Response({"detail": "You're already the member of this team!"}, status=status.HTTP_400_BAD_REQUEST)
            
        team.members.add(request.user)
        return Response({"detail": "Successfully joined the team."}, status=status.HTTP_200_OK)


class TeamDeleteView(APIView):
    """
    DELETE: Usuwanie zespołu (dostępne tylko dla lidera).
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        team = get_object_or_404(Team, pk=pk)
        
        # Super-zabezpieczenie: tylko lider może usunąć zespół!
        if team.leader != request.user:
            return Response({"detail": "Only the leader of this team can delete it."}, status=status.HTTP_403_FORBIDDEN)
            
        team.delete() # Uwaga: To usunie też wszystkie przypisane do niego wiadomości (Cascade)
        return Response(status=status.HTTP_204_NO_CONTENT)