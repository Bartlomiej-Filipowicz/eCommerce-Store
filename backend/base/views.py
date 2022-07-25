from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .products import products
from .models import Product

from .serializers import ProductSerializer

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

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/products/',
        '/api/products/create/',
    ]
    # JsonResponse is an HttpResponse subclass that helps to create a JSON-encoded response
    return Response(routes)

@api_view(['GET'])
def getProducts(request):
    products = Product.objects.all() # it takes data from the database, because Product is a model
    serializer = ProductSerializer(products, many=True) # 'many=True' means that I'm passing multiple objects
    # return Response(products) <- it's incorrect because the Product object is NOT serialized
    return Response(serializer.data) # now the data comes from the database

@api_view(['GET'])
def getProduct(request, pk): # pk stands for primary key
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data) # now the data comes from the database