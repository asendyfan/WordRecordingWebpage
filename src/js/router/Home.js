import React from 'react';
import {Layout} from 'antd';
// import MyNavBars from '../component/MyNavbars'

export default class Login extends React.Component{
    constructor(props){
        super(props);
        this.state={
            userName:'User'
        }
    }
    render(){
        return <Layout className='route-min-height'>
            {/* <MyNavBars/> */}
        </Layout>
    }
}