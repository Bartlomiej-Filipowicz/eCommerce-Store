from base.serializers import UserSerializerWithToken
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

# Create your tests here.


class RegistrationTestCase(APITestCase):
    def test_registration(self):
        data = {
            "name": "testcase",
            "email": "test@localhost.app",
            "password": "some_psw",
        }

        response = self.client.post("/api/users/register/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class UserProfileTestCase(APITestCase):
    """Handle user profile (by a user)"""

    def setUp(self):
        self.user = User.objects.create(
            first_name="testcase",
            username="test@localhost.app",
            email="test@localhost.app",
            password="some_psw",
        )
        serializer = UserSerializerWithToken(self.user, many=False)
        self.api_authentication(serializer.get_token(self.user))

    def api_authentication(self, token):
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + token)

    def test_profile_authenticated(self):
        response = self.client.get(
            "/api/users/profile/", content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_profile_not_authenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(
            "/api/users/profile/", content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_update_user(self):
        # response = self.client.put(reverse('profile-detail', kwargs={'pk': 1}))
        response = self.client.put(
            "/api/users/update_profile/",
            data={
                "id": self.user.id,
                "name": "testcase2",
                "email": "test@localhost.app",
                "password": "strong-pswd",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "test@localhost.app")


class UserProfileAdminTestCase(APITestCase):
    """Handle user profile (by admin)"""

    def setUp(self):
        self.user = User.objects.create_superuser(
            first_name="testcaseadmin",
            username="admin@localhost.app",
            email="admin@localhost.app",
            password="some_psw_admin",
        )
        serializer = UserSerializerWithToken(self.user, many=False)
        self.api_authentication(serializer.get_token(self.user))

    def api_authentication(self, token):
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + token)

    def test_all_users(self):
        response = self.client.get("/api/users/", content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_user_details(self):
        response = self.client.put(
            f"/api/users/{self.user.id}/update_user/",
            data={
                "id": self.user.id,
                "name": "testcase2",
                "username": "test2@localhost.app",
                "email": "test2@localhost.app",
                "isAdmin": "True",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
