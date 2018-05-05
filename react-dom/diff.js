import React from '../react'
import {setAttribute} from './dom'
/****
vnode可以分为三种，分别为文本，原生dom，和组件（组件数组）
 ****/
export function diff(dom, vnode, container) {
	const ret = diffNode(dom, vnode)
    if (container && ret.parentNode !== container) {
        container.appendChild(ret)
    }
    return ret
}
function diffNode(dom, vnode) {
	let out = dom
	if (vnode === void 666 || vnode === null || typeof vnode === 'boolean') return
	if (typeof vnode === 'number') vnode = String(vnode)
	// 对比文本节点
	if (typeof vnode === 'string') {
		// 如果当前的dom就是文本节点，则直接更新内容
		if (dom && dom.nodeType === 3) {
			if (dom.textContent !== vnode) {
				dom.textContent = vnode
			}
		}
		// 如果dom不是文本节点，则新建一个文本节点dom，并移除掉原来的
		else {
			out = document.createTextNode(vnode)
			if (dom && dom.parentNode) {
				dom.parentNode.replaceChild(out, dom)
			}
		}
		return out
	}
	if (typeof vnode.tag === 'function') {
		return diffComponent(dom, vnode)
	}
	// 对比非文本dom节点，如果当前dom和vnode不属于同一类型的dom
	if (!dom || !isSameNodeType(dom, vnode)) {
		if(vnode.tag) {
			out = document.createElement(vnode.tag)
		}
		if (dom) {
			// 将原来的子节点移到新节点下
			Array.from(dom.childNodes).map(out.appendChild)
			if (dom.parentNode) {
				// 移除掉原来的dom对象
				dom.parentNode.replaceChild(out, dom)
			}
		}
	}
	// 对比子节点
	if (vnode.children && vnode.children.length > 0 || (out && out.childNodes && out.childNodes.length > 0)) {
	 	diffChildren(out, vnode.children)
	}
	// 对比属性
	if(out) {
		diffAttributes(out, vnode)
	}
	return out
}
// 删除dom
function removeNode(dom) {
	if (dom && dom.parentNode) {
		dom.parentNode.removeChild(dom)
	}
}
// 对比真实dom和vnode(属于dom的情况)是否是同一个类型
function isSameNodeType(dom, vnode) {
	// 如果vnode是普通字符串或者数字
	if (typeof vnode === 'string' || typeof vnode === 'number') {
		// 直接对比dom的nodeType即可
		return dom.nodeType === 3
	}
	// 如果vnode是dom标签的情况
	if (typeof vnode.tag === 'string') {
		return dom.nodeName.toLowerCase() === vnode.tag.toLowerCase()
	}
	// 剩下的情况是组件同类型比较
	return dom && dom._component && dom._component.constructor === vnode.tag
}
// 对比属性，找出节点的属性和事件监听的变化
function diffAttributes(dom, vnode) {
	// 当前dom的属性
	const domAttrs = {}
	// 虚拟dom的属性
    const vnodeAttrs = vnode.attrs
    Array.from(dom.attributes).forEach(attr => {
		domAttrs[attr.name] = attr.value
	})
    // 如果原来的属性不在新的属性当中，则将其从dom中移除
    for (let name in domAttrs) {
    	if (!(name in vnodeAttrs)) {
    		setAttribute(dom, name, void 666)
    	}
    }
    // 更新dom新的属性值
    for (let name in vnodeAttrs) {
    	if (domAttrs[name] !== vnodeAttrs[name]) {
    		setAttribute(dom, name, vnodeAttrs[name])
    	}
    }
}
// 对比子节点
function diffChildren(dom, vchildren) {
	// 得到真实dom的子节点
	const domChildren = dom.childNodes
	// 保存没有key的dom
	const children = []
	// 保存有key的dom字典
	const keyed = {}
	// 将有key的节点和没有key的节点分开
	if (domChildren.length > 0) {
		for(let i = 0; i < domChildren.length; i++) {
			const child = domChildren[i]
			const key = child.key
			if (key) {
				keyed[key] = child
			}else {
				children.push(child)
			}
		}
	}
	if (vchildren && vchildren.length > 0) {
		let min = 0
        let childrenLen = children.length
        for (let i = 0; i < vchildren.length; i++) {
        	const vchild = vchildren[i]
        	const key = vchild.key
        	let child = null
        	// 如果有key，找到对应key值的节点
        	if (key) {
        		if (keyed[key]) {
        			child = keyed[key]
        			keyed[key] = void 666
        		}
        	}
        	// 如果没有key，则优先找类型相同的节点
        	else if (min < childrenLen) {
        		for (let j = min; j < childrenLen; j++) {
        			let c = children[j]
        			if (c && isSameNodeType(c, vchild)) {
        				child = c
        				children[j] = void 666
        				if (j === childrenLen - 1) childrenLen--
        				if (j === min) min++
        				break
        			}
        		}
        	}
        	// 递归对比
        	child = diffNode(child, vchild)  
        	// 更新dom
        	const f = domChildren[i]
	        if (child && child !== dom && child !== f) {
	        	if (!f) {
	        		dom.appendChild(child)		
	        	}else if (child === f.nextSibling) {
	        		removeNode(f)
	        	}else {
					dom.insertBefore(child, f)
	        	}
	        }  	
        } // end for vchildren
	}
}
// 对比组件
function diffComponent(dom, vnode){
	let c = dom && dom._component
	let oldDom = dom
	// 如果组件类型没有变化，则重新set props
	if (c && c.constructor === vnode.tag) {
		setComponentProps(c, vnode.attrs)
		dom = c.base
	}	
	// 如果组件类型变化，则移除掉原来组件，并渲染新的组件
	else {
		if (c) {
			unmountComponent(c)
			oldDom = null
		}
		c = createComponent(vnode.tag, vnode.attrs)
		setComponentProps(c, vnode.attrs)
		dom = c.base
		if (oldDom && dom !== oldDom) {
			oldDom._component = null
			removeNode(oldDom)
		}	
	}
	return dom
}
function unmountComponent(component) {
	if (component.componentWillUnmount) {
		component.componentWillUnmount()
	}
	removeNode(component.base)
}
function createComponent(component, props) {
	let instance = null
	// class类定义组件
	if (component.prototype && component.prototype.render) {
		// 直接实例该class组件类型
		instance = new component(props)
	}
	// 函数定义组件
	else {
		instance = new React.Component(props)
		// 将instance的构造函数指向原函数本身 
		instance.constructor = component
		// 手动构造实例本身的render函数
		instance.render = () => instance.constructor(props)
	}
	return instance
}
function setComponentProps(component, props) {
	if(!component.base) {
		if (component.componentWillMount) {
			component.componentWillMount()
		}
	}
	component.props = props
	renderComponent(component)
}
export function renderComponent(component) {
    let base = null
    const renderer = component.render()
    if (component.base && component.componentWillUpdate) {
        component.componentWillUpdate(component)
    }
    base = diffNode(component.base, renderer)
    component.base = base
    base._component = component
}


