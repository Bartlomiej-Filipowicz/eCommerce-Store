import React, { useEffect } from 'react'
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../actions/cartActions'

function CartScreen() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const productId = id
  const qty = Number(searchParams.get('qty')) > 1 ? Number(searchParams.get('qty')) : 1 // replaces location.search
  // below is an older version
  //const qty = location.search ? Number(location.search.split('=')[1]) : 1
  // ^^splits url by '=' and returns the second value, which is quantity
  // otherwise returns 1
  
  const dispatch = useDispatch()

  const cart = useSelector(state => state.cart)
  const { cartItems } = cart

  // things inside useEffect are done after each render of a component(including useState value refresh)
  useEffect(() => {
    if(productId) {
      dispatch(addToCart(productId, qty)) // addToCart is in cartActions.js
    }
  }, [dispatch, productId, qty])


  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }

  const navigate = useNavigate() // replaces history

  const checkoutHandler = () => {
    navigate('/login?redirect=shipping') // replaces history.push()
  }

  return (
    <Row>
      <h1>Shopping Cart</h1>
      <Col md={8}>
        
        {cartItems.length === 0 ? (
          <Message variant='info'>
            Your cart is empty <Link to='/'>Go to Homepage</Link>
          </Message>
        ) : (
          <ListGroup variant='flush' >
            {cartItems.map(item => ( 
              
                <ListGroup.Item key={item.product} className='mb-3' >
                  
                    <Row>
                        <Col md={2}>
                            <Image src={item.image} alt={item.name} fluid rounded/>
                        </Col>

                        <Col md={3} className='mt-3'>
                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                        </Col>

                        <Col md={2} className='mt-3'>${item.price}</Col>

                        <Col md={3} className='mt-3'>
                            <Form.Control 
                              as="select"
                              value={item.qty}
                              onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}> 
                              {// e stands for event
                              }

                              {
                                [...Array(item.countInStock).keys()].map((x) =>(
                                  <option key={x + 1} value={x + 1}>
                                    {x + 1}
                                  </option>
                                ))
                                // ^^^ I created an array out of countInStock,
                                // and then I map through that array creating options
                              }

                            </Form.Control>
                        </Col>

                        <Col md={1} className='mt-3'>
                              <Button 
                                type='button'
                                variant='light'
                                onClick={() => removeFromCartHandler(item.product)}>
                                  <i className='fas fa-trash'></i>
                              </Button>
                        </Col>

                    </Row>
                  
                </ListGroup.Item>
            
                
          ))}  
          </ListGroup>

        ) }

      </Col>

      <Col md={4}>
          <Card className='mt-0 p-3 border border-2 rounded-3 border border-light'>
              <ListGroup variant='flush'>
                  <ListGroup.Item>
                      <h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0 )}) items</h2>
                      ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0 ).toFixed(2)}
                  </ListGroup.Item>
          
                  <ListGroup.Item className='mt-3'>
                      <div className="d-grid gap-2">
                        <Button type='button' size='lg' 
                            disabled={cartItems.length === 0}
                            onClick={checkoutHandler}
                            >
                              <strong>Proceed To Checkout</strong>
                        </Button>
                      </div>
                  </ListGroup.Item>
              </ListGroup>

          </Card>
      </Col>
    </Row>
  )
}

export default CartScreen