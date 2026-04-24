let runningTotal = 0;
let buffer = "0";
let previousOperator = null;
//Selecting display
const display = document.querySelector('.display');

function buttonClick(value){
    if(isNaN(value)){
        handleSymbol(value);
    } else{
        handleNumber(value);
    }
    display.innerText = buffer;
}

function handleSymbol(symbol){
    switch(symbol){
        case 'C':
            buffer = '0';
            runningTotal = 0;
            previousOperator = null;
            break;
        case '=':
            if(previousOperator === null){
                return;
            }
            if(!flushOperation(parseInt(buffer, 10))){
                return;
            }
            previousOperator = null;
            buffer = "" + runningTotal; //Keeps it as a string for the display
            runningTotal = 0;
            break;
        case '←':
            if(buffer.length === 1){
                buffer = '0';
            } else{
                buffer = buffer.substring(0, buffer.length - 1);
            }
            break;
        case '+':
        case '−':
        case '×':
        case '÷':
            handleMath(symbol);
            break;
    }
}

function handleMath(symbol){
    if(buffer === '0' || buffer === 'Error'){
        return;
    }

    const intBuffer = parseInt(buffer, 10);

    if(runningTotal === 0){
        runningTotal = intBuffer;
    } else{
        if(!flushOperation(intBuffer)){
            return;
        }
    }
    previousOperator = symbol;
    buffer = '0';
}

function flushOperation(intBuffer){
    if (previousOperator === '÷' && intBuffer === 0) {
        buffer = 'Error';
        runningTotal = 0;
        previousOperator = null;
        return false;
    }

    if(previousOperator === '+'){
        runningTotal += intBuffer;
    } else if(previousOperator === '−'){
        runningTotal -= intBuffer;
    } else if (previousOperator === '×'){
        runningTotal *= intBuffer;
    } else if(previousOperator === '÷'){
        runningTotal /= intBuffer;
    }

    return true;
}


function handleNumber(numberString){
    if(buffer === '0' || buffer === 'Error'){
        buffer = numberString;
    } else{
        buffer += numberString;
    }
}

function handleKeydown(event){
    const key = event.key;

    if(/^\d$/.test(key)){
        event.preventDefault();
        buttonClick(key);
        return;
    }

    const keyMap = {
        '+': '+',
        '-': '−',
        '*': '×',
        '/': '÷',
        '=': '=',
        'Enter': '=',
        'Backspace': '←',
        'Delete': 'C',
        'Escape': 'C',
        'c': 'C',
        'C': 'C'
    };

    if(!keyMap[key]){
        return;
    }

    event.preventDefault();
    buttonClick(keyMap[key]);
}

function init(){
    document.querySelector('.CalButtons').addEventListener('click', function(event){
        //Only going to be triggered if a button is clicked
        if (event.target.tagName === 'BUTTON'){
            buttonClick(event.target.innerText);
        }
    });

    document.addEventListener('keydown', handleKeydown);
}

init();