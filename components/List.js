import React from '../react'
import Item from './Item'
class List extends React.Component {
	constructor(props) {
        super(props)
        this.state = {
        	list: ['React', 'Vue', 'AngularJS']
        }
    }
	componentWillMount() {
		console.log('List componentWillMount')
	}
	// 测试局部更新数组的第一项字面量
	changeOneItem() {
		this.state.list[0] = Math.random().toString(36).substr(2)
		this.setState({list: this.state.list})
	}
	// 测试添加数组项
	addItem(){
		this.state.list.push(Math.random().toString(36).substr(2))
		this.setState({list: this.state.list})
	}
	// 测试覆盖更新整个数组
	updateAllItem(){
		this.state.list = []
		for(let i = 0; i < 4; i++) {
			this.state.list.push(Math.random().toString(36).substr(2))
		}
		this.setState({list: this.state.list})
	}
	// 测试删除数组的第二项
	deleteItem(){
		this.state.list.splice(1, 1)
		this.setState({list: this.state.list})
	}
    render() {
    	const list = this.state.list.map(item => <Item name={item}></Item>)
        return (
            <div>
            	{list}
            	<dl>
            		<button className='btn' onClick={e => {this.addItem()}}>添加列表</button>
	            	<button className='btn' onClick={e => {this.deleteItem()}}>删除列表第二项</button>
	            	<button className='btn' onClick={e => {this.changeOneItem()}}>更新列表第一项字面量</button>
	            	<button className='btn' onClick={e => {this.updateAllItem()}}>更新整个列表</button>
            	</dl>
            </div>
        )
    }
}
export default List