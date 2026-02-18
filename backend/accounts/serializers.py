from djoser.serializers import UserCreateSerializer, UserSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'full_name', 'profile_pic', 'password')

class CustomUserSerializer(UserSerializer):
    has_usable_password = serializers.SerializerMethodField()

    def get_has_usable_password(self, obj):
        return obj.has_usable_password()

    class Meta(UserSerializer.Meta):
        model = User
        fields = ('id', 'email', 'full_name', 'profile_pic', 'google_profile_pic', 'has_usable_password')
        read_only_fields = ('google_profile_pic', 'has_usable_password')
