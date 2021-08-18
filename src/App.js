import MainPage from "./MainPage";
import { Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import Analytics from "./Analytics";

function App() {

 
  return (
    <BrowserRouter>
      <Switch>
        {/*<Route path = "/:employee" component = {MainPage} />*/}
        <Route path = "/analytics" component = {Analytics} />  
        <Route path = "/" component = {MainPage} />  
      </Switch>
    </BrowserRouter>


  );
}

export default App;
