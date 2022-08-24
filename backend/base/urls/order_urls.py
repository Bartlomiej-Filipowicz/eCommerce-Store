# this file is responsible for connecting views to urls
from base.views import order_views as views
from django.urls import path

urlpatterns = [
    path("", views.getOrders, name="orders"),
    path("add/", views.addOrderItems, name="orders-add"),
    path("myorders/", views.getMyOrders, name="myorders"),
    path("<str:pk>/deliver/", views.updateOrderToDelivered, name="order-delivered"),
    path("<str:pk>/", views.getOrderById, name="user-order"),
    path("<str:pk>/pay/", views.updateOrderToPaid, name="pay"),
]
