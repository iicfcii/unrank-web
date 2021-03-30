import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Grommet } from 'grommet';
import { theme } from './theme';

import { Header } from './Header';
import { Footer } from './Footer';
import { Home } from './Home/Home';
import { Visual } from './Visual/Visual';
import { Demo } from './Demo/Demo';
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
          <Route path='/demo'>
            <Demo />
          </Route>
          <Route path='/visual'>
            <Visual/>
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
