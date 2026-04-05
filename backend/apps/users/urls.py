from django.urls import path
from apps.users.views import RegisterView, EmailTokenObtainPairView, LogoutView, UserListView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('auth/login/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/logout/', LogoutView.as_view(), name='auth_logout'),
    path('users/', UserListView.as_view(), name='user_list'),
]