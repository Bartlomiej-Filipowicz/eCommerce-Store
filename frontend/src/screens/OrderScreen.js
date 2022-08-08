import React, { useState, useEffect } from 'react'
import { Button, Row, Col, ListGroup, Image, Card, Container } from 'react-bootstrap'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails } from '../actions/orderActions'


function OrderScreen() {

    const { id } = useParams()
    const orderId = id
    
    const dispatch = useDispatch()

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, error, loading } = orderDetails

    //////////const itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2) // it doesn't update the store, it's only for this page
    //cart.itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)  <- old version
    // INITIALLLY 'itemsPrice' was an attribute of the 'cart' state, but it was causing Error: Invariant failed: A state mutation
    // was detected between dispatches, in the path 'cart.itemsPrice'
    if(!loading && !error) {
        order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    }


    // navigate() should be inside useEffect(), because when it was outside it didn't work
    useEffect(() => {

        if (!order || order._id !== Number(orderId) ) {

            dispatch(getOrderDetails(orderId))
        }
        
    }, [dispatch, order, orderId])

   

    return loading ? (
        <Loader />
    ) : error ? (
        <Message variant='danger'>{error}</Message>
    ) : (
        <div>

            <h1>Order {order._id}</h1>
            
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2 className="text-light">Shipping</h2>

                            <p className="text-light"><strong className="text-secondary">Name:  &nbsp;  &nbsp;  </strong> {order.user.name}</p>
                            <p className="text-light"><strong className="text-secondary">Email:  &nbsp;  &nbsp;  </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>

                            <p className="text-light">
                                <strong className="text-secondary">Shipping:  &nbsp;  &nbsp;  </strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city}
                                {'  '}
                                {order.shippingAddress.postalCode},
                                {'  '}
                                {order.shippingAddress.country}
                            </p>

                            {order.isDelivered ? (
                                <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                                ) : (
                                    <Message variant='primary'>Not Delivered</Message>
                                )}
                        </ListGroup.Item>
                    <br/>
                        <ListGroup.Item>
                            <h2 className="text-light">Payment Method</h2>

                            <p className="text-light">
                                <strong className="text-secondary">Method:  &nbsp;  &nbsp;  </strong>
                                {order.paymentMethod}
                            </p>

                            {order.isPaid ? (
                                    <Message variant='success'>Paid on {order.paidAt}</Message>
                                    ) : (
                                        <Message variant='primary'>Not Paid</Message>
                                    )}
                        </ListGroup.Item>
                    <br/>
                        <ListGroup.Item>
                            <h2 className="text-light">Order Items</h2>

                            {order.orderItems.length === 0 ? <Message variant='info'>
                                Order is empty
                            </Message> : (
                                <ListGroup variant='flush'>
                                    {order.orderItems.map((item,index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>

                                                <Col>
                                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                </Col>

                                                <Col md={4}>
                                                    <strong>{item.qty}</strong> &nbsp;  X  &nbsp; ${item.price} &nbsp;  =  &nbsp;  ${(item.qty * item.price).toFixed(2)}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) }
                            
                        </ListGroup.Item>

                    </ListGroup>
                </Col>
                    
                <Col md={4}>
                    <Card className='mt-0 p-3 border border-2 rounded-3 border border-light'>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2 className="text-light">Order Summary</h2>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col><strong className="text-light">Items </strong></Col>
                                    <Col>${order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col><strong className="text-light">Shipping </strong></Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col><strong className="text-light">Tax </strong></Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item className='pb-3'>
                                <Row>
                                    <Col><strong className="text-secondary">Total </strong></Col>
                                    <Col>${order.totalPrice}</Col>
                                    
                                </Row>
                                
                            </ListGroup.Item>
                            

                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default OrderScreen