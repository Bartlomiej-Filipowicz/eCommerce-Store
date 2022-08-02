import React, { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { getUserDetails } from '../actions/userActions'



function ProfileScreen() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('') // useState allows me to track/change state in a function component
    // email - the current state.
    // setEmail - a function that updates the state
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('') // checking if passwords match


    const dispatch = useDispatch()

    const userDetails = useSelector(state => state.userDetails)
    const { error, loading, user } = userDetails

    const userLogin = useSelector(state => state.userLogin) // I have to know which user is logged in
    const { userInfo } = userLogin

    const navigate = useNavigate() // replaces history

    // things inside useEffect are done after each render of a component(including useState value refresh)
    useEffect(() => {
        if(!userInfo) {
            navigate('/login') // replaces history.push()
        }
        else {
            if(!user || !user.name) { // if there is no user data in redux store
                dispatch(getUserDetails('profile'))
                // dispatch() sends the getUserDetails action to a reducer
            }
            else {
                setName(user.name)
                setEmail(user.email)
            }
        }
    }, [dispatch, userInfo, user])

    const submitHandler = (e) => {
        e.preventDefault()

        if (password != confirmPassword) {
            setMessage('Passwords do not match')
        }
        else {
            console.log('updating...')
        }
    }

    // By default, the browser will refresh the page when a Form submission event is triggered
    // that's why after logging in useEffect is run and we're being redirected to whatever
    // 'redirect' is pointing (in the begging it was redirecting to a homepage, because
    // 'redirect' was a slash)

    return (
    <Row>
        <Col md={3}>
            <h2>User Profile</h2>

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
                        type='password'
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    >

                    </Form.Control>
                </Form.Group>

                <br/>

                <Button type='submit' variant='primary'>Update</Button>

            </Form>

        </Col>

        <Col md={9}>
            <h2>My Orders</h2>
        </Col>
    </Row>
    )
}

export default ProfileScreen