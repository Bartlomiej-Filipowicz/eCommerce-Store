# this file is responsible for connecting views to urls
from base.views import product_views as views
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path("", views.GetProducts.as_view(), name="products"),
    path("create/", views.AdminProducts.as_view(), name="product-create"),
    path("upload/", views.UploadImage.as_view(), name="image-upload"),
    path("<str:pk>/reviews/", views.ProductReview.as_view(), name="create-review"),
    path("top/", views.TopProducts.as_view(), name="top-products"),
    path("<str:pk>/", views.GetProduct.as_view(), name="product"),
    path("update/<str:pk>/", views.AdminProducts.as_view(), name="product-update"),
    path("delete/<str:pk>/", views.AdminProducts.as_view(), name="product-delete"),
]

urlpatterns = format_suffix_patterns(urlpatterns)
