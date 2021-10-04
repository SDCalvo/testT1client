import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import { BrowserRouter as Router, Switch, Route  } from 'react-router-dom';
import HulkNavbar from './Components/Navbar/HulkNavbar'
import HulkFooter from './Components/Footer/HulkFooter'
import Admin from './Components/Admin/Admin'
import HulkShop from './Components/Shop/HulkShop'
import HulkCart from './Components/Cart/HulkCart'
import {useState} from 'react'

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <div className="App">
      <Router>
        <HulkNavbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Switch>
          <Route exact path="/">
            <HulkShop isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          </Route>
          <Route path="/cart" >
            <HulkCart/>
          </Route>
          <Route path="/admin" isLoggedIn={isLoggedIn}>
            <Admin />
          </Route>
        </Switch>
        <HulkFooter />
      </Router>
    </div>
  );
}

export default App;
