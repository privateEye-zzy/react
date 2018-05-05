// 合并短时间内的多次setState，异步更新state和完成单位时间内的一次渲染组件
import {renderComponent} from '../react-dom/diff'
// 用队列来保存每次setState的更新数据
const setStateQueue = []
// 因为同一个组件可能会多次添加到队列中，则需要单独一个队列来保存所有组件
const renderQueue = []
// 延迟方法，在一段时间内合并所有的setState，来执行flush方法
function defer(fn) {
	return Promise.resolve().then(fn)
}
// 保存每次的setState的数据和组件
export function enqueueSetState(stateChange, component) {
	// 当队列为空时候，证明是在上一次flush之后，第一次往队列里添加stateChange
	if(setStateQueue.length === 0) {
		defer(flush)
	}
	// 把当前的stateChange和对应的组件放入队列中
	setStateQueue.push({stateChange, component})
	// 如果renderQueue队列里没有当前组件，则将组件添加到队列中
	if (!renderQueue.includes(component)) {
		renderQueue.push(component)
	}
}
// 清空队列，更新state并渲染对应的组件
function flush() {
	let item = null, curComponent = null
	// 合并更新每一个state的变化
	while(item = setStateQueue.shift()) {
		// 如果没有prevState，则将当前的state作为初始的prevState
		const {stateChange, component} = item
		if (!component.prevState) {
			component.prevState = Object.assign({}, component.state)
		}
		// 如果stateChange是一个函数，将当前的prevState抛出给应用层
		if(typeof stateChange === 'function') {
			Object.assign(component.state, 
				stateChange(component.prevState,
					component.props))
		}
		// 如果stateChange是一个对象，则直接合并到setState中
		else {
			Object.assign(component.state, stateChange)
		}
		// 更新prevState为当前的state
		component.prevState = component.state
	}
	// 合并完state之后，渲染到每一个组件
	while(curComponent = renderQueue.shift()) {
		renderComponent(curComponent)
	}
}

