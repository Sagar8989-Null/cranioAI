from django.db import models
from django.contrib.auth.models import User
import uuid
import os


def profile_image_upload_path(instance, filename):
    ext = filename.split(".")[-1]
    return f"profile_images/{uuid.uuid4()}.{ext}"


class UserProfile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    full_name = models.CharField(
        max_length=150,
        blank=True
    )

    phone_number = models.CharField(
        max_length=20,
        blank=True
    )

    location = models.CharField(
        max_length=200,
        blank=True
    )

    about = models.TextField(
        blank=True
    )

    profile_image = models.ImageField(
        upload_to=profile_image_upload_path,
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.pk:
            old = UserProfile.objects.filter(pk=self.pk).first()

            if (
                old
                and old.profile_image
                and old.profile_image != self.profile_image
            ):
                if os.path.isfile(old.profile_image.path):
                    os.remove(old.profile_image.path)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.user.username