import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
export default class OnlineTranslation extends React.Component {
    static contextTypes = {
        onSetWord: PropTypes.func,
        onGetWord: PropTypes.func
    }
    render() {
        const { translateResult } = this.props
        return (
            <div className='mx-auto p-3 text-left'>
                {Object.keys(translateResult).length &&
                    <div className = "media">
                        <div className = "media-body">
                            <div className = "mt-0" style={{ lineHeight: 1.2, fontWeight: 500 }}>{translateResult.word}&nbsp;&nbsp;<i className="fas fa-language"></i>&nbsp;&nbsp;{translateResult.translations[0]}</div>
                            <p>{translateResult.phonetic}</p>
                            <ul className='list-unstyled' style={{fontSize:'0.8rem'}}>
                                {translateResult.explains.map((value) => <li key={value}><b className='float-left'>{value.split('. ')[0]}.</b><span className='d-block pl-5'>{value.split('. ')[1]}</span></li>)}
                            </ul>
                        </div>
                    </div>}
                <div className='d-flex justify-content-center'>
                    <Button type='primary' onClick={(e)=>{
                        const data = {
                            word:translateResult.word,
                            phonetic:translateResult.phonetic,
                            translate:translateResult.explains.length?translateResult.explains.join('\n'):translateResult.translations[0],
                            classifications:'',
                        }
                        this.context.onSetWord(data)
                    }} >添加到单词表</Button>
                </div>
            </div>)
    }
}