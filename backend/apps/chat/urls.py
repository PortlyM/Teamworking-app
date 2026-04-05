from django.urls import path
from apps.users.views import UserListView
from apps.chat.views import PrivateChatHistoryView

urlpatterns = [
    path('users/', UserListView.as_view(), name='user_list'),
    path('history/private/<int:target_id>/', PrivateChatHistoryView.as_view(), name='private_chat_history'),
]