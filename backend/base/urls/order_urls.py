# this file is responsible for connecting views to urls
from base.views import order_views as views
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path("", views.AdminOrders.as_view(), name="orders"),
    path("add/", views.UserOrders.as_view(), name="orders-add"),
    path("myorders/", views.MyOrders.as_view(), name="myorders"),
    path("<str:pk>/deliver/", views.AdminOrders.as_view(), name="order-delivered"),
    path("<str:pk>/", views.UserOrders.as_view(), name="user-order"),
    path("<str:pk>/pay/", views.UserOrders.as_view(), name="pay"),
]

urlpatterns = format_suffix_patterns(urlpatterns)
