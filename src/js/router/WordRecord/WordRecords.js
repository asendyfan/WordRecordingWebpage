import React from 'react';
import MyNavBars from '../../component/MyNavbars';
import WordRecordDemo from '../../../demo/wordRecordDemo'
import { Table, Button, Icon, Input } from 'antd';
import "antd/dist/antd.css";
import '../../../css/word-record-table.css'
import Highlighter from 'react-highlight-words';
import TableFilter from './TableFilter';
import eventProxy from '../../utils/event-proxy';

class WordTable extends React.Component {

    componentDidMount(){
        eventProxy.on('wordsTypeChange', (wordsType)=>{
            this.setState({wordsType})
        })
    }

    state = {
        searchText: '',
        wordsType:'all'
    };

    getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys, selectedKeys, confirm, clearFilters,
        }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={node => { this.searchInput = node; }}
                        placeholder={`Search ${dataIndex}`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm)}
                        icon="search"
                        size="small"
                        style={{ width: 90, marginRight: 8 }}>
                        Search
                    </Button>
                    <Button
                        onClick={() => this.handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}>
                        Reset
                    </Button>
                </div>
            ),
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: (text) => (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text.toString()}
            />
        ),
    }) 
    
    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    }

    handleReset = (clearFilters) => {
        clearFilters();
        this.setState({ searchText: '' });
    }

    buildTable(){
        const {wordsType} = this.state
        const column = [
            {
                title:'单词',
                dataIndex:'word',
                sorter:(a,b)=>a.word > b.word?1:-1,
                defaultSortOrder:'ascend',
                ...this.getColumnSearchProps('word'),
            },
            {
                title:'词性',
                dataIndex:'wordClass',
            },
            {
                title:'翻译',
                dataIndex:'translate',
            },
            {
                title:'记录时间',
                dataIndex:'recordingTime',
                sorter:(a, b)=>a.recordingTime > b.recordingTime?1:-1,
            },
            {
                title:'记录天数',
                dataIndex:'recordDays'
            },
            {
                title:'重要性',
                dataIndex:'starsNum',
                render:(value, row, index)=>{
                    let array = []
                    for(let i=0;i<value;i++){
                        array.push(<i className='fas fa-star' key={i+'star'}></i>)
                    }
                    console.log(value, array)
                    return {children:<div>{array.map((value)=>{console.log('sss');return value})}</div>}
                }
            },
        ]

        const values = WordRecordDemo
            .filter(value=>wordsType==='all'?true:wordsType===value.type)
            .map(data=>{
                return {
                    word:data.word,
                    wordClass:data.wordClass,
                    translate:data.translate,
                    recordingTime:data.recordingTime,
                    recordDays:1,
                    starsNum:data.starsNum
                }
        })
        return <Table columns={column} dataSource={values} />
    }

    render(){
        return (
            <div className='page-max-width'>
                {this.buildTable()}
            </div>
        )
    }
}

export default class WordRecord extends React.Component{
    render(){
        return(
            <div>
                <MyNavBars/>
                <div className='page-max-width mx-lg-auto mx-3'>
                    <TableFilter/>
                    <WordTable/>
                </div>
            </div>
        )
    }
}