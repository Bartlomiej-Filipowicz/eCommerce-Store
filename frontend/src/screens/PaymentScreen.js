import React, { useState, useEffect } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../actions/cartActions'


function PaymentScreen() {

    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    const dispatch = useDispatch()

    const [paymentMethod, setPaymentMethod] = useState('PayPal')

    const navigate = useNavigate()  // replaces history

    if(!shippingAddress.address) {
        navigate('/login/shipping')   // replaces history.push()
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder')   // replaces history.push()
    }


    return (
        <FormContainer>
            
            <CheckoutSteps step1 step2 step3 />

            <Form onSubmit={submitHandler} >

                <Form.Group>

                    <Form.Label as='legend'>Select Method</Form.Label>

                    <Col>
                        <Form.Check 
                            type='radio'
                            label='PayPal or Credit Card'
                            id='paypal'
                            name='paymentMethod'
                            checked
                            onChange={(e) => setPaymentMethod(e.target.value)}>
                        </Form.Check>
                    </Col>

                </Form.Group>

                <br/>

                <Button type='submit' variant='primary'>Continue</Button>

            </Form>

        </FormContainer>
    )
}

export default PaymentScreen