const input = document.getElementById('number-input')
const backInput = document.getElementById('history-input')

const numbers = document.querySelectorAll('.number')
const operators = document.querySelectorAll('.operator')
const actions = document.querySelectorAll('.action')

let total = 0
let ans
let currentOperator

const setValueFunc = e => {
    const value = e.target.value
    if (input.value.includes('.') && value === '.') return
    input.value += value
}

const setHistory = (number, operator = null) => {
    backInput.value = operator ? `${number} ${operator}` : number
    currentOperator = null
}

const setOperator = (e) => {
    if(!input.value) return
    if(!currentOperator)
    {
        currentOperator = e.target.value
        ans = parseInt(input.value)
        setHistory(ans, e.target.value)
        input.value = ''
        return
    }

    switch (e.target.value){
        case '+':
            ans += parseInt(input.value)
            setHistory(ans)
            break
    }
}

const setAction = (e) => {
    const action = e.target.value
    const value = input.value
    switch (action)
    {
        case 'cancel':
            input.value = '';
            break;
        case 'back':
            input.value = value.substring(0,value.length-1)
            break
    }
}

// Set click event a buttons
numbers.forEach( e => e.addEventListener('click', setValueFunc))
operators.forEach( e => e.addEventListener('click', setOperator))
actions.forEach(e => e.addEventListener('click', setAction))