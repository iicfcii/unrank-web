import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Grommet } from 'grommet';
import { theme } from './theme';

import { Header } from './Header';
import { Footer } from './Footer';
import { Home } from './Home/Home';
import { Demo } from './Demo/Demo';
import { About } from './About/About';
import { Legal } from './Legal/Legal';
import { MouseUpContext, useMouseUp } from './utils';

const App = () => {
  const mouseUp = useMouseUp();

  return (
    <MouseUpContext.Provider value={mouseUp}>
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
    </MouseUpContext.Provider>
  );
}

export default App;
