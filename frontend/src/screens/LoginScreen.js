import React, { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { login } from '../actions/userActions'

function LoginScreen() {

    const [email, setEmail] = useState('') // useState allows me to track/change state in a function component
    // email - the current state.
    // setEmail - a function that updates the state
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()

    const [searchParams] = useSearchParams()
    const redirect = searchParams.get('redirect') ? searchParams.get('redirect') : '/' // replaces location.search
  //const redirect = location.search ? location.search.split('=')[1] : '/'

    const userLogin = useSelector(state => state.userLogin)
    const { error, loading, userInfo } = userLogin

    const navigate = useNavigate() // replaces history

    // things inside useEffect are done after each render of a component(including useState value refresh)
    useEffect(() => {
        if(userInfo) {
            navigate(redirect) // replaces history.push()
        }
    }, [userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email, password)) // login is an action
    }

    // By default, the browser will refresh the page when a Form submission event is triggered
    // that's why after logging in useEffect is run and we're being redirected to whatever
    // 'redirect' is pointing (in the begging it was redirecting to a homepage, because
    // 'redirect' was a slash)

    return (
        <FormContainer>
            <h1>Sign In</h1>

            {error && <Message variant='danger'>{error}</Message> }
            {loading && <Loader/> }

            <Form onSubmit={submitHandler}>
                <Form.Group controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Enter Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    >

                    </Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary'>Sign In</Button>

            </Form>

            <Row className='py-3'>
                <Col>
                    New Customer? <Link
                        to={redirect ? `/register?redirect=${redirect}` : '/register'}>
                        Register
                    </Link>
                </Col>
            </Row>

        </FormContainer>
    )
}

export default LoginScreen