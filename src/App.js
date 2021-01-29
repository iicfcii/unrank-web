import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Grommet } from 'grommet';
import { theme } from './theme';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home/Home';
import { Demo } from './pages/Demo/Demo';
import { About } from './pages/About/About';
import { Legal } from './pages/Legal/Legal';

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
