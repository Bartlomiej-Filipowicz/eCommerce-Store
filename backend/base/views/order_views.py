from datetime import datetime

from base.models import Order, OrderItem, Product, ShippingAddress
from base.serializers import OrderSerializer
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


class UserOrders(APIView):
    """
    Handling orders for users
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        # add order items

        user = request.user
        data = request.data

        orderItems = data["orderItems"]

        if orderItems and len(orderItems) == 0:
            return Response(
                {"detail": "No Order Items"}, status=status.HTTP_400_BAD_REQUEST
            )
        else:
            # 1. Create Order model

            order = Order.objects.create(
                user=user,
                paymentMethod=data["paymentMethod"],
                taxPrice=data["taxPrice"],
                shippingPrice=data["shippingPrice"],
                totalPrice=data["totalPrice"],
            )

            # 2. Create ShippingAddress model

            shipping = ShippingAddress.objects.create(
                order=order,
                address=data["shippingAddress"]["address"],
                city=data["shippingAddress"]["city"],
                postalCode=data["shippingAddress"]["postalCode"],
                country=data["shippingAddress"]["country"],
            )

            # 3. Create OrderItem models and set Order to OrderItem relationship

            for i in orderItems:
                product = get_object_or_404(Product, id=i["product"])
                # product is an id

                item = OrderItem.objects.create(
                    product=product,
                    order=order,
                    name=product.name,
                    qty=i["qty"],
                    price=i["price"],
                    image=product.image.url,
                )

                # 4. Update stock

                product.countInStock -= item.qty
                product.save()

            serializer = OrderSerializer(order, many=False)

            return Response(serializer.data)

    def get(self, request, pk, format=None):
        # get order by Id

        user = request.user

        try:
            order = Order.objects.get(id=pk)

        except Order.DoesNotExist:
            return Response(
                {"detail": "Order does not exist"}, status=status.HTTP_400_BAD_REQUEST
            )

        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            Response(
                {"detail": "Not authorized to view this order"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def put(self, request, pk, format=None):
        # update order to paid
        order = get_object_or_404(Order, id=pk)

        order.isPaid = True
        order.paidAt = datetime.now()
        order.save()

        return Response("Order was paid")


class MyOrders(APIView):
    """
    Getting all user's orders
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        # get my orders

        user = request.user
        orders = user.order_set.all()
        serializer = OrderSerializer(orders, many=True)

        return Response(serializer.data)


class AdminOrders(APIView):
    """
    Handling orders for admins
    """

    permission_classes = [IsAdminUser]

    def get(self, request, format=None):
        # get orders
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        # update order to delivered
        order = get_object_or_404(Order, id=pk)

        order.isDelivered = True
        order.deliveredAt = datetime.now()
        order.save()

        return Response("Order was delivered")
