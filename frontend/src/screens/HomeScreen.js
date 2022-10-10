import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Product from "../components/Product";
import { listProducts } from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";

function HomeScreen() {
  // state of a component -> the data being used in that component at that point in time
  // that state can be an array of values, booleans, strings, objects or any other data that the component uses
  // if you want to have a value which changes many times you can useState
  // const [ value, setValue] = useState(start_value) ;; setValue is a function used to change value
  // useState is a hook
  // const [products, setProducts] = useState([]) <- previous version before redux

  /* ------previous version before redux----------------
  // things inside useEffect are done after each render of a component(including useState value refresh)
  useEffect(() => {
    async function fetchProducts(){
      const {data} = await axios.get('/api/products/') // API call (GET method)
      setProducts(data)
    }

    // django cors headers are neccessary so that the backend allows my frontend to do an API call, 
    //i.e. in django I set up specific urls from which API calls are accepted
    fetchProducts()
    
  }, [])
  ^^^^^^^^^^^^^^^^^^previous version before redux^^^^^^^^^^^^^^^^^^^    */

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList); // state.productList is from store.js (reducer)
  const { error, loading, products, page, pages } = productList;

  const location = useLocation(); // replaces history.location
  let keyword = location.search;

  useEffect(() => {
    dispatch(listProducts(keyword));
  }, [dispatch, keyword]);

  return (
    <div>
      {!keyword && <ProductCarousel />}

      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <Row>
            {products.map((product) => (
              <Col key={product.id} sm={12} md={6} lg={4} xl={3}>
                {" "}
                {
                  // <- making it responsive
                }
                <Product product={product} />
              </Col>
            ))}
          </Row>

          <Paginate page={page} pages={pages} keyword={keyword} />
        </div>
      )}
    </div>
  );
}

export default HomeScreen;
