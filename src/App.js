import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Grommet } from 'grommet';
import { theme } from './theme';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './Home/Home';
import { Analysis } from './Analysis/Analysis';
import { About } from './About/About';
import { Legal } from './Legal/Legal';

const App = () => {
  return (
    <Router>
      <Grommet theme={theme}>
        <Header/>
        <Switch>
          <Route path='/legal'>
            <Legal />
          </Route>
          <Route path='/about'>
            <About />
          </Route>
          <Route path='/analysis'>
            <Analysis />
          </Route>
          <Route path='/'>
            <Home />
          </Route>
        </Switch>
        <Footer/>
      </Grommet>
    </Router>
  );
}

export default App;
