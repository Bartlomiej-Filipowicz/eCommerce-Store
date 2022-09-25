from base.models import Product, Review
from base.serializers import (
    ProductSerializer,
    ReviewExistSerializer,
    ReviewValidateSerializer,
)
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.serializers import ValidationError
from rest_framework.views import APIView

# A view takes a web request and returns a web response.


class GetProducts(APIView):
    """Return a set of products"""

    def get(self, request, format=None):
        """Get products"""

        query = request.query_params.get("keyword")  # for search box functionality

        if query is None:
            query = ""

        products = Product.objects.filter(name__icontains=query)

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
            {"products": serializer.data, "page": page, "pages": paginator.num_pages}
        )


class TopProducts(APIView):
    """Getting top products for the carousel"""

    def get(self, request, format=None):
        """Get top products"""

        products = Product.objects.filter(rating__gte=4).order_by("-rating")[0:5]
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)


class GetProduct(APIView):
    """Getting a single product"""

    def get(self, request, pk, format=None):
        """Get product"""

        product = get_object_or_404(Product, id=pk)
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)


class AdminProducts(APIView):
    """Handling products for admins"""

    permission_classes = [IsAdminUser]

    def post(self, request, format=None):
        """Create product"""

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

    def put(self, request, pk, format=None):
        """Update product"""

        data = request.data
        product = get_object_or_404(Product, id=pk)

        serializer = ProductSerializer(instance=product, data=data, many=False)
        serializer.is_valid(raise_exception=True)

        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk, format=None):
        """Delete product"""

        product = get_object_or_404(Product, id=pk)
        product.delete()
        return Response("Producted Deleted")


class UploadImage(APIView):
    """Uploading an image for a product"""

    def post(self, request, format=None):
        """Upload image"""

        data = request.data

        product_id = data["product_id"]
        product = get_object_or_404(Product, id=product_id)

        product.image = request.FILES.get("image")
        product.save()

        return Response("Image was uploaded")


class ProductReview(APIView):
    """Creating a product review"""

    permission_classes = [IsAuthenticated]

    def post(self, request, pk, format=None):
        """Create product review"""

        user = request.user
        product = get_object_or_404(Product, id=pk)
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
                {"detail": "Please select a rating"}, status=status.HTTP_400_BAD_REQUEST
            )

        # 3 - Create review

        review = Review.objects.create(
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
