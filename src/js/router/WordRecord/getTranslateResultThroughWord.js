import $ from 'jquery'
const getTranslateResultThroughWord = function(word, e){
    e.preventDefault()
    if (!word) return ''
    word = word.trim()
    return $.ajax({
        method: 'GET',
        url: '/api/getTranslateResult',
        data: { word: word },
    }).catch(err => {
        console.error('err: ',err)
    })
}

export default getTranslateResultThroughWord