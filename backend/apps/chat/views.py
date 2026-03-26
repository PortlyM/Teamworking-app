from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Message
from .serializers import MessageSerializer

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