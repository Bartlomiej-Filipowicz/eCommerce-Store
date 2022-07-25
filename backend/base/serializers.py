from dataclasses import fields
import imp
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product

# I create a serializer for every single model that I want to return, a serializer is going to wrap my model
# and turn that model into a JSON format

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'