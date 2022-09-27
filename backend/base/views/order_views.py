from datetime import datetime

from base.models import Order, OrderItem, Product, ShippingAddress
from base.serializers import OrderSerializer
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet


class OrderViewSet(ModelViewSet):
    """Handling orders for users and admins"""

    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    @action(
        methods=["post"],
        detail=False,
        permission_classes=[IsAuthenticated],
        url_path="create_order",
    )
    def create_order(self, request, format=None):
        """Add order items"""

        user = request.user
        data = request.data

        orderItems = data["orderItems"]

        if orderItems and len(orderItems) == 0:
            return Response(
                {"detail": "No Order Items"},
                status=status.HTTP_400_BAD_REQUEST,  # noqa: E501
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

            shipping = ShippingAddress.objects.create(  # noqa: F841
                order=order,
                address=data["shippingAddress"]["address"],
                city=data["shippingAddress"]["city"],
                postalCode=data["shippingAddress"]["postalCode"],
                country=data["shippingAddress"]["country"],
            )

            # 3. Create OrderItem models
            # and set Order to OrderItem relationship

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

    @action(methods=["get"], detail=True, permission_classes=[IsAuthenticated])
    def get_one_order(self, request, pk, format=None):
        """Get order by Id"""

        user = request.user

        try:
            order = self.queryset.get(id=pk)

        except Order.DoesNotExist:
            return Response(
                {"detail": "Order does not exist"},
                status=status.HTTP_400_BAD_REQUEST,  # noqa: E501
            )

        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            Response(
                {"detail": "Not authorized to view this order"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(methods=["put"], detail=True, permission_classes=[IsAuthenticated])
    def pay(self, request, pk, format=None):
        """Update order to paid"""

        order = get_object_or_404(self.queryset, id=pk)

        order.isPaid = True
        order.paidAt = datetime.now()
        order.save()

        return Response("Order was paid")

    @action(
        methods=["get"], detail=False, permission_classes=[IsAuthenticated]
    )  # noqa: E501
    def myorders(self, request, format=None):
        """Get my orders"""

        user = request.user
        orders = user.order_set.all()
        serializer = OrderSerializer(orders, many=True)

        return Response(serializer.data)

    @action(methods=["get"], detail=False, permission_classes=[IsAdminUser])
    def all_orders(self, request, format=None):
        """Get all orders"""

        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    @action(methods=["put"], detail=True, permission_classes=[IsAdminUser])
    def deliver(self, request, pk, format=None):
        """Update order to delivered"""

        order = get_object_or_404(self.queryset, id=pk)

        order.isDelivered = True
        order.deliveredAt = datetime.now()
        order.save()

        return Response("Order was delivered")
