from dataclasses import fields
import imp
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .models import Product, Order, OrderItem, ShippingAddress

# I create a serializer for every single model that I want to return, a serializer is going to wrap my model
# and turn that model into a JSON format

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)    # custom field
    _id = serializers.SerializerMethodField(read_only=True)     # custom field
    isAdmin = serializers.SerializerMethodField(read_only=True) # custom field

    class Meta:
        model = User
        fields = ['id','_id', 'username', 'email', 'name', 'isAdmin']

    def get__id(self, obj):
        return obj.id

    def get_isAdmin(self, obj):
        return obj.is_staff

    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email

        return name

'''UserSerializerWithToken generates a refresh token, it's needed for situations
when a user first registers or changes account details'''
class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)    # custom field
    
    class Meta:
        model = User
        fields = ['id','_id', 'username', 'email', 'name', 'isAdmin', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'



class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField(read_only=True) 
    shippingAddress = serializers.SerializerMethodField(read_only=True)  
    user = serializers.SerializerMethodField(read_only=True) 

    class Meta:
        model = Order
        fields = '__all__'

    def get_orderItems(self, obj):
        items = obj.orderitem_set.all()
        serializer = OrderItemSerializer(items, many=True)

        return serializer.data

    def get_shippingAddress(self, obj):
        try:
            address = ShippingAddressSerializer(obj.shippingAddress, many=False)
        except:
            address = False

        return address

    def get_user(self, obj):
        user = obj.user
        serializer = UserSerializer(user, many=False)
        return serializer.data