import React from 'react';
import $ from 'jquery';
import _ from 'lodash';
import MyNavBars from '../../component/MyNavbars';
import WordRecordDemo from '../../../demo/wordRecordDemo'
import { Table, Button, Icon, Input, Rate, DatePicker, Layout } from 'antd';
import "antd/dist/antd.css";
import '../../../css/word-record-table.css'
import Highlighter from 'react-highlight-words';
import TableFilter from './TableFilter';
import eventProxy from '../../utils/event-proxy';
import SideMenu from './SideMenu';


// class DatePickerWrapper extends React.Component{
//     constructor(props){
//         super(props);
//         this.state={
//             needOpen:false,
//             dates:[]
//         }
//         this.DateFormat = 'YYYY/MM/DD'
//         this.handleDateChange = this.handleDateChange.bind(this)
//     }
//     handleNeedOpen(){
//         this.setState({needOpen:true})
//     }
//     handleNeedClose(){
//         this.setState({needOpen:false})
//     }
//     handleDateChange(dates, dateStrings){
//         this.setState(dates)
//     }
//     clearButtonComponents = ()=> (<div style={{width:'500px'}}>
//         <button className='btn btn-link float-right border-0' onClick={()=>this.handleNeedClose()}>ok</button>
//         <button className='btn btn-link float-right border-0' onClick={()=>this.handleDateChange([])}>clear</button>
//     </div>)
//     render(){
//         const {dates} = this.state;
//         const valueProp = dates.length?{value:dates}:{}
//         return <DatePicker.RangePicker
//             onChange={this.handleDateChange} 
//             {...valueProp}
//             open={this.state.needOpen} 
//             {...this.props}
//             renderExtraFooter={()=>this.clearButtonComponents()}/>
//     }
// }

class WordTable extends React.Component {

    componentDidMount(){
        eventProxy.on('wordsTypeChange', (wordsType)=>{
            this.setState({wordsType})
        })
    }

    state = {
        searchText: '',
        wordsType:'所有',
        words:[],
        isTotalVisible:true
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
        const {isTotalVisible} = this.state
        const changeVisible = isTotalVisible?false:true
        this.setState({isTotalVisible:changeVisible});
    }

    buildTable(){
        const {wordsType, words, isTotalVisible} = this.state
        const column = [
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
                title: '单词',
                dataIndex: 'word',
                sorter: (a, b) => a.word.toLowerCase() > b.word.toLowerCase() ? 1 : -1,
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
                title: ()=><div>翻译<Icon type={isTotalVisible ?"eye":"eye-invisible"} className='ml-1' style={{cursor:'pointer'}} onClick={()=>this.handleTranslateColumnVisible()}/></div>,
                dataIndex: 'translate',
                align: 'center',
                render:(text)=>isTotalVisible?text:'*****'
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
                    recordDays: Math.ceil((Date.now() - Number(data.recordingTime))/(1000*60*60*24)),
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
        return (
            <Layout className='route-min-height'>
                <SideMenu/>
                <Layout>
                    <MyNavBars/>
                    <div className='page-max-width mx-lg-auto mx-3'>
                        <TableFilter />
                        <WordTable  words={words}/>
                    </div>
                </Layout>
            </Layout>
        )
    }
}