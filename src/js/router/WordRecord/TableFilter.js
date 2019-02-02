import React from 'react';
import eventProxy from '../../utils/event-proxy';
import $ from 'jquery';
import { Select, Modal, Icon } from 'antd';
// import ShowClassificationsModal from './ShowClassificationsModal';
import ShowClassificationsModal from './ShowClassificationsModal';

class TableFilter extends React.Component{

    state={
        classifications:[],
        editClassificatiModal:false
    }

    typeSelectChange=(value)=>{
        if(value==='编辑'){
            console.log('编辑')
            this.classificationsModal.setModalVisable(true)
        }
        else eventProxy.trigger('wordsTypeChange', value)
    }

    editClassificationModal=()=>{
        Modal.info({
            title:'编辑分类标签',
            centered:true,
            content:(
                <div></div>
            )
        })
    }

    setClassificationOk=async ()=>{
        let data = await $.ajax({
            method:'GET',
            url:'/api/wordRecords/getClassification',
        }).catch(err=>{console.error('get classification error',err);alert('没有权限')})
        console.log(data)
        this.setState({classifications:data?data.split(','):[]})
    }

    componentWillMount(){
        $.ajax({
            url:'/api/wordRecords/getClassification'            
        }).then(data=>{
            this.setState({classifications:data.split(',')})
        }).catch(err=>console.error(err))
    }

    render(){
        const {classifications, editClassificatiModal} = this.state;
        const {wordClassifications} = this.props
        console.log(this.props)
        console.log(wordClassifications)
        return <div {...this.props}>
            <Select defaultValue='所有单词' onSelect={(value)=>this.typeSelectChange(value)} style={{minWidth:'6.5rem'}}>
                <Select.Option key='所有单词' value='所有单词'>所有单词{wordClassifications && wordClassifications['所有单词'] && `(${wordClassifications['所有单词']})`}</Select.Option>
                {classifications.map(value=><Select.Option value={value} key={value}>{value}{wordClassifications && ` (${wordClassifications[value]?wordClassifications[value]:0})`}</Select.Option>)}
                <Select.Option value='编辑' className='border-top text-center'>编辑<Icon type="edit"  className='ml-1'/></Select.Option>
            </Select>
            {/* <span className='text-primary hover-pointer ml-1' style={{fontSize:'0.8rem'}} onClick={()=>this.setState({editClassificatiModal:true})}>编辑</span> */}
            <ShowClassificationsModal ref={(node)=>this.classificationsModal = node} classifications={classifications} setClassificationOk={this.setClassificationOk}/>
        </div>
    }
    
    componentWillUnmount(){
        eventProxy.off('wordsTypeChange')
    }
}

export default TableFilter;