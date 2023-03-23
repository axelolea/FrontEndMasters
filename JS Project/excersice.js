const character = 'a'
const timesToRepeat = 10

// Iterative Solution
let newString = ''
for (let i = 0; i < timesToRepeat; i++) newString += character

console.log(newString)

// Declarative Solution
newString = character.repeat(timesToRepeat)

console.log(newString)