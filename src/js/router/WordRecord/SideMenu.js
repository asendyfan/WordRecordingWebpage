import React from 'react';
import {Layout, Icon, Input, Button, Modal} from 'antd';
import $ from 'jquery'
import {getCookie} from '../../utils/get-cookie'
import signout from '../../../pic/signout.svg';
import signin from '../../../pic/signin.svg';
import OnlineTranslation from './OnlineTranslation';
import getTranslateResultThroughWord from './getTranslateResultThroughWord';

const {Sider} = Layout

class SideMenu extends React.Component{
    state ={
        collapsed:true,
        noSearching:true,
        translateResult:{},
        searchWord:''
    }
    user = getCookie('user')

    onCollapse = ()=>{
        const {collapsed} = this.state;
        this.setState({collapsed:collapsed?false:true});
    }
    onpenSideMenu=()=>{
        this.state.collapsed &&this.state.noSearching && this.setState({collapsed:false})
    }

    signInOrOut=()=>{
        if(!this.user)return this.props.history.push('/signin');
        else return Modal.confirm({
            title:'退出',
            content:'确定要退出吗？',
            onOk:()=>{
                $.ajax({
                    type:'POST',
                    url:'/api/user/signout',
                }).then(()=>{
                    console.log('success sign out')
                    window.location.reload([true])
                })
            }
        })
    }

    onSearchWord= async ()=>{
        const {searchWord} = this.state
        let translateResult = await getTranslateResultThroughWord(searchWord)
        if(!translateResult)return 
        translateResult.word = searchWord.trim()
        translateResult && this.setState({translateResult})
    }

    render(){
        const {collapsed,noSearching, translateResult, searchWord} = this.state;
        return (
            <div onMouseOver={this.onpenSideMenu} style={{backgroundColor:'rgb(0,21,41)'}} >
                    <Sider
                        collapsed={collapsed}
                        onCollapse={this.onCollapse}
                        className='route-min-height'
                        onMouseLeave={()=>noSearching && this.setState({collapsed:true})}
                    >
                        <div className='d-flex  text-center justify-content-center  flex-column'>
                            <div className={`text-white hover-pointer ${collapsed?'invisible':'visible'}`}>
                                <Icon 
                                    className='mr-1 mt-2'
                                    type="shrink" 
                                    style={{float:'right', fontSize:'1.2rem'}}
                                    onClick={(e)=>{e.preventDefault();this.setState({noSearching:true,collapsed:true})}}/>
                            </div>
                            <div className='my-5 hover-pointer'>
                                <Icon type='user' className='text-white' style={{fontSize:'2rem'}}/>
                                <div className='d-block text-white'>{this.user?this.user:'User'}</div>
                            </div>
                            {collapsed ? 
                            <Icon 
                                type='search' 
                                className='text-white icon-half-larger hover-pointer' 
                                onClick={()=>this.setState({collapsed:false,noSearching:false})}/> : 
                            <Input.Search 
                                placeholder='search' 
                                className='px-2 mb-2'
                                allowClear
                                onFocus={()=>noSearching && this.setState({noSearching:false})}
                                onSearch={this.onSearchWord}
                                onChange={(e)=>this.setState({searchWord:e.target.value})}/>}
                            {!collapsed && 
                            <Button 
                                className='mx-2 mb-2' 
                                type='primary' 
                                onClick={(e)=>{
                                    e.preventDefault()
                                    this.onSearchWord()
                                }}>翻译</Button>}
                            <div className={`${!collapsed && Object.keys(translateResult).length?'visible':'invisible'} text-white`}>    
                                <OnlineTranslation translateResult={translateResult}/>
                            </div>
                        </div>
                    </Sider>  
                    <div className='text-white d-flex mx-auto justify-content-center' 
                        style={{position:'relative',bottom:'3rem',width:!collapsed?'200px':'80px',cursor:'pointer'}}
                        onClick={this.signInOrOut}>
                        {!collapsed && <span className='align-self-center mr-1'>{this.user?'登出':'登录'}</span>}<embed src={this.user?signout:signin} style={{width:'1.5rem'}}/>  
                    </div>    
            </div>
        )
    }
}

export default SideMenu