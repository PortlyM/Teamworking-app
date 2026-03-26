import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from apps.chat.models import Message
from apps.teams.models import Team

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_type = self.scope['url_route']['kwargs']['chat_type']
        self.target_id = int(self.scope['url_route']['kwargs']['target_id'])
        
        self.user = self.scope['user'] 

        if not self.user.is_authenticated:
            await self.close()
            return

        if self.chat_type == 'team':
            self.room_group_name = f'chat_team_{self.target_id}'
        elif self.chat_type == 'private':
            min_id = min(self.user.id, self.target_id)
            max_id = max(self.user.id, self.target_id)
            self.room_group_name = f'chat_private_{min_id}_{max_id}'
        else:
            await self.close()
            return

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_content = data['message']

        saved_message = await self.save_message(message_content)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message_content,
                'sender_id': self.user.id,
                'sender_username': self.user.username,
                'timestamp': str(saved_message.timestamp)
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender_id': event['sender_id'],
            'sender_username': event['sender_username'],
            'timestamp': event['timestamp']
        }))

    @database_sync_to_async
    def save_message(self, content):
        if self.chat_type == 'team':
            team = Team.objects.get(id=self.target_id)
            return Message.objects.create(sender=self.user, content=content, team=team)
        elif self.chat_type == 'private':
            recipient = User.objects.get(id=self.target_id)
            return Message.objects.create(sender=self.user, content=content, recipient=recipient)