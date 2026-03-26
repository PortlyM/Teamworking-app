from django.urls import path
from apps.users.views import UserListView
from apps.chat.views import PrivateChatHistoryView

urlpatterns = [
    path('api/v1/users/', UserListView.as_view(), name='user_list'),
    path('api/v1/chat/history/private/<int:target_id>/', PrivateChatHistoryView.as_view(), name='private_chat_history'),
]