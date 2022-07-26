import React, { useState, useEffect } from 'react'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { PayPalButton } from 'react-paypal-button-v2'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants'


function OrderScreen() {

    const { id } = useParams()
    const orderId = id
    
    const dispatch = useDispatch()

    const [sdkReady, setSdkReady] = useState(false)

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, error, loading } = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    //////////const itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2) // it doesn't update the store, it's only for this page
    //cart.itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)  <- old version
    // INITIALLLY 'itemsPrice' was an attribute of the 'cart' state, but it was causing Error: Invariant failed: A state mutation
    // was detected between dispatches, in the path 'cart.itemsPrice'
    if(!loading && !error) {
        order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    }


    const addPayPalScript = () => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = 'https://www.paypal.com/sdk/js?client-id=Afgpg65Eiuo4UxglW1pMP3Ch8vmI62-7V5d7aHvLMXwU5x2Yyaxa1jbDoGcnSytVGpcBNanfgLwNR7hK&currency=USD'
        script.async = true
        script.onload = () => {
            setSdkReady(true)
        }
        document.body.appendChild(script)
    }

    const navigate = useNavigate()  //replaces history

    // navigate() should be inside useEffect(), because when it was outside it didn't work
    useEffect(() => {

        if (!userInfo) {
            navigate('/login')  // replaces history.push()
        }

        if (!order || successPay || order._id !== Number(orderId) || successDeliver ) {

            dispatch({ type: ORDER_PAY_RESET })
            dispatch({ type: ORDER_DELIVER_RESET })

            dispatch(getOrderDetails(orderId))
        }
        else if (!order.isPaid) {
            if (!window.paypal) {
                addPayPalScript()
            } 
            else {
                setSdkReady(true)
            }
        }
        
    }, [dispatch, order, orderId, successPay, successDeliver])


    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(orderId, paymentResult))
    }

    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }
   

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
                                <Message variant='success'>Delivered on {order.deliveredAt.substring(0, 10)}</Message>
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
                                    <Message variant='success'>Paid on {order.paidAt.substring(0, 19).replace('T', '  ')}</Message>
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

                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader />}

                                    {!sdkReady ? (
                                        <Loader />
                                    ) : (
                                            <PayPalButton
                                                amount={order.totalPrice}
                                                onSuccess={successPaymentHandler}
                                            />
                                        )}
                                </ListGroup.Item>
                            )}
                        

                            {loadingDeliver && <Loader />}
                            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                <ListGroup.Item className='mt-3'>
                                    <div className="d-grid gap-2">
                                        <Button
                                            type='button'
                                            size='lg'
                                            onClick={deliverHandler}
                                        >
                                            <strong>Mark As Delivered</strong>
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default OrderScreen