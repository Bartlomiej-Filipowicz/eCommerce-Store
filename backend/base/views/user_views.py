from email import message
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.contrib.auth.models import User # User is a model/class/database table
from django.contrib.auth.hashers import make_password
from rest_framework import status

from base.serializers import ProductSerializer, UserSerializer, UserSerializerWithToken

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

#from backend.base import serializers
from .. import serializers


# A view function, or view for short, is a Python function that takes a web request and returns a web response.

# Create your views here.

# I need to serialize the Product object so that it is easily transmitted to frontend

# I create a serializer for every single model that I want to return, a serializer is going to wrap my model
# and turn that model into a JSON format

# Serialization is the process of converting a data object—a combination of code and data
# represented within a region of data storage—into a series of bytes that saves the state
# of the object in an easily transmittable form, in this serialized form, the data can be
# delivered to another data store (such as an in-memory computing platform), application,
# or some other destination.

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v

        return data
# ^^^customizing JWT above

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def registerUser(request):
    data = request.data

    try:
        user = User.objects.create(
            first_name = data['name'],
            username = data['email'],
            email = data['email'],
            password = make_password(data['password'])
        )
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)

    except:
        message = {'detail':'User with this email already exists :('}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

# if token is off, then access is denied because authentication credentials were not provided
@api_view(['GET'])
@permission_classes([IsAuthenticated]) # protected route
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False) # 'many=False' means that I want to obtain one user
    # return Response(user) <- it's incorrect because it's NOT serialized
    return Response(serializer.data) # now the data comes from the database

@api_view(['GET'])
@permission_classes([IsAdminUser]) # only for admins
def getUsers(request):
    users = User.objects.all() # it takes data from the database, because User is a model
    serializer = UserSerializer(users, many=True) # 'many=True' means that I'm passing multiple objects
    # return Response(users) <- it's incorrect because the User object is NOT serialized
    return Response(serializer.data) # now the data comes from the database

