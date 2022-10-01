# this file is responsible for connecting views to urls
from base.views import user_views as views
from django.urls import path
from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns

# flake8: noqa E501

router = routers.SimpleRouter()
router.register(r"", views.UserViewSet)

urlpatterns = [
    path("login/", views.MyTokenObtainPairView.as_view(), name="token_obtain_pair")
]

urlpatterns += router.urls


urlpatterns = format_suffix_patterns(urlpatterns)
