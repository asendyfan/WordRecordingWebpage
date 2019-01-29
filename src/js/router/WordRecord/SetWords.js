import React from 'react';
import $ from 'jquery';
import _ from 'lodash';

import eventProxy from '../../utils/event-proxy';
import {Select, Tag, Modal} from 'antd';
import MyNavbars from '../../component/MyNavbars';

class SetWords extends React.Component{
    state={
        module:'添加单词',
        showTranslateComponent:false,
        translateResult:''
    }

    getTranslateResult=(resultData)=>{
        this.setState({
            showTranslateComponent:true,
            translateResult:resultData
        })
    }

    render(){
        const {module, showTranslateComponent, translateResult} = this.state;
        const navs = <div  className='d-flex justify-content-center'>
            <div className='mt-5'>
                <ul className='nav nav-pills border rounded'
                    onClick={(e) => {
                        this.setState({ 'module': e.target.text })
                    }}>
                    <li className='nav-item'>
                        <a className={`nav-link ${module === '添加单词' ? 'active' : ''}`} href='javascript:;'>添加单词</a>
                    </li>
                    <li className='nav-item'>
                        <a className={`nav-link ${module === '呈现所有' ? 'active' : ''}`} href='javascript:;'>呈现所有</a>
                    </li>
                </ul>
            </div>
        </div>
        return <div>
            <MyNavbars/>
            {navs}
            {module==='添加单词' && <AddWord getTranslateResult={this.getTranslateResult} />}
            {module==='添加单词' && showTranslateComponent && <OnlineTranslation translateResult={translateResult}/>}
        </div>
    }
}

const transFormDataArrayToObject=(formDataArray)=>{
    return formDataArray.reduce((pre, cur)=>{
        pre[cur.name] = cur.value
        return pre
    },{})
}

const getTranslateResultThroughForm = function(form, e, thisObj = this){
    e.preventDefault()
    const formDataArray = form.serializeArray()
    const formDataObject = transFormDataArrayToObject(formDataArray);
    console.log('formData', formDataObject)
    const word = formDataObject.word.trim()
    if (!word) return
    $.ajax({
        method: 'GET',
        url: '/api/getTranslateResult',
        data: { word: word },
    }).then(transResult => {
        console.log(transResult)
        transResult.word = word
        thisObj.props.getTranslateResult(transResult)
        thisObj.setState({phonetic:transResult.phonetic})
    }).catch(err => {
        console.error('err: ',err)
    })
}

class AddWord extends React.Component{
    state={
        phonetic:'',
        classifications:[]
    }
    thisWordClassifications=[]
    getClassifications = async function(){
        let data = await $.ajax({
            method:'GET',
            url:'/api/wordRecords/getClassification',
        }).catch(err=>{console.error('get classification error',err);alert('没有权限')})
        console.log(data)
        this.setState({classifications:data?data.split(','):[]})
    }

    setClassificationOk=()=>{
        console.log('set ok')
        this.getClassifications()
    }

    componentWillMount(){
        this.getClassifications()
    }

    getThisWordClassifications = (classifications)=>{
        this.thisWordClassifications = classifications
    }

    componentDidMount(){
        this.form = $('#addWord');
        this.form.submit(e=>{
            const {phonetic} = this.state
            e.preventDefault()
            const formDataArray = this.form.serializeArray()
            const formData = transFormDataArrayToObject(formDataArray)
            formData.phonetic = phonetic
            formData.classifications = this.thisWordClassifications.join(',')
            console.log(formData)
            $.ajax({
                method:'GET',
                url:'/api/wordRecords/setword',
                data:formData
            }).then(data=>{
                console.log(data);
                alert('添加成功')
            })
        })
    }

    render(){
        const {phonetic, classifications} = this.state
        const classificationsModalId = 'exampleModalCenter'
        return <div className='d-flex justify-content-center'>
            <form className='form-inline p-2' id='addWord' action=''>
                <label class="sr-only" for="inlineFormInputGroupWord">word</label>
                <div class="input-group my-2 m-sm-2">
                    <div class="input-group-prepend">
                        <div class="input-group-text">单词</div>
                    </div>
                    <input type="text" class="form-control" id="inlineFormInputGroupWord" name='word' placeholder="word" required/>
                </div>
                <label class="sr-only" for="inlineFormClassification">classification</label>
                <div class="input-group my-2 m-sm-2">
                    <div class="input-group-prepend">
                        <div class="input-group-text">分类</div>
                    </div>
                    <div className="form-control p-0" id="inlineFormClassification">
                        <SelectWithHiddenSelectedOptions placeholder='选择标签' name='classification' getThisWordClassifications={this.getThisWordClassifications} options={classifications}/>
                    </div>
                    <div class="input-group-prepend">
                        <div class="input-group-text border-left-0 rounded-right">
                            <ShowModal classifications={classifications} setClassificationOk={this.setClassificationOk}/>
                        </div>
                    </div>
                </div>
                <label class="sr-only" for="inlineFormInputGroupTranslate">translate</label>
                <div class="input-group my-2 m-sm-2">
                    <div class="input-group-prepend">
                        <div class="input-group-text">翻译</div>
                    </div>
                    <input type="text" class="form-control" id="inlineFormInputGroupTranslate" name='translate' placeholder="translate" required/>
                </div>

                <label class="sr-only" for="inlineFormInputGroupWordClass">词性</label>
                <div class="input-group my-2 m-sm-2">
                    <div class="input-group-prepend">
                        <div class="input-group-text">词性</div>
                    </div>
                    <select className='form-control' id="inlineFormInputGroupWordClass" name='wordClass' required>
                        <option>n.</option>
                        <option>v.</option>
                        <option>adj.</option>
                        <option>adv.</option>
                    </select>
                </div>
                <input className='sr-only' name='phonetic' value={phonetic}/>
                <button type='submit' className='btn btn-primary mr-2 m-sm-2'>Submit</button>
                <button type='text' className='btn btn-primary m-sm-2' onClick={(e)=>getTranslateResultThroughForm(this.form, e, this)}>在线翻译</button>
            </form>
        </div>
    }
}

class OnlineTranslation extends React.Component{
    render(){
        const {translateResult} =this.props

        return <div className='mx-auto p-3' style={{maxWidth:'912px'}}>
            <div class="media">
                    <div class="media-body">
                        <h5 class="mt-0">{translateResult.word}&nbsp;&nbsp;<i className="fas fa-language"></i>&nbsp;&nbsp;{translateResult.translations[0]}</h5>
                        <p>{translateResult.phonetic}</p>
                        <ul className='list-unstyled'>
                            {translateResult.explains.map((value)=><li><b className='float-left'>{value.split('. ')[0]}.</b><span className='d-block pl-5'>{value.split('. ')[1]}</span></li>)}
                        </ul>
                    </div>
            </div>
        </div>
    }
}

class SelectWithHiddenSelectedOptions extends React.Component {
    state = {
        selectedItems: [],
    };

    handleChange = selectedItems => {
        const {getThisWordClassifications} = this.props
        getThisWordClassifications(selectedItems)
        this.setState({ selectedItems });
    };

    componentDidMount(){
        const selectSonEle = $('.ant-select-selection')
        selectSonEle.addClass('form-control border-0').attr('style','min-width:8rem;padding-bottom:0.375rem')
        $('.ant-select-selection__rendered').css({'line-height':1.5}).addClass('ml-0')
        $('.ant-select-selection__rendered > div').css({'line-height':'1.5'}).addClass('ml-0')
    }

    render() {
        const {placeholder, options} = this.props
        const { selectedItems } = this.state;
        let filteredOptions = options ? options.filter(o => !selectedItems.includes(o)):[];
        return (
            <Select
                mode="multiple"
                placeholder={placeholder}
                value={selectedItems}
                onChange={this.handleChange}
            >
                {filteredOptions && filteredOptions.map(item => (
                    <Select.Option key={item} value={item}>
                        {item}
                    </Select.Option>
                ))}
            </Select>
        );
    }
}

class ShowModal extends React.Component {

    state={
        modalVisable : false,
        thisClassifiction:[],
        collectAddTagValues:[]
    }

    setModalVisable(modalVisable){
        this.setState({modalVisable})
    }

    setTagVisable(){
        const {thisClassifiction} = this.state
        const tagVisible = thisClassifiction.reduce((pre, cur)=>{
            pre[cur+'TagVisible'] = true
            return pre
        },{})
        this.setState({collectAddTagValues:[],...tagVisible})
    }

    addTag(){
        console.log('add tag')
        const {addTagValue, thisClassifiction, collectAddTagValues} = this.state;
        if(thisClassifiction.indexOf(addTagValue)>-1 || collectAddTagValues.indexOf(addTagValue)>-1)return alert('已有此标签')
        collectAddTagValues.push(addTagValue);
        this.setState({collectAddTagValues,[addTagValue+'TagVisible']:true})
    }

    saveFun(){
        const {setClassificationOk} = this.props
        const {thisClassifiction, collectAddTagValues} = this.state
        // let classifications = thisClassifiction
        //     .reduce((pre, cur, index)=>{
        //         this.state[cur+'TagVisible'] && pre.push(cur)
        //         return pre
        //     },[])
        //     .join(',')
        for(let i=0;i<thisClassifiction.length;i++){
            if(!this.state[thisClassifiction[i]+'TagVisible']){
                thisClassifiction.splice(i,1)
                i--
            }
        }
        this.totalClassifiction = thisClassifiction.concat(collectAddTagValues).join(',');
        console.log(thisClassifiction,collectAddTagValues,this.totalClassifiction)
        $.ajax({
            method:'GET',
            url:'/api/wordRecords/setClassification',
            data:{classifications:this.totalClassifiction}
        }).then(data=>setClassificationOk()).catch(err=>alert('更新失败'+err))
    }

    render(){
        const {modalVisable, thisClassifiction, collectAddTagValues} = this.state;
        return (
            <div>
                <i class="fas fa-edit float-right" style={{cursor:'pointer'}} onClick={()=>this.setModalVisable(true)}></i>
                <Modal
                    title='编辑分类标签'
                    centered
                    visible = {modalVisable}
                    onCancel={() => {this.setModalVisable(false);this.setTagVisable()}}
                    onOk={()=>{this.setModalVisable(false);this.saveFun()}}>
                        <div className='d-flex justify-content-center'>
                            <input type='text' className='d-inline-block form-control mr-2' onChange={(e)=>{
                                this.state.addTagValue = e.target.value
                            }}/>
                            <button className='btn btn-primary d-inline-block' onClick={(e) => {e.preventDefault();this.addTag()}}>添加</button>
                        </div>
                        <hr />
                        <div className='d-flex'>
                            {thisClassifiction.map((value, index) =>{
                                // console.log(value,'visible',this.state[value+'TagVisible'])
                                return <Tag 
                                    closable 
                                    visible={this.state[value+'TagVisible']} 
                                    onClose={(e)=>{
                                        e.preventDefault()
                                        this.setState({thisClassifiction,[value+'TagVisible']:false})}
                                    }> 
                                    {value}
                                </Tag>
                            })}
                            {collectAddTagValues.map((value, index) =>{
                                return <Tag 
                                    closable 
                                    visible={this.state[value+'TagVisible']} 
                                    onClose={(e)=>{
                                        e.preventDefault()
                                        collectAddTagValues.splice(index,1)
                                        console.log('tag close',collectAddTagValues)
                                        this.setState({collectAddTagValues,[value+'TagVisible']:false})}
                                    }> 
                                    {value}
                                </Tag>
                            })}
                        </div>
                </Modal>
            </div>
        )
    }

    componentDidUpdate(){
        const {classifications, modalVisable} = this.props;
        const {thisClassifiction} = this.state;
        // console.log(classifications, thisClassifiction)
        if((thisClassifiction.length < classifications.length)){
            console.log(thisClassifiction, classifications)
            const tagVisible = classifications.reduce((pre, cur)=>{
                pre[cur+'TagVisible'] = true
                return pre
            },{})
            console.log('tab visible',)
            this.setState({thisClassifiction:_.cloneDeep(classifications),...tagVisible})
        }   
    }
}

export default SetWords