import React from 'react';
import eventProxy from '../../utils/event-proxy';

class TableFilter extends React.Component{

    typeSelectChange(e){
        eventProxy.trigger('wordsTypeChange', e.target.value)
    }

    componentWillUnmount(){
        eventProxy.off('wordsTypeChange')
    }

    render(){
        return <div className='page-max-width container mb-2 mx-sm-0'>
            <div className='row'>
                <div className='col-12 col-sm-6 col-md-4 px-0'>
                    <div className='input-group my-2'>
                        <div className='input-group-prepend'>
                            <span className='input-group-text' id='words-type'>单词来源类型</span>
                        </div>
                        <select className='custom-select' id='words-type' onChange={(e)=>this.typeSelectChange(e)}>
                            <option selected value='all'>所有</option>
                            <option value='normal'>生活中的</option>
                            <option value='computer'>计算机</option>
                            <option value='material'>材料</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default TableFilter;