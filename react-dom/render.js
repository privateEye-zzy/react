import {diff} from './diff'
export function render(vnode, container, dom) {
    return diff(dom, vnode, container)
}
