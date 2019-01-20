import React from 'react';
import {Redirect} from 'react-router-dom';
class Setting extends React.Component{
    render(){
        const settings = [
            {name:'Set Words',path:'/setWords'},
            {name:'edit blog',path:'/setWords'}];
        return <div className='d-flex justify-content-center mt-5'>
            <div className='btn-group-vertical' role='group'>
                {settings.map((value, index)=>{
                    return <button 
                        type="button" 
                        className='btn btn-primary mt-1 rounded'
                        onClick={(e)=>this.props.history.push(value.path)}>  
                        {value.name}
                    </button>
                })}
            </div>
        </div>
    }
}
export default Setting;