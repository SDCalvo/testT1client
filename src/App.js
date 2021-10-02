import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import { BrowserRouter as Router, Switch, Route  } from 'react-router-dom';
import HulkNavbar from './Components/Navbar/HulkNavbar'
import HulkFooter from './Components/Footer/HulkFooter'
import Admin from './Components/Admin/Admin'
function App() {

  return (
    <div className="App">
      <Router>
        <HulkNavbar />
        <Switch>
          <Route exact path="/" />
          <Route path="/cart" />
          <Route path="/admin" component={Admin} />
        </Switch>
        <HulkFooter />
      </Router>
    </div>
  );
}

export default App;
