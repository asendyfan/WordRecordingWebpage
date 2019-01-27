import React from 'react';
import eventProxy from '../../utils/event-proxy';
import $ from 'jquery';

class TableFilter extends React.Component{

    state={
        classifications:[]
    }

    typeSelectChange(e){
        eventProxy.trigger('wordsTypeChange', e.target.value)
    }

    componentWillMount(){
        $.ajax({
            url:'/api/wordRecords/getClassification'            
        }).then(data=>{
            this.setState({classifications:data.split(',')})
        }).catch(err=>console.error(err))
    }

    render(){
        const {classifications} = this.state;
        return <div className='page-max-width container mb-2 mx-sm-0'>
            <div className='row'>
                <div className='col-12 col-sm-6 col-md-4 px-0'>
                    <div className='input-group my-2'>
                        <div className='input-group-prepend'>
                            <span className='input-group-text' id='words-type'>单词来源类型</span>
                        </div>
                        <select className='custom-select' id='words-type' onChange={(e)=>this.typeSelectChange(e)}>
                            <option selected value='所有'>所有</option>
                            {classifications.map(value=><option value={value}>{value}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    }
    
    componentWillUnmount(){
        eventProxy.off('wordsTypeChange')
    }
}

export default TableFilter;