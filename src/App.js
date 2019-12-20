import React, { useState } from 'react';
import {
  Switch,
  Route
 } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './styles/app.css';

function App(props) {
  let localStore = JSON.parse(localStorage.getItem('data'));
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

  const banks = ['Chase', 'Patelco'];
  const [isAuthorized_C, setIsAuthorized_C] = useState(() => {
    if (getCookie('session') === null || getCookie('session') === "") {
      return false;
    } else {
      let localAuth_C = localStore.isAuthorized_C;
      return localAuth_C;
    }
  });
  const [isAuthorized_P, setIsAuthorized_P] = useState(() => {
    if (getCookie('session') === null || getCookie('session') === "") {
      return false;
    } else {
      let localAuth_P = localStore.isAuthorized_P;
      return localAuth_P;
    }
  });
  const [chaseStatement, setChaseStatement] = useState(() => {
    if (getCookie('session') === null || getCookie('session') === "") {
      return [];
    } else {
      let localChaseStatement = localStore.chaseStatement;
      return localChaseStatement;
    }
  });
  const [patelcoStatement, setPatelcoStatement] = useState(() => {
    if (getCookie('session') === null || getCookie('session') === "") {
      return [];
    } else {
      let localPatelcoStatement = localStore.patelcoStatement;
      return localPatelcoStatement;
    }
  });
  const [chaseBalance, setChaseBalance] = useState(() => {
    if (getCookie('session') === null || getCookie('session') === "") {
      return "";
    } else {
      let localChaseBalance = localStore.chaseBalance;
      return localChaseBalance;
    }
  });
  const [patelcoBalance, setPatelcoBalance] = useState(() => {
    if (getCookie('session') === null || getCookie('session') === "") {
      return "";
    } else {
      let localPatelcoBalance = localStore.patelcoBalance;
      return localPatelcoBalance;
    }
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
