import React from 'react';
import {Layout, Menu, Icon, Input, Button} from 'antd';
import {getCookie} from '../../utils/get-cookie'
import signout from '../../../pic/signout.svg';
import signin from '../../../pic/signin.svg';
import OnlineTranslation from './OnlineTranslation';
import getTranslateResultThroughWord from './getTranslateResultThroughWord';

const {Header, Content, Sider} = Layout

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

    render(){
        const {collapsed,noSearching, translateResult, searchWord} = this.state;
        const sideContents = this.props
        return (
            <div className='route-min-height' onMouseOver={this.onpenSideMenu}>
                <Sider
                    collapsed={collapsed}
                    onCollapse={this.onCollapse}
                    className='route-min-height'
                    onMouseLeave={()=>noSearching && this.setState({collapsed:true})}
                >
                    <div className='d-flex  text-center justify-content-center  flex-column'>
                        <div className={`text-white hover-pointer ${collapsed?'invisible':'visible'}`}>
                            <Icon 
                                className='mr-1 mt-1'
                                type="shrink" 
                                style={{float:'right', fontSize:'1.2rem'}}
                                onClick={(e)=>{e.preventDefault();this.setState({noSearching:true,collapsed:true})}}/>
                        </div>
                        <div className='my-5 hover-pointer'>
                            <Icon type='user' className='text-white' style={{fontSize:'2rem'}}/>
                            <div className='d-block text-white'>{this.user?this.user:'sign in'}</div>
                        </div>
                        {collapsed ? 
                        <Icon 
                            type='search' 
                            className='text-white icon-half-larger hover-pointer' 
                            onClick={()=>this.setState({collapsed:false,noSearching:false})}/> : 
                        <Input.Search 
                            placeholder='search' 
                            className='px-2 mb-2'
                            onFocus={()=>noSearching && this.setState({noSearching:false})}
                            onChange={(e)=>this.setState({searchWord:e.target.value})}/>}
                        {!collapsed && 
                        <Button 
                            className='mx-2 mb-2' 
                            type='primary' 
                            onClick={async (e)=>{
                                let translateResult = await getTranslateResultThroughWord(this.state.searchWord, e)
                                if(!translateResult)return 
                                translateResult.word = searchWord.trim()
                                translateResult && this.setState({translateResult})
                            }}>翻译</Button>}
                        <div className={`${Object.keys(translateResult).length?'visible':'invisible'} text-white`}>    
                            <OnlineTranslation translateResult={translateResult}/>
                        </div>
                        
                    </div>
                </Sider>  
                <div className='text-white d-flex mx-auto justify-content-center' style={{position:'relative',bottom:'3rem',width:'4rem'}}>
                    {!collapsed && <span className='align-self-center mr-1'>{this.user?'登出':'登录'}</span>}<embed src={this.user?signout:signin} style={{width:'1.5rem'}}/>  
                    
                </div>    
                {/* {!collapsed && <div className='text-white'>
                    
                </div>} */}
                {/* <div className='d-flex justify-content-center align-items-center hover-pointer' style={{backgroundColor:'#d7d7d7'}} onClick={this.onCollapse}>
                    <div style={{height:'3rem',backgroundColor:'#3297fb',width:'0.8em',marginLeft:'-0.1em'}} className='d-flex align-items-center side-collapse-style' onMouseOver={()=>console.log(222)}>
                        <Icon type={`caret-${collapsed?'right':'left'}`} className='align-middle text-white'/>
                    </div>
                </div> */}
            </div>
        )
    }
}

export default SideMenu