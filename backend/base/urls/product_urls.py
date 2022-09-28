# this file is responsible for connecting views to urls
from base.views import product_views as views
from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns

router = routers.SimpleRouter()
router.register(r"", views.ProductViewSet)

urlpatterns = router.urls

urlpatterns = format_suffix_patterns(urlpatterns)
