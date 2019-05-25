import React from 'react';
import {Layout, Icon, Input, Button, Modal} from 'antd';
import $ from 'jquery'
import {getCookie} from '../../utils/get-cookie'
import OnlineTranslation from '../OnlineTranslation/OnlineTranslation';
import getTranslateResultThroughWord from '../getTranslateResultThroughWord';
import styles from './index.module.scss';

const {Sider} = Layout

class SideMenu extends React.Component{
    state ={
        collapsed:false,
        noSearching:true,
        translateResult:{},
        searchWord:'',
        searchNoResultWarning:false,
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
        console.log('translate result',translateResult)
        // if(!translateResult)return this.setState({searchNoResultWarning:true,translateResult:{}})
        if(!translateResult)return 
        translateResult.word = searchWord.trim()
        translateResult && this.setState({translateResult,searchNoResultWarning:false})
    }

    render(){
        const {collapsed,noSearching, translateResult, searchNoResultWarning} = this.state;
        return (
                <Sider
                    width = {230}
                    collapsedWidth={70}
                    style={{backgroundColor:'#003366'}}
                    collapsed={collapsed}
                    onCollapse={this.onCollapse}
                    className='route-min-height'
                >
                    <div className={`${styles.siderMain}`} style={{width:collapsed?70:230}} id='sideContent'>
                        <div className={styles.iconWrapper}>
                            <Icon type='user' className={styles.icon} style={{fontSize:'2rem'}}/>
                            <div>{this.user?this.user:'User'}</div>
                        </div>
                        {collapsed ? 
                        <Icon 
                            type='search' 
                            className='icon-half-larger hover-pointer' 
                            onClick={()=>this.setState({collapsed:false,noSearching:false})}/> : 
                        <Input.Search 
                            placeholder='search' 
                            className={styles.search}
                            allowClear
                            onFocus={()=>noSearching && this.setState({noSearching:false})}
                            onSearch={this.onSearchWord}
                            onChange={(e)=>this.setState({searchWord:e.target.value})}/>}
                        {!collapsed && 
                        <Button 
                            className={styles.button} 
                            id='translateButton'
                            size='small'
                            onClick={(e)=>{
                                e.preventDefault()
                                this.onSearchWord()
                            }}>在线翻译</Button>}
                        {!collapsed && Object.keys(translateResult).length>0 && <div className={`text-white`}>    
                            <OnlineTranslation translateResult={translateResult}/>
                        </div>} 
                        {/* {!collapsed && searchNoResultWarning &&<div className='text-white mt-3'>
                            搜索不到该单词
                        </div>}   */}
                    </div>
                    <div className={styles.authButton} id='loginOrLogoutButton'
                        style={{width:collapsed?70:230}}
                        onClick={this.signInOrOut}>
                        {!collapsed && <span className='align-self-center mr-1'>{this.user?'登出':'登录'}&nbsp;<Icon type={this.user?'logout':'login'} style={{width:'1.5rem'}}/></span>}
                    </div> 
                </Sider>  
        )
    }
}

export default SideMenu