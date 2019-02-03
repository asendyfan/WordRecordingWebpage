import React from 'react';
import {Modal, Tag} from 'antd';
import $ from 'jquery';
import _ from 'lodash';
/**
 *
 *
 * @export
 * @class ShowClassificationsModal
 * @extends {React.Component}
 * @props [Array] classifications         分类的数组
 * @props [Function] setClassificationOk  分类设置完成后的回填
 */
export default class ShowClassificationsModal extends React.Component {

    state={
        modalVisable : false,   //控制modal的显示
        thisClassifiction:[],
    }

    setModalVisable(modalVisable){
        this.setState({modalVisable})
    }

    addTag(){
        const {addTagValue, thisClassifiction} = this.state;
        if(!addTagValue)return alert('不能为空')
        if(thisClassifiction.indexOf(addTagValue)>-1)return alert('已有此标签')
        this.setState({thisClassifiction:thisClassifiction.concat([addTagValue]),addTagValue:''})
    }

    closeTag(thisClassifiction, deleteValue){
        // console.log('tag close',deleteValue)
        this.setState({thisClassifiction:thisClassifiction.filter(classification=>classification!==deleteValue)})
    }

    clearEdit=()=>{
        this.setState({thisClassifiction:[],addTagValue:''})
    }

    saveFun(){
        const {setClassificationOk} = this.props
        const {thisClassifiction} = this.state
        this.totalClassifiction = thisClassifiction.join(',');
        // console.log(thisClassifiction,this.totalClassifiction)
        $.ajax({
            method:'GET',
            url:'/api/wordRecords/setClassification',
            data:{classifications:this.totalClassifiction}
        })
        .then(()=>setClassificationOk())
        .then(()=>this.clearEdit())
        .catch(err=>alert('更新失败'+err))
    }

    shouldComponentUpdate(nextProps, nextState){
        if(!this.state.modalVisable && !nextState.modalVisable)return false
        else return true
    }

    render(){
        const {modalVisable, thisClassifiction, addTagValue} = this.state;
        console.log('render modal','visialbe',modalVisable,thisClassifiction)
        return (
            <div>
                <Modal
                    title='编辑分类标签'
                    centered
                    visible = {modalVisable}
                    onCancel={() => {this.setModalVisable(false);this.clearEdit()}}
                    onOk={()=>{this.setModalVisable(false);this.saveFun()}}>
                        <div className='d-flex justify-content-center'>
                            <input type='text' className='d-inline-block form-control mr-2' onChange={(e)=>this.setState({addTagValue:e.target.value})} value={addTagValue}/>
                            <button className='btn btn-primary d-inline-block' onClick={(e) => {e.preventDefault();this.addTag()}}>添加</button>
                        </div>
                        <hr />
                        <div className='d-flex'>
                            {thisClassifiction.map((value, index) =>{
                                return <Tag
                                    key={value} 
                                    closable 
                                    onClose={()=>this.closeTag(thisClassifiction, value)}> 
                                    {value}
                                </Tag>
                            })}
                        </div>
                </Modal>
            </div>
        )
    }

    componentDidUpdate(){
        const {classifications} = this.props;
        const {thisClassifiction} = this.state;
        //初始化，标签的显示
        if((thisClassifiction.length ===0 && classifications.length)){
            console.log(thisClassifiction, classifications)
            const tagVisible = classifications.reduce((pre, cur)=>{
                pre[cur+'TagVisible'] = true
                return pre
            },{})
            this.setState({thisClassifiction:_.cloneDeep(classifications),...tagVisible})
        }   
    }
}