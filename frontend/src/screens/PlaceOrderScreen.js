import React, { useState, useEffect } from 'react'
import { Button, Row, Col, ListGroup, Image, Card, Container } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'

function PlaceOrderScreen() {

    const cart = useSelector(state => state.cart)

    const itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2) // it doesn't update the store, it's only for this page
    //cart.itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)  <- old version
    // INITIALLLY 'itemsPrice' was an attribute of the 'cart' state, but it was causing Error: Invariant failed: A state mutation
    // was detected between dispatches, in the path 'cart.itemsPrice'

    const shippingPrice = (itemsPrice > 100 ? 0 : 10).toFixed(2)
    const taxPrice = Number( 0.05 * itemsPrice).toFixed(2)
    const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2)

    const placeOrder = () => {
        console.log('place order')
    }

    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4 />
            
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2 class="text-light">Shipping</h2>

                            <p class="text-light">
                                <strong class="text-secondary">Shipping: </strong>
                                {cart.shippingAddress.address}, {cart.shippingAddress.city}
                                {'  '}
                                {cart.shippingAddress.postalCode},
                                {'  '}
                                {cart.shippingAddress.country}
                            </p>
                        </ListGroup.Item>
                    <br/>
                        <ListGroup.Item>
                            <h2 class="text-light">Payment Method</h2>

                            <p class="text-light">
                                <strong class="text-secondary">Method: </strong>
                                {cart.paymentMethod}
                            </p>
                        </ListGroup.Item>
                    <br/>
                        <ListGroup.Item>
                            <h2 class="text-light">Order Items</h2>

                            {cart.cartItems.length === 0 ? <Message variant='info'>
                                Your cart is empty
                            </Message> : (
                                <ListGroup variant='flush'>
                                    {cart.cartItems.map((item,index) => (
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
                                <h2 class="text-light">Order Summary</h2>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col><strong class="text-light">Items </strong></Col>
                                    <Col>${itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col><strong class="text-light">Shipping </strong></Col>
                                    <Col>${shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col><strong class="text-light">Tax </strong></Col>
                                    <Col>${taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col><strong class="text-secondary">Total </strong></Col>
                                    <Col>${totalPrice}</Col>
                                    
                                </Row>
                                
                            </ListGroup.Item>
                            <br/>
                            <ListGroup.Item>
                                <div className="d-grid gap-2">
                                    <Button
                                        type='button'
                                        size='lg'
                                        className='btn-block'
                                        disabled={cart.cartItems === 0}
                                        onClick={placeOrder}
                                    >
                                        <strong>Place Order</strong>
                                    </Button>
                                </div>
                            </ListGroup.Item>

                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default PlaceOrderScreen