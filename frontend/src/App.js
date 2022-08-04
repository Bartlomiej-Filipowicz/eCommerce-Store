import React from 'react'
import { Container } from 'react-bootstrap'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'

import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/CartScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ProfileScreen from './screens/ProfileScreen'
import ShippingScreen from './screens/ShippingScreen'

// this is what is seen in a browser

// 'py-3' bootstrap documentation: p - for classes that set padding, y - for classes that set both *-top and *-bottom 

// <Route path='/' component={HomeScreen} />  HomeScreen component will be rendered here

function App() {
  return (
    <Router>
      <Header/>
      <main className='py-3'> 
        <Container>
          {// there was an update and <Route/> must be kept in <Routes>
           // in <Route/> it must be 'element', NOT 'component'
           // and it must be {<HomeScreen />} , NOT {HomeScreen}
          }
          <Routes>
            <Route path='/' element={<HomeScreen />} exact />
            <Route path='/login' element={<LoginScreen />} />
            <Route path='/register' element={<RegisterScreen />} />
            <Route path='/profile' element={<ProfileScreen />} />
            <Route path='/login/shipping' element={<ShippingScreen />} />  { // path can be problematic, be careful

            }
            <Route path='/product/:id' element={<ProductScreen />} />
            <Route path='/cart/:id' element={<CartScreen />} /> 
            <Route path='/cart/' element={<CartScreen />} /> 


          </Routes>
          
        </Container>
      </main>
      <br/><br/><br/>
      <Footer/>
    </Router>
  );
}

export default App;
