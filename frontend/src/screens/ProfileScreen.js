import React, { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'
import { listMyOrders } from '../actions/orderActions'


function ProfileScreen() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('') // useState allows me to track/change state in a function component
    // email - the current state.
    // setEmail - a function that updates the state
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('') // checking if passwords match
    const [messageSuccess, setMessageSuccess] = useState('') // message for a successful update

    const dispatch = useDispatch()

    const userDetails = useSelector(state => state.userDetails)
    const { error, loading, user } = userDetails

    const userLogin = useSelector(state => state.userLogin) // I have to know which user is logged in
    const { userInfo } = userLogin

    const userUpdateProfile = useSelector(state => state.userUpdateProfile) // I have to know which user is logged in
    const { success } = userUpdateProfile

    const orderListMy = useSelector(state => state.orderListMy)
    const { loading: loadingOrders, error: errorOrders, orders } = orderListMy

    const navigate = useNavigate() // replaces history

    // things inside useEffect are done after each render of a component(including useState value refresh)
    useEffect(() => {
        if(!userInfo) {
            navigate('/login') // replaces history.push()
        }
        else {
            if(!user || !user.name || success || userInfo._id !== user._id) { // if there is no user data in redux store
                dispatch({ type: USER_UPDATE_PROFILE_RESET })
                dispatch(getUserDetails('profile'))
                // dispatch() sends the getUserDetails action to a reducer
                dispatch(listMyOrders())
            }
            else {
                setName(user.name)
                setEmail(user.email)
            }
        }
    }, [dispatch, userInfo, user, success])

    const submitHandler = (e) => {
        e.preventDefault()

        if (password != confirmPassword) {
            setMessageSuccess('')
            setMessage('Passwords do not match')
        }
        else {
            dispatch(updateUserProfile({
                'id': user._id,
                'name': name,
                'email': email,
                'password': password
            }))
            setMessage('')
            setMessageSuccess('Profile details updated')
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
            {messageSuccess && <Message variant='success'>{messageSuccess}</Message> }
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

            {loadingOrders ? (
                    <Loader />
                ) : errorOrders ? (
                    <Message variant='danger'>{errorOrders}</Message>
                ) : (
                        <Table striped responsive className='table-sm' variant='dark'>
                            <thead>
                                <tr>
                                    <th className="text-secondary">ID</th>
                                    <th className="text-secondary">Date</th>
                                    <th className="text-secondary">Total</th>
                                    <th className="text-secondary">Paid</th>
                                    <th className="text-secondary">Delivered</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.createdAt.substring(0, 10)}</td>
                                        <td>${order.totalPrice}</td>
                                        <td>{order.isPaid ? order.paidAt.substring(0, 10) : (
                                            <i className='fas fa-times' style={{ color: 'red' }}></i>
                                        )}</td>
                                        <td>
                                            <LinkContainer to={`/order/${order._id}`}>
                                                <Button className='px-3 btn-sm'>Details</Button>
                                            </LinkContainer>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                )}
        </Col>
    </Row>
    )
}

export default ProfileScreen