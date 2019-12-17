import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/login.css';



export default function Login(props) {
  const [ loadingC, setLoadingC ] = useState(false);
  const [ loadingP, setLoadingP ] = useState(false);
  const { banks } = props;
  const [ chase, patelco ] = banks;
  const [ loginErrorC, setLoginErrorC ] = useState(false);
  const [ loginErrorP, setLoginErrorP ] = useState(false);

  const source = axios.CancelToken.source();
  const config = {
    baseURL: 'http://localhost:8888',
    withCredentials: true,
    cancelToken: source.token
  }

  function onLoginSubmit(e) {
    e.preventDefault();
    setLoginErrorC(false);
    setLoginErrorP(false);
    let username = e.target[0].value;
    let password = e.target[1].value;
    let banking = e.target[0].attributes.bank.value;
    banking === 'Chase' ? setLoadingC(true) : setLoadingP(true);

    axios.post(`/login/${banking}`, {
      username,
      password,
      banking
    }, config).then(res => {
      console.log(res);
      const statusCode = parseInt(res.data.statusCode);

      if (statusCode === 0 && banking === 'Chase') {
        const balance = res.data.balance;
        const statement = [...res.data.formatted];
        props.setIsAuthorized_C(true);
        props.setChaseBalance(balance);
        props.setChaseStatement(statement);
        setLoadingC(false);
      } else if (statusCode === 0 && banking === 'Patelco') {
        const balance = res.data.balance;
        const statement = [...res.data.formatted];
        props.setIsAuthorized_P(true);
        props.setPatelcoBalance(balance);
        props.setPatelcoStatement(statement);
        setLoadingP(false);
      } else if (statusCode !== 0 && banking === 'Chase') {
        setLoadingC(false);
        setLoginErrorC(true);
        console.log(res.data);
      } else if (statusCode !== 0 && banking === 'Patelco') {
        setLoadingP(false);
        setLoginErrorP(true);
        console.log(res.data);
      }
    })
    .catch(err => {
      if (axios.isCancel(err)) {
        console.log()
      } else {
        throw err;
      }
    });
  }

  const isLoggedIn = (loggedInBank) => {
    return (
      <span className="logged-in-msg">You're logged into {loggedInBank}</span>
    );
  }

  const handleAuthorizedLogin = () => {
    localStorage.setItem('data', JSON.stringify({
      isAuthorized_P: props.isAuthorized_P,
      isAuthorized_C: props.isAuthorized_C,
      chaseBalance: props.chaseBalance,
      patelcoBalance: props.patelcoBalance,
      chaseStatement: props.chaseStatement,
      patelcoStatement: props.patelcoStatement
    }));
    props.handleBankInfo(props.chaseStatement, props.patelcoStatement, props.chaseBalance, props.patelcoBalance, props.isAuthorized_C, props.isAuthorized_P);
  }

  // useEffect(() => {
  //   if(localStorage.data === 'undefined' && !props.isAuthorized_P && !props.isAuthorized_C && (!loadingC || !loadingP)) {
  //     const setAllStates = () => {
  //       props.setIsAuthorized_C(props.isAuthorized_C)
  //       props.setIsAuthorized_P(props.isAuthorized_P)
  //       props.setChaseStatement(props.chaseStatement)
  //       props.setPatelcoStatement(props.patelcoStatement)
  //       props.setChaseBalance(props.chaseBalance)
  //       props.setPatelcoBalance(props.patelcoBalance)
  //     }
  //     setAllStates();
  //   }
  //   //  else if (localStorage.data !== 'undefined' && document.cookie !== "") {
  //   //   const local = JSON.parse(localStorage.getItem('data'));
  //   //   const setAllStates = () => {
  //   //     props.setIsAuthorized_C(local.isAuthorized_C)
  //   //     props.setIsAuthorized_P(local.isAuthorized_P)
  //   //     props.setChaseStatement(local.chaseStatement)
  //   //     props.setPatelcoStatement(local.patelcoStatement)
  //   //     props.setChaseBalance(local.chaseBalance)
  //   //     props.setPatelcoBalance(local.patelcoBalance)
  //   //   }
  //   //   setAllStates();
  //   // }
  // }, [props]);

  useEffect(() => {
    return () => {
      setInterval(() => source.cancel(), 3000)
    }
  }, [source]);

  return (
    <div className="login-wrap">
      <h1 className="logo">Account Glance</h1>

      <div className="logins">
        <div className="bank-login">
          {
            loadingC
            ? <span>Loading...</span>
            : ( props.isAuthorized_C
                ? isLoggedIn(chase)
                : <>
                    <h3>{chase}</h3>
                    <form onSubmit={onLoginSubmit} className="bank-form">
                      <label htmlFor="username">
                        <input type="text" name="username" bank={chase} placeholder="Username"></input>
                      </label>
                      <label htmlFor="password">
                        <input type="password" name="password" placeholder="Password"></input>
                      </label>
                      <input type="submit" value="Submit" />
                      {
                        loginErrorC
                        ? <div>
                            <span className="login-error-text">There was an issue logging into {chase}.</span><br></br>
                            <span className="login-error-text">Check credentials and try again.</span><br></br>
                            <span className="additional-error">*The {chase} server may be offline.</span>
                          </div>
                        : ''
                      }
                    </form>
                  </>
            )
          }
        </div>

        <div className="hr"></div>

        <div className="bank-login">
        {
          loadingP
          ? <span>Loading...</span>
          : ( props.isAuthorized_P
              ? isLoggedIn(patelco)
              : <>
                  <h3>{patelco}</h3>
                  <form onSubmit={onLoginSubmit} className="bank-form">
                    <label htmlFor="username">
                      <input type="text" name="username" bank={patelco} placeholder="Username"></input>
                    </label>
                    <label htmlFor="password">
                      <input type="password" name="password" placeholder="Password"></input>
                    </label>
                    <input type="submit" value="Submit" />
                    {
                      loginErrorP
                      ? <div>
                        <span className="login-error-text">There was an issue logging into {patelco}.</span><br></br>
                        <span className="login-error-text">Check credentials and try again.</span><br></br>
                        <span className="additional-error">*The {patelco} server may be offline.</span>
                      </div>
                      : ''
                    }
                  </form>
                </>
            )
          }
        </div>
      </div>

      <Link className="login-btn" to="/dashboard">
        <button
          onClick={handleAuthorizedLogin}
          disabled={props.isAuthorized_C || props.isAuthorized_P ? false : true}
        >
          See Balances
        </button>
      </Link>
    </div>
  )
}