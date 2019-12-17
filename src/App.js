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
  const [isAuthorized_C, setIsAuthorized_C] = useState(() => {
    let localStore = JSON.parse(localStorage.getItem('data'));
    let localAuth_C = localStore.isAuthorized_C;
    return localAuth_C;
  });
  const [isAuthorized_P, setIsAuthorized_P] = useState(() => {
    let localStore = JSON.parse(localStorage.getItem('data'));
    let localAuth_P = localStore.isAuthorized_P;
    return localAuth_P;
  });
  const [chaseStatement, setChaseStatement] = useState(() => {
    let localStore = JSON.parse(localStorage.getItem('data'));
    let localChaseStatement = localStore.chaseStatement;
    return localChaseStatement;
  });
  const [patelcoStatement, setPatelcoStatement] = useState(() => {
    let localStore = JSON.parse(localStorage.getItem('data'));
    let localPatelcoStatement = localStore.patelcoStatement;
    return localPatelcoStatement;
  });
  const [chaseBalance, setChaseBalance] = useState(() => {
    let localStore = JSON.parse(localStorage.getItem('data'));
    let localChaseBalance = localStore.chaseBalance;
    return localChaseBalance;
  });
  const [patelcoBalance, setPatelcoBalance] = useState(() => {
    let localStore = JSON.parse(localStorage.getItem('data'));
    let localPatelcoBalance = localStore.patelcoBalance;
    return localPatelcoBalance;
  });

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
    const getCookie = (name) => {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    }
    if (getCookie('session') === null) {
      localStorage.setItem('data', JSON.stringify({
        isAuthorized_P: false,
        isAuthorized_C: false,
        chaseBalance: "",
        patelcoBalance: "",
        chaseStatement: [],
        patelcoStatement: []
      }));
    }
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
