import './css/index.css'
import React from './react'
import ReactDOM from './react-dom'
class Item extends React.Component {
	constructor(props) {
        super(props)
        this.state = {
        	num: 1
        }
    }
	componentWillUpdate(component) {
		console.log('Item componentWillUpdate')
	}
	clickItem() {
		for (let i = 0; i < 100; i++) {
			this.setState({num: this.state.num + 1})
//			this.setState(prevState => {
//				console.log(prevState.num)
//				return {num: prevState.num + 1}
//			})
		}
	}
	render() {
		return (<h3 className='item' onClick={() => this.clickItem()}>Hello, Click {this.props.name}{this.state.num}</h3>)
	}
}
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
	changeOneItem() {
		this.state.list[0] = Math.random().toString(36).substr(2)
		this.setState({list: this.state.list})
	}
	addItem(){
		this.state.list.push(Math.random().toString(36).substr(2))
		this.setState({list: this.state.list})
	}
	updateAllItem(){
		this.state.list = []
		for(let i = 0; i < 4; i++) {
			this.state.list.push(Math.random().toString(36).substr(2))
		}
		this.setState({list: this.state.list})
	}
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
            		<button className='btn' onClick={() => {this.addItem()}}>添加列表</button>
	            	<button className='btn' onClick={() => {this.deleteItem()}}>删除列表第二项</button>
	            	<button className='btn' onClick={() => {this.changeOneItem()}}>更新列表第一项字面量</button>
	            	<button className='btn' onClick={() => {this.updateAllItem()}}>更新整个列表</button>
            	</dl>
            </div>
        )
    }
}
ReactDOM.render(
	<List></List>,
	document.getElementById('app')
)
	