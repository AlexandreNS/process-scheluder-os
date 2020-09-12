function generateName(id){
    let arrCharAt = []
    let div = id
    do {
        arrCharAt.push(div % 26)
        div = Math.floor(div/26)
    } while(div != 0)
    let name = arrCharAt.map((val) => String.fromCharCode(65+val)).reverse().join("")
    return name
}
function randomNumber(min, max){
    return Math.floor(Math.random()*(max-min+1)+min)
}
module.exports = {generateName, randomNumber}
