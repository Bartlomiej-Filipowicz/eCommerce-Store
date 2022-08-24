from django.contrib.auth.models import User
from django.db.models.signals import pre_save

# anything I use in pre_save is gonna go into my models
# and conduct actions there before a model finishes a saving process

"""a username gets the same value as an email before the User model is saved"""


def updateUser(sender, instance, **kwargs):
    user = instance
    if user.email != "":
        user.username = user.email


# when the User model is about to be saved, fire updateUser function first
pre_save.connect(updateUser, sender=User)
