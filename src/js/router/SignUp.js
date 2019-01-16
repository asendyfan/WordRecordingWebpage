import React from 'react';
// import axios from 'axios';
import $ from 'jquery';
import '../../css/login.css';
import md5 from 'md5';
export default class Login extends React.Component {

    componentDidMount() {
        //  const form = document.getElementById('sign-form')
        //  console.log(form)
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
                url: '/user/signup',
                async: false,
                data: data
            }).then(data => {
                console.log(data)
                this.props.history.push('/')
            }).catch(err => {
                console.log(err)
            })
        })
    }


    render() {
        return <div style={{ marginTop: '16vh' }}>
            <form id="sign-form" className="border border-dark rounded mx-auto px-2 py-4" action="" >
                <div className='text-center'><h3>Sign Up</h3></div>
                <div className="form-group">
                    <label for="validationDefault01">Name</label>
                    <input type="text" class="form-control" id="validationDefault01" placeholder="Name" name="user" required />
                </div>
                <div className="form-group">
                    <label for="exampleInputPassword1">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" minLength="8" maxLength="20" placeholder="Password" name="password" required />
                </div>
                <div className='row justify-content-center'>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form>
        </div>
    }
}