import $ from 'jquery'
const getTranslateResultThroughWord = function(word){
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