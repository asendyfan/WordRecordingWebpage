import React from 'react';
import {Link} from 'react-router-dom';
import $ from 'jquery';

import {getCookie} from '../utils/get-cookie';
export default class MyNavbars extends React.Component{
    signOut(){
        $.ajax({
            type:'POST',
            url:'/api/user/signout',
        }).then(()=>{
            console.log('success sign out')
            this.setState({userName:'User'})
            this.props.history.push('/');
        })
    }
    render(){
        let userName = getCookie('user');
        userName = userName?userName:'User';
        console.log('is',userName)
        return (
            <div className="dropdown" style={{marginRight:'3rem'}}>
                <a role="button" className="dropdown-toggle" data-toggle="dropdown" href="javascript:;" aria-haspopup="true" aria-expanded="false">
                    <i className="fas fa-user"></i> {userName}
                </a>
                <div className="dropdown-menu dropdown-menu-right">
                    {(userName==='admin'||userName==='beibei') && <button className="dropdown-item" href="/#" type="button"><Link to='/setting'><i className="fas fa-pencil-alt"></i>  编辑</Link></button>}
                    {userName ==='User' && <button className="dropdown-item" href="#" type="button"><Link to='/signin'><i className="fas fa-sign-in-alt"></i>  登陆</Link></button>}
                    {userName ==='User' && <button className="dropdown-item" href="#" type="button"><Link to='/signup'><i className="fas fa-user-plus"></i>  注册</Link></button>}
                    {userName !=='User' && <button className="dropdown-item" href="#" type="button" onClick={()=>this.signOut()}><i className="fas fa-sign-in-alt"></i>  离开</button>}
                    {/* <button className="dropdown-item" href="#" type="button"><i className="fas fa-sign-out-alt"></i>  log out</button> */}
                </div>
            </div>
        )
    }
}