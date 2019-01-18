import React from 'react';
import {Link} from 'react-router-dom';
import UserDropDown from './UserDropDown';
export default class MyNavbars extends React.Component{
    render(){
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="/">Fan</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                    <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                        <li className="nav-item active dropdown">
                            <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false"><i className="fas fa-tools"></i> tools</a>
                            <div className="dropdown-menu">
                                <Link to="/WordRecords" className="dropdown-item nav-link">生词记录</Link>
                                <Link to="/WordRecords" className="dropdown-item nav-link">排列组合计算</Link>
                            </div>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" role="button" to="#"><i className="fas fa-blog"></i> blogs</Link>
                        </li>
                    </ul>
                    <div className=" my-2 my-lg-0 mr-5">
                        <UserDropDown className='nav-item'/>
                    </div>
                </div>
            </nav>
        )
    }
}