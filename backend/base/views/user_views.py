from base.serializers import (
    UserSerializer,
    UserSerializerWithToken,
    UserUpdateSerializer,
)
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User  # User is a model/database table
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# A view takes a web request and returns a web response.
# flake8: noqa E501


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        """username and password authentication"""

        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v

        return data


# ^^^customizing JWT above


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class UserViewSet(ModelViewSet):
    """Handling user accounts
    User management for admins"""

    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(methods=["post"], detail=False)
    def register(self, request, format=None):
        """Register user"""

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

        except:  # noqa: E722
            message = {"detail": "User with this email already exists :("}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

    @action(
        methods=["put"], detail=False, permission_classes=[IsAuthenticated]
    )  # noqa: E501
    def update_profile(self, request, format=None):
        """Update user profile"""

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

        return Response(serializer.data)

    @action(
        methods=["get"], detail=False, permission_classes=[IsAuthenticated]
    )  # noqa: E501
    def profile(self, request, format=None):
        """Get user profile"""

        user = request.user
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)

    @action(
        methods=["get"], detail=False, permission_classes=[IsAdminUser], url_path=""
    )
    def all_users(self, request, format=None):
        """Get users"""

        serializer = UserSerializer(self.queryset, many=True)
        return Response(serializer.data)

    @action(methods=["put"], detail=True, permission_classes=[IsAdminUser])
    def update_user(self, request, pk, format=None):
        """Update user details (by admin)"""

        user = get_object_or_404(self.queryset, id=pk)
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

    @action(methods=["delete"], detail=True, permission_classes=[IsAdminUser])
    def delete(self, request, pk, format=None):
        """Delete a user"""

        userForDeletion = get_object_or_404(self.queryset, id=pk)
        userForDeletion.delete()
        return Response("User was deleted")

    @action(methods=["get"], detail=True, permission_classes=[IsAdminUser], url_path="")
    def get_user(self, request, pk, format=None):
        """Get user by id"""

        user = get_object_or_404(self.queryset, id=pk)
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)
