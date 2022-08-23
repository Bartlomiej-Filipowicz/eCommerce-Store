import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'// react router dom is a react library that enables loading components on a website(SPA), instead of redirecting to a new page 
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Button, Card, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useParams } from 'react-router-dom'
import { listProductDetails, createProductReview } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'


function ProductScreen() {
  const { id } = useParams();
  //const product = products.find((p) => p._id == (id))

  // state of a component -> the data being used in that component at that point in time
  // that state can be an array of values, booleans, strings, objects or any other data that the component uses
  // if you want to have a value which changes many times you can useState
  // const [ value, setValue] = useState(start_value) ;; setValue is a function used to change value
  // useState is a hook
  //const [product, setProduct] = useState([])
/*
  // things inside useEffect are done after each render of a component(including useState value refresh)
  useEffect(() => {

    async function fetchProduct(){
      const {data} = await axios.get(`/api/products/${id}`) // API call (GET method)
      setProduct(data)
    }

    // django cors headers are neccessary so that the backend allows my frontend to do an API call, 
    //i.e. in django I set up specific urls from which API calls are accepted
    fetchProduct()
    
  }, [])
*/
  const [qty, setQty] = useState(1) // useState allows me to track/change state in a function component
  // qty - the current state.
  // setQTy - a function that updates the state
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const dispatch = useDispatch()

  const productDetails = useSelector(state => state.productDetails) // productDetails is a state
  const { loading, error, product } = productDetails 

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin

  const productReviewCreate = useSelector(state => state.productReviewCreate)
    const {
        loading: loadingProductReview,
        error: errorProductReview,
        success: successProductReview,
    } = productReviewCreate

  // things inside useEffect are done after each render of a component(including useState value refresh)
  useEffect(() => {

    if (successProductReview) {
      setRating(0)
      setComment('')
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
    }

    dispatch(listProductDetails(id)) // listProductDetails is an action
    // dispatch() sends/dispatches the action listProductDetails to a reducer

  }, [dispatch, successProductReview])

  const navigate = useNavigate() // replaces history

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`) // replaces history.push()
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(createProductReview(
        id, {
        rating,
        comment
    }
    ))
}

  return (
    <div>
      <Link to='/' className='btn btn-light my-3'>Go back</Link>

      {loading ?
        <Loader />
        : error 
          ? <Message variant='danger'>{error}</Message>
          :(
            <div>
              <Row>
                <Col md={6}>
                  <Image src={product.image} alt={product.name} fluid/>
                </Col>

                <Col md={3}>
                  <ListGroup variant='flush'>
                    <ListGroup.Item>
                      <h3>{product.name}</h3>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'} />
                    </ListGroup.Item>

                    <ListGroup.Item>
                      Price:  ${product.price}
                    </ListGroup.Item>

                    <ListGroup.Item>
                      Description: {product.description}
                    </ListGroup.Item>
                  </ListGroup>
                </Col>

                <Col md={3}>
                  <Card className='mt-0 p-3 border border-2 rounded-3 border border-light'>
                    <ListGroup variant='flush'>
                      <ListGroup.Item>
                        <Row>
                          <Col><strong className="text-secondary">Price </strong></Col>
                          <Col>
                            <strong>${product.price}</strong>
                          </Col>
                        </Row>

                      </ListGroup.Item>

                      <ListGroup.Item>
                        <Row>
                          <Col><strong className="text-light">Status </strong></Col>
                          <Col>
                            {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                          </Col>
                        </Row>

                      </ListGroup.Item>

                      {product.countInStock > 0 && (
                        <ListGroup.Item>
                          <Row>
                            <Col><strong className="text-light">Qty </strong></Col>
                            <Col xs='auto' className='my-1'>
                              <Form.Control 
                              as="select"
                              value={qty}
                              onChange={(e) => setQty(e.target.value)}> 
                              {// e stands for event
                              }

                              {
                                [...Array(product.countInStock).keys()].map((x) =>(
                                  <option key={x + 1} value={x + 1}>
                                    {x + 1}
                                  </option>
                                ))
                                // ^^^ I created an array out of countInStock,
                                // and then I map through that array creating options
                              }

                              </Form.Control>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      )}
                  
                      <ListGroup.Item className='mt-3'>
                        <Row>
                          <Button
                          onClick={addToCartHandler}
                          className='btn-block' disabled={product.countInStock === 0}
                          size='lg'
                          type='button'><strong>Add to cart</strong></Button>
                        </Row>
                      </ListGroup.Item>

                    </ListGroup>
                  </Card>
                </Col>
              </Row>

              <Row className='mt-5'>
                  <Col md={6}>
                    <br/>
                      <h4>Reviews</h4>
                      {product.reviews.length === 0 && <Message variant='info'>No Reviews</Message>}

                      <ListGroup variant='flush'>
                          {product.reviews.map((review) => (
                              <ListGroup.Item key={review._id} className='mb-3'>
                                  <strong>{review.name}</strong>
                                  <Rating value={review.rating} color='#f8e825' />
                                  <p><strong className="text-secondary">{review.createdAt.substring(0, 10)}</strong></p>
                                  <p>{review.comment}</p>
                              </ListGroup.Item>
                          ))}

                          <ListGroup.Item>
                              <h5 className="text-light">Write a review</h5>

                              {loadingProductReview && <Loader />}
                              {successProductReview && <Message variant='success'>Review Submitted</Message>}
                              {errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}

                              {userInfo ? (
                                  <Form onSubmit={submitHandler}>
                                      <Form.Group controlId='rating'>
                                          <Form.Label>Rating</Form.Label>
                                          <Form.Control
                                              as='select'
                                              value={rating}
                                              onChange={(e) => setRating(e.target.value)}
                                          >
                                              <option value=''>Select...</option>
                                              <option value='1'>1 - Poor</option>
                                              <option value='2'>2 - Fair</option>
                                              <option value='3'>3 - Good</option>
                                              <option value='4'>4 - Very Good</option>
                                              <option value='5'>5 - Excellent</option>
                                          </Form.Control>
                                      </Form.Group>

                                      <Form.Group controlId='comment'>
                                          <Form.Label>Review</Form.Label>
                                          <Form.Control
                                              as='textarea'
                                              row='5'
                                              value={comment}
                                              onChange={(e) => setComment(e.target.value)}
                                          ></Form.Control>
                                      </Form.Group>

                                      <Button
                                          disabled={loadingProductReview}
                                          type='submit'
                                          variant='primary'
                                          className='my-3'
                                      >
                                          Submit
                                      </Button>

                                  </Form>
                              ) : (
                                      <Message variant='info'>Please <Link to='/login'>login</Link> to write a review</Message>
                                  )}
                          </ListGroup.Item>
                      </ListGroup>
                  </Col>
              </Row>

            </div>
          )

      }
      
      
    </div>
  )
}

export default ProductScreen