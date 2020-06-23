import React, { useState } from 'react';
import {BrowserRouter as Router,Route, Switch} from 'react-router-dom'
import RepoCard from './RepoCard'
import Main from './Main'
import '../styles/App.css';


function App() {

  let [repToOpen, setRepToOpen] = useState({})
  

 
  return (

    <div className="App">
      <Router>
        <Switch>
          <Route render={() => <Main openRep={setRepToOpen} />} exact path='/' />
          <Route exact render={() => <RepoCard repo={repToOpen} />} path='/repository/:repOwner/:name' />
        </Switch>
      </Router>
    </div>
    
  );
}

export default App;
