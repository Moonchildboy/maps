from django.db import models

from address.models import AddressField
from phonenumber_field.modelfields import PhoneNumberField
from address.models import State, Country, Locality


class CoopTypeManager(models.Manager):

    def get_by_natural_key(self, name):
        return self.get_or_create(name=name)[0]


class CoopType(models.Model):
    name = models.CharField(max_length=200, null=False)

    objects = CoopTypeManager()

    class Meta:
        unique_together = ("name",)


class CoopManager(models.Manager):
    # Look up by coop type
    def get_by_type(self, type):
        qset = Coop.objects.filter(type__name=type)
        return qset

    # Meant to look up coops case-insensitively by part of a type
    def contains_type(self, types_arr):
        queryset = Coop.objects.all()
        for type in types_arr:
            queryset = queryset.filter(type__name__icontains=type)
        return queryset


class Coop(models.Model):
    objects = CoopManager()
    name = models.CharField(max_length=250, null=False)
    type = models.ForeignKey(CoopType, on_delete=None) 
    address = AddressField(on_delete=models.CASCADE)
    enabled = models.BooleanField(default=True, null=False)
    phone = PhoneNumberField(null=True)
    email = models.EmailField(null=True)
    web_site = models.TextField()

def country_get_by_natural_key(self, name):
    return self.get_or_create(name=name)[0]

Country.add_to_class("get_by_natural_key",country_get_by_natural_key)

class StateCustomManager(models.Manager):
    def get_by_natural_key(self, code, country):
        country = Country.objects.get_or_create(name=country)[0]
        return State.objects.get_or_create(code=code, country=country)[0]

setattr(State._meta, 'default_manager', StateCustomManager())

class LocalityCustomManager(models.Manager):
    def get_by_natural_key(self, city, postal_code, state):
        state = State.objects.get(id=state)[0]
        return Locality.objects.get_or_create(city=city, postal_code=postal_code, state=state)[0]

setattr(Locality._meta, 'default_manager', LocalityCustomManager())


