import React from 'react';
import { useParams, Link } from "react-router-dom";
import '../styles/statements.css';

export default function Statements({chaseStatement, patelcoStatement}) {
  let { bank } = useParams();

  return (
    <div className="statement-wrapper">
      <div className="statement-container">
        <div className="statement-head">
          <Link to="/dashboard">
            <button className="back-btn">&#60;</button>
          </Link>
          <h2 className='statement-bank-heading'>{bank} Statement</h2>
        </div>
        <div className="sm-line-wrap">
          {
            bank === 'Chase' ?
            chaseStatement.map((statement, i) => {
              return (
                <div className="statement-line" key={"c"+i}>
                  <span className="sm-text sm-date">{statement.date}</span>
                  <span className="sm-text sm-name">{statement.name}</span>
                  <span className="sm-text sm-amt">{'$' + statement.amt}</span>
                </div>
              )
            }) :
            patelcoStatement.map((statement, i) => {
              return (
                <div className="statement-line" key={"p"+i}>
                  <span className="sm-text sm-date">{statement.date}</span>
                  <span className="sm-text sm-name">{statement.name}</span>
                  <span className="sm-text sm-amt">{'$' + statement.amt}</span>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}