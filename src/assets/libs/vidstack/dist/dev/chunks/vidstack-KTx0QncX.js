const SCOPE = Symbol("SCOPE" );

let scheduledEffects = false, runningEffects = false, currentScope = null, currentObserver = null, currentObservers = null, currentObserversIndex = 0, effects = [], defaultContext = {};
const NOOP = () => {
}, STATE_CLEAN = 0, STATE_CHECK = 1, STATE_DIRTY = 2, STATE_DISPOSED = 3;
function flushEffects() {
  scheduledEffects = true;
  queueMicrotask(runEffects);
}
function runEffects() {
  if (!effects.length) {
    scheduledEffects = false;
    return;
  }
  runningEffects = true;
  for (let i = 0; i < effects.length; i++) {
    if (effects[i]._state !== STATE_CLEAN)
      runTop(effects[i]);
  }
  effects = [];
  scheduledEffects = false;
  runningEffects = false;
}
function runTop(node) {
  let ancestors = [node];
  while (node = node[SCOPE]) {
    if (node._effect && node._state !== STATE_CLEAN)
      ancestors.push(node);
  }
  for (let i = ancestors.length - 1; i >= 0; i--) {
    updateCheck(ancestors[i]);
  }
}
function root(init) {
  const scope = createScope();
  return compute(scope, !init.length ? init : init.bind(null, dispose.bind(scope)), null);
}
function peek(fn) {
  return compute(currentScope, fn, null);
}
function untrack(fn) {
  return compute(null, fn, null);
}
function tick() {
  if (!runningEffects)
    runEffects();
}
function getScope() {
  return currentScope;
}
function scoped(run, scope) {
  try {
    return compute(scope, run, null);
  } catch (error) {
    handleError(scope, error);
    return;
  }
}
function getContext(key, scope = currentScope) {
  return scope?._context[key];
}
function setContext(key, value, scope = currentScope) {
  if (scope)
    scope._context = { ...scope._context, [key]: value };
}
function onDispose(disposable) {
  if (!disposable || !currentScope)
    return disposable || NOOP;
  const node = currentScope;
  if (!node._disposal) {
    node._disposal = disposable;
  } else if (Array.isArray(node._disposal)) {
    node._disposal.push(disposable);
  } else {
    node._disposal = [node._disposal, disposable];
  }
  return function removeDispose() {
    if (node._state === STATE_DISPOSED)
      return;
    disposable.call(null);
    if (isFunction$1(node._disposal)) {
      node._disposal = null;
    } else if (Array.isArray(node._disposal)) {
      node._disposal.splice(node._disposal.indexOf(disposable), 1);
    }
  };
}
function dispose(self = true) {
  if (this._state === STATE_DISPOSED)
    return;
  let head = self ? this._prevSibling || this[SCOPE] : this, current = this._nextSibling, next = null;
  while (current && current[SCOPE] === this) {
    dispose.call(current, true);
    disposeNode(current);
    next = current._nextSibling;
    current._nextSibling = null;
    current = next;
  }
  if (self)
    disposeNode(this);
  if (current)
    current._prevSibling = !self ? this : this._prevSibling;
  if (head)
    head._nextSibling = current;
}
function disposeNode(node) {
  node._state = STATE_DISPOSED;
  if (node._disposal)
    emptyDisposal(node);
  if (node._sources)
    removeSourceObservers(node, 0);
  if (node._prevSibling)
    node._prevSibling._nextSibling = null;
  node[SCOPE] = null;
  node._sources = null;
  node._observers = null;
  node._prevSibling = null;
  node._context = defaultContext;
  node._handlers = null;
}
function emptyDisposal(scope) {
  try {
    if (Array.isArray(scope._disposal)) {
      for (let i = scope._disposal.length - 1; i >= 0; i--) {
        const callable = scope._disposal[i];
        callable.call(callable);
      }
    } else {
      scope._disposal.call(scope._disposal);
    }
    scope._disposal = null;
  } catch (error) {
    handleError(scope, error);
  }
}
function compute(scope, compute2, observer) {
  const prevScope = currentScope, prevObserver = currentObserver;
  currentScope = scope;
  currentObserver = observer;
  try {
    return compute2.call(scope);
  } finally {
    currentScope = prevScope;
    currentObserver = prevObserver;
  }
}
function handleError(scope, error) {
  if (!scope || !scope._handlers)
    throw error;
  let i = 0, len = scope._handlers.length, coercedError = coerceError(error);
  for (i = 0; i < len; i++) {
    try {
      scope._handlers[i](coercedError);
      break;
    } catch (error2) {
      coercedError = coerceError(error2);
    }
  }
  if (i === len)
    throw coercedError;
}
function coerceError(error) {
  return error instanceof Error ? error : Error(JSON.stringify(error));
}
function read() {
  if (this._state === STATE_DISPOSED)
    return this._value;
  if (currentObserver && !this._effect) {
    if (!currentObservers && currentObserver._sources && currentObserver._sources[currentObserversIndex] == this) {
      currentObserversIndex++;
    } else if (!currentObservers)
      currentObservers = [this];
    else
      currentObservers.push(this);
  }
  if (this._compute)
    updateCheck(this);
  return this._value;
}
function write(newValue) {
  const value = isFunction$1(newValue) ? newValue(this._value) : newValue;
  if (this._changed(this._value, value)) {
    this._value = value;
    if (this._observers) {
      for (let i = 0; i < this._observers.length; i++) {
        notify(this._observers[i], STATE_DIRTY);
      }
    }
  }
  return this._value;
}
const ScopeNode = function Scope() {
  this[SCOPE] = null;
  this._nextSibling = null;
  this._prevSibling = null;
  if (currentScope)
    currentScope.append(this);
};
const ScopeProto = ScopeNode.prototype;
ScopeProto._context = defaultContext;
ScopeProto._handlers = null;
ScopeProto._compute = null;
ScopeProto._disposal = null;
ScopeProto.append = function(child) {
  child[SCOPE] = this;
  child._prevSibling = this;
  if (this._nextSibling) {
    if (child._nextSibling) {
      let tail = child._nextSibling;
      while (tail._nextSibling)
        tail = tail._nextSibling;
      tail._nextSibling = this._nextSibling;
      this._nextSibling._prevSibling = tail;
    } else {
      child._nextSibling = this._nextSibling;
      this._nextSibling._prevSibling = child;
    }
  }
  this._nextSibling = child;
  child._context = child._context === defaultContext ? this._context : { ...this._context, ...child._context };
  if (this._handlers) {
    child._handlers = !child._handlers ? this._handlers : [...child._handlers, ...this._handlers];
  }
};
ScopeProto.dispose = function() {
  dispose.call(this);
};
function createScope() {
  return new ScopeNode();
}
const ComputeNode = function Computation(initialValue, compute2, options) {
  ScopeNode.call(this);
  this._state = compute2 ? STATE_DIRTY : STATE_CLEAN;
  this._init = false;
  this._effect = false;
  this._sources = null;
  this._observers = null;
  this._value = initialValue;
  this.id = options?.id ?? (this._compute ? "computed" : "signal");
  if (compute2)
    this._compute = compute2;
  if (options && options.dirty)
    this._changed = options.dirty;
};
const ComputeProto = ComputeNode.prototype;
Object.setPrototypeOf(ComputeProto, ScopeProto);
ComputeProto._changed = isNotEqual;
ComputeProto.call = read;
function createComputation(initialValue, compute2, options) {
  return new ComputeNode(initialValue, compute2, options);
}
function isNotEqual(a, b) {
  return a !== b;
}
function isFunction$1(value) {
  return typeof value === "function";
}
function updateCheck(node) {
  if (node._state === STATE_CHECK) {
    for (let i = 0; i < node._sources.length; i++) {
      updateCheck(node._sources[i]);
      if (node._state === STATE_DIRTY) {
        break;
      }
    }
  }
  if (node._state === STATE_DIRTY)
    update(node);
  else
    node._state = STATE_CLEAN;
}
function cleanup(node) {
  if (node._nextSibling && node._nextSibling[SCOPE] === node)
    dispose.call(node, false);
  if (node._disposal)
    emptyDisposal(node);
  node._handlers = node[SCOPE] ? node[SCOPE]._handlers : null;
}
function update(node) {
  let prevObservers = currentObservers, prevObserversIndex = currentObserversIndex;
  currentObservers = null;
  currentObserversIndex = 0;
  try {
    cleanup(node);
    const result = compute(node, node._compute, node);
    if (currentObservers) {
      if (node._sources)
        removeSourceObservers(node, currentObserversIndex);
      if (node._sources && currentObserversIndex > 0) {
        node._sources.length = currentObserversIndex + currentObservers.length;
        for (let i = 0; i < currentObservers.length; i++) {
          node._sources[currentObserversIndex + i] = currentObservers[i];
        }
      } else {
        node._sources = currentObservers;
      }
      let source;
      for (let i = currentObserversIndex; i < node._sources.length; i++) {
        source = node._sources[i];
        if (!source._observers)
          source._observers = [node];
        else
          source._observers.push(node);
      }
    } else if (node._sources && currentObserversIndex < node._sources.length) {
      removeSourceObservers(node, currentObserversIndex);
      node._sources.length = currentObserversIndex;
    }
    if (!node._effect && node._init) {
      write.call(node, result);
    } else {
      node._value = result;
      node._init = true;
    }
  } catch (error) {
    if (!node._init && typeof node._value === "undefined") {
      console.error(
        `computed \`${node.id}\` threw error during first run, this can be fatal.

Solutions:

1. Set the \`initial\` option to silence this error`,
        "\n2. Or, use an `effect` if the return value is not being used",
        "\n\n",
        error
      );
    }
    handleError(node, error);
    if (node._state === STATE_DIRTY) {
      cleanup(node);
      if (node._sources)
        removeSourceObservers(node, 0);
    }
    return;
  }
  currentObservers = prevObservers;
  currentObserversIndex = prevObserversIndex;
  node._state = STATE_CLEAN;
}
function notify(node, state) {
  if (node._state >= state)
    return;
  if (node._effect && node._state === STATE_CLEAN) {
    effects.push(node);
    if (!scheduledEffects)
      flushEffects();
  }
  node._state = state;
  if (node._observers) {
    for (let i = 0; i < node._observers.length; i++) {
      notify(node._observers[i], STATE_CHECK);
    }
  }
}
function removeSourceObservers(node, index) {
  let source, swap;
  for (let i = index; i < node._sources.length; i++) {
    source = node._sources[i];
    if (source._observers) {
      swap = source._observers.indexOf(node);
      source._observers[swap] = source._observers[source._observers.length - 1];
      source._observers.pop();
    }
  }
}

function noop(...args) {
}
function isNull(value) {
  return value === null;
}
function isUndefined(value) {
  return typeof value === "undefined";
}
function isNil(value) {
  return isNull(value) || isUndefined(value);
}
function isObject(value) {
  return value?.constructor === Object;
}
function isNumber(value) {
  return typeof value === "number" && !Number.isNaN(value);
}
function isString(value) {
  return typeof value === "string";
}
function isBoolean(value) {
  return typeof value === "boolean";
}
function isFunction(value) {
  return typeof value === "function";
}
function isArray(value) {
  return Array.isArray(value);
}

var _a$1;
const EVENT = Event, DOM_EVENT = Symbol("DOM_EVENT");
class DOMEvent extends EVENT {
  constructor(type, ...init) {
    super(type, init[0]);
    this[_a$1] = true;
    /**
     * The event trigger chain.
     */
    this.triggers = new EventTriggers();
    this.detail = init[0]?.detail;
    const trigger = init[0]?.trigger;
    if (trigger)
      this.triggers.add(trigger);
  }
  static {
    _a$1 = DOM_EVENT;
  }
  /**
   * The preceding event that was responsible for this event being fired.
   */
  get trigger() {
    return this.triggers.source;
  }
  /**
   * The origin event that lead to this event being fired.
   */
  get originEvent() {
    return this.triggers.origin;
  }
  /**
   * Whether the origin event was triggered by the user.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted}
   */
  get isOriginTrusted() {
    return this.triggers.origin?.isTrusted ?? false;
  }
}
class EventTriggers {
  constructor() {
    this.chain = [];
  }
  get source() {
    return this.chain[0];
  }
  get origin() {
    return this.chain[this.chain.length - 1];
  }
  /**
   * Appends the event to the end of the chain.
   */
  add(event) {
    this.chain.push(event);
    if (isDOMEvent(event)) {
      this.chain.push(...event.triggers);
    }
  }
  /**
   * Removes the event from the chain and returns it (if found).
   */
  remove(event) {
    return this.chain.splice(this.chain.indexOf(event), 1)[0];
  }
  /**
   * Returns whether the chain contains the given `event`.
   */
  has(event) {
    return this.chain.some((e) => e === event);
  }
  /**
   * Returns whether the chain contains the given event type.
   */
  hasType(type) {
    return !!this.findType(type);
  }
  /**
   * Returns the first event with the given `type` found in the chain.
   */
  findType(type) {
    return this.chain.find((e) => e.type === type);
  }
  /**
   * Walks an event chain on a given `event`, and invokes the given `callback` for each trigger event.
   */
  walk(callback) {
    for (const event of this.chain) {
      const returnValue = callback(event);
      if (returnValue)
        return [event, returnValue];
    }
  }
  [Symbol.iterator]() {
    return this.chain.values();
  }
}
function isDOMEvent(event) {
  return !!event?.[DOM_EVENT];
}
function walkTriggerEventChain(event, callback) {
  if (!isDOMEvent(event))
    return;
  return event.triggers.walk(callback);
}
function findTriggerEvent(event, type) {
  return isDOMEvent(event) ? event.triggers.findType(type) : void 0;
}
function hasTriggerEvent(event, type) {
  return !!findTriggerEvent(event, type);
}
function appendTriggerEvent(event, trigger) {
  if (trigger)
    event.triggers.add(trigger);
}
class EventsTarget extends EventTarget {
  addEventListener(type, callback, options) {
    return super.addEventListener(type, callback, options);
  }
  removeEventListener(type, callback, options) {
    return super.removeEventListener(type, callback, options);
  }
}
function listenEvent(target, type, handler, options) {
  target.addEventListener(type, handler, options);
  return onDispose(() => target.removeEventListener(type, handler, options));
}
function isPointerEvent(event) {
  return !!event?.type.startsWith("pointer");
}
function isTouchEvent(event) {
  return !!event?.type.startsWith("touch");
}
function isMouseEvent(event) {
  return /^(click|mouse)/.test(event?.type ?? "");
}
function isKeyboardEvent(event) {
  return !!event?.type.startsWith("key");
}
function isKeyboardClick(event) {
  return isKeyboardEvent(event) && (event.key === "Enter" || event.key === " ");
}
function setAttribute(host, name, value) {
  if (!host)
    return;
  else if (!value && value !== "" && value !== 0) {
    host.removeAttribute(name);
  } else {
    const attrValue = value === true ? "" : value + "";
    if (host.getAttribute(name) !== attrValue) {
      host.setAttribute(name, attrValue);
    }
  }
}
function setStyle(host, property, value) {
  if (!host)
    return;
  else if (!value && value !== 0) {
    host.style.removeProperty(property);
  } else {
    host.style.setProperty(property, value + "");
  }
}

function signal(initialValue, options) {
  const node = createComputation(initialValue, null, options), signal2 = read.bind(node);
  signal2.node = node;
  signal2[SCOPE] = true;
  signal2.set = write.bind(node);
  return signal2;
}
function isReadSignal(fn) {
  return isFunction$1(fn) && SCOPE in fn;
}
function computed(compute, options) {
  const node = createComputation(
    options?.initial,
    compute,
    options
  ), signal2 = read.bind(node);
  signal2[SCOPE] = true;
  signal2.node = node;
  return signal2;
}
function effect$1(effect2, options) {
  const signal2 = createComputation(
    null,
    function runEffect() {
      let effectResult = effect2();
      isFunction$1(effectResult) && onDispose(effectResult);
      return null;
    },
    { id: options?.id ?? "effect" } 
  );
  signal2._effect = true;
  update(signal2);
  {
    return function stopEffect() {
      dispose.call(signal2, true);
    };
  }
}
function isWriteSignal(fn) {
  return isReadSignal(fn) && "set" in fn;
}

const effect = effect$1;

function createContext(provide) {
  return { id: Symbol(), provide };
}
function provideContext(context, value, scope = getScope()) {
  if (!scope) {
    throw Error("[maverick] attempting to provide context outside root");
  }
  const hasProvidedValue = !isUndefined(value);
  if (!hasProvidedValue && !context.provide) {
    throw Error("[maverick] context can not be provided without a value or `provide` function");
  }
  setContext(context.id, hasProvidedValue ? value : context.provide?.(), scope);
}
function useContext(context) {
  const value = getContext(context.id);
  if (isUndefined(value)) {
    throw Error("[maverick] attempting to use context without providing first");
  }
  return value;
}
function hasProvidedContext(context) {
  return !isUndefined(getContext(context.id));
}

const PROPS = /* @__PURE__ */ Symbol("PROPS" );
const METHODS = /* @__PURE__ */ Symbol("METHODS" );
const ON_DISPATCH = /* @__PURE__ */ Symbol("ON_DISPATCH" );

var _a;
const EMPTY_PROPS = {};
class Instance {
  constructor(Component, scope, init) {
    /* @internal */
    this[_a] = null;
    this.$el = signal(null);
    this.a = null;
    this.d = null;
    this.f = null;
    this.g = null;
    this.e = null;
    this.o = false;
    this.i = EMPTY_PROPS;
    this.b = null;
    this.c = null;
    this.l = [];
    this.m = [];
    this.j = [];
    this.n = [];
    this.d = scope;
    if (init?.scope)
      init.scope.append(scope);
    let stateFactory = Component.state, props = Component.props;
    if (stateFactory) {
      this.h = stateFactory.create();
      this.k = new Proxy(this.h, {
        get: (_, prop) => this.h[prop]()
      });
      provideContext(stateFactory, this.h);
    }
    if (props) {
      this.i = createInstanceProps(props);
      if (init?.props) {
        for (const prop of Object.keys(init.props)) {
          this.i[prop]?.set(init.props[prop]);
        }
      }
    }
    onDispose(this.p.bind(this));
  }
  static {
    _a = ON_DISPATCH;
  }
  w() {
    scoped(() => {
      for (const callback of this.l)
        callback();
    }, this.d);
  }
  x(el) {
    if (this.a)
      return;
    this.a = el;
    this.$el.set(el);
    {
      el.$$COMPONENT_NAME = this.e?.constructor.name;
    }
    scoped(() => {
      this.f = createScope();
      scoped(() => {
        for (const callback of this.m)
          callback(this.a);
        this.q();
        this.r();
      }, this.f);
    }, this.d);
    el.dispatchEvent(new Event("attached"));
  }
  s() {
    this.f?.dispose();
    this.f = null;
    this.g = null;
    if (this.a) {
      this.a.$$COMPONENT_NAME = null;
    }
    this.a = null;
    this.$el.set(null);
  }
  y() {
    if (!this.a || !this.f || !this.j.length)
      return;
    scoped(() => {
      this.g = createScope();
      scoped(() => {
        for (const callback of this.j)
          callback(this.a);
      }, this.g);
    }, this.f);
  }
  z() {
    this.g?.dispose();
    this.g = null;
  }
  p() {
    if (this.o)
      return;
    this.o = true;
    scoped(() => {
      for (const callback of this.n)
        callback(this.a);
    }, this.d);
    const el = this.a;
    this.s();
    this.d.dispose();
    this.l.length = 0;
    this.m.length = 0;
    this.j.length = 0;
    this.n.length = 0;
    this.e = null;
    this.b = null;
    this.c = null;
    this.i = EMPTY_PROPS;
    this.d = null;
    this.k = EMPTY_PROPS;
    this.h = null;
    if (el)
      delete el.$;
  }
  t(target) {
    if (target.onSetup)
      this.l.push(target.onSetup.bind(target));
    if (target.onAttach)
      this.m.push(target.onAttach.bind(target));
    if (target.onConnect)
      this.j.push(target.onConnect.bind(target));
    if (target.onDestroy)
      this.n.push(target.onDestroy.bind(target));
  }
  q() {
    if (!this.b)
      return;
    for (const name of Object.keys(this.b)) {
      if (isFunction(this.b[name])) {
        effect(this.u.bind(this, name));
      } else {
        setAttribute(this.a, name, this.b[name]);
      }
    }
  }
  r() {
    if (!this.c)
      return;
    for (const name of Object.keys(this.c)) {
      if (isFunction(this.c[name])) {
        effect(this.v.bind(this, name));
      } else {
        setStyle(this.a, name, this.c[name]);
      }
    }
  }
  u(name) {
    setAttribute(this.a, name, this.b[name].call(this.e));
  }
  v(name) {
    setStyle(this.a, name, this.c[name].call(this.e));
  }
}
function createInstanceProps(props) {
  const $props = {};
  for (const name of Object.keys(props)) {
    const def = props[name];
    $props[name] = signal(def, def);
  }
  return $props;
}

let currentInstance = { $$: null };
function createComponent(Component, init) {
  return root(() => {
    currentInstance.$$ = new Instance(Component, getScope(), init);
    const component = new Component();
    currentInstance.$$.e = component;
    currentInstance.$$ = null;
    return component;
  });
}
class ViewController extends EventTarget {
  constructor() {
    super();
    if (currentInstance.$$)
      this.attach(currentInstance);
  }
  get el() {
    return this.$$.a;
  }
  get $el() {
    return this.$$.$el();
  }
  get scope() {
    return this.$$.d;
  }
  get attachScope() {
    return this.$$.f;
  }
  get connectScope() {
    return this.$$.g;
  }
  /** @internal */
  get $props() {
    return this.$$.i;
  }
  /** @internal */
  get $state() {
    return this.$$.h;
  }
  get state() {
    return this.$$.k;
  }
  attach({ $$ }) {
    this.$$ = $$;
    $$.t(this);
    return this;
  }
  addEventListener(type, callback, options) {
    if (!this.el) {
      const name = this.constructor.name;
      console.warn(`[maverick] adding event listener to \`${name}\` before element is attached`);
    }
    this.listen(type, callback, options);
  }
  removeEventListener(type, callback, options) {
    this.el?.removeEventListener(type, callback, options);
  }
  /**
   * This method can be used to specify attributes that should be set on the host element. Any
   * attributes that are assigned to a function will be considered a signal and updated accordingly.
   */
  setAttributes(attributes) {
    if (!this.$$.b)
      this.$$.b = {};
    Object.assign(this.$$.b, attributes);
  }
  /**
   * This method can be used to specify styles that should set be set on the host element. Any
   * styles that are assigned to a function will be considered a signal and updated accordingly.
   */
  setStyles(styles) {
    if (!this.$$.c)
      this.$$.c = {};
    Object.assign(this.$$.c, styles);
  }
  /**
   * This method is used to satisfy the CSS variables contract specified on the current
   * component. Other CSS variables can be set via the `setStyles` method.
   */
  setCSSVars(vars) {
    this.setStyles(vars);
  }
  /**
   * Type-safe utility for creating component DOM events.
   */
  createEvent(type, ...init) {
    return new DOMEvent(type, init[0]);
  }
  /**
   * Creates a `DOMEvent` and dispatches it from the host element. This method is typed to
   * match all component events.
   */
  dispatch(type, ...init) {
    if (!this.el)
      return false;
    const event = type instanceof Event ? type : new DOMEvent(type, init[0]);
    Object.defineProperty(event, "target", {
      get: () => this.$$.e
    });
    return untrack(() => {
      this.$$[ON_DISPATCH]?.(event);
      return this.el.dispatchEvent(event);
    });
  }
  dispatchEvent(event) {
    return this.dispatch(event);
  }
  /**
   * Adds an event listener for the given `type` and returns a function which can be invoked to
   * remove the event listener.
   *
   * - The listener is removed if the current scope is disposed.
   * - This method is safe to use on the server (noop).
   */
  listen(type, handler, options) {
    if (!this.el)
      return noop;
    return listenEvent(this.el, type, handler, options);
  }
}

class Component extends ViewController {
  subscribe(callback) {
    if (!this.state) {
      const name = this.constructor.name;
      throw Error(
        `[maverick] component \`${name}\` can not be subscribed to because it has no internal state`
      );
    }
    return scoped(() => effect(() => callback(this.state)), this.$$.d);
  }
  destroy() {
    this.$$.p();
  }
}

function prop(target, propertyKey, descriptor) {
  if (!target[PROPS])
    target[PROPS] = /* @__PURE__ */ new Set();
  target[PROPS].add(propertyKey);
}
function method(target, propertyKey, descriptor) {
  if (!target[METHODS])
    target[METHODS] = /* @__PURE__ */ new Set();
  target[METHODS].add(propertyKey);
}

class State {
  constructor(record) {
    this.id = Symbol("STATE" );
    this.record = record;
    this.A = Object.getOwnPropertyDescriptors(record);
  }
  create() {
    const store = {}, state = new Proxy(store, { get: (_, prop) => store[prop]() });
    for (const name of Object.keys(this.record)) {
      const getter = this.A[name].get;
      store[name] = getter ? computed(getter.bind(state)) : signal(this.record[name]);
    }
    return store;
  }
  reset(record, filter) {
    for (const name of Object.keys(record)) {
      if (!this.A[name].get && (!filter || filter(name))) {
        record[name].set(this.record[name]);
      }
    }
  }
}
function useState(state) {
  return useContext(state);
}

function runAll(fns, arg) {
  for (const fn of fns)
    fn(arg);
}

function camelToKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function kebabToCamelCase(str) {
  return str.replace(/-./g, (x) => x[1].toUpperCase());
}
function uppercaseFirstChar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function unwrap(fn) {
  return isFunction(fn) ? fn() : fn;
}

function ariaBool(value) {
  return value ? "true" : "false";
}

function createDisposalBin() {
  const disposal = /* @__PURE__ */ new Set();
  return {
    add(...callbacks) {
      for (const callback of callbacks)
        disposal.add(callback);
    },
    empty() {
      for (const callback of disposal)
        callback();
      disposal.clear();
    }
  };
}
function useDisposalBin() {
  const disposal = createDisposalBin();
  onDispose(disposal.empty);
  return disposal;
}

function deferredPromise() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function waitTimeout(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
function animationFrameThrottle(func) {
  let id = -1, lastArgs;
  function throttle(...args) {
    lastArgs = args;
    if (id >= 0)
      return;
    id = window.requestAnimationFrame(() => {
      func.apply(this, lastArgs);
      id = -1;
      lastArgs = void 0;
    });
  }
  return throttle;
}
const requestIdleCallback = typeof window !== "undefined" ? "requestIdleCallback" in window ? window.requestIdleCallback : (cb) => window.setTimeout(cb, 1) : noop;
function waitIdlePeriod(callback, options) {
  return new Promise((resolve) => {
    requestIdleCallback((deadline) => {
      callback?.(deadline);
      resolve();
    }, options);
  });
}

const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = v => ({
  x: v,
  y: v
});
function getSide(placement) {
  return placement.split('-')[0];
}
function getAlignment(placement) {
  return placement.split('-')[1];
}
function getOppositeAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}
function getAxisLength(axis) {
  return axis === 'y' ? 'height' : 'width';
}
function getSideAxis(placement) {
  return ['top', 'bottom'].includes(getSide(placement)) ? 'y' : 'x';
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function rectToClientRect(rect) {
  return {
    ...rect,
    top: rect.y,
    left: rect.x,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  };
}

function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === 'y';
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case 'top':
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case 'bottom':
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case 'right':
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case 'left':
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case 'start':
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case 'end':
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a reference element when it is given a certain positioning strategy.
 *
 * This export does not have any `platform` interface logic. You will need to
 * write one for the platform you are using Floating UI with.
 */
const computePosition$1 = async (reference, floating, config) => {
  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
    platform
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
  let rects = await platform.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i = 0; i < validMiddleware.length; i++) {
    const {
      name,
      fn
    } = validMiddleware[i];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === 'object') {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
      continue;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};

function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || '').toLowerCase();
  }
  // Mocked nodes in testing environments may not be instances of Node. By
  // returning `#document` an infinite loop won't occur.
  // https://github.com/floating-ui/floating-ui/issues/2317
  return '#document';
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null ? void 0 : (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  // Browsers without `ShadowRoot` support.
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !['inline', 'contents'].includes(display);
}
function isTableElement(element) {
  return ['table', 'td', 'th'].includes(getNodeName(element));
}
function isContainingBlock(element) {
  const webkit = isWebKit();
  const css = getComputedStyle(element);

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  return css.transform !== 'none' || css.perspective !== 'none' || (css.containerType ? css.containerType !== 'normal' : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== 'none' : false) || !webkit && (css.filter ? css.filter !== 'none' : false) || ['transform', 'perspective', 'filter'].some(value => (css.willChange || '').includes(value)) || ['paint', 'layout', 'strict', 'content'].some(value => (css.contain || '').includes(value));
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else {
      currentNode = getParentNode(currentNode);
    }
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === 'undefined' || !CSS.supports) return false;
  return CSS.supports('-webkit-backdrop-filter', 'none');
}
function isLastTraversableNode(node) {
  return ['html', 'body', '#document'].includes(getNodeName(node));
}
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.pageXOffset,
    scrollTop: element.pageYOffset
  };
}
function getParentNode(node) {
  if (getNodeName(node) === 'html') {
    return node;
  }
  const result =
  // Step into the shadow DOM of the parent of a slotted node.
  node.assignedSlot ||
  // DOM Element detected.
  node.parentNode ||
  // ShadowRoot detected.
  isShadowRoot(node) && node.host ||
  // Fallback.
  getDocumentElement(node);
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], win.frameElement && traverseIframes ? getOverflowAncestors(win.frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}

function getCssDimensions(element) {
  const css = getComputedStyle(element);
  // In testing environments, the `width` and `height` properties are empty
  // strings for SVG elements, returning NaN. Fallback to `0` in this case.
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}

function unwrapElement(element) {
  return !isElement(element) ? element.contextElement : element;
}

function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? round(rect.width) : rect.width) / width;
  let y = ($ ? round(rect.height) : rect.height) / height;

  // 0, NaN, or Infinity should always fallback to 1.

  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}

const noOffsets = /*#__PURE__*/createCoords(0);
function getVisualOffsets(element) {
  const win = getWindow(element);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
    return false;
  }
  return isFixed;
}

function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentIFrame = win.frameElement;
    while (currentIFrame && offsetParent && offsetWin !== win) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentIFrame = getWindow(currentIFrame).frameElement;
    }
  }
  return rectToClientRect({
    width,
    height,
    x,
    y
  });
}

function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  if (offsetParent === documentElement) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = createCoords(1);
  const offsets = createCoords(0);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && strategy !== 'fixed') {
    if (getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y
  };
}

function getClientRects(element) {
  return Array.from(element.getClientRects());
}

function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  return getBoundingClientRect(getDocumentElement(element)).left + getNodeScroll(element).scrollLeft;
}

// Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable.
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if (getComputedStyle(body).direction === 'rtl') {
    x += max(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}

function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isWebKit();
    if (!visualViewportBased || visualViewportBased && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}

// Returns the inner client rect, subtracting scrollbars if present.
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === 'fixed');
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === 'viewport') {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === 'document') {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      ...clippingAncestor,
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y
    };
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return getComputedStyle(parentNode).position === 'fixed' || hasFixedPositionAncestor(parentNode, stopNode);
}

// A "clipping ancestor" is an `overflow` element with the characteristic of
// clipping (or hiding) child elements. This returns all clipping ancestors
// of the given element up the tree.
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element, [], false).filter(el => isElement(el) && getNodeName(el) !== 'body');
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle(element).position === 'fixed';
  let currentNode = elementIsFixed ? getParentNode(element) : element;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === 'fixed') {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === 'static' && !!currentContainingBlockComputedStyle && ['absolute', 'fixed'].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      // Drop non-containing blocks.
      result = result.filter(ancestor => ancestor !== currentNode);
    } else {
      // Record last containing block for next iteration.
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}

// Gets the maximum area that the element is visible in due to any number of
// clipping ancestors.
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === 'clippingAncestors' ? getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}

function getDimensions(element) {
  return getCssDimensions(element);
}

function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === 'fixed';
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = createCoords(0);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle(element).position === 'fixed') {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  return element.offsetParent;
}

// Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.
function getOffsetParent(element, polyfill) {
  const window = getWindow(element);
  if (!isHTMLElement(element)) {
    return window;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle(offsetParent).position === 'static' && !isContainingBlock(offsetParent))) {
    return window;
  }
  return offsetParent || getContainingBlock(element) || window;
}

const getElementRects = async function (_ref) {
  let {
    reference,
    floating,
    strategy
  } = _ref;
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  return {
    reference: getRectRelativeToOffsetParent(reference, await getOffsetParentFn(floating), strategy),
    floating: {
      x: 0,
      y: 0,
      ...(await getDimensionsFn(floating))
    }
  };
};

function isRTL(element) {
  return getComputedStyle(element).direction === 'rtl';
}

const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement,
  isRTL
};

// https://samthor.au/2021/observing-dom/
function observeMove(element, onMove) {
  let io = null;
  let timeoutId;
  const root = getDocumentElement(element);
  function cleanup() {
    clearTimeout(timeoutId);
    io && io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const {
      left,
      top,
      width,
      height
    } = element.getBoundingClientRect();
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = floor(top);
    const insetRight = floor(root.clientWidth - (left + width));
    const insetBottom = floor(root.clientHeight - (top + height));
    const insetLeft = floor(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: max(0, min(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 100);
        } else {
          refresh(false, ratio);
        }
      }
      isFirstUpdate = false;
    }

    // Older browsers don't support a `document` as the root and will throw an
    // error.
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup;
}

/**
 * Automatically updates the position of the floating element when necessary.
 * Should only be called when the floating element is mounted on the DOM or
 * visible on the screen.
 * @returns cleanup function that should be invoked when the floating element is
 * removed from the DOM or hidden from the screen.
 * @see https://floating-ui.com/docs/autoUpdate
 */
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === 'function',
    layoutShift = typeof IntersectionObserver === 'function',
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...(referenceEl ? getOverflowAncestors(referenceEl) : []), ...getOverflowAncestors(floating)] : [];
  ancestors.forEach(ancestor => {
    ancestorScroll && ancestor.addEventListener('scroll', update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener('resize', update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver(_ref => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        // Prevent update loops when using the `size` middleware.
        // https://github.com/floating-ui/floating-ui/issues/1740
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          resizeObserver && resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && (nextRefRect.x !== prevRefRect.x || nextRefRect.y !== prevRefRect.y || nextRefRect.width !== prevRefRect.width || nextRefRect.height !== prevRefRect.height)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    ancestors.forEach(ancestor => {
      ancestorScroll && ancestor.removeEventListener('scroll', update);
      ancestorResize && ancestor.removeEventListener('resize', update);
    });
    cleanupIo && cleanupIo();
    resizeObserver && resizeObserver.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a reference element when it is given a certain CSS positioning
 * strategy.
 */
const computePosition = (reference, floating, options) => {
  // This caches the expensive `getClippingElementAncestors` function so that
  // multiple lifecycle resets re-use the same result. It only lives for a
  // single call. If other functions become expensive, we can add them as well.
  const cache = new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return computePosition$1(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};

const STRING = (v) => v === null ? "" : v + "";
const NULLABLE_STRING = (v) => v === null ? null : v + "";
const NUMBER = (v) => v === null ? 0 : Number(v);
const BOOLEAN = (v) => v !== null;
const FUNCTION = () => null;
const ARRAY = (v) => v === null ? [] : JSON.parse(v);
const OBJECT = (v) => v === null ? {} : JSON.parse(v);
function inferAttributeConverter(value) {
  if (value === null)
    return NULLABLE_STRING;
  switch (typeof value) {
    case "undefined":
      return STRING;
    case "string":
      return STRING;
    case "boolean":
      return BOOLEAN;
    case "number":
      return NUMBER;
    case "function":
      return FUNCTION;
    case "object":
      return isArray(value) ? ARRAY : OBJECT;
    default:
      return STRING;
  }
}

const ATTRS = /* @__PURE__ */ Symbol("ATTRS" );
const SETUP = /* @__PURE__ */ Symbol("SETUP" );
const SETUP_STATE = /* @__PURE__ */ Symbol("SETUP_STATE" );
const SETUP_CALLBACKS = /* @__PURE__ */ Symbol("SETUP_CALLBACKS" );

function Host(Super, Component) {
  var _a, _b, _c;
  class MaverickElement extends Super {
    constructor(...args) {
      super(...args);
      this[_b] = 0 /* Idle */;
      this[_c] = null;
      this.keepAlive = false;
      this.forwardKeepAlive = true;
      this.$ = scoped(() => createComponent(Component), null);
      this.$.$$.t(this);
      if (Component.props) {
        const props = this.$props, descriptors = Object.getOwnPropertyDescriptors(this);
        for (const prop of Object.keys(descriptors)) {
          if (prop in Component.props) {
            props[prop].set(this[prop]);
            delete this[prop];
          }
        }
      }
    }
    static {
      this[_a] = null;
    }
    static get observedAttributes() {
      if (!this[ATTRS] && Component.props) {
        const map = /* @__PURE__ */ new Map();
        for (const propName of Object.keys(Component.props)) {
          let attr = this.attrs?.[propName], attrName = isString(attr) ? attr : !attr ? attr : attr?.attr;
          if (attrName === false)
            continue;
          if (!attrName)
            attrName = camelToKebabCase(propName);
          map.set(attrName, {
            C: propName,
            B: attr && !isString(attr) && attr?.converter || inferAttributeConverter(Component.props[propName])
          });
        }
        this[ATTRS] = map;
      }
      return this[ATTRS] ? Array.from(this[ATTRS].keys()) : [];
    }
    get scope() {
      return this.$.$$.d;
    }
    get attachScope() {
      return this.$.$$.f;
    }
    get connectScope() {
      return this.$.$$.g;
    }
    get $props() {
      return this.$.$$.i;
    }
    get $state() {
      return this.$.$$.h;
    }
    get state() {
      return this.$.state;
    }
    attributeChangedCallback(name, _, newValue) {
      const Ctor = this.constructor;
      if (!Ctor[ATTRS]) {
        super.attributeChangedCallback?.(name, _, newValue);
        return;
      }
      const def = Ctor[ATTRS].get(name);
      if (def)
        this[def.C] = def.B(newValue);
    }
    connectedCallback() {
      const instance = this.$?.$$;
      if (!instance || instance.o)
        return;
      if (this[SETUP_STATE] !== 2 /* Ready */) {
        setup.call(this);
        return;
      }
      if (!this.isConnected)
        return;
      if (this.hasAttribute("keep-alive")) {
        this.keepAlive = true;
      }
      instance.y();
      if (isArray(this[SETUP_CALLBACKS]))
        runAll(this[SETUP_CALLBACKS], this);
      this[SETUP_CALLBACKS] = null;
      const callback = super.connectedCallback;
      if (callback)
        scoped(() => callback.call(this), this.connectScope);
      return;
    }
    disconnectedCallback() {
      const instance = this.$?.$$;
      if (!instance || instance.o)
        return;
      instance.z();
      const callback = super.disconnectedCallback;
      if (callback)
        callback.call(this);
      if (!this.keepAlive && !this.hasAttribute("keep-alive")) {
        setTimeout(() => {
          requestAnimationFrame(() => {
            if (!this.isConnected)
              instance.p();
          });
        }, 0);
      }
    }
    [(_a = ATTRS, _b = SETUP_STATE, _c = SETUP_CALLBACKS, SETUP)]() {
      const instance = this.$.$$, Ctor = this.constructor;
      if (instance.o) {
        console.warn(`[maverick] attempted attaching to destroyed element \`${this.tagName}\``);
      }
      if (instance.o)
        return;
      const attrs = Ctor[ATTRS];
      if (attrs) {
        for (const attr of this.attributes) {
          let def = attrs.get(attr.name);
          if (def && def.B) {
            instance.i[def.C].set(def.B(this.getAttribute(attr.name)));
          }
        }
      }
      instance.w();
      instance.x(this);
      this[SETUP_STATE] = 2 /* Ready */;
      this.connectedCallback();
    }
    // @ts-expect-error
    subscribe(callback) {
      return this.$.subscribe(callback);
    }
    destroy() {
      this.disconnectedCallback();
      this.$.destroy();
    }
  }
  extendProto(MaverickElement, Component);
  return MaverickElement;
}
function extendProto(Element, Component) {
  const ElementProto = Element.prototype, ComponentProto = Component.prototype;
  if (Component.props) {
    for (const prop of Object.keys(Component.props)) {
      Object.defineProperty(ElementProto, prop, {
        enumerable: true,
        configurable: true,
        get() {
          return this.$props[prop]();
        },
        set(value) {
          this.$props[prop].set(value);
        }
      });
    }
  }
  if (ComponentProto[PROPS]) {
    for (const name of ComponentProto[PROPS]) {
      Object.defineProperty(ElementProto, name, {
        enumerable: true,
        configurable: true,
        get() {
          return this.$[name];
        },
        set(value) {
          this.$[name] = value;
        }
      });
    }
  }
  if (ComponentProto[METHODS]) {
    for (const name of ComponentProto[METHODS]) {
      ElementProto[name] = function(...args) {
        return this.$[name](...args);
      };
    }
  }
}
function setup() {
  if (this[SETUP_STATE] !== 0 /* Idle */)
    return;
  this[SETUP_STATE] = 1 /* Pending */;
  const parent = findParent(this), isParentRegistered = parent && window.customElements.get(parent.localName), isParentSetup = parent && parent[SETUP_STATE] === 2 /* Ready */;
  if (parent && (!isParentRegistered || !isParentSetup)) {
    waitForParent.call(this, parent);
    return;
  }
  attach.call(this, parent);
}
async function waitForParent(parent) {
  await window.customElements.whenDefined(parent.localName);
  if (parent[SETUP_STATE] !== 2 /* Ready */) {
    await new Promise((res) => (parent[SETUP_CALLBACKS] ??= []).push(res));
  }
  attach.call(this, parent);
}
function attach(parent) {
  if (!this.isConnected)
    return;
  if (parent) {
    if (parent.keepAlive && parent.forwardKeepAlive) {
      this.keepAlive = true;
      this.setAttribute("keep-alive", "");
    }
    const scope = this.$.$$.d;
    if (scope)
      parent.$.$$.f.append(scope);
  }
  this[SETUP]();
}
function findParent(host) {
  let node = host.parentNode, prefix = host.localName.split("-", 1)[0] + "-";
  while (node) {
    if (node.nodeType === 1 && node.localName.startsWith(prefix)) {
      return node;
    }
    node = node.parentNode;
  }
  return null;
}

function defineCustomElement(element, throws = false) {
  if (throws || !window.customElements.get(element.tagName)) {
    window.customElements.define(element.tagName, element);
  }
}

export { prop as $, hasTriggerEvent as A, walkTriggerEventChain as B, findTriggerEvent as C, DOMEvent as D, appendTriggerEvent as E, isPointerEvent as F, isKeyboardEvent as G, Host as H, Component as I, useContext as J, camelToKebabCase as K, useDisposalBin as L, isNil as M, isNull as N, EventsTarget as O, tick as P, createContext as Q, root as R, State as S, unwrap as T, kebabToCamelCase as U, animationFrameThrottle as V, BOOLEAN as W, ViewController as X, waitIdlePeriod as Y, provideContext as Z, uppercaseFirstChar as _, isNumber as a, method as a0, noop as a1, ariaBool as a2, isWriteSignal as a3, hasProvidedContext as a4, isMouseEvent as a5, createDisposalBin as a6, isKeyboardClick as b, isTouchEvent as c, defineCustomElement as d, effect as e, setStyle as f, getScope as g, autoUpdate as h, isUndefined as i, computePosition as j, setAttribute as k, listenEvent as l, signal as m, computed as n, onDispose as o, peek as p, createScope as q, isString as r, scoped as s, isObject as t, isBoolean as u, deferredPromise as v, isArray as w, isFunction as x, waitTimeout as y, useState as z };
