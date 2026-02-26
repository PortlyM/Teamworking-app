from django.db import models
from django.contrib.auth.models import User
from apps.teams.models import Team

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    # Opcjonalne powiązania
    team = models.ForeignKey(Team, on_delete=models.CASCADE, null=True, blank=True)
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='direct_messages')