import React, { useState, useEffect } from 'react';
import {
  Switch,
  Route
 } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './styles/app.css';

function App(props) {
  const banks = ['Chase', 'Patelco'];
  const [isAuthorized_C, setIsAuthorized_C] = useState(false);
  const [isAuthorized_P, setIsAuthorized_P] = useState(false);
  const [chaseStatement, setChaseStatement] = useState([]);
  const [patelcoStatement, setPatelcoStatement] = useState([]);
  const [chaseBalance, setChaseBalance] = useState("");
  const [patelcoBalance, setPatelcoBalance] = useState("");

  const handleBankInfo = (statementC, statementP, balanceC, balanceP,  authC, authP) => {
    if (statementC) setChaseStatement([...statementC]);
    if (statementP) setPatelcoStatement([...statementP]);
    setChaseBalance(balanceC);
    setPatelcoBalance(balanceP);
    setIsAuthorized_C(authC);
    setIsAuthorized_P(authP);
  }

  const handleLogoutStates = (statementC, statementP, balanceC, balanceP, authC, authP) => {
    setIsAuthorized_C(authC);
    setIsAuthorized_P(authP);
    setChaseStatement(statementC);
    setPatelcoStatement(statementP);
    setChaseBalance(balanceC);
    setPatelcoBalance(balanceP);
  }

  useEffect(() => {
    let sessions = document.cookie.split('=');
    let tempSess = sessions[1].split(' ');
    sessions.splice(1, 1, tempSess[0], tempSess[1]);
    // if (document.cookie && sessions[1] !== ";") {
      
    // }
    console.log(sessions[1]);
    return () => {
    };
  }, [])

  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <Login
            banks={banks}
            isAuthorized_C={isAuthorized_C}
            setIsAuthorized_C={setIsAuthorized_C}
            isAuthorized_P={isAuthorized_P}
            setIsAuthorized_P={setIsAuthorized_P}
            chaseStatement={chaseStatement}
            setChaseStatement={setChaseStatement}
            patelcoStatement={patelcoStatement}
            setPatelcoStatement={setPatelcoStatement}
            chaseBalance={chaseBalance}
            setChaseBalance={setChaseBalance}
            patelcoBalance={patelcoBalance}
            setPatelcoBalance={setPatelcoBalance}
            handleBankInfo={handleBankInfo}
          />
        </Route>
        <Route path="/dashboard">
          <Dashboard
            bankInfo={props}
            isAuthorized_C={isAuthorized_C}
            setIsAuthorized_C={setIsAuthorized_C}
            isAuthorized_P={isAuthorized_P}
            setIsAuthorized_P={setIsAuthorized_P}
            chaseStatement={chaseStatement}
            setChaseStatement={setChaseStatement}
            patelcoStatement={patelcoStatement}
            setPatelcoStatement={setPatelcoStatement}
            chaseBalance={chaseBalance}
            setChaseBalance={setChaseBalance}
            patelcoBalance={patelcoBalance}
            setPatelcoBalance={setPatelcoBalance}
            handleBankInfo={handleBankInfo}
            banks={banks}
            handleLogoutStates={handleLogoutStates}
          />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
