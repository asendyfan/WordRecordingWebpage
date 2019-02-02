import React from 'react';
import {Modal, Tag} from 'antd';
import $ from 'jquery';
import _ from 'lodash';
import ShowClassificationsModal from './ShowClassificationsModal';
export default class ShowClassificationsModalWithIcon extends React.Component {

    iconClick=(modalVisable)=>{
        this.classificationsModal.setModalVisable(modalVisable)
    }

    render(){
        const {classifications, setClassificationOk} = this.props;
        return (
            <div>
                <i class="fas fa-edit float-right" style={{cursor:'pointer'}} onClick={()=>this.iconClick(true)}></i>
                <ShowClassificationsModal ref={(node)=>this.classificationsModal=node} {...this.props}/>            
            </div>
        )
    }
}