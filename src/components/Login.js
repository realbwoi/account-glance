import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/login.css';
import patelcoImg from '../util/patelco-img';
import chaseImg from '../util/chase-img';


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
    cancelToken: source.token,
    timeout: 1000*60*3
  }

  function onLoginSubmit(e) {
    e.preventDefault();
    setLoginErrorC(false);
    setLoginErrorP(false);
    let username = e.target[0].value;
    let password = e.target[1].value;
    let banking = e.target[0].attributes.bank.value;
    console.log(`Banking: ${banking}, User: ${username}, Pass: ${password}`)
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
      } else if ((statusCode !== 0 || res === 'Error: HTTP/1.1 400 Bad Request') && banking === 'Chase') {
        setLoadingC(false);
        setLoginErrorC(true);
        console.log(res.data);
      } else if ((statusCode !== 0 || res === 'Error: HTTP/1.1 400 Bad Request') && banking === 'Patelco') {
        setLoadingP(false);
        setLoginErrorP(true);
        console.log(res.data);
      }
    })
    .catch(err => {
      if (axios.isCancel(err)) {
        console.log('Cancelled: ' + err)
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

  useEffect(() => {
    return () => {
      setInterval(() => source.cancel(), 1000*60*3)
    }
  }, [source]);

  return (
    <div className="login-wrap">
      <h1 className="logo">&#9865; Account Glance</h1>

      <div className="logins">
        <div className="bank-login">
          {
            loadingC
            ? <span>Loading...</span>
            : ( props.isAuthorized_C
                ? isLoggedIn(chase)
                : <>
                    <h3 style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><img src={chaseImg} style={{display: 'inline-block', width: 64}} alt="Chase Logo"></img>{chase}</h3>
                    <form onSubmit={onLoginSubmit} className="bank-form">
                      <label htmlFor="username">
                        <input type="text" name="username" bank={chase} placeholder="Username"></input>
                      </label>
                      <label htmlFor="password">
                        <input type="password" name="password" placeholder="Password"></input>
                      </label>
                      <input className="login-submit-btn" type="submit" value="Submit" />
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
          ? <><span>Loading...</span><br /><span style={{fontSize: '12px', fontStyle: 'italic'}}>Patelco's response may take up to 3 minutes</span></>
          : ( props.isAuthorized_P
              ? isLoggedIn(patelco)
              : <>
                  <h3 style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <img
                      src={patelcoImg}
                      style={{width: 32, marginRight: 8}} alt="Patelco Logo"></img>
                  {patelco}</h3>
                  <form onSubmit={onLoginSubmit} className="bank-form">
                    <label htmlFor="username">
                      <input type="text" name="username" bank={patelco} placeholder="Username"></input>
                    </label>
                    <label htmlFor="password">
                      <input type="password" name="password" placeholder="Password"></input>
                    </label>
                    <input className="login-submit-btn" type="submit" value="Submit" />
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
          className="login-goto-dash-btn"
          onClick={handleAuthorizedLogin}
          disabled={props.isAuthorized_C || props.isAuthorized_P ? false : true}
        >
          See Balances
        </button>
      </Link>

      <div style={{margin: '0 auto', padding: '16px', backgroundColor: 'rgba(255, 0, 0, 0.5)', borderRadius: '4px'}}>
        <p style={{margin: '0 0 8px 0', textTransform: 'uppercase', textAlign: 'center'}}>Test Account</p>
        <p style={{margin: 0}}>Username: <b><i>test</i></b></p>
        <p style={{margin: 0}}>Password: <b><i>12345</i></b></p>
      </div>
    </div>
  )
}