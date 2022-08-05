from email import message
from email.mime import image
from itertools import product
from math import prod
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.models import Product, Order, OrderItem, ShippingAddress


from rest_framework import status

from base.serializers import ProductSerializer, OrderSerializer

from .. import serializers

@api_view(['POST'])
@permission_classes(['IsAuthenticated'])
def addOrderItems(request):

    user = request.user
    data = request.data

    orderItems = data['orderItems']

    if orderItems and len(orderItems) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        # 1. Create Order model

        order = Order.objects.create(
            user = user,
            paymentMethod = data['paymentMethod'],
            taxPrice = data['taxPrice'],
            shippingPrice = data['shippingPrice'],
            totalPrice = data['totalPrice']
        )

        # 2. Create ShippingAddress model

        shipping = ShippingAddress.objects.create(
            order = order,
            address = data['shippingAddress']['address'],
            city = data['shippingAddress']['city'],
            postalCode = data['shippingAddress']['postalCode'],
            country = data['shippingAddress']['country'],

        )

        # 3. Create OrderItem models and set Order to OrderItem relationship

        for i in orderItems:
            product = Product.objects.get(_id = i['product']) # 'product' is an id

            item = OrderItem.objects.create(
                product = product,
                order = order,
                name = product.name,
                qty = i['qty'],
                price = i['price'],
                image = product.image.url,
            )

            # 4. Update stock

            product.countInStock -= item.qty
            product.save()

    serializer = OrderSerializer(order, many=False)

    return Response(serializer.data)