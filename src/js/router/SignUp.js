import React from 'react';
// import axios from 'axios';
import $ from 'jquery';
import '../../css/login.css';
import md5 from 'md5';
export default class Login extends React.Component {
    constructor(props){
        super(props)
        this.state={
            isAlert:false
        }
    }

    componentWillMount(){
        $.ajax({
            url:'api/admincheck',
            async:false,
        }).catch(err=>{
            console.log('err',err);
            this.props.history.push('/forbidden')
        })
    }

    componentDidMount() {
        const form = $('#sign-form')
        form.submit( (event) => {
            const formData = form.serializeArray();
            const data = formData.reduce((pre, cur) => {
                pre.user = (cur.name === 'user') ? cur.value : pre.user
                pre.password = cur.name === 'password' ? md5(cur.value) : pre.password
                return pre
            }, {})
            event.preventDefault()
            $.ajax({
                type:'POST',
                url: '/api/user/signup',
                async: false,
                data: data
            }).then(data => {
                console.log(data)
                this.props.history.push('/')
            }).catch(err => {
                console.log(err)
                this.setState({isAlert:true})
            })
        })
    }

    alertComponent(alertSentence){
        return <div className="alert alert-danger alert-dismissiblew" role="alert">
            {alertSentence}
            <button type="button" className="close" onClick={()=>this.setState({isAlert:false})} aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    }

    render() {
        const {isAlert} = this.state
        return <div style={{ marginTop: '16vh' }}>
            <form id="sign-form" className="border border-dark rounded mx-auto px-2 py-4" action="" >
                <div className='text-center'><h3>注册账户</h3></div>
                {isAlert && this.alertComponent('用户名已被使用.')}
                <div className="form-group">
                    <label htmlFor="validationDefault01">用户名</label>
                    <input type="text" className="form-control" id="validationDefault01" placeholder="Name" name="user" required />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">密码</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" minLength="8" maxLength="20" placeholder="Password" name="password" required />
                </div>
                <div className='row justify-content-center'>
                    <button type="submit" className="btn btn-primary">提交</button>
                </div>
            </form>
        </div>
    }
}