import React, { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { register } from '../actions/userActions'


function RegisterScreen() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('') // useState allows me to track/change state in a function component
    // email - the current state.
    // setEmail - a function that updates the state
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('') // checking if passwords match


    const dispatch = useDispatch()

    const [searchParams] = useSearchParams()
    const redirect = searchParams.get('redirect') ? searchParams.get('redirect') : '/' // replaces location.search
  //const redirect = location.search ? location.search.split('=')[1] : '/'

    const userRegister = useSelector(state => state.userRegister)
    const { error, loading, userInfo } = userRegister

    const navigate = useNavigate() // replaces history

    // things inside useEffect are done after each render of a component(including useState value refresh)
    useEffect(() => {
        if(userInfo) {
            navigate(redirect) // replaces history.push()
        }
    }, [userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()

        if (password != confirmPassword) {
            setMessage('Passwords do not match')
        }
        else {
            dispatch(register(name,email, password)) // register is an action
        }
    }

    // By default, the browser will refresh the page when a Form submission event is triggered
    // that's why after logging in useEffect is run and we're being redirected to whatever
    // 'redirect' is pointing (in the begging it was redirecting to a homepage, because
    // 'redirect' was a slash)


    return (
        <FormContainer>

            <h1>Sign In</h1>

            {message && <Message variant='danger'>{message}</Message> }
            {error && <Message variant='danger'>{error}</Message> }
            {loading && <Loader/> }

            <Form onSubmit={submitHandler}>

                <Form.Group controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        required
                        type='name'
                        placeholder='Enter Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        required
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
                        required
                        type='password'
                        placeholder='Enter Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='passwordConfirm'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        required
                        type='password'
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    >

                    </Form.Control>
                </Form.Group>

                <br/>

                <Button type='submit' variant='primary'>Register</Button>

            </Form>

            <Row className='py-3'>
                <Col>
                    Have an Account? <Link
                        to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                        Sign In
                    </Link>
                </Col>
            </Row>

        </FormContainer>
    )
}

export default RegisterScreen