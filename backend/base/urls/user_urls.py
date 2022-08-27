# this file is responsible for connecting views to urls
from base.views import user_views as views
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path("login/", views.MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("register/", views.RegisterUser.as_view(), name="register"),
    path("profile/", views.UserProfile.as_view(), name="users-profile"),
    path("profile/update/", views.UserProfile.as_view(), name="user-profile-update"),
    path("", views.AdminProfile.as_view(), name="users"),
    path("<str:pk>/", views.AdminProfileId.as_view(), name="user"),
    path("update/<str:pk>/", views.UpdateUser.as_view(), name="user-update"),
    path("delete/<str:pk>/", views.AdminProfile.as_view(), name="user-delete"),
]

urlpatterns = format_suffix_patterns(urlpatterns)
