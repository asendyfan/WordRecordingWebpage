import React from 'react';
import $ from 'jquery';
import _ from 'lodash';
import MyNavBars from '../../component/MyNavbars';
import { Table, Button, Icon, Input, Rate, DatePicker, Layout, Popconfirm, message, Modal, Spin } from 'antd';
import "antd/dist/antd.css";
import '../../../css/word-record-table.css'
import Highlighter from 'react-highlight-words';
import TableFilter from './TableFilter';
import eventProxy from '../../utils/event-proxy';
import SideMenu from './SideMenu';

class WordTable extends React.Component {

    componentDidMount(){
        eventProxy.on('wordsTypeChange', (wordsType)=>{
            this.setState({wordsType})
        })
    }

    state = {
        searchText: '',
        wordsType:'所有单词',
        words:[],
        isTotalTransVisible:true,
        selectedRowKeys:[],
        isTotalWordVisible:true
    };
    needDeleteWord=[]

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


    getColumnDatePickerProps = (dataIndex)=>({
        filterDropdown:({
            setSelectedKeys,selectedKeys, confirm, clearFilters,
        }) => (
            <div>
                    <DatePicker.RangePicker 
                        ref={(node)=>this.RangePicker = node}
                        onChange={(dates, dateStrings) => {setSelectedKeys([dateStrings]);this.dateStrings = dateStrings}}/>
                    <Button className='ml-2' onClick={()=>{
                        this.dateStrings && this.dateStrings[0] ? confirm():clearFilters()
                    }}>ok</Button>
            </div>
        ),
        filterIcon:filtered => <Icon type="calendar" />,
        onFilter:(value, record)=> {
            const dataDate = new Date(record[dataIndex])
                .toLocaleDateString('nu-arab',{'timeZone':'Asia/Shanghai','year':'numeric','month':'2-digit','day':'2-digit'})
                .replace(/\//g,'-')
            // return ((value[0].replace(/\-/g,'/')  <= record[dataIndex]) && record[dataIndex] <= (value[1].replace(/\-/g, '/')))
            return value[0] <= dataDate && dataDate <=value[1]
        },
        onFilterDropdownVisibleChange:(visible)=>{
            if(visible){
                this.RangePicker.focus()
            }
        } 
    })
    
    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    }

    handleReset = (clearFilters) => {
        clearFilters();
        this.setState({ searchText: '' });
    }

    handleTranslateColumnVisible(e){
        const {isTotalTransVisible} = this.state
        const changeVisible = isTotalTransVisible?false:true
        this.setState({isTotalTransVisible:changeVisible});
    }

    rowSelection={
        onChange:(selectedRowKeys, selectedRows) => {
            // console.log(`selectedRowKeys: ${selectedRowKeys instanceof Array}`, 'selectedRows: ', selectedRows);
            this.setState({selectedRowKeys})
            this.needDeleteWord = selectedRows.length ?selectedRows.map(value=>value.word):[]
        }
    }

    clearSelect=()=>{
        this.setState({selectedRowKeys:[]})
    }

    buildTable(){
        const {wordsType, isTotalTransVisible, selectedRowKeys, isTotalWordVisible} = this.state
        this.rowSelection.selectedRowKeys = selectedRowKeys
        const {words} = this.props
        const column = [
            {
                title: (sortOrder)=>{
                    // console.log('sortOrder',sortOrder)
                    return <div onClick={(e)=>{e.stopPropagation();this.setState({isTotalWordVisible:isTotalWordVisible?false:true})}}>单词<Icon className='ml-1' type={`eye${!isTotalWordVisible ? '-invisible':''}`} ></Icon></div>
                },
                dataIndex: 'word',
                sorter: (a, b) => a.word.toLowerCase() > b.word.toLowerCase() ? 1 : -1,
                ...this.getColumnSearchProps('word'),
                align: 'center', 
                render:(text)=>isTotalWordVisible?text:'*****'
            },
            {
                title:'记录日期',
                dataIndex:'recordingTime',
                sorter:(a, b)=>a.recordingTime > b.recordingTime?1:-1,
                defaultSortOrder:'descend',
                ...this.getColumnDatePickerProps('recordingTime'),
                align:'center',
                render:(text)=>{
                    return new Date(text).toLocaleDateString('nu-arab',{'timeZone':'Asia/Shanghai','year':'2-digit','month':'2-digit','day':'2-digit'})
                }
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
                title: ()=><div>翻译<Icon type={isTotalTransVisible ?"eye":"eye-invisible"} className='ml-1' style={{cursor:'pointer'}} onClick={()=>this.handleTranslateColumnVisible()}/></div>,
                dataIndex: 'translate',
                align: 'center',
                render:(text)=>isTotalTransVisible?text:'*****'
            },
            {
                title: '记录天数',
                dataIndex: 'recordDays',
                align: 'center',
            },
        ]

        const values = words
            .filter(data => wordsType === '所有单词' ? true : data.classifications.includes(wordsType))
            .map(data => {
                return {
                    word: data.word,
                    phonetic:data.phonetic,
                    wordClass: data.wordClass,
                    translate: data.translate,
                    recordingTime: data.recordingTime,
                    recordDays: Math.ceil(( new Date(new Date().toLocaleDateString()).getTime() - new Date(new Date(data.recordingTime).toLocaleDateString()).getTime()  )/(1000*60*60*24) + 1 ),
                    starsNum: data.starsNum
                }
            })
        return <Table rowSelection={this.rowSelection} columns={column} dataSource={values}  />
    }

    render() {
        return (
            <div className='page-max-width'>
                {this.buildTable()}
            </div>
        )
    }

    componentDidUpdate(){
        // const {words} = this.props
        // if(this.state.words.length===0 && words.length!==0){
        //     const nowWords = _.cloneDeep(words)
        //     this.setState({words:nowWords});
        // }
    }
}

export default class WordRecord extends React.Component {

    state={
        words:[],
        searchResult:[]
    }

    componentWillMount(){
        $.ajax({
            url:'/api/wordRecords/getwords'            
        }).then(data=>{
            this.setState({words:data})
        }).catch(err=>console.error(err))
    }

    deleteWord= async ()=>{
        const that = this
        if(!this.WordTableElement.needDeleteWord.length)return message.info('请先选择')
        const deleteWordLogic = ()=>{
            const newWords = this.state.words.filter((value)=>!this.WordTableElement.needDeleteWord.includes(value.word))
    
            console.log('new words', newWords);
            this.WordTableElement.clearSelect()
    
            $.ajax({
                method:'GET',
                url:'/api/wordRecords/deletewords',
                data:{needDeleteWord:this.WordTableElement.needDeleteWord}
            }).then((words)=>{
                Modal.success({
                    title:'单词删除',
                    content:'删除成功',
                    onOk:()=>that.setState({words})
                })
            }).catch(err=>{
                Modal.error({
                    title:'删除失败',
                    content:'error:'+JSON.stringify(err),
                })
            })
        }
        Modal.confirm({
            title:'单词删除',
            content:'确定要删除单词？',
            onOk:deleteWordLogic
        })
    }

    searchWordByTypeWordOrTransfer = (searchKeys)=>{
        const {words} = this.state
        console.log('words',words)
        const searchResult = words.filter((word)=>{
            console.log(word, searchKeys, word.word.includes(searchKeys), word.translate.includes(searchKeys))
            return word.word.includes(searchKeys)||word.translate.includes(searchKeys)
        })
        console.log('search result', searchResult);
        this.setState({searchResult})
    }

    render() {
        const {words, searchResult} = this.state;
        console.log('words',words);
        const wordClassifications = words.reduce((pre, curWord)=>{
            pre['所有单词'] = pre['所有单词']===undefined?1:pre['所有单词']+1
            curWord.classifications.split(',').forEach(classification=>{
                if(!classification)return
                pre[classification] = pre[classification]===undefined?1:pre[classification]+1
            })
            return pre
        },{}) 
        return (
            <Layout className='route-min-height'>
                <SideMenu/>
                <Layout>
                    <MyNavBars/>
                    <div className='page-max-width mx-xl-5 mx-md-3 mx-1 mt-5'>
                        <div className='position-relative'>
                            <div className='d-flex justify-content-between mb-3'>
                                <TableFilter style={{zIndex:'100'}} {...{wordClassifications}} />                  
                                <div className='d-flex float-right ' style={{zIndex:'100'}}>
                                    <div className='mr-2'>
                                        <Input.Search placeholder='输入单词/中文翻译'
                                            onchange={value=>!value && this.setState({searchResult:[]})} 
                                            style={{minWidth:'14rem'}}
                                            enterButton='搜索'
                                            allowClear 
                                            onSearch={this.searchWordByTypeWordOrTransfer}/>
                                    </div>
                                    <Button type="danger" ghost onClick={()=>this.deleteWord()}>批量删除</Button>
                                </div>
                            </div>
                            <div className='position-absolute w-100 text-center' style={{top:'0px'}}>
                                <div className=' d-inline-block position-relative'  >
                                    <Button type="primary">添加单词</Button>
                                </div>
                            </div>
                        </div>
                        <WordTable  words={searchResult.length?searchResult:words} ref={(WordTableElement)=>this.WordTableElement=WordTableElement}/>
                    </div>
                </Layout>
            </Layout>
        )
    }
}