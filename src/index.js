/**
 * 提供移动端可调试的方法
 * 增加队列打印的方式
 */

const GLOBALLOGININVIEWID = 'globalLogInViewId'
const toString = Object.prototype.toString

/**
 * 将数据转换为string
 * @param {Any} data - 需要打印的数据
 * @return {String} 返回值
 */
function convertToString(data) {
  if ((typeof data === 'object' && data !== null) || Array.isArray(data)) {
    try {
      data = JSON.stringify(data)
    } catch (e) {
      const contructor = data.constructor.name || ''
      data = `${toString.call(data)} - ${contructor}`
    }
  } else {
    data = data.toString()
  }
  return data
}

/**
 * 构造关闭按钮
 * @param {DOM} parent - 父容器
 * @return {DOM} 关闭的DOM
 */
function createClose(parent) {
  const div = document.createElement('div')
  div.style.cssText = 'position:fixed;right:0;top:0;width:50px;height:50px;text-align:center;line-height:50px;font-size:20px;color:#fff;'
  div.innerText = '×'
  div.onclick = () => {
    parent.style.left = '100%'
    parent.style.overflow = 'visible'
  }
  parent.appendChild(div)
  return div
}

/**
 * 构造打开按钮
 * @param {DOM} parent - 父容器
 * @return {DOM} 关闭的DOM
 */
function createOpen(parent) {
  const div = document.createElement('div')
  div.style.cssText = 'position:absolute;left:-50px;top:50%;margin-top:-25px;width:50px;height:50px;text-align:center;line-height:50px;color:#999;font-size:24px;'
  div.innerText = '<'
  div.onclick = () => {
    parent.style.left = '0%'
    parent.style.overflow = 'auto'
  }
  parent.appendChild(div)
  return div
}

/**
 * 构建contaer的DOM结构
 * @return {DOM} div
 */
function createContainer() {
  const div = document.createElement('div')
  div.id = GLOBALLOGININVIEWID
  div.style.cssText = 'position:fixed;z-index:99999;width:100%;height:100%;padding:30px 30px;background-color:rgba(0,0,0,0.8);color:#fff;font-size:16px;top:0;left:0;transition:all 0.5s;overflow:auto;'
  createClose(div)
  createOpen(div)
  return div
}

/**
 * 类
 * @param {Object} options - 配置
 */
function LogView(options = {}) {
  this.options = options
  // 打印队列
  this.queue = []
  // 队列活跃标识
  this.active = false
  // 初始化配置并构建DOM
  this.init()
}

LogView.prototype.init = function () {
  const body = document.body
  const div = document.getElementById(GLOBALLOGININVIEWID)
  if (!body || div) {
    // 存在此DOM则返回
    return
  }
  this.container = createContainer()
  body.appendChild(this.container)
}

LogView.prototype.handleQueue = function () {
  this.active = true
  const step = index => {
    if (index < this.queue.length) {
      this.logViewData(this.queue[index]).then(() => {
        step(index + 1)
      })
    } else {
      this.active = false
    }
  }
  step(0)
}

LogView.prototype.logViewData = function (data) {
  return new Promise((resolve) => {
    const div = document.createElement('div')
    div.className = `${GLOBALLOGININVIEWID}-text`
    div.style.cssText = 'margin:20px 0;text-align:left;line-height:25px;'
    div.innerText = data.message
    this.container.appendChild(div)
    resolve()
  })
}

LogView.prototype.log = function (data) {
  this.data = convertToString(data)
  this.queue.push({
    message: this.data,
  })
  if (!this.active) {
    this.handleQueue()
  }
}

LogView.prototype.clear = function () {
  this.queue = []
  this.active = false
  let allText = this.container.querySelectorAll('.globalLogInViewId-text')
  allText = Array.prototype.slice.call(allText, 0)
  allText.forEach((text) => {
    this.container.removeChild(text)
  })
}

module.exports = {
  LogView,
}
