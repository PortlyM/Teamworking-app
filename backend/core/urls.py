"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from apps.users.views import RegisterView, EmailTokenObtainPairView, LogoutView, UserListView
from apps.chat.views import PrivateChatHistoryView, TeamChatHistoryView
from apps.teams.views import TeamListCreateView, TeamMemberListView, TeamLeaveView
from apps.teams.views import TeamListCreateView, TeamMemberListView, TeamLeaveView, TeamJoinView, TeamDeleteView
from apps.tasks.views import TaskListCreateView, TaskDetailView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include('apps.users.urls')),
    path('teams/', include('apps.teams.urls')),
    path('chat/', include('apps.chat.urls')),
    path('tasks/', include('apps.tasks.urls')),
    path('api/v1/auth/login/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/auth/register/', RegisterView.as_view(), name='auth_register'),
    path('api/v1/auth/logout/', LogoutView.as_view(), name='auth_logout'),
    path('api/v1/users/', UserListView.as_view(), name='user_list'),
    path('api/v1/chat/history/private/<int:target_id>/', PrivateChatHistoryView.as_view(), name='private_chat_history'),
    path('api/v1/teams/', TeamListCreateView.as_view(), name='team_list_create'),
    path('api/v1/teams/<int:pk>/members/', TeamMemberListView.as_view(), name='team_members'),
    path('api/v1/teams/<int:pk>/leave/', TeamLeaveView.as_view(), name='team_leave'),
    path('api/v1/chat/history/team/<int:team_id>/', TeamChatHistoryView.as_view(), name='team_chat_history'),
    path('api/v1/teams/<int:pk>/join/', TeamJoinView.as_view(), name='team_join'),
    path('api/v1/teams/<int:pk>/', TeamDeleteView.as_view(), name='team_delete'),
    path('api/v1/teams/<int:team_id>/tasks/', TaskListCreateView.as_view(), name='team_tasks'),
    path('api/v1/tasks/<int:pk>/', TaskDetailView.as_view(), name='task_detail'),
]
