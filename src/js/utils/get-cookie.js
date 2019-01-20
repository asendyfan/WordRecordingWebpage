export 
     function getCookie(name) {
        if (!name) return document.cookie
        const cookies = document.cookie,
            leftSide = cookies.indexOf(name)
        if (leftSide === -1) return ''
        const deleteRightOthers = cookies.substring(leftSide),
            rightSide = deleteRightOthers.indexOf(';')
        if (rightSide === -1) return deleteRightOthers
        const value = deleteRightOthers.substring(0, rightSide)
        return value.split('=')[1];
    }
