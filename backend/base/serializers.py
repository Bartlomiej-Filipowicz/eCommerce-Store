from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Order, OrderItem, Product, Review, ShippingAddress


class UserSerializer(serializers.ModelSerializer):

    name = serializers.SerializerMethodField(read_only=True)  # custom field
    isAdmin = serializers.SerializerMethodField(read_only=True)  # custom field
    # first_name field serves as full name

    class Meta:
        model = User
        fields = ["id", "username", "email", "name", "isAdmin"]

    def get_isAdmin(self, obj):
        # isAdmin is read_only
        return obj.is_staff

    def get_name(self, obj):
        # name is read_only
        name = obj.first_name
        if name == "":
            name = obj.email

        return name


class UserUpdateSerializer(serializers.ModelSerializer):
    # first_name field serves as full name

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "is_staff"]


class UserSerializerWithToken(UserSerializer):
    """UserSerializerWithToken generates a refresh token, it's needed
    for situations when a user first registers or changes account details"""

    token = serializers.SerializerMethodField(read_only=True)  # custom field

    class Meta:
        model = User
        fields = ["id", "username", "email", "name", "isAdmin", "token"]

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"


class ReviewExistSerializer(serializers.Serializer):
    def validate(self, data):
        """Check if review already exists"""

        alreadyExists = self.instance.review_set.filter(user=data).exists()
        if alreadyExists:
            raise serializers.ValidationError("Product already reviewed")
        return data


class ReviewValidateSerializer(serializers.Serializer):
    def validate(self, data):
        """Check if there is a rating"""

        if int(data["rating"]) == 0:
            raise serializers.ValidationError("There is no rating")
        return data


class ProductSerializer(serializers.ModelSerializer):

    reviews = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = "__all__"

    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data


class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = "__all__"


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField(read_only=True)
    shippingAddress = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = "__all__"

    def get_orderItems(self, obj):
        items = obj.orderitem_set.all()
        serializer = OrderItemSerializer(items, many=True)

        return serializer.data

    def get_shippingAddress(self, obj):
        try:
            address = ShippingAddressSerializer(obj.shippingaddress, many=False).data
        except:
            address = False

        return address

    def get_user(self, obj):
        user = obj.user
        serializer = UserSerializer(user, many=False)
        return serializer.data
