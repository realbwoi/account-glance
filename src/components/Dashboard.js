import React, { useState, useEffect } from 'react';
import { Redirect, Link, Route } from 'react-router-dom';
import axios from 'axios';
import Statements from "./Statements";
import Calculator from "./Calculator";
import "../styles/dashboard.css";


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
    <div className="dashboard-wrapper">
      <div className="header-bar">
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      <div className="balances-info-wrap">
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
        <h2 className="balances-header-text">Balances</h2>
        {
          props.chaseBalance
          ? (
            <div className="bank-balances-info-wrap">
              <h3 className="bank-name">{ chase }</h3>
              <span className="actual-balance-text">${props.chaseBalance}</span>
              <Link className="statements-link" to={`/dashboard/statements/${chase}`}>See Recent Transactions</Link>
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
        <div className="sticky-calc-btn-container">
          <Link to="/dashboard/calculator">
            <button className="icon-calc-btn">
              <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="calculator" className="svg-inline--fa fa-calculator fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M400 0H48C22.4 0 0 22.4 0 48v416c0 25.6 22.4 48 48 48h352c25.6 0 48-22.4 48-48V48c0-25.6-22.4-48-48-48zM128 435.2c0 6.4-6.4 12.8-12.8 12.8H76.8c-6.4 0-12.8-6.4-12.8-12.8v-38.4c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4zm0-128c0 6.4-6.4 12.8-12.8 12.8H76.8c-6.4 0-12.8-6.4-12.8-12.8v-38.4c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4zm128 128c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4zm0-128c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4zm128 128c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8V268.8c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v166.4zm0-256c0 6.4-6.4 12.8-12.8 12.8H76.8c-6.4 0-12.8-6.4-12.8-12.8V76.8C64 70.4 70.4 64 76.8 64h294.4c6.4 0 12.8 6.4 12.8 12.8v102.4z"></path></svg>
            </button>
          </Link>
        </div>
      </div>
      <Route exact path="/dashboard/calculator" children={<Calculator chaseBalance={props.chaseBalance} patelcoBalance={props.patelcoBalance} />} />
      <Route exact path="/dashboard/statements/:bank" children={<Statements chaseStatement={props.chaseStatement} patelcoStatement={props.patelcoStatement} />} />
    </div>

  );
}
