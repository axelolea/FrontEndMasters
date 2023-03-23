let count = 3
const primeNumbers = [2]

while(true)
{
    let flag = true
    primeNumbers.forEach(e => {
        if (flag){
            flag = count % e !== 0
        }
    });
    if (flag)
    {
        primeNumbers.push(count)
    }
    if (primeNumbers.length === 5000) break
    count++
}

primeNumbers.forEach(e => console.log(e))