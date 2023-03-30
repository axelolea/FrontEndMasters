const validateWordUrl = 'https://words.dev-apis.com/validate-word'
const arrows = document.querySelectorAll('.arrow')

const getActualRow = () => {
    return document.querySelector(
        `.row[data-number="${game.rowPosition}"]`
    )
}

// Create game table

const table = document.getElementById('table')
const createTable = () => {
    table.innerHTML = ''
    for (let i = 1; i <= 6; i++) {
        const rowTable = document.createElement('div')
        rowTable.classList.add('row')
        rowTable.setAttribute('data-number', `${i}`)
        for (let j = 0; j < 5; j++) {
            const columnTable = document.createElement('div')
            columnTable.classList.add('cell')
            columnTable.setAttribute('data-position', `${j}`)
            rowTable.append(columnTable)
        }
        table.append(rowTable)
    }
}

createTable()

class Game
{
    #wordDay
    rowPosition
    word
    winner
    loading
    constructor() {
        this.loading = false
        this.winner = false
        this.losser = false
        this.rowPosition = 1
        this.word = '';
        this.#setWordDay()
    }

    #setWordDay ()
    {
        fetch('https://words.dev-apis.com/word-of-the-day')
            .then( resp => resp.json())
            .then( json => {
                this.#wordDay = json.word
            })
    }

    validateWord()
    {
        return this.#wordDay === this.word
    }
    inWordValidate(i){
        const letter = this.word[i]
        if (this.#wordDay.includes(letter)){
            const sliceWord = this.word.slice(0,i+1)
            let countA = 0
            let countB = 0
            for(let i = 0; i < this.#wordDay.length; i++)
            {
                if(this.#wordDay.at(i) === letter)countA++
                if(sliceWord.at(i) === letter) countB++
            }
            if(countA === countB) return true
        }
        return false
    }
    validateLetterWord(pos)
    {
        return this.word.at(pos) === this.#wordDay.at(pos)
    }
}

function setPropertiesArrows()
{
    const boxElement = document.querySelector(`.row[data-number="${game.rowPosition}"] .cell`)
    const tablePos = document.getElementById('table').getBoundingClientRect().top
    const sizeBox = boxElement.clientHeight
    const topBox = boxElement.getBoundingClientRect().top
    arrows.forEach(el => {
        el.style.height = `${sizeBox}px`
        el.style.marginTop = `${topBox - tablePos}px`
    })
}


async function validateWord()
{
    const body = {
        method: 'POST',
        body: JSON.stringify({ word: game.word })
    }
    const resp = await fetch(validateWordUrl, body)
    const data = await resp.json()

    if (!data['validWord'])
    {
        alert()
        return
    }

    const actualRow = getActualRow()
    removeAnimationArrows()

    if(game.validateWord())
    {
        game.winner = true
        actualRow.querySelectorAll('.cell')
            .forEach(el => {
                el.style.backgroundColor = 'var(--color-cell-3)'
            })
        return
    }

    for(let i = 0; i < 5; i++)
    {
        const cell = actualRow.querySelector(`.cell[data-position="${i}"]`)
        if(game.validateLetterWord(i)) cell.style.backgroundColor = 'var(--color-cell-3)'
        else if(game.inWordValidate(i)) cell.style.backgroundColor = 'var(--color-cell-4)'
        else cell.style.backgroundColor = 'var(--color-cell-2)'
    }
    if(game.rowPosition >= 6)
    {
        game.losser = true
    }

    game.rowPosition++
    game.word = ''
}

function alert()
{
    const actualRow = getActualRow()
    const cells = actualRow.querySelectorAll('.cell')
    cells.forEach(el => {
        el.classList.add('alert')
        setTimeout(() => {
            el.classList.remove('alert')
        }, 100)
    })
}

function renderWord()
{
    const actualRow = getActualRow()
    for(let i = 0; i < 5; i++)
    {
        const cell = actualRow.querySelector(`.cell[data-position="${i}"]`)
        const letter = game.word.at(i)
        cell.innerText = letter ? letter.toUpperCase() : ''
    }
}


const alphaRegex = /^[a-zA-Z]$/

const game = new Game()
const loading = document.querySelector('.loading')
const removeAnimationArrows = () => arrows.forEach(el => el.classList.remove('enable'))
setPropertiesArrows()
window.addEventListener('keydown', (e) => {
    if(game.winner || game.losser || game.loading) return
    if(alphaRegex.test(e.key))
    {
        if(game.word.length < 5)
        {
            game.word += e.key
            renderWord()
            if(game.word.length === 5){
                arrows.forEach(el => el.classList.add('enable'))
            }
        }
    }
    if(e.key === 'Backspace' && game.word.length > 0)
    {
        game.word = game.word.slice(0, game.word.length - 1)
        removeAnimationArrows()
        renderWord()
    }
    if(e.key === 'Enter' && game.word.length === 5)
    {
        game.loading = true
        loading.classList.remove('hidden')
        validateWord()
            .then(
                () => {
                    game.loading = false
                    loading.classList.add('hidden')
                    setPropertiesArrows()
                }
            )
    }
})
