import React from 'react';
import eventProxy from '../utils/event-proxy';

class ChooseStarts extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            'stars': this.initAllEmptyStar(),
            'type':'far',
            starIndex:-1
        }
    }

    initAllEmptyStar(){
        let stars = [];
        for(let i=0;i<5;i++){
            stars.push(<i className='far fa-star hover-pointer mr-1' id={i}></i>)
        }
        return stars
    }

    clickStarts(e){
        const {type, starIndex} = this.state
        let newStars = this.initAllEmptyStar(),
            index = Number(e.target.id)+1,
            changeType = type
        if(type==='far' && starIndex<index)changeType='fas'
        else if(type==='fas' && starIndex>=index) changeType = 'far'
        for(let i=0;i<index;i++){
            newStars[i] = <i className={`${changeType} fa-star hover-pointer mr-1`} id={i}></i>
        }
        this.setState({stars:newStars,type:changeType})
        eventProxy.trigger('starsNum', index)
    }

    render(){
        const {stars} = this.state
        return <div onClick={(e)=>this.clickStarts(e)}>
            {stars.map(value=>value)}
        </div>
    }
}

export default ChooseStarts