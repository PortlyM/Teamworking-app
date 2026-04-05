from django.db import models
from django.contrib.auth import get_user_model
from apps.teams.models import Team

User = get_user_model()

class Task(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=255)
    is_completed = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"[{self.team.name}] {self.title}"