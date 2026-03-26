from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    message = serializers.CharField(source='content')
    sender_id = serializers.IntegerField(source='sender.id', read_only=True)

    class Meta:
        model = Message
        fields = ('id', 'sender_id', 'message', 'timestamp')