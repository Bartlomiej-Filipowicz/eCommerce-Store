from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Order, OrderItem, Product, Review, ShippingAddress

# I create a serializer for every single model that I want to return,
# a serializer is going to wrap my model
# and turn that model into a JSON format


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)  # custom field
    id = serializers.SerializerMethodField(read_only=True)  # custom field
    isAdmin = serializers.SerializerMethodField(read_only=True)  # custom field

    class Meta:
        model = User
        fields = ["id", "username", "email", "name", "isAdmin"]

    def get_id(self, obj):
        return obj.id

    def get_isAdmin(self, obj):
        return obj.is_staff

    def get_name(self, obj):
        name = obj.first_name
        if name == "":
            name = obj.email

        return name


"""UserSerializerWithToken generates a refresh token, it's needed
for situations when a user first registers or changes account details"""


class UserSerializerWithToken(UserSerializer):
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


class ProductSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only=True)

    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(allow_blank=True, allow_null=True, max_length=200)
    price = serializers.DecimalField(max_digits=7, decimal_places=2, allow_null=True)
    brand = serializers.CharField(allow_blank=True, allow_null=True, max_length=200)
    countInStock = serializers.IntegerField(allow_null=True, default=0)
    category = serializers.CharField(allow_blank=True, allow_null=True, max_length=200)
    description = serializers.CharField(allow_null=True, allow_blank=True)

    class Meta:
        model = Product
        fields = "__all__"

    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data

    def update(self, instance, validated_data):

        instance.name = validated_data.get("name", instance.name)
        instance.price = validated_data.get("price", instance.price)
        instance.brand = validated_data.get("brand", instance.brand)
        instance.countInStock = validated_data.get(
            "countInStock", instance.countInStock
        )
        instance.category = validated_data.get("category", instance.category)
        instance.description = validated_data.get("description", instance.description)
        instance.save()
        return instance


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
