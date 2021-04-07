import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Grommet } from 'grommet';
import { theme } from './theme';

import { Header } from './Header';
import { Footer } from './Footer';
import { Home } from './Home/Home';
import { Visualize } from './Visualize/Visualize';
import { Demo } from './Demo/Demo';
import { Viewer } from './Viewer/Viewer';
import { About } from './About/About';
import { Legal } from './Legal/Legal';

const AV = require('leancloud-storage');
AV.init({
  appId: 'vNMcfOQkbIrK2mv1HCODUDie-MdYXbMMI',
  appKey: 'UDpxy5slHSvQQUzenUabBURS',
});

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
          <Route path='/visualize'>
            <Visualize/>
          </Route>
          <Route path={['/viewer/:id','/v/:id','/viewer','/v']}>
            <Viewer/>
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
