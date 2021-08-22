import MainPage from "./MainPage";
import { Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import Analytics from "./Analytics";

function App() {

 
  return (
    <BrowserRouter>
      <Switch>
        {/*<Route path = "/:employee" component = {MainPage} />*/}
        <Route exact path = "/analytics" component = {Analytics} />  
        <Route exact path = "/" component = {MainPage} />  
      </Switch>
    </BrowserRouter>


  );
}

export default App;
