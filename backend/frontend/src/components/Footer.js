import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

function Footer() {
  return (
    <footer>
        <Container>
          <Row>
            <Col className='text-center py-3'>Made with <span role="img" aria-label="heart emoji">❤️</span> by Bartłomiej Filipowicz &copy; 2022</Col>
          </Row>
        </Container>
    </footer>
  )
}

export default Footer