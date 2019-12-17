import React from 'react';
import { useParams } from "react-router-dom";

export default function Statements({chaseStatement, patelcoStatement}) {
  let { bank } = useParams();

  return (
    <div style={{position: 'absolute', top: 0, left: 'calc(100% - 1000px)', display: 'flex', flexDirection: 'column', width: 1000, minHeight: '100%', backgroundColor: 'red', zIndex: 999}}>
      <h2>{bank} Statement</h2>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        {
          bank === 'Chase' ?
          chaseStatement.map((statement, i) => {
            return (
              <div key={"c"+i}>
                <span>{statement.date}</span>
                <span>{statement.type}</span>
                <span>{statement.name}</span>
                <span>{'$' + statement.amt}</span>
              </div>
            )
          }) :
          patelcoStatement.map((statement, i) => {
            return (
              <div key={"p"+i}>
                <span>{statement.date}</span>
                <span>{statement.type}</span>
                <span>{statement.name}</span>
                <span>{'$' + statement.amt}</span>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}