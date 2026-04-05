from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    creator_name = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'team', 'title', 'is_completed', 'created_by', 'creator_name']
        read_only_fields = ['team', 'created_by']