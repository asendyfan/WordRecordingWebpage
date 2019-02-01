import React from 'react';
import eventProxy from '../../utils/event-proxy';
import $ from 'jquery';
import { Select } from 'antd';

class TableFilter extends React.Component{

    state={
        classifications:[]
    }

    typeSelectChange(value){
        eventProxy.trigger('wordsTypeChange', value)
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
        // <div className='page-max-width container mb-1 mt-5 mx-sm-0'>
        //     <div className='row'>
        //         <div className='col-12 col-sm-6 col-md-4 px-0'>
        //             {/* <div className='input-group my-2'>
        //                 <div className='input-group-prepend'>
        //                     <span className='input-group-text' id='words-type'>单词来源类型</span>
        //                 </div>
        //                 <select className='custom-select' id='words-type' onChange={(e)=>this.typeSelectChange(e)}>
        //                     <option selected value='所有'>所有</option>
        //                     {classifications.map(value=><option value={value}>{value}</option>)}
        //                 </select>
        //             </div> */}
        //             <div>
        return <div {...this.props}>
            <Select defaultValue='所有单词' onChange={(value)=>this.typeSelectChange(value)}>
                <Select.Option value='所有单词'>所有</Select.Option>
                {classifications.map(value=><Select.Option value={value} key={value}>{value}</Select.Option>)}
            </Select>
        </div>
    }
    
    componentWillUnmount(){
        eventProxy.off('wordsTypeChange')
    }
}

export default TableFilter;