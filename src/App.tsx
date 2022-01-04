import React from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom"
import Header from './Components/Header';
import Home from './Routes/Home';
import Search from './Routes/Search';
import Tv from './Routes/Tv';

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/gongflix/search">
          <Search />
        </Route>
        <Route path={["/gongflix/tv","/gongflix/tv/:tvId"]}>
          <Tv />
        </Route>
        <Route path={["/gongflix/movies","/gongflix/movies/:movieId"]} >
          <Home />
        </Route>
        <Route path="/gongflix">
          <Redirect to="/gongflix/movies"/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
