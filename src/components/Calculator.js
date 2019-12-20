import React from 'react';
import { Link } from 'react-router-dom';

export default function Calculator({chaseBalance, patelcoBalance}) {
  const calcInputRef = React.createRef();
  let firstVal = 0;
  let secondVal = 0;

  const updateDisplay = (e) => {
    e.target.value = parseFloat(e.target.value).toFixed(2);
  }

  return(
    <div>
      <Link to="/dashboard">
        <button>Close</button>
      </Link>
      <div>
        <input className="calc-input-window" type="text" ref={calcInputRef} style={{direction: 'rtl'}} defaultValue="0" onChange={updateDisplay}></input>
      </div>
      <div className="calc-btns-wrap">
        <div className="calc-btn-row-1">
          <button onClick={() => {
              if (chaseBalance === '') {
                return;
              }

              if (calcInputRef.current.value === "0" || calcInputRef.current.value === '') {
                calcInputRef.current.value = chaseBalance;
              }
          }}>CHS BAL</button>
          <button onClick={() => {
              if (patelcoBalance === '') {
                return;
              }

              if (calcInputRef.current.value === "0") {
                calcInputRef.current.value = patelcoBalance;
              } else {
                calcInputRef.current.value = patelcoBalance;
              }
          }}>PTL BAL</button>
        </div>
        <div className="calc-btn-row-2">
          <button>C</button>
          <button>DEL</button>
          <button>÷</button>
        </div>
        <div className="calc-btn-row-3">
          <button>7</button>
          <button>8</button>
          <button>9</button>
          <button>X</button>
        </div>
        <div className="calc-btn-row-4">
          <button>4</button>
          <button>5</button>
          <button>6</button>
          <button>-</button>
        </div>
        <div className="calc-btn-row-5">
          <button>1</button>
          <button>2</button>
          <button>3</button>
          <button>+</button>
        </div>
        <div className="calc-btn-row-6">
          <button>0</button>
          <button>.</button>
          <button>=</button>
        </div>
      </div>
    </div>
  )
}
