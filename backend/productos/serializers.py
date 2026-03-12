from rest_framework import serializers
from .models import Producto


class ProductoSerializer(serializers.ModelSerializer):
    marca_nombre = serializers.StringRelatedField(source="marca", read_only=True)
    modelo_nombre = serializers.StringRelatedField(source="modelo", read_only=True)
    color_nombre = serializers.StringRelatedField(source="color", read_only=True)
    talla_nombre = serializers.StringRelatedField(source="talla", read_only=True)

    class Meta:
        model = Producto
        fields = [
            "id",
            "nombre",
            "marca",
            "modelo",
            "color",
            "talla",
            "marca_nombre",
            "modelo_nombre",
            "color_nombre",
            "talla_nombre",
            "imagen",
            "precio",
        ]