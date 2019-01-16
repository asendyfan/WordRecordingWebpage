import React from 'react';
import {Link} from 'react-router-dom';
export default class MyNavbars extends React.Component{
    render(){
        return (
            <div className="dropdown" style={{marginRight:'3rem'}}>
                <a role="button" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i className="fas fa-user"></i> User
                </a>
                <div className="dropdown-menu dropdown-menu-right">
                    <button className="dropdown-item" href="/#" type="button"><Link to='/user/signin'><i className="fas fa-pencil-alt"></i>  Edit</Link></button>
                    <button className="dropdown-item" href="#" type="button"><Link to='/user/signin'><i className="fas fa-sign-in-alt"></i>  Sign in</Link></button>
                    <button className="dropdown-item" href="#" type="button"><Link to='/user/signup'><i className="fas fa-user-plus"></i>  Sign up</Link></button>
                    {/* <button className="dropdown-item" href="#" type="button"><i className="fas fa-sign-out-alt"></i>  log out</button> */}
                </div>
            </div>
            // <li className="nav-item active dropdown">
            //     <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">tools</a>
            //     <div className="dropdown-menu dropdown-menu-right">
            //         <Link to="/WordsRecord" className="dropdown-item nav-link">生词记录</Link>
            //         <Link to="/WordsRecord" className="dropdown-item nav-link">排列组合计算</Link>
            //     </div>
            // </li>
        )
    }
}