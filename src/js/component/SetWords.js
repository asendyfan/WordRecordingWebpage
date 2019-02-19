import React from 'react';
import $ from 'jquery';

import {Select} from 'antd';
// import MyNavbars from '../../component/MyNavbars';
import ShowClassificationsModalWithIcon from './ShowClassificationsModalWithIcon';

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
            {/* <MyNavbars/> */}
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
        console.log('getClassification',data)
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
                            <ShowClassificationsModalWithIcon classifications={classifications} setClassificationOk={this.setClassificationOk}/>
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


export default SetWords