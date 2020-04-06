import React from 'react';
import { Link } from 'react-router-dom';

export default function Calculator({chaseBalance, patelcoBalance}) {
  const calcInputRef = React.createRef();
  let isFirstValSet = false;
  let firstVal = 0;
  let isOperandSet = false;
  let curOperand = '';
  let isSecondValSet = false;
  let secondVal;

  const updateDisplay = (e) => {
    e.target.value = parseFloat(e.target.value).toFixed(2);
    console.log(`First Value Set: ${isFirstValSet}\nOperand Set: ${isOperandSet}\nSecond Value Set: ${isSecondValSet}`)
  }

  return(
    <div>
      <Link to="/dashboard">
        <button>Close</button>
      </Link>

      {/* Display Window */}
      <div>
        <input className="calc-input-window" type="text" ref={calcInputRef} style={{direction: 'rtl'}} defaultValue="0" onChange={updateDisplay}></input>
      </div>

      {/* Calculator Buttons */}
      <div className="calc-btns-wrap">
        <div className="calc-btn-row-1">
          <button onClick={() => {
            if (!isFirstValSet) {
              firstVal = chaseBalance;
              isFirstValSet = !isFirstValSet;
              calcInputRef.current.value = firstVal;
              console.log(firstVal);
            } else if (isOperandSet && !isSecondValSet) {
              secondVal = chaseBalance;
              isSecondValSet = !isSecondValSet;
              calcInputRef.current.value = secondVal;
              console.log(secondVal);
            } else {
              return;
            }
            return;
          }}>CHS BAL</button>
          <button onClick={() => {
            if (!isFirstValSet) {
              firstVal = patelcoBalance;
              isFirstValSet = !isFirstValSet;
              calcInputRef.current.value = firstVal;
            } else if (isOperandSet && !isSecondValSet) {
              secondVal = patelcoBalance;
              isSecondValSet = !isSecondValSet;
              calcInputRef.current.value = secondVal;
            } else {
              return;
            }
            return;
          }}>PTL BAL</button>
        </div>
        <div className="calc-btn-row-2">
          <button onClick={() => {
            firstVal = 0;
            secondVal = 0;
            isFirstValSet = false;
            isSecondValSet = false;
            isOperandSet = false;
            calcInputRef.current.value = 0;
          }}>C</button>
          <button>DEL</button>
          <button onClick={() => {
          }}>÷</button>
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
          <button onClick={() => {
            calcInputRef.current.value = 1;
          }}>1</button>
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
