from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Message
from .serializers import MessageSerializer
from apps.teams.models import Team
from django.shortcuts import get_object_or_404

class PrivateChatHistoryView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        other_user_id = self.kwargs['target_id']
        my_id = self.request.user.id

        return Message.objects.filter(
            Q(sender_id=my_id, recipient_id=other_user_id) |
            Q(sender_id=other_user_id, recipient_id=my_id)
        ).order_by('timestamp')
    
class TeamChatHistoryView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Wyciągamy ID zespołu z adresu URL
        team_id = self.kwargs['team_id']
        team = get_object_or_404(Team, id=team_id)
        
        if self.request.user not in team.members.all():
            return Message.objects.none()

        return Message.objects.filter(team=team).order_by('timestamp')