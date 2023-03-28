const validateWordUrl = 'https://words.dev-apis.com/validate-word'

const getActualRow = () => {
    return document.querySelector(
        `.row[data-number="${game.rowPosition}"]`
    )
}

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

    validateLetterWord(pos)
    {
        return this.word.at(pos) === this.#wordDay.at(pos)
    }
}

async function validateWord()
{
    game.loading = true

    const data = {
        method: 'POST',
        body: JSON.stringify({ word: game.word })
    }
    const resp = await fetch(validateWordUrl, data)
    const json = await resp.json()

    if (!json.validWord)
    {
        alert()
        game.loading = false
        return
    }

    const actualRow = getActualRow()

    if(game.validateWord())
    {
        game.winner = true
        actualRow.querySelectorAll('.cell')
            .forEach(el => {
                el.style.backgroundColor = 'var(--color-cell-3)'
            })
        game.loading = false
        return
    }

    for(let i = 0; i < 5; i++)
    {
        const cell = actualRow.querySelector(`.cell[data-position="${i}"]`)
        if(game.validateLetterWord(i))
        {
            cell.style.backgroundColor = 'var(--color-cell-3)'
        }
        else
        {
            cell.style.backgroundColor = 'var(--color-cell-2)'
        }
    }

    if(game.rowPosition >= 6)
    {
        game.losser = true
    }

    game.rowPosition++
    game.word = ''
    game.loading = false
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

window.addEventListener('keydown', (e) => {
    if(game.winner || game.losser || game.loading) return
    if(alphaRegex.test(e.key))
    {
        if(game.word.length < 5)
        {
            game.word += e.key
            renderWord()
        }
    }
    if(e.key === 'Backspace' && game.word.length > 0)
    {
        game.word = game.word.slice(0, game.word.length - 1)
        renderWord()
    }
    if(e.key === 'Enter' && game.word.length === 5)
    {
        validateWord()
    }
})
