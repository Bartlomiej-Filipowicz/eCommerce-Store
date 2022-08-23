import React from 'react'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import { Link } from 'react-router-dom'

// 'my-3' 'p-3' - margin, padding
//product._id , product.image , product.name , product.rating it comes from the file src/products.js

function Product({ product }) {
  return (
    <Card className='my-3 p-3 border border-2 rounded-3 border border-light'>
        <Link to={`/product/${product._id}`}> { // there is no <a href='sth'>, there is <Link to={sth}> instead, becasue it is a SPA

        }
            <Card.Img src={product.image} />
        </Link>

        <Card.Body>
            <Link to={`/product/${product._id}`}>
                <Card.Title as="div">
                    <strong>{product.name}</strong>
                </Card.Title>
            </Link>

            <Card.Text as="div">
                <div className='my-3'>
                    
                    <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'} />
                </div>
            </Card.Text>

            <Card.Text as="h3">
                ${product.price}
            </Card.Text>

        </Card.Body>
    </Card>
  )
}

export default Product