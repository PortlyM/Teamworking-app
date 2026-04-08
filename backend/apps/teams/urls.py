from django.urls import path
from . import views
from apps.chat.views import TeamChatHistoryView
from apps.teams.views import TeamListCreateView, TeamMemberListView, TeamLeaveView, TeamJoinView, TeamDeleteView, DashboardStatsView
from apps.tasks.views import TaskListCreateView

urlpatterns = [
    path('', TeamListCreateView.as_view(), name='team_list_create'),
    path('<int:pk>/members/', TeamMemberListView.as_view(), name='team_members'),
    path('<int:pk>/leave/', TeamLeaveView.as_view(), name='team_leave'),
    path('chat/history/team/<int:team_id>/', TeamChatHistoryView.as_view(), name='team_chat_history'),
    path('<int:pk>/join/', TeamJoinView.as_view(), name='team_join'),
    path('<int:pk>/', TeamDeleteView.as_view(), name='team_delete'),
    path('<int:team_id>/tasks/', TaskListCreateView.as_view(), name='team_tasks'),
    path('stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
]