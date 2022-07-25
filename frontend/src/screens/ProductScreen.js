import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'// react router dom is a react library that enables loading components on a website(SPA), instead of redirecting to a new page 
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Button, Card } from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useParams } from 'react-router-dom'
import { listProductDetails } from '../actions/productActions'


//<span style="color:#44d9e8;">Price:</span>

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

  const dispatch = useDispatch()

  const productDetails = useSelector(state => state.productDetails)

  const { loading, error, product } = productDetails 

  // things inside useEffect are done after each render of a component(including useState value refresh)
  useEffect(() => {

    dispatch(listProductDetails(id)) // listProductDetails is an action
    // dispatch() sends/dispatches the action listProductDetails to a reducer

  }, [])

  return (
    <div>
      <Link to='/' className='btn btn-light my-3'>Go back</Link>


      
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
              Price: {product.price} PLN
            </ListGroup.Item>

            <ListGroup.Item>
              Description: {product.description}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={3}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>{product.price} PLN</strong>
                  </Col>
                </Row>

              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                  </Col>
                </Row>

              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Button className='btn-block' disabled={product.countInStock == 0} type='button'>Add to cart</Button>
                </Row>
              </ListGroup.Item>

            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ProductScreen