from django.db import models
from apps.teams.models import Team # Importujemy model z innej apki

class TaskList(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='task_lists')
    name = models.CharField(max_length=100)

class Task(models.Model):
    task_list = models.ForeignKey(TaskList, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=200)
    is_completed = models.BooleanField(default=False)