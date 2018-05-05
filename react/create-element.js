import Component from './component.js'
function createElement(tag, attrs, ...children) {
	children = flatten(children)
	attrs = attrs || {}
    return {tag, attrs, children, key: attrs.key || null}
}
// 将多维数组转化为一维数组
const flatten = arr => arr.reduce((acc, val) => 
	acc.concat(Array.isArray(val)? flatten(val) : val), []
)
export default createElement