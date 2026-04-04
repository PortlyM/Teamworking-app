from rest_framework import serializers
from .models import Team

class TeamSerializer(serializers.ModelSerializer):
    is_member = serializers.SerializerMethodField()
    
    class Meta:
        model = Team
        fields = ('id', 'name', 'leader', 'is_member')
        read_only_fields = ('leader',)

    def get_is_member(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            return any(member.id == request.user.id for member in obj.members.all())
        return False