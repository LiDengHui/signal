// 尝试使用原生 EventTarget，如果不存在，则使用自定义实现
let BaseEventTarget: typeof EventTarget

if (typeof EventTarget === 'undefined') {
  // 如果原生 EventTarget 不存在，则使用自定义的 @dhlx/event-target 包
  const { EventTarget: CustomEventTarget } = require('@dhlx/event-target')
  BaseEventTarget = CustomEventTarget
} else {
  BaseEventTarget = EventTarget
}

export class Signal<T> extends BaseEventTarget {
  #value: T

  get value(): T {
    return this.#value
  }

  set value(value: T) {
    if (this.#value === value) return
    this.#value = value
    this.dispatchEvent(new CustomEvent('change'))
  }

  constructor(value: T) {
    super()
    this.#value = value
  }

  effect(fn: () => void): () => void {
    fn() // 立即执行副作用函数
    this.addEventListener('change', fn) // 注册副作用函数
    return () => this.removeEventListener('change', fn) // 返回用于移除监听器的函数
  }

  valueOf(): T {
    return this.#value
  }

  toString(): string {
    return String(this.#value)
  }
}

export class Computed<T> extends Signal<T> {
  private _scheduled: boolean = false // 用于标识是否已调度更新
  private _deps: Signal<any>[] // 存储依赖信号

  constructor(fn: (...args: any[]) => T, deps: Signal<any>[]) {
    super(fn(...deps.map((dep) => dep.value))) // 计算初始值
    this._deps = deps

    for (const dep of deps) {
      dep.addEventListener('change', () => this.scheduleUpdate(fn))
    }
  }

  private scheduleUpdate(fn: (...args: any[]) => T): void {
    if (!this._scheduled) {
      this._scheduled = true // 标记为已调度
      Promise.resolve().then(() => {
        this.value = fn(...this._deps.map((dep) => dep.value)) // 更新值
        this._scheduled = false // 重置标志
      })
    }
  }
}

// 工厂函数
export const signal = <T>(value: T): Signal<T> => new Signal(value)
export const computed = <T>(
  fn: (...args: any[]) => T,
  deps: Signal<any>[]
): Computed<T> => new Computed(fn, deps)
