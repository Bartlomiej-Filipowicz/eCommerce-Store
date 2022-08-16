import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'


function SearchBox() {

    const [keyword, setKeyword] = useState('')

    const navigate = useNavigate()  // replaces history

    const location = useLocation()  // replaces history.location

    const submitHandler = (e) => {
        e.preventDefault() 
        if (keyword) {
            navigate(`/?keyword=${keyword}`)  // replaces history.push()
        } else {
            navigate(navigate(location.pathname))
        }  
    }

    return (
        <Form onSubmit={submitHandler} className='d-flex ms-5'>
            <Form.Control
                type='text'
                name='q'
                onChange={(e) => setKeyword(e.target.value)}
                placeholder='Search'
                className="w-150"
            ></Form.Control>
        
            <Button
                type='submit'
                variant='secondary'
            >
                Search
            </Button>
        </Form>
    )
}

export default SearchBox