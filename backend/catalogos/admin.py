from django.contrib import admin
from .models import Marca, Modelo, Color, Talla
# Register your models here.

admin.site.register(Marca)
admin.site.register(Modelo)
admin.site.register(Color)
admin.site.register(Talla)