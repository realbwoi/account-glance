import React, { useState, useEffect } from 'react';
import { Redirect, Link, Route } from 'react-router-dom';
import axios from 'axios';
import Statements from "./Statements";
import Calculator from "./Calculator";


export default function Dashboard(props) {
  const { banks } = props;
  const [ chase, patelco ] = banks;
  const [ logoutConfirmed, setLogoutConfirmed ] = useState(false);
  const [ logoutSuccessful, setLogoutSuccessful ] = useState(false);
  const [ redirect, setRedirect ] = useState(false);

  let source = axios.CancelToken.source();
  const config = {
    baseURL: 'http://localhost:8888',
    withCredentials: true,
    cancelToken: source.token
  }

  const handleLogout = () => {
    setLogoutConfirmed(!logoutConfirmed);
  }

  const redirectOnLogout = () => {
    return <Redirect to="/" />
  }

  const bubbleLogout = () => {
    props.handleLogoutStates(props.chaseStatement, props.patelcoStatement, props.chaseBalance, props.patelcoBalance, props.isAuthorized_C, props.isAuthorized_P);
    setRedirect(true);
    setLogoutSuccessful(false);
  }

  const sendLogout = () => {
    props.setIsAuthorized_C(false);
    props.setIsAuthorized_P(false);
    props.setChaseBalance("");
    props.setPatelcoBalance("");
    props.setChaseStatement([]);
    props.setPatelcoStatement([]);
  }

  const handleConfirmedLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    axios.post(
      '/logout',
      {cookie: document.cookie},
      config
    ).then(res => {
      setLogoutSuccessful(true);
      sendLogout();
      console.log(localStorage);
    }).catch(err => console.log(err));
  }

  useEffect(() => {
    return () => {
      setInterval(() => source.cancel(), 3000)
    }
  }, [source])

  return (
    redirect || (localStorage.length === 0 && !logoutSuccessful) ? redirectOnLogout() :
    <div style={{position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', minHeight: '100vh'}}>
      <div>
        {
          logoutConfirmed
          ? <div>
              {
                logoutSuccessful
                ? <div>
                    <span>You have successfully been logged out.</span>
                    <Link to="/">
                      <button onClick={bubbleLogout}>Ok</button>
                    </Link>
                  </div>
                : <div>
                    <p>Are you sure you want to logout?</p>
                    <button onClick={handleConfirmedLogout}>Yes</button>
                    <button onClick={handleLogout}>Cancel</button>
                  </div>
              }
            </div>
          : ''
        }
        <div className="header-bar">
          <button onClick={handleLogout}>Logout</button>
        </div>
        <h2 style={{textTransform: 'uppercase'}}>Balances</h2>
        {
          props.chaseBalance
          ? (
            <div>
              <h3>{ chase }</h3>
              <span>${props.chaseBalance}</span>
              <Link to={`/dashboard/statements/${chase}`}>See Recent Transactions</Link>
            </div>
          )
          : ''
        }
        {
          props.patelcoBalance
          ? (
            <div>
              <h3>{ patelco }</h3>
              <span>${props.patelcoBalance}</span>
              <Link to={`/dashboard/statements/${patelco}`}>See Recent Transactions</Link>
            </div>
          )
          : ''
        }
        <div className="sticky-calc-btn">
          <Link to="/dashboard/calculator">
            <button className="icon-calc-btn">Calculator</button>
          </Link>
        </div>
      </div>
      <Route exact path="/dashboard/calculator" children={<Calculator chaseBalance={props.chaseBalance} patelcoBalance={props.patelcoBalance} />} />
      <Route exact path="/dashboard/statements/:bank" children={<Statements chaseStatement={props.chaseStatement} patelcoStatement={props.patelcoStatement} />} />
    </div>

  );
}
