import React from 'react';
import MyNavBars from '../component/MyNavbars';
import WordRecordDemo from '../../demo/wordRecordDemo'
import { Table, Button, Icon, Input } from 'antd';
import "antd/dist/antd.css";
import Highlighter from 'react-highlight-words';

export default class Login extends React.Component {

    state = {
        searchText: '',
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
                dataIndex:'recordDays',
            },
        ]
        // const keys = ['word', 'wordClass', 'translate', 'recordingTime', 'recordDays'];
        // column.forEach((value, index)=>{
        //     value.sorter = (a, b) => a[keys[index]] - b[keys[index]]
        // })
        const values = WordRecordDemo.map(data=>{
            return {
                word:data.word,
                wordClass:data.wordClass,
                translate:data.translate,
                recordingTime:data.recordingTime,
                recordDays:1
            }
        })
        return <Table columns={column} dataSource={values} />
    }
    render(){
        return (
            <div>
                <MyNavBars/>
                {this.buildTable()}
            </div>
        )
    }
}