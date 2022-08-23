import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'


function SearchBox() {

    const [keyword, setKeyword] = useState('')
    const [placeholder, setPlaceholder] = useState('Search')

    const navigate = useNavigate()  // replaces history

    function resolveAfter2Seconds(x) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(x);
          }, 2000);
        });
    }
      
    async function f1() {
        // eslint-disable-next-line
        const x = await resolveAfter2Seconds(10);
        setPlaceholder('Search')
    }

    const submitHandler = (e) => {
        e.preventDefault() 
        if (keyword) {
            navigate(`/?keyword=${keyword}&page=1`)  // replaces history.push()
        } else {
            setPlaceholder('Type something :)')
            f1()
        }  
    }

    return (
        <Form onSubmit={submitHandler} className='d-flex ms-5'>
            <Form.Control
                type='text'
                name='q'
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={placeholder}
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