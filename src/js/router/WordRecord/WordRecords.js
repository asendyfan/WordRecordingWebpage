import React from 'react';
import $ from 'jquery';
import _ from 'lodash';
import MyNavBars from '../../component/MyNavbars';
import WordRecordDemo from '../../../demo/wordRecordDemo'
import { Table, Button, Icon, Input, Rate } from 'antd';
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
        wordsType:'所有',
        words:[]
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
        const {wordsType, words} = this.state
        console.log(words)
        const column = [
            {
                title:'记录日期',
                dataIndex:'recordingTime',
                sorter:(a, b)=>a.recordingTime > b.recordingTime?1:-1,
                defaultSortOrder:'descend',
                align:'center',
            },
            {
                title:'熟练度',
                dataIndex: 'starsNum',
                render: (value, row, index) => <Rate allowHalf disabled value={value} />,
                sorter: (a, b) => a > b ? 1 : -1,
                filters: [
                    {
                        text: '1星',
                        value: 1
                    },
                    {
                        text: '2星',
                        value: 2
                    },
                    {
                        text: '3星',
                        value: 3
                    },
                    {
                        text: '4星',
                        value: 4
                    },
                    {
                        text: '5星',
                        value: 5
                    },
                ],
                onFilter: (value, record) => record.starsNum == value,
                align: 'center',
            },
            {
                title: '单词',
                dataIndex: 'word',
                sorter: (a, b) => a.word > b.word ? 1 : -1,
                ...this.getColumnSearchProps('word'),
                align: 'center',
            },
            {
                title:'发音',
                dataIndex:'phonetic',
                align:'center'
            },
            {
                title: '词性',
                dataIndex: 'wordClass',
                filters: [{
                    text: 'n.',
                    value: 'n.'
                }, {
                    text: 'v.',
                    value: 'v.'
                }, {
                    text: 'adj.',
                    value: 'adj.'
                }, {
                    text: 'adv.',
                    value: 'adv.'
                }],
                onFilter: (value, record) => record.wordClass == value,
                align: 'center',
            },
            {
                title: '翻译',
                dataIndex: 'translate',
                align: 'center',
            },
            {
                title: '记录天数',
                dataIndex: 'recordDays',
                align: 'center',
            },
        ]

        const values = words
            .filter(data => wordsType === '所有' ? true : data.classifications.includes(wordsType))
            .map(data => {
                return {
                    word: data.word,
                    phonetic:data.phonetic,
                    wordClass: data.wordClass,
                    translate: data.translate,
                    recordingTime: data.recordingTime,
                    recordDays: Math.ceil((Date.now() - new Date(data.recordingTime).getTime())/(1000*60*60*24)),
                    starsNum: data.starsNum
                }
            })
        return <Table columns={column} dataSource={values} bordered />
    }

    render() {
        return (
            <div className='page-max-width'>
                {this.buildTable()}
            </div>
        )
    }

    componentDidUpdate(){
        const {words} = this.props
        if(this.state.words.length===0 & words.length!==0){
            const nowWords = _.cloneDeep(words)
            this.setState({words:nowWords});
        }
    }
}

export default class WordRecord extends React.Component {

    state={
        words:[]
    }

    componentWillMount(){
        $.ajax({
            url:'/api/wordRecords/getwords'            
        }).then(data=>{
            this.setState({words:data})
        }).catch(err=>console.error(err))
    }


    render() {
        const {words} = this.state;
        console.log('word record',words)
        return (
            <div>
                <MyNavBars />
                <div className='page-max-width mx-lg-auto mx-3'>
                    <TableFilter />
                    <WordTable  words={words}/>
                </div>
            </div>
        )
    }
}