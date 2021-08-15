import MainPage from "./MainPage";
import { Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";

function App() {

 
  return (
    <BrowserRouter>
      <Switch>
        <Route path = "/:employee" component = {MainPage} />  
      </Switch>
    </BrowserRouter>


  );
}

export default App;
