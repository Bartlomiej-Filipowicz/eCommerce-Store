from base.models import Product, Review
from base.serializers import (
    ProductSerializer,
    ReviewExistSerializer,
    ReviewValidateSerializer,
)
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.serializers import ValidationError
from rest_framework.viewsets import ModelViewSet

# A view takes a web request and returns a web response.


class ProductViewSet(ModelViewSet):
    """Getting products
    Handling products for admins"""

    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    @action(methods=["get"], detail=False)
    def all_products(self, request, format=None):
        """Get products"""

        query = request.query_params.get("keyword")
        # for search box functionality

        if query is None:
            query = ""

        products = self.queryset.filter(name__icontains=query)

        page = request.query_params.get("page")
        paginator = Paginator(products, 4)  # 4 items for each page

        try:
            products = paginator.page(page)
        except PageNotAnInteger:
            products = paginator.page(1)
        except EmptyPage:
            products = paginator.page(paginator.num_pages)

        if page is None:
            page = 1

        page = int(page)

        serializer = ProductSerializer(products, many=True)

        return Response(
            {
                "products": serializer.data,
                "page": page,
                "pages": paginator.num_pages,
            }  # noqa: E501
        )

    @action(methods=["get"], detail=False)
    def top(self, request, format=None):
        """Get top products"""

        products = self.queryset.filter(rating__gte=4).order_by("-rating")[0:5]
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    @action(methods=["get"], detail=True)
    def product(self, request, pk, format=None):
        """Get a single product"""

        product = get_object_or_404(self.queryset, id=pk)
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)

    @action(methods=["post"], detail=False, permission_classes=[IsAdminUser])
    def create_product(self, request, format=None):
        """Create a product"""

        user = request.user

        product = Product.objects.create(
            user=user,
            name="Sample Name",
            price=0,
            brand="Sample Brand",
            countInStock=0,
            category="Sample Category",
            description="",
        )

        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)

    @action(methods=["put"], detail=True, permission_classes=[IsAdminUser])
    def update_product(self, request, pk, format=None):
        """Update product"""

        data = request.data
        product = get_object_or_404(self.queryset, id=pk)

        serializer = ProductSerializer(instance=product, data=data, many=False)
        serializer.is_valid(raise_exception=True)

        serializer.save()
        return Response(serializer.data)

    @action(methods=["delete"], detail=True, permission_classes=[IsAdminUser])
    def delete(self, request, pk, format=None):
        """Delete a product"""

        product = get_object_or_404(self.queryset, id=pk)
        product.delete()
        return Response("Producted Deleted")

    @action(methods=["post"], detail=False)
    def upload_image(self, request, format=None):
        """Upload image for a product"""

        data = request.data

        product_id = data["product_id"]
        product = get_object_or_404(self.queryset, id=product_id)

        product.image = request.FILES.get("image")
        product.save()

        return Response("Image was uploaded")

    @action(
        methods=["post"], detail=True, permission_classes=[IsAuthenticated]
    )  # noqa: E501
    def review(self, request, pk, format=None):
        """Create a product review"""

        user = request.user
        product = get_object_or_404(self.queryset, id=pk)
        data = request.data

        # 1 - Review already exists
        try:
            serializer = ReviewExistSerializer(instance=product)
            serializer.validate(data=user)
        except ValidationError:
            return Response(
                {"detail": "Product already reviewed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 2 - No Rating or 0
        try:
            serializer = ReviewValidateSerializer()
            serializer.validate(data=data)
        except ValidationError:
            return Response(
                {"detail": "Please select a rating"},
                status=status.HTTP_400_BAD_REQUEST,  # noqa: E501
            )

        # 3 - Create review

        review = Review.objects.create(  # noqa: F841
            user=user,
            product=product,
            name=user.first_name,
            rating=data["rating"],
            comment=data["comment"],
        )

        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating

        product.rating = total / len(reviews)
        product.save()

        return Response("Review Added")
