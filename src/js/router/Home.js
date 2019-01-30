import React from 'react';
import $ from 'jquery';
import {Layout} from 'antd';
import MyNavBars from '../component/MyNavbars'
import {getCookie} from '../utils/get-cookie';



export default class Login extends React.Component{
    constructor(props){
        super(props);
        this.state={
            userName:'User'
        }
    }
    componentWillMount(){
        // $.ajax({
        //     type:'GET',
        //     url:'/user/signInCheck',
        // }).then((data)=>{
        //     console.log(data)
        //     // this.setState({userName:getCookie('user')})
        // }).catch((err)=>{
        //     console.log(err);
        //     if(getCookie('user'))console.log('这里是个bug:',getCookie('user'))
        // })
    }
    render(){
        const {userName} = this.state
        return <Layout className='route-min-height'>
            <MyNavBars/>
        </Layout>
    }
}