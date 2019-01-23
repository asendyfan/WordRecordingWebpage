import React from 'react';
import $ from 'jquery';

import ChooseStars from '../../component/ChooseStarts';
import eventProxy from '../../utils/event-proxy';

class SetWords extends React.Component{
    state={
        module:'添加单词'
    }
    render(){
        const {module} = this.state;
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
            {navs}
            {module==='添加单词' && <AddWord/>}
        </div>
    }
}

class AddWord extends React.Component{
    componentDidMount(){
        eventProxy.on('starsNum', (num)=>{this.starsNum = num})
        const form = $('#addWord');
        console.log(form)
        form.submit(e=>{
            e.preventDefault()
            const formData = form.serializeArray()
            console.log(formData)
            console.log(this.starsNum)
        })
    }

    render(){
        return <div className='d-flex justify-content-center'>
            <form className='form-inline p-2' id='addWord' action=''>
                <label class="sr-only" for="inlineFormInputGroupWord">word</label>
                <div class="input-group m-sm-2">
                    <div class="input-group-prepend">
                        <div class="input-group-text">单词</div>
                    </div>
                    <input type="text" class="form-control" id="inlineFormInputGroupWord" name='word' placeholder="word" required/>
                </div>
                <label class="sr-only" for="inlineFormInputGroupTranslate">translate</label>
                <div class="input-group m-sm-2">
                    <div class="input-group-prepend">
                        <div class="input-group-text">翻译</div>
                    </div>
                    <input type="text" class="form-control" id="inlineFormInputGroupTranslate" name='translate' placeholder="translate" required/>
                </div>
                <label class="sr-only" for="inlineFormInputGroupWordClass">词性</label>
                <div class="input-group m-sm-2">
                    <div class="input-group-prepend">
                        <div class="input-group-text">词性</div>
                    </div>
                    <select className='form-control' id="inlineFormInputGroupWordClass" name='wordClass' required>
                        <option>n.</option>
                        <option>adj.</option>
                        <option>v.</option>
                    </select>
                </div>
                <label className='sr-only' for='chooseStars'></label>
                <div className='input-group m-sm-2'>
                    <ChooseStars className='form-control' id='chooseStars'/>
                </div>
                <button type='submit' className='btn btn-primary m-sm-2'>Submit</button>
            </form>
        </div>
    }
}

export default SetWords