import React from '../react'
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
export default Item