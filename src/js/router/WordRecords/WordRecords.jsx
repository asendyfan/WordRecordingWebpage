import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { Table, Button, Icon, Input, Rate, DatePicker, Layout, message, Modal, Popconfirm, Dropdown, Menu, Select, Tooltip, List, Form } from 'antd';
import {getCookie} from '../../utils/get-cookie'
import Highlighter from 'react-highlight-words';
import TableFilter from '../../component/TableFilter';
import eventProxy from '../../utils/event-proxy';
import SideMenu from '../../component/SideMenu';
import WrappedAddWordFormModal from '../../component/AddWordForm';
import ClassificationsSelect from '../../component/ClassificationsSelect';
import {cloneDeep} from 'lodash';
import styles from './index.module.scss'

class WordTable extends React.Component {

    componentDidMount(){
        eventProxy.on('wordsTypeChange', (wordsType)=>{
            this.setState({wordsType})
        })
        eventProxy.on('classifications',(classifications)=>this.classifications = classifications)
        window.onbeforeunload = ()=>{
            // console.log('changeStarNum', this.changeStarNum,Object.keys(this.changeStarNum))
            if(Object.keys(this.changeStarNum).length>0){
                $.ajax({
                    method:'POST',
                    url:'api/wordRecords/setStars',
                    data:{changeStarNum:JSON.stringify(this.changeStarNum)}
                })
            }
        }
        this.timeId = setInterval(() => {
            if(Object.keys(this.changeStarNum).length){
                let cloneChangeStarNum = cloneDeep(this.changeStarNum)
                $.ajax({
                    method:'POST',
                    url:'api/wordRecords/setStars',
                    data:{changeStarNum:JSON.stringify(cloneChangeStarNum)}
                }).then(()=>{
                    for(const delKey in cloneChangeStarNum){
                        if(this.changeStarNum[delKey] === cloneChangeStarNum[delKey])
                            delete this.changeStarNum[delKey]
                    }
                    cloneChangeStarNum = null;
                })
            }
        }, (1000*60*20));
    }

    state = {
        searchText: '',
        wordsType:'所有单词',
        words:[],
        isTotalTransVisible:true,
        selectedRowKeys:[],
        isTotalWordVisible:true,
        editingKey:'',
    };
    needDeleteWord=[]
    user = getCookie('user')

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

    isEditing=(record)=>{
        // console.log('isEditing',record)
        return record.key === this.state.editingKey
    }
    save=(data)=>{
        this.props.setWord(data)
        this.setState({editingKey:''})
    }
    cancel=(key)=>{
        console.log('cancel')
        this.setState({editingKey:''})
    }
    edit=(key)=>{
        console.log('edit',key)
        this.setState({editingKey:key})
    }
    editClassifications = (record)=>{
        console.log((record))
        Modal.confirm({
            title:'单词分类编辑',
            icon:<Icon className='text-primary' type="info-circle" />,
            content:<ClassificationsSelect 
                defaultValue={record.classifications.split(',')}
                classifications={this.classifications} 
                ref={(ele)=>this.ClassificationsSelect = ele}/>,
            onOk:()=>this.props.setWord({word:record.word,classifications:this.ClassificationsSelect.getSpecifiedClassifications()})
        })
    }

    addEditColumn = (column, values)=>{
        column.push({
            title: '操作',
            dataIndex: 'operation',
            align: 'center',
            render: (text, record)=> {
                const editable = this.isEditing(record);
                const operateMenu = (
                    <Menu>
                        <Menu.Item key='编辑'>
                            <a className='text-primary' onClick = {()=>this.edit(record.key)}>编辑</a>
                        </Menu.Item >
                        <Menu.Item key='删除'>
                            <a className='text-primary' onClick = {()=>this.props.deleteWordByOperation(record.key)}>删除</a>
                        </Menu.Item>
                        <Menu.Item key='分类'>
                            <a className='text-primary' onClick = {()=>this.editClassifications(record)}>分类</a>
                        </Menu.Item>
                    </Menu>
                )
                return (
                    <div>
                        {editable?(
                            <span>
                                <a className={styles.savingButton} href='javascript:;' onClick={()=>{
                                    this.save({
                                        word:this.editWordElement.state.value.trim(),
                                        phonetic:this.editPhoneticElement.state.value.trim(),
                                        translate:this.editTranslateElement.textAreaRef.value.trim(),
                                    })
                                    }}>保存</a>
                                <Popconfirm
                                    title='您确定取消吗？'
                                    onConfirm={()=>this.cancel(record.key)}>
                                    <a className='text-primary'>取消</a>
                                </Popconfirm>
                            </span>
                        ):(
                            <Dropdown overlay={operateMenu}><a className="ant-dropdown-link" href="#">操作<Icon type='down'/></a></Dropdown>
                        )}
                    </div>
                )
            }
        })
    }
    changeStarNum={}//单词星星数量变化，就存储

    buildTable(){
        const {wordsType, isTotalTransVisible, selectedRowKeys, isTotalWordVisible} = this.state
        this.rowSelection.selectedRowKeys = selectedRowKeys
        const {words} = this.props
        const column = [
            {
                title: ()=>{
                    return <div onClick={(e)=>{e.stopPropagation();this.setState({isTotalWordVisible:isTotalWordVisible?false:true})}}>单词<Icon className='ml-1' type={`eye${!isTotalWordVisible ? '-invisible':''}`} ></Icon></div>
                },
                dataIndex: 'word',
                sorter: (a, b) => a.word.toLowerCase() > b.word.toLowerCase() ? 1 : -1,
                ...this.getColumnSearchProps('word'),
                align: 'center', 
                render:(text, record)=>this.isEditing(record)?<Input style={{width:'9rem'}} defaultValue={text} ref={(ele)=>this.editWordElement=ele}/>:<div className='font-weight-bold font-italic' style={{size:'1.2rem'}}>{text}</div>,
            },
            {
                title:'熟练度',
                dataIndex: 'starsNum',
                render: (value, row) => <Rate defaultValue={value} onChange={(starNums)=>{this.changeStarNum[row.word] = starNums}} allowClear={true} />,
                sorter: (a, b) => {
                    const aNum = this.changeStarNum[a.word]?this.changeStarNum[a.word]:a.starsNum
                    const bNum = this.changeStarNum[b.word]?this.changeStarNum[b.word]:b.starsNum
                    return aNum > bNum ? 1 : -1},
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
                onFilter: (value, record) =>(this.changeStarNum[record.word]?this.changeStarNum[record.word]:record.starsNum) === Number(value),
                align: 'center',
            },
            {
                title:'发音',
                dataIndex:'phonetic',
                align:'center',
                render:(text, record)=>this.isEditing(record)?<Input style={{width:'11rem'}} defaultValue = {text} ref={ele=>this.editPhoneticElement = ele}/>:text,
            },
            {
                title: ()=><div>翻译<Icon type={isTotalTransVisible ?"eye":"eye-invisible"} className='ml-1' style={{cursor:'pointer'}} onClick={()=>this.handleTranslateColumnVisible()}/></div>,
                dataIndex: 'translate',
                align: 'left',
                className:'column-max-width showEllipsis',
                render:(text, record)=>{return this.isEditing(record)?
                    <Input.TextArea defaultValue={text} autosize={{minRows:1, maxRows:6}} ref={(ele)=>this.editTranslateElement=ele}/>:
                    <Tooltip placement="top" title={<List size='small' style={{color:'white'}} dataSource={text && text.toString().split('\n')} renderItem={item=>(<List.Item>{item}</List.Item>)}/>}>
                        {text && text.toString().split('\n').map((value, index, array)=>{
                            if(index>2)return
                            if(index === 0)return <span key={value}>{value}<br/></span>
                            if(index === 1) return <span key={value}>{value}</span>
                            if(index === 2) return <span key='...'>.....</span>
                        })}
                    </Tooltip>},
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
                title: '记录天数',
                dataIndex: 'recordDays',
                align: 'center',
            }
        ]
        const values = words
            .filter(data => wordsType === '所有单词' ? true : data.classifications && data.classifications.includes(wordsType))
            .map(data => {
                return {
                    key:data.word,
                    word: isTotalWordVisible?data.word:'*****',
                    phonetic:data.phonetic,
                    wordClass: data.wordClass,
                    translate: isTotalTransVisible?data.translate:'*****',
                    recordingTime: data.recordingTime,
                    recordDays: Math.ceil(( new Date(new Date().toLocaleDateString()).getTime() - new Date(new Date(data.recordingTime).toLocaleDateString()).getTime()  )/(1000*60*60*24) + 1 ),
                    starsNum: data.starsNum,
                    classifications:data.classifications,
                }
            })
        if(this.user)this.addEditColumn(column, values)
        return <Table rowSelection={this.rowSelection} columns={column} dataSource={values}  />
    }

    render() {
        return (
            <div>
                {this.buildTable()}
            </div>
        )
    }
    componentWillUnmount(){
        clearInterval(this.timeId)
    }
}

export default class WordRecord extends React.Component {

    state={
        words:[],
        searchResult:[],
    }

    componentWillMount(){
        this.getWord()
        eventProxy.on('classifications',(classifications)=>this.classifications = classifications)
    }

    getChildContext(){
        return {
            onSetWord: this.setWord,
            onGetWord: this.getWord,
            ongetClassifications: this.getClassifications,
        }
    }

    getClassifications=()=>{
        return this.classifications
    }

    getWord = ()=>{
        $.ajax({
            url:'/api/wordRecords/getwords'            
        }).then(data=>{
            // this.wordsStarNum = data.reduce(preObj, curWord=>{
            //     preObj[word.word] = word.starsNum
            //     return preObj
            // },{})
            this.setState({words:data})
        }).catch(err=>console.error(err))
    }

    wordSetState = (words)=>{
        this.setState(words)
    }

    setWord=(data)=>{
        return $.ajax({
            url:'api/wordRecords/setword',
            data:data
        }).then(()=>{
            this.getWord()
        }).catch(err=>{
            console.error(err);
            if(err.status==403){
                Modal.error({
                    title:'无效权限',
                    content:'请先登录'
                })
                throw new Error(403)
            }
        })
    }

    deleteWordByOperation = (needDeleteWord)=>{
        const deleteWordLogic = ()=>{
            this.deleteWordRequest([needDeleteWord])
        }
        Modal.confirm({
            title:'单词删除',
            content:'确定要删除单词？',
            onOk:deleteWordLogic
        })
    }

    deleteWordBySelect = ()=>{
        if(!this.WordTableElement.needDeleteWord.length)return message.info('请先选择')
        const deleteWordLogic = ()=>{
            this.WordTableElement.clearSelect()
            this.deleteWordRequest(this.WordTableElement.needDeleteWord)
        }
        Modal.confirm({
            title:'单词删除',
            content:'确定要删除单词？',
            onOk:deleteWordLogic
        })
    }

    deleteWordRequest = (needDeleteWord)=>{
        $.ajax({
            method:'GET',
            url:'/api/wordRecords/deletewords',
            data:{needDeleteWord:needDeleteWord}
        }).then((words)=>{
            Modal.success({
                title:'单词删除',
                content:'删除成功',
                onOk:()=>{console.log('删除成功',words);this.setState({words});this.WordTableElement.needDeleteWord =[]}
            })
        }).catch(err=>{
            if(err.status===403){
                Modal.error({
                    title:'无效权限',
                    content:'请先登录'
                })
            }
            else Modal.error({
                title:'删除失败',
                content:'error:'+JSON.stringify(err),
            })
        })
    }

    searchWordByTypeWordOrTransfer = (searchKeys)=>{
        const {words} = this.state
        const searchResult = words.filter((word)=>{
            console.log(word, searchKeys, word.word.includes(searchKeys), word.translate.includes(searchKeys))
            return word.word.includes(searchKeys)||word.translate.includes(searchKeys)
        })
        this.setState({searchResult})
    }

    render() {
        const {words, searchResult} = this.state;
        console.log('words',words);
        const wordClassifications = words.reduce((pre, curWord)=>{//记录每个分类的次数
            pre['所有单词'] = pre['所有单词']===undefined?1:pre['所有单词']+1
            curWord.classifications && curWord.classifications.split(',').forEach(classification=>{
                if(!classification)return
                pre[classification] = pre[classification]===undefined?1:pre[classification]+1
            })
            return pre
        },{}) 
        return (
            <Layout className='route-min-height'>
                <SideMenu history={this.props.history} />
                <Layout>
                    <div className={`page-max-width ${styles.main}`}>
                        <div className={styles.toolBar}>
                            <div className={styles.toolBarWrapper}>
                                <TableFilter style={{ zIndex: '100' }} {...{ wordClassifications }} />
                                <div className={styles.toolBarRight} style={{ zIndex: '100' }}>
                                    <div className={styles.search}>
                                        <Input.Search placeholder='输入单词/中文翻译'
                                            onChange={value => !value && this.setState({ searchResult: [] })}
                                            style={{ minWidth: '14rem' }}
                                            enterButton='搜索'
                                            allowClear
                                            onSearch={this.searchWordByTypeWordOrTransfer} />
                                    </div>
                                    <Button type="danger" ghost onClick={() => this.deleteWordBySelect()}>批量删除</Button>
                                </div>
                            </div>
                            <div className={styles.toolBarCenter}>
                                <div>
                                    <Button type="primary" onClick={() => this.WrappedAddWordFormModal.modalVisible()}>添加单词</Button>
                                    <WrappedAddWordFormModal ref={ele => this.WrappedAddWordFormModal = ele} />
                                </div>
                            </div>
                        </div>
                        <WordTable
                            words={searchResult.length ? searchResult : words}
                            ref={(WordTableElement) => this.WordTableElement = WordTableElement}
                            deleteWordByOperation={this.deleteWordByOperation}
                            setWord={this.setWord} />
                    </div>
                </Layout>
            </Layout>
        )
    }
}

WordRecord.childContextTypes = {
    onSetWord: PropTypes.func,
    onGetWord: PropTypes.func,
    ongetClassifications: PropTypes.func,
}