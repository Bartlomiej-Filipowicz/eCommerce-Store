from email import message
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.models import Product, Review

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from rest_framework import status

from base.serializers import ProductSerializer

#from backend.base import serializers
from .. import serializers

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
def getProducts(request):
    query = request.query_params.get('keyword') # for search box functionality

    if query == None:
        query = ''

    products = Product.objects.filter(name__icontains = query) # it takes data from the database, because Product is a model
    # ^^ it's looking for a word(from query) in a name of products and is case-insensitive 

    page = request.query_params.get('page')
    paginator = Paginator(products, 4)  # 2 items for each page

    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)

    if page == None:
        page = 1

    page = int(page)

    serializer = ProductSerializer(products, many=True) # 'many=True' means that I'm passing multiple objects
    # return Response(products) <- it's incorrect because the Product object is NOT serialized
    return Response({'products': serializer.data, 'page': page, 'pages': paginator.num_pages}) # now the data comes from the database



@api_view(['GET'])
def getTopProducts(request):
    products = Product.objects.filter(rating__gte=4).order_by('-rating')[0:5]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)



@api_view(['GET'])
def getProduct(request, pk): # pk stands for primary key
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data) # now the data comes from the database


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user

    product = Product.objects.create(
        user=user,
        name='Sample Name',
        price=0,
        brand='Sample Brand',
        countInStock=0,
        category='Sample Category',
        description=''
    )

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)



@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.data
    product = Product.objects.get(_id=pk)

    product.name = data['name']
    product.price = data['price']
    product.brand = data['brand']
    product.countInStock = data['countInStock']
    product.category = data['category']
    product.description = data['description']

    product.save()

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)



@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    product = Product.objects.get(_id=pk)
    product.delete()
    return Response('Producted Deleted')



@api_view(['POST'])
def uploadImage(request):
    data = request.data

    product_id = data['product_id']
    product = Product.objects.get(_id=product_id)

    product.image = request.FILES.get('image')
    product.save()

    return Response('Image was uploaded')




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = Product.objects.get(_id=pk)
    data = request.data

    # 1 - Review already exists
    alreadyExists = product.review_set.filter(user=user).exists()
    if alreadyExists:
        content = {'detail': 'Product already reviewed'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 2 - No Rating or 0
    elif data['rating'] == 0:
        content = {'detail': 'Please select a rating'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 3 - Create review
    else:
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment'],
        )

        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating

        product.rating = total / len(reviews)
        product.save()

        return Response('Review Added')