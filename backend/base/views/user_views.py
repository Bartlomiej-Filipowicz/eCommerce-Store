from base.serializers import (
    UserSerializer,
    UserSerializerWithToken,
    UserUpdateSerializer,
)
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User  # User is a model/database table
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# A view takes a web request and returns a web response.

# I create a serializer for every single model that I want to return,
# a serializer is going to wrap my model and turn that model into a JSON format


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # a username and a password authentication
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v

        return data


# ^^^customizing JWT above


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class RegisterUser(APIView):
    """
    Creating a new account
    """

    def post(self, request, format=None):
        # register user
        data = request.data

        try:
            user = User.objects.create(
                first_name=data["name"],
                username=data["email"],
                email=data["email"],
                password=make_password(data["password"]),
            )
            serializer = UserSerializerWithToken(user, many=False)
            return Response(serializer.data)

        except:
            message = {"detail": "User with this email already exists :("}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)


class UserProfile(APIView):
    """
    Handling user profile
    """

    permission_classes = [IsAuthenticated]

    def put(self, request, format=None):
        # update user profile
        user = request.user
        serializer = UserSerializerWithToken(user, many=False)

        data = request.data

        user.first_name = data["name"]
        user.username = data["email"]
        user.email = data["email"]

        if data["password"] != "":
            user.password = make_password(data["password"])

        if user.email != "":
            user.username = user.email

        user.save()

        # return Response(user) <- it's incorrect because it's NOT serialized
        return Response(serializer.data)

    def get(self, request, format=None):
        # get user profile
        user = request.user
        serializer = UserSerializer(user, many=False)
        # return Response(user) <- it's incorrect because it's NOT serialized
        return Response(serializer.data)


class AdminProfile(APIView):
    """
    User management for admins
    """

    permission_classes = [IsAdminUser]

    def get(self, request, format=None):
        # get users
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        # return Response(users) <- it's incorrect because
        # the User object is NOT serialized
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        # update user
        user = get_object_or_404(User, id=pk)
        data = request.data
        data["first_name"] = data.pop("name")
        data["is_staff"] = data.pop("isAdmin")

        serializer = UserUpdateSerializer(
            user,
            data=data,
            many=False,
        )
        serializer.is_valid(raise_exception=True)
        # print(serializer.errors)

        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk, format=None):
        # delete user
        userForDeletion = get_object_or_404(User, id=pk)
        userForDeletion.delete()
        return Response("User was deleted")


class AdminProfileId(APIView):
    """
    User management for admins
    Extracting a single user
    """

    permission_classes = [IsAdminUser]

    def get(self, request, pk, format=None):
        # get user by id
        user = get_object_or_404(User, id=pk)
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)
