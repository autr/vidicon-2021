
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var browser=function(t){var e={};function r(n){if(e[n])return e[n].exports;var i=e[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n});},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0});},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)r.d(n,i,function(e){return t[e]}.bind(null,i));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=32)}([function(t,e){var r;r=function(){return this}();try{r=r||Function("return this")()||(0,eval)("this");}catch(t){"object"==typeof window&&(r=window);}t.exports=r;},function(t,e,r){var n=r(6),i=Object.keys||function(t){var e=[];for(var r in t)e.push(r);return e};t.exports=f;var o=r(5);o.inherits=r(2);var s=r(23),a=r(14);o.inherits(f,s);for(var u=i(a.prototype),c=0;c<u.length;c++){var l=u[c];f.prototype[l]||(f.prototype[l]=a.prototype[l]);}function f(t){if(!(this instanceof f))return new f(t);s.call(this,t),a.call(this,t),t&&!1===t.readable&&(this.readable=!1),t&&!1===t.writable&&(this.writable=!1),this.allowHalfOpen=!0,t&&!1===t.allowHalfOpen&&(this.allowHalfOpen=!1),this.once("end",h);}function h(){this.allowHalfOpen||this._writableState.ended||n.nextTick(p,this);}function p(t){t.end();}Object.defineProperty(f.prototype,"writableHighWaterMark",{enumerable:!1,get:function(){return this._writableState.highWaterMark}}),Object.defineProperty(f.prototype,"destroyed",{get:function(){return void 0!==this._readableState&&void 0!==this._writableState&&this._readableState.destroyed&&this._writableState.destroyed},set:function(t){void 0!==this._readableState&&void 0!==this._writableState&&(this._readableState.destroyed=t,this._writableState.destroyed=t);}}),f.prototype._destroy=function(t,e){this.push(null),this.end(),n.nextTick(e,t);};},function(t,e){"function"==typeof Object.create?t.exports=function(t,e){t.super_=e,t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}});}:t.exports=function(t,e){t.super_=e;var r=function(){};r.prototype=e.prototype,t.prototype=new r,t.prototype.constructor=t;};},function(t,e,r){(function(t){
    /*!
     * The buffer module from node.js, for the browser.
     *
     * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
     * @license  MIT
     */
    var n=r(38),i=r(39),o=r(40);function s(){return u.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function a(t,e){if(s()<e)throw new RangeError("Invalid typed array length");return u.TYPED_ARRAY_SUPPORT?(t=new Uint8Array(e)).__proto__=u.prototype:(null===t&&(t=new u(e)),t.length=e),t}function u(t,e,r){if(!(u.TYPED_ARRAY_SUPPORT||this instanceof u))return new u(t,e,r);if("number"==typeof t){if("string"==typeof e)throw new Error("If encoding is specified then the first argument must be a string");return f(this,t)}return c(this,t,e,r)}function c(t,e,r,n){if("number"==typeof e)throw new TypeError('"value" argument must not be a number');return "undefined"!=typeof ArrayBuffer&&e instanceof ArrayBuffer?function(t,e,r,n){if(e.byteLength,r<0||e.byteLength<r)throw new RangeError("'offset' is out of bounds");if(e.byteLength<r+(n||0))throw new RangeError("'length' is out of bounds");return e=void 0===r&&void 0===n?new Uint8Array(e):void 0===n?new Uint8Array(e,r):new Uint8Array(e,r,n),u.TYPED_ARRAY_SUPPORT?(t=e).__proto__=u.prototype:t=h(t,e),t}(t,e,r,n):"string"==typeof e?function(t,e,r){if("string"==typeof r&&""!==r||(r="utf8"),!u.isEncoding(r))throw new TypeError('"encoding" must be a valid string encoding');var n=0|d(e,r),i=(t=a(t,n)).write(e,r);return i!==n&&(t=t.slice(0,i)),t}(t,e,r):function(t,e){if(u.isBuffer(e)){var r=0|p(e.length);return 0===(t=a(t,r)).length?t:(e.copy(t,0,0,r),t)}if(e){if("undefined"!=typeof ArrayBuffer&&e.buffer instanceof ArrayBuffer||"length"in e)return "number"!=typeof e.length||function(t){return t!=t}(e.length)?a(t,0):h(t,e);if("Buffer"===e.type&&o(e.data))return h(t,e.data)}throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}(t,e)}function l(t){if("number"!=typeof t)throw new TypeError('"size" argument must be a number');if(t<0)throw new RangeError('"size" argument must not be negative')}function f(t,e){if(l(e),t=a(t,e<0?0:0|p(e)),!u.TYPED_ARRAY_SUPPORT)for(var r=0;r<e;++r)t[r]=0;return t}function h(t,e){var r=e.length<0?0:0|p(e.length);t=a(t,r);for(var n=0;n<r;n+=1)t[n]=255&e[n];return t}function p(t){if(t>=s())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+s().toString(16)+" bytes");return 0|t}function d(t,e){if(u.isBuffer(t))return t.length;if("undefined"!=typeof ArrayBuffer&&"function"==typeof ArrayBuffer.isView&&(ArrayBuffer.isView(t)||t instanceof ArrayBuffer))return t.byteLength;"string"!=typeof t&&(t=""+t);var r=t.length;if(0===r)return 0;for(var n=!1;;)switch(e){case"ascii":case"latin1":case"binary":return r;case"utf8":case"utf-8":case void 0:return N(t).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return H(t).length;default:if(n)return N(t).length;e=(""+e).toLowerCase(),n=!0;}}function _(t,e,r){var n=t[e];t[e]=t[r],t[r]=n;}function v(t,e,r,n,i){if(0===t.length)return -1;if("string"==typeof r?(n=r,r=0):r>2147483647?r=2147483647:r<-2147483648&&(r=-2147483648),r=+r,isNaN(r)&&(r=i?0:t.length-1),r<0&&(r=t.length+r),r>=t.length){if(i)return -1;r=t.length-1;}else if(r<0){if(!i)return -1;r=0;}if("string"==typeof e&&(e=u.from(e,n)),u.isBuffer(e))return 0===e.length?-1:y(t,e,r,n,i);if("number"==typeof e)return e&=255,u.TYPED_ARRAY_SUPPORT&&"function"==typeof Uint8Array.prototype.indexOf?i?Uint8Array.prototype.indexOf.call(t,e,r):Uint8Array.prototype.lastIndexOf.call(t,e,r):y(t,[e],r,n,i);throw new TypeError("val must be string, number or Buffer")}function y(t,e,r,n,i){var o,s=1,a=t.length,u=e.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(t.length<2||e.length<2)return -1;s=2,a/=2,u/=2,r/=2;}function c(t,e){return 1===s?t[e]:t.readUInt16BE(e*s)}if(i){var l=-1;for(o=r;o<a;o++)if(c(t,o)===c(e,-1===l?0:o-l)){if(-1===l&&(l=o),o-l+1===u)return l*s}else -1!==l&&(o-=o-l),l=-1;}else for(r+u>a&&(r=a-u),o=r;o>=0;o--){for(var f=!0,h=0;h<u;h++)if(c(t,o+h)!==c(e,h)){f=!1;break}if(f)return o}return -1}function m(t,e,r,n){r=Number(r)||0;var i=t.length-r;n?(n=Number(n))>i&&(n=i):n=i;var o=e.length;if(o%2!=0)throw new TypeError("Invalid hex string");n>o/2&&(n=o/2);for(var s=0;s<n;++s){var a=parseInt(e.substr(2*s,2),16);if(isNaN(a))return s;t[r+s]=a;}return s}function g(t,e,r,n){return V(N(e,t.length-r),t,r,n)}function b(t,e,r,n){return V(function(t){for(var e=[],r=0;r<t.length;++r)e.push(255&t.charCodeAt(r));return e}(e),t,r,n)}function w(t,e,r,n){return b(t,e,r,n)}function E(t,e,r,n){return V(H(e),t,r,n)}function C(t,e,r,n){return V(function(t,e){for(var r,n,i,o=[],s=0;s<t.length&&!((e-=2)<0);++s)n=(r=t.charCodeAt(s))>>8,i=r%256,o.push(i),o.push(n);return o}(e,t.length-r),t,r,n)}function x(t,e,r){return 0===e&&r===t.length?n.fromByteArray(t):n.fromByteArray(t.slice(e,r))}function j(t,e,r){r=Math.min(t.length,r);for(var n=[],i=e;i<r;){var o,s,a,u,c=t[i],l=null,f=c>239?4:c>223?3:c>191?2:1;if(i+f<=r)switch(f){case 1:c<128&&(l=c);break;case 2:128==(192&(o=t[i+1]))&&(u=(31&c)<<6|63&o)>127&&(l=u);break;case 3:o=t[i+1],s=t[i+2],128==(192&o)&&128==(192&s)&&(u=(15&c)<<12|(63&o)<<6|63&s)>2047&&(u<55296||u>57343)&&(l=u);break;case 4:o=t[i+1],s=t[i+2],a=t[i+3],128==(192&o)&&128==(192&s)&&128==(192&a)&&(u=(15&c)<<18|(63&o)<<12|(63&s)<<6|63&a)>65535&&u<1114112&&(l=u);}null===l?(l=65533,f=1):l>65535&&(l-=65536,n.push(l>>>10&1023|55296),l=56320|1023&l),n.push(l),i+=f;}return function(t){var e=t.length;if(e<=S)return String.fromCharCode.apply(String,t);for(var r="",n=0;n<e;)r+=String.fromCharCode.apply(String,t.slice(n,n+=S));return r}(n)}e.Buffer=u,e.SlowBuffer=function(t){return +t!=t&&(t=0),u.alloc(+t)},e.INSPECT_MAX_BYTES=50,u.TYPED_ARRAY_SUPPORT=void 0!==t.TYPED_ARRAY_SUPPORT?t.TYPED_ARRAY_SUPPORT:function(){try{var t=new Uint8Array(1);return t.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===t.foo()&&"function"==typeof t.subarray&&0===t.subarray(1,1).byteLength}catch(t){return !1}}(),e.kMaxLength=s(),u.poolSize=8192,u._augment=function(t){return t.__proto__=u.prototype,t},u.from=function(t,e,r){return c(null,t,e,r)},u.TYPED_ARRAY_SUPPORT&&(u.prototype.__proto__=Uint8Array.prototype,u.__proto__=Uint8Array,"undefined"!=typeof Symbol&&Symbol.species&&u[Symbol.species]===u&&Object.defineProperty(u,Symbol.species,{value:null,configurable:!0})),u.alloc=function(t,e,r){return function(t,e,r,n){return l(e),e<=0?a(t,e):void 0!==r?"string"==typeof n?a(t,e).fill(r,n):a(t,e).fill(r):a(t,e)}(null,t,e,r)},u.allocUnsafe=function(t){return f(null,t)},u.allocUnsafeSlow=function(t){return f(null,t)},u.isBuffer=function(t){return !(null==t||!t._isBuffer)},u.compare=function(t,e){if(!u.isBuffer(t)||!u.isBuffer(e))throw new TypeError("Arguments must be Buffers");if(t===e)return 0;for(var r=t.length,n=e.length,i=0,o=Math.min(r,n);i<o;++i)if(t[i]!==e[i]){r=t[i],n=e[i];break}return r<n?-1:n<r?1:0},u.isEncoding=function(t){switch(String(t).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return !0;default:return !1}},u.concat=function(t,e){if(!o(t))throw new TypeError('"list" argument must be an Array of Buffers');if(0===t.length)return u.alloc(0);var r;if(void 0===e)for(e=0,r=0;r<t.length;++r)e+=t[r].length;var n=u.allocUnsafe(e),i=0;for(r=0;r<t.length;++r){var s=t[r];if(!u.isBuffer(s))throw new TypeError('"list" argument must be an Array of Buffers');s.copy(n,i),i+=s.length;}return n},u.byteLength=d,u.prototype._isBuffer=!0,u.prototype.swap16=function(){var t=this.length;if(t%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var e=0;e<t;e+=2)_(this,e,e+1);return this},u.prototype.swap32=function(){var t=this.length;if(t%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var e=0;e<t;e+=4)_(this,e,e+3),_(this,e+1,e+2);return this},u.prototype.swap64=function(){var t=this.length;if(t%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var e=0;e<t;e+=8)_(this,e,e+7),_(this,e+1,e+6),_(this,e+2,e+5),_(this,e+3,e+4);return this},u.prototype.toString=function(){var t=0|this.length;return 0===t?"":0===arguments.length?j(this,0,t):function(t,e,r){var n=!1;if((void 0===e||e<0)&&(e=0),e>this.length)return "";if((void 0===r||r>this.length)&&(r=this.length),r<=0)return "";if((r>>>=0)<=(e>>>=0))return "";for(t||(t="utf8");;)switch(t){case"hex":return T(this,e,r);case"utf8":case"utf-8":return j(this,e,r);case"ascii":return R(this,e,r);case"latin1":case"binary":return k(this,e,r);case"base64":return x(this,e,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return P(this,e,r);default:if(n)throw new TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),n=!0;}}.apply(this,arguments)},u.prototype.equals=function(t){if(!u.isBuffer(t))throw new TypeError("Argument must be a Buffer");return this===t||0===u.compare(this,t)},u.prototype.inspect=function(){var t="",r=e.INSPECT_MAX_BYTES;return this.length>0&&(t=this.toString("hex",0,r).match(/.{2}/g).join(" "),this.length>r&&(t+=" ... ")),"<Buffer "+t+">"},u.prototype.compare=function(t,e,r,n,i){if(!u.isBuffer(t))throw new TypeError("Argument must be a Buffer");if(void 0===e&&(e=0),void 0===r&&(r=t?t.length:0),void 0===n&&(n=0),void 0===i&&(i=this.length),e<0||r>t.length||n<0||i>this.length)throw new RangeError("out of range index");if(n>=i&&e>=r)return 0;if(n>=i)return -1;if(e>=r)return 1;if(e>>>=0,r>>>=0,n>>>=0,i>>>=0,this===t)return 0;for(var o=i-n,s=r-e,a=Math.min(o,s),c=this.slice(n,i),l=t.slice(e,r),f=0;f<a;++f)if(c[f]!==l[f]){o=c[f],s=l[f];break}return o<s?-1:s<o?1:0},u.prototype.includes=function(t,e,r){return -1!==this.indexOf(t,e,r)},u.prototype.indexOf=function(t,e,r){return v(this,t,e,r,!0)},u.prototype.lastIndexOf=function(t,e,r){return v(this,t,e,r,!1)},u.prototype.write=function(t,e,r,n){if(void 0===e)n="utf8",r=this.length,e=0;else if(void 0===r&&"string"==typeof e)n=e,r=this.length,e=0;else {if(!isFinite(e))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");e|=0,isFinite(r)?(r|=0,void 0===n&&(n="utf8")):(n=r,r=void 0);}var i=this.length-e;if((void 0===r||r>i)&&(r=i),t.length>0&&(r<0||e<0)||e>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");for(var o=!1;;)switch(n){case"hex":return m(this,t,e,r);case"utf8":case"utf-8":return g(this,t,e,r);case"ascii":return b(this,t,e,r);case"latin1":case"binary":return w(this,t,e,r);case"base64":return E(this,t,e,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return C(this,t,e,r);default:if(o)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),o=!0;}},u.prototype.toJSON=function(){return {type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};var S=4096;function R(t,e,r){var n="";r=Math.min(t.length,r);for(var i=e;i<r;++i)n+=String.fromCharCode(127&t[i]);return n}function k(t,e,r){var n="";r=Math.min(t.length,r);for(var i=e;i<r;++i)n+=String.fromCharCode(t[i]);return n}function T(t,e,r){var n=t.length;(!e||e<0)&&(e=0),(!r||r<0||r>n)&&(r=n);for(var i="",o=e;o<r;++o)i+=U(t[o]);return i}function P(t,e,r){for(var n=t.slice(e,r),i="",o=0;o<n.length;o+=2)i+=String.fromCharCode(n[o]+256*n[o+1]);return i}function O(t,e,r){if(t%1!=0||t<0)throw new RangeError("offset is not uint");if(t+e>r)throw new RangeError("Trying to access beyond buffer length")}function A(t,e,r,n,i,o){if(!u.isBuffer(t))throw new TypeError('"buffer" argument must be a Buffer instance');if(e>i||e<o)throw new RangeError('"value" argument is out of bounds');if(r+n>t.length)throw new RangeError("Index out of range")}function F(t,e,r,n){e<0&&(e=65535+e+1);for(var i=0,o=Math.min(t.length-r,2);i<o;++i)t[r+i]=(e&255<<8*(n?i:1-i))>>>8*(n?i:1-i);}function L(t,e,r,n){e<0&&(e=4294967295+e+1);for(var i=0,o=Math.min(t.length-r,4);i<o;++i)t[r+i]=e>>>8*(n?i:3-i)&255;}function M(t,e,r,n,i,o){if(r+n>t.length)throw new RangeError("Index out of range");if(r<0)throw new RangeError("Index out of range")}function B(t,e,r,n,o){return o||M(t,0,r,4),i.write(t,e,r,n,23,4),r+4}function D(t,e,r,n,o){return o||M(t,0,r,8),i.write(t,e,r,n,52,8),r+8}u.prototype.slice=function(t,e){var r,n=this.length;if(t=~~t,e=void 0===e?n:~~e,t<0?(t+=n)<0&&(t=0):t>n&&(t=n),e<0?(e+=n)<0&&(e=0):e>n&&(e=n),e<t&&(e=t),u.TYPED_ARRAY_SUPPORT)(r=this.subarray(t,e)).__proto__=u.prototype;else {var i=e-t;r=new u(i,void 0);for(var o=0;o<i;++o)r[o]=this[o+t];}return r},u.prototype.readUIntLE=function(t,e,r){t|=0,e|=0,r||O(t,e,this.length);for(var n=this[t],i=1,o=0;++o<e&&(i*=256);)n+=this[t+o]*i;return n},u.prototype.readUIntBE=function(t,e,r){t|=0,e|=0,r||O(t,e,this.length);for(var n=this[t+--e],i=1;e>0&&(i*=256);)n+=this[t+--e]*i;return n},u.prototype.readUInt8=function(t,e){return e||O(t,1,this.length),this[t]},u.prototype.readUInt16LE=function(t,e){return e||O(t,2,this.length),this[t]|this[t+1]<<8},u.prototype.readUInt16BE=function(t,e){return e||O(t,2,this.length),this[t]<<8|this[t+1]},u.prototype.readUInt32LE=function(t,e){return e||O(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},u.prototype.readUInt32BE=function(t,e){return e||O(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},u.prototype.readIntLE=function(t,e,r){t|=0,e|=0,r||O(t,e,this.length);for(var n=this[t],i=1,o=0;++o<e&&(i*=256);)n+=this[t+o]*i;return n>=(i*=128)&&(n-=Math.pow(2,8*e)),n},u.prototype.readIntBE=function(t,e,r){t|=0,e|=0,r||O(t,e,this.length);for(var n=e,i=1,o=this[t+--n];n>0&&(i*=256);)o+=this[t+--n]*i;return o>=(i*=128)&&(o-=Math.pow(2,8*e)),o},u.prototype.readInt8=function(t,e){return e||O(t,1,this.length),128&this[t]?-1*(255-this[t]+1):this[t]},u.prototype.readInt16LE=function(t,e){e||O(t,2,this.length);var r=this[t]|this[t+1]<<8;return 32768&r?4294901760|r:r},u.prototype.readInt16BE=function(t,e){e||O(t,2,this.length);var r=this[t+1]|this[t]<<8;return 32768&r?4294901760|r:r},u.prototype.readInt32LE=function(t,e){return e||O(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},u.prototype.readInt32BE=function(t,e){return e||O(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},u.prototype.readFloatLE=function(t,e){return e||O(t,4,this.length),i.read(this,t,!0,23,4)},u.prototype.readFloatBE=function(t,e){return e||O(t,4,this.length),i.read(this,t,!1,23,4)},u.prototype.readDoubleLE=function(t,e){return e||O(t,8,this.length),i.read(this,t,!0,52,8)},u.prototype.readDoubleBE=function(t,e){return e||O(t,8,this.length),i.read(this,t,!1,52,8)},u.prototype.writeUIntLE=function(t,e,r,n){t=+t,e|=0,r|=0,n||A(this,t,e,r,Math.pow(2,8*r)-1,0);var i=1,o=0;for(this[e]=255&t;++o<r&&(i*=256);)this[e+o]=t/i&255;return e+r},u.prototype.writeUIntBE=function(t,e,r,n){t=+t,e|=0,r|=0,n||A(this,t,e,r,Math.pow(2,8*r)-1,0);var i=r-1,o=1;for(this[e+i]=255&t;--i>=0&&(o*=256);)this[e+i]=t/o&255;return e+r},u.prototype.writeUInt8=function(t,e,r){return t=+t,e|=0,r||A(this,t,e,1,255,0),u.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),this[e]=255&t,e+1},u.prototype.writeUInt16LE=function(t,e,r){return t=+t,e|=0,r||A(this,t,e,2,65535,0),u.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8):F(this,t,e,!0),e+2},u.prototype.writeUInt16BE=function(t,e,r){return t=+t,e|=0,r||A(this,t,e,2,65535,0),u.TYPED_ARRAY_SUPPORT?(this[e]=t>>>8,this[e+1]=255&t):F(this,t,e,!1),e+2},u.prototype.writeUInt32LE=function(t,e,r){return t=+t,e|=0,r||A(this,t,e,4,4294967295,0),u.TYPED_ARRAY_SUPPORT?(this[e+3]=t>>>24,this[e+2]=t>>>16,this[e+1]=t>>>8,this[e]=255&t):L(this,t,e,!0),e+4},u.prototype.writeUInt32BE=function(t,e,r){return t=+t,e|=0,r||A(this,t,e,4,4294967295,0),u.TYPED_ARRAY_SUPPORT?(this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t):L(this,t,e,!1),e+4},u.prototype.writeIntLE=function(t,e,r,n){if(t=+t,e|=0,!n){var i=Math.pow(2,8*r-1);A(this,t,e,r,i-1,-i);}var o=0,s=1,a=0;for(this[e]=255&t;++o<r&&(s*=256);)t<0&&0===a&&0!==this[e+o-1]&&(a=1),this[e+o]=(t/s>>0)-a&255;return e+r},u.prototype.writeIntBE=function(t,e,r,n){if(t=+t,e|=0,!n){var i=Math.pow(2,8*r-1);A(this,t,e,r,i-1,-i);}var o=r-1,s=1,a=0;for(this[e+o]=255&t;--o>=0&&(s*=256);)t<0&&0===a&&0!==this[e+o+1]&&(a=1),this[e+o]=(t/s>>0)-a&255;return e+r},u.prototype.writeInt8=function(t,e,r){return t=+t,e|=0,r||A(this,t,e,1,127,-128),u.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),t<0&&(t=255+t+1),this[e]=255&t,e+1},u.prototype.writeInt16LE=function(t,e,r){return t=+t,e|=0,r||A(this,t,e,2,32767,-32768),u.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8):F(this,t,e,!0),e+2},u.prototype.writeInt16BE=function(t,e,r){return t=+t,e|=0,r||A(this,t,e,2,32767,-32768),u.TYPED_ARRAY_SUPPORT?(this[e]=t>>>8,this[e+1]=255&t):F(this,t,e,!1),e+2},u.prototype.writeInt32LE=function(t,e,r){return t=+t,e|=0,r||A(this,t,e,4,2147483647,-2147483648),u.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8,this[e+2]=t>>>16,this[e+3]=t>>>24):L(this,t,e,!0),e+4},u.prototype.writeInt32BE=function(t,e,r){return t=+t,e|=0,r||A(this,t,e,4,2147483647,-2147483648),t<0&&(t=4294967295+t+1),u.TYPED_ARRAY_SUPPORT?(this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t):L(this,t,e,!1),e+4},u.prototype.writeFloatLE=function(t,e,r){return B(this,t,e,!0,r)},u.prototype.writeFloatBE=function(t,e,r){return B(this,t,e,!1,r)},u.prototype.writeDoubleLE=function(t,e,r){return D(this,t,e,!0,r)},u.prototype.writeDoubleBE=function(t,e,r){return D(this,t,e,!1,r)},u.prototype.copy=function(t,e,r,n){if(r||(r=0),n||0===n||(n=this.length),e>=t.length&&(e=t.length),e||(e=0),n>0&&n<r&&(n=r),n===r)return 0;if(0===t.length||0===this.length)return 0;if(e<0)throw new RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw new RangeError("sourceStart out of bounds");if(n<0)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),t.length-e<n-r&&(n=t.length-e+r);var i,o=n-r;if(this===t&&r<e&&e<n)for(i=o-1;i>=0;--i)t[i+e]=this[i+r];else if(o<1e3||!u.TYPED_ARRAY_SUPPORT)for(i=0;i<o;++i)t[i+e]=this[i+r];else Uint8Array.prototype.set.call(t,this.subarray(r,r+o),e);return o},u.prototype.fill=function(t,e,r,n){if("string"==typeof t){if("string"==typeof e?(n=e,e=0,r=this.length):"string"==typeof r&&(n=r,r=this.length),1===t.length){var i=t.charCodeAt(0);i<256&&(t=i);}if(void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string");if("string"==typeof n&&!u.isEncoding(n))throw new TypeError("Unknown encoding: "+n)}else "number"==typeof t&&(t&=255);if(e<0||this.length<e||this.length<r)throw new RangeError("Out of range index");if(r<=e)return this;var o;if(e>>>=0,r=void 0===r?this.length:r>>>0,t||(t=0),"number"==typeof t)for(o=e;o<r;++o)this[o]=t;else {var s=u.isBuffer(t)?t:N(new u(t,n).toString()),a=s.length;for(o=0;o<r-e;++o)this[o+e]=s[o%a];}return this};var I=/[^+\/0-9A-Za-z-_]/g;function U(t){return t<16?"0"+t.toString(16):t.toString(16)}function N(t,e){var r;e=e||1/0;for(var n=t.length,i=null,o=[],s=0;s<n;++s){if((r=t.charCodeAt(s))>55295&&r<57344){if(!i){if(r>56319){(e-=3)>-1&&o.push(239,191,189);continue}if(s+1===n){(e-=3)>-1&&o.push(239,191,189);continue}i=r;continue}if(r<56320){(e-=3)>-1&&o.push(239,191,189),i=r;continue}r=65536+(i-55296<<10|r-56320);}else i&&(e-=3)>-1&&o.push(239,191,189);if(i=null,r<128){if((e-=1)<0)break;o.push(r);}else if(r<2048){if((e-=2)<0)break;o.push(r>>6|192,63&r|128);}else if(r<65536){if((e-=3)<0)break;o.push(r>>12|224,r>>6&63|128,63&r|128);}else {if(!(r<1114112))throw new Error("Invalid code point");if((e-=4)<0)break;o.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128);}}return o}function H(t){return n.toByteArray(function(t){if((t=function(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")}(t).replace(I,"")).length<2)return "";for(;t.length%4!=0;)t+="=";return t}(t))}function V(t,e,r,n){for(var i=0;i<n&&!(i+r>=e.length||i>=t.length);++i)e[i+r]=t[i];return i}}).call(this,r(0));},function(t,e){var r,n,i=t.exports={};function o(){throw new Error("setTimeout has not been defined")}function s(){throw new Error("clearTimeout has not been defined")}function a(t){if(r===setTimeout)return setTimeout(t,0);if((r===o||!r)&&setTimeout)return r=setTimeout,setTimeout(t,0);try{return r(t,0)}catch(e){try{return r.call(null,t,0)}catch(e){return r.call(this,t,0)}}}!function(){try{r="function"==typeof setTimeout?setTimeout:o;}catch(t){r=o;}try{n="function"==typeof clearTimeout?clearTimeout:s;}catch(t){n=s;}}();var u,c=[],l=!1,f=-1;function h(){l&&u&&(l=!1,u.length?c=u.concat(c):f=-1,c.length&&p());}function p(){if(!l){var t=a(h);l=!0;for(var e=c.length;e;){for(u=c,c=[];++f<e;)u&&u[f].run();f=-1,e=c.length;}u=null,l=!1,function(t){if(n===clearTimeout)return clearTimeout(t);if((n===s||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(t);try{n(t);}catch(e){try{return n.call(null,t)}catch(e){return n.call(this,t)}}}(t);}}function d(t,e){this.fun=t,this.array=e;}function _(){}i.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)e[r-1]=arguments[r];c.push(new d(t,e)),1!==c.length||l||a(p);},d.prototype.run=function(){this.fun.apply(null,this.array);},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",i.versions={},i.on=_,i.addListener=_,i.once=_,i.off=_,i.removeListener=_,i.removeAllListeners=_,i.emit=_,i.prependListener=_,i.prependOnceListener=_,i.listeners=function(t){return []},i.binding=function(t){throw new Error("process.binding is not supported")},i.cwd=function(){return "/"},i.chdir=function(t){throw new Error("process.chdir is not supported")},i.umask=function(){return 0};},function(t,e,r){(function(t){function r(t){return Object.prototype.toString.call(t)}e.isArray=function(t){return Array.isArray?Array.isArray(t):"[object Array]"===r(t)},e.isBoolean=function(t){return "boolean"==typeof t},e.isNull=function(t){return null===t},e.isNullOrUndefined=function(t){return null==t},e.isNumber=function(t){return "number"==typeof t},e.isString=function(t){return "string"==typeof t},e.isSymbol=function(t){return "symbol"==typeof t},e.isUndefined=function(t){return void 0===t},e.isRegExp=function(t){return "[object RegExp]"===r(t)},e.isObject=function(t){return "object"==typeof t&&null!==t},e.isDate=function(t){return "[object Date]"===r(t)},e.isError=function(t){return "[object Error]"===r(t)||t instanceof Error},e.isFunction=function(t){return "function"==typeof t},e.isPrimitive=function(t){return null===t||"boolean"==typeof t||"number"==typeof t||"string"==typeof t||"symbol"==typeof t||void 0===t},e.isBuffer=t.isBuffer;}).call(this,r(3).Buffer);},function(t,e,r){(function(e){!e.version||0===e.version.indexOf("v0.")||0===e.version.indexOf("v1.")&&0!==e.version.indexOf("v1.8.")?t.exports={nextTick:function(t,r,n,i){if("function"!=typeof t)throw new TypeError('"callback" argument must be a function');var o,s,a=arguments.length;switch(a){case 0:case 1:return e.nextTick(t);case 2:return e.nextTick(function(){t.call(null,r);});case 3:return e.nextTick(function(){t.call(null,r,n);});case 4:return e.nextTick(function(){t.call(null,r,n,i);});default:for(o=new Array(a-1),s=0;s<o.length;)o[s++]=arguments[s];return e.nextTick(function(){t.apply(null,o);})}}}:t.exports=e;}).call(this,r(4));},function(t,e,r){var n=r(3),i=n.Buffer;function o(t,e){for(var r in t)e[r]=t[r];}function s(t,e,r){return i(t,e,r)}i.from&&i.alloc&&i.allocUnsafe&&i.allocUnsafeSlow?t.exports=n:(o(n,e),e.Buffer=s),o(i,s),s.from=function(t,e,r){if("number"==typeof t)throw new TypeError("Argument must not be a number");return i(t,e,r)},s.alloc=function(t,e,r){if("number"!=typeof t)throw new TypeError("Argument must be a number");var n=i(t);return void 0!==e?"string"==typeof r?n.fill(e,r):n.fill(e):n.fill(0),n},s.allocUnsafe=function(t){if("number"!=typeof t)throw new TypeError("Argument must be a number");return i(t)},s.allocUnsafeSlow=function(t){if("number"!=typeof t)throw new TypeError("Argument must be a number");return n.SlowBuffer(t)};},function(t,e,r){var n=r(17)(Object,"create");t.exports=n;},function(t,e,r){var n=r(31);t.exports=function(t,e){for(var r=t.length;r--;)if(n(t[r][0],e))return r;return -1};},function(t,e,r){var n=r(96);t.exports=function(t,e){var r=t.__data__;return n(e)?r["string"==typeof e?"string":"hash"]:r.map};},function(t,e,r){(function(t){var n=void 0!==t&&t||"undefined"!=typeof self&&self||window,i=Function.prototype.apply;function o(t,e){this._id=t,this._clearFn=e;}e.setTimeout=function(){return new o(i.call(setTimeout,n,arguments),clearTimeout)},e.setInterval=function(){return new o(i.call(setInterval,n,arguments),clearInterval)},e.clearTimeout=e.clearInterval=function(t){t&&t.close();},o.prototype.unref=o.prototype.ref=function(){},o.prototype.close=function(){this._clearFn.call(n,this._id);},e.enroll=function(t,e){clearTimeout(t._idleTimeoutId),t._idleTimeout=e;},e.unenroll=function(t){clearTimeout(t._idleTimeoutId),t._idleTimeout=-1;},e._unrefActive=e.active=function(t){clearTimeout(t._idleTimeoutId);var e=t._idleTimeout;e>=0&&(t._idleTimeoutId=setTimeout(function(){t._onTimeout&&t._onTimeout();},e));},r(35),e.setImmediate="undefined"!=typeof self&&self.setImmediate||void 0!==t&&t.setImmediate||this&&this.setImmediate,e.clearImmediate="undefined"!=typeof self&&self.clearImmediate||void 0!==t&&t.clearImmediate||this&&this.clearImmediate;}).call(this,r(0));},function(t,e){function r(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0;}function n(t){return "function"==typeof t}function i(t){return "object"==typeof t&&null!==t}function o(t){return void 0===t}t.exports=r,r.EventEmitter=r,r.prototype._events=void 0,r.prototype._maxListeners=void 0,r.defaultMaxListeners=10,r.prototype.setMaxListeners=function(t){if(!function(t){return "number"==typeof t}(t)||t<0||isNaN(t))throw TypeError("n must be a positive number");return this._maxListeners=t,this},r.prototype.emit=function(t){var e,r,s,a,u,c;if(this._events||(this._events={}),"error"===t&&(!this._events.error||i(this._events.error)&&!this._events.error.length)){if((e=arguments[1])instanceof Error)throw e;var l=new Error('Uncaught, unspecified "error" event. ('+e+")");throw l.context=e,l}if(o(r=this._events[t]))return !1;if(n(r))switch(arguments.length){case 1:r.call(this);break;case 2:r.call(this,arguments[1]);break;case 3:r.call(this,arguments[1],arguments[2]);break;default:a=Array.prototype.slice.call(arguments,1),r.apply(this,a);}else if(i(r))for(a=Array.prototype.slice.call(arguments,1),s=(c=r.slice()).length,u=0;u<s;u++)c[u].apply(this,a);return !0},r.prototype.addListener=function(t,e){var s;if(!n(e))throw TypeError("listener must be a function");return this._events||(this._events={}),this._events.newListener&&this.emit("newListener",t,n(e.listener)?e.listener:e),this._events[t]?i(this._events[t])?this._events[t].push(e):this._events[t]=[this._events[t],e]:this._events[t]=e,i(this._events[t])&&!this._events[t].warned&&(s=o(this._maxListeners)?r.defaultMaxListeners:this._maxListeners)&&s>0&&this._events[t].length>s&&(this._events[t].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[t].length),"function"==typeof console.trace&&console.trace()),this},r.prototype.on=r.prototype.addListener,r.prototype.once=function(t,e){if(!n(e))throw TypeError("listener must be a function");var r=!1;function i(){this.removeListener(t,i),r||(r=!0,e.apply(this,arguments));}return i.listener=e,this.on(t,i),this},r.prototype.removeListener=function(t,e){var r,o,s,a;if(!n(e))throw TypeError("listener must be a function");if(!this._events||!this._events[t])return this;if(s=(r=this._events[t]).length,o=-1,r===e||n(r.listener)&&r.listener===e)delete this._events[t],this._events.removeListener&&this.emit("removeListener",t,e);else if(i(r)){for(a=s;a-- >0;)if(r[a]===e||r[a].listener&&r[a].listener===e){o=a;break}if(o<0)return this;1===r.length?(r.length=0,delete this._events[t]):r.splice(o,1),this._events.removeListener&&this.emit("removeListener",t,e);}return this},r.prototype.removeAllListeners=function(t){var e,r;if(!this._events)return this;if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[t]&&delete this._events[t],this;if(0===arguments.length){for(e in this._events)"removeListener"!==e&&this.removeAllListeners(e);return this.removeAllListeners("removeListener"),this._events={},this}if(n(r=this._events[t]))this.removeListener(t,r);else if(r)for(;r.length;)this.removeListener(t,r[r.length-1]);return delete this._events[t],this},r.prototype.listeners=function(t){return this._events&&this._events[t]?n(this._events[t])?[this._events[t]]:this._events[t].slice():[]},r.prototype.listenerCount=function(t){if(this._events){var e=this._events[t];if(n(e))return 1;if(e)return e.length}return 0},r.listenerCount=function(t,e){return t.listenerCount(e)};},function(t,e,r){(e=t.exports=r(23)).Stream=e,e.Readable=e,e.Writable=r(14),e.Duplex=r(1),e.Transform=r(27),e.PassThrough=r(45);},function(t,e,r){(function(e,n,i){var o=r(6);function s(t){var e=this;this.next=null,this.entry=null,this.finish=function(){!function(t,e,r){var n=t.entry;for(t.entry=null;n;){var i=n.callback;e.pendingcb--,i(void 0),n=n.next;}e.corkedRequestsFree?e.corkedRequestsFree.next=t:e.corkedRequestsFree=t;}(e,t);};}t.exports=m;var a,u=!e.browser&&["v0.10","v0.9."].indexOf(e.version.slice(0,5))>-1?n:o.nextTick;m.WritableState=y;var c=r(5);c.inherits=r(2);var l,f={deprecate:r(44)},h=r(24),p=r(7).Buffer,d=i.Uint8Array||function(){},_=r(25);function v(){}function y(t,e){a=a||r(1),t=t||{};var n=e instanceof a;this.objectMode=!!t.objectMode,n&&(this.objectMode=this.objectMode||!!t.writableObjectMode);var i=t.highWaterMark,c=t.writableHighWaterMark,l=this.objectMode?16:16384;this.highWaterMark=i||0===i?i:n&&(c||0===c)?c:l,this.highWaterMark=Math.floor(this.highWaterMark),this.finalCalled=!1,this.needDrain=!1,this.ending=!1,this.ended=!1,this.finished=!1,this.destroyed=!1;var f=!1===t.decodeStrings;this.decodeStrings=!f,this.defaultEncoding=t.defaultEncoding||"utf8",this.length=0,this.writing=!1,this.corked=0,this.sync=!0,this.bufferProcessing=!1,this.onwrite=function(t){!function(t,e){var r=t._writableState,n=r.sync,i=r.writecb;if(function(t){t.writing=!1,t.writecb=null,t.length-=t.writelen,t.writelen=0;}(r),e)!function(t,e,r,n,i){--e.pendingcb,r?(o.nextTick(i,n),o.nextTick(x,t,e),t._writableState.errorEmitted=!0,t.emit("error",n)):(i(n),t._writableState.errorEmitted=!0,t.emit("error",n),x(t,e));}(t,r,n,e,i);else {var s=E(r);s||r.corked||r.bufferProcessing||!r.bufferedRequest||w(t,r),n?u(b,t,r,s,i):b(t,r,s,i);}}(e,t);},this.writecb=null,this.writelen=0,this.bufferedRequest=null,this.lastBufferedRequest=null,this.pendingcb=0,this.prefinished=!1,this.errorEmitted=!1,this.bufferedRequestCount=0,this.corkedRequestsFree=new s(this);}function m(t){if(a=a||r(1),!(l.call(m,this)||this instanceof a))return new m(t);this._writableState=new y(t,this),this.writable=!0,t&&("function"==typeof t.write&&(this._write=t.write),"function"==typeof t.writev&&(this._writev=t.writev),"function"==typeof t.destroy&&(this._destroy=t.destroy),"function"==typeof t.final&&(this._final=t.final)),h.call(this);}function g(t,e,r,n,i,o,s){e.writelen=n,e.writecb=s,e.writing=!0,e.sync=!0,r?t._writev(i,e.onwrite):t._write(i,o,e.onwrite),e.sync=!1;}function b(t,e,r,n){r||function(t,e){0===e.length&&e.needDrain&&(e.needDrain=!1,t.emit("drain"));}(t,e),e.pendingcb--,n(),x(t,e);}function w(t,e){e.bufferProcessing=!0;var r=e.bufferedRequest;if(t._writev&&r&&r.next){var n=e.bufferedRequestCount,i=new Array(n),o=e.corkedRequestsFree;o.entry=r;for(var a=0,u=!0;r;)i[a]=r,r.isBuf||(u=!1),r=r.next,a+=1;i.allBuffers=u,g(t,e,!0,e.length,i,"",o.finish),e.pendingcb++,e.lastBufferedRequest=null,o.next?(e.corkedRequestsFree=o.next,o.next=null):e.corkedRequestsFree=new s(e),e.bufferedRequestCount=0;}else {for(;r;){var c=r.chunk,l=r.encoding,f=r.callback;if(g(t,e,!1,e.objectMode?1:c.length,c,l,f),r=r.next,e.bufferedRequestCount--,e.writing)break}null===r&&(e.lastBufferedRequest=null);}e.bufferedRequest=r,e.bufferProcessing=!1;}function E(t){return t.ending&&0===t.length&&null===t.bufferedRequest&&!t.finished&&!t.writing}function C(t,e){t._final(function(r){e.pendingcb--,r&&t.emit("error",r),e.prefinished=!0,t.emit("prefinish"),x(t,e);});}function x(t,e){var r=E(e);return r&&(function(t,e){e.prefinished||e.finalCalled||("function"==typeof t._final?(e.pendingcb++,e.finalCalled=!0,o.nextTick(C,t,e)):(e.prefinished=!0,t.emit("prefinish")));}(t,e),0===e.pendingcb&&(e.finished=!0,t.emit("finish"))),r}c.inherits(m,h),y.prototype.getBuffer=function(){for(var t=this.bufferedRequest,e=[];t;)e.push(t),t=t.next;return e},function(){try{Object.defineProperty(y.prototype,"buffer",{get:f.deprecate(function(){return this.getBuffer()},"_writableState.buffer is deprecated. Use _writableState.getBuffer instead.","DEP0003")});}catch(t){}}(),"function"==typeof Symbol&&Symbol.hasInstance&&"function"==typeof Function.prototype[Symbol.hasInstance]?(l=Function.prototype[Symbol.hasInstance],Object.defineProperty(m,Symbol.hasInstance,{value:function(t){return !!l.call(this,t)||this===m&&t&&t._writableState instanceof y}})):l=function(t){return t instanceof this},m.prototype.pipe=function(){this.emit("error",new Error("Cannot pipe, not readable"));},m.prototype.write=function(t,e,r){var n=this._writableState,i=!1,s=!n.objectMode&&function(t){return p.isBuffer(t)||t instanceof d}(t);return s&&!p.isBuffer(t)&&(t=function(t){return p.from(t)}(t)),"function"==typeof e&&(r=e,e=null),s?e="buffer":e||(e=n.defaultEncoding),"function"!=typeof r&&(r=v),n.ended?function(t,e){var r=new Error("write after end");t.emit("error",r),o.nextTick(e,r);}(this,r):(s||function(t,e,r,n){var i=!0,s=!1;return null===r?s=new TypeError("May not write null values to stream"):"string"==typeof r||void 0===r||e.objectMode||(s=new TypeError("Invalid non-string/buffer chunk")),s&&(t.emit("error",s),o.nextTick(n,s),i=!1),i}(this,n,t,r))&&(n.pendingcb++,i=function(t,e,r,n,i,o){if(!r){var s=function(t,e,r){return t.objectMode||!1===t.decodeStrings||"string"!=typeof e||(e=p.from(e,r)),e}(e,n,i);n!==s&&(r=!0,i="buffer",n=s);}var a=e.objectMode?1:n.length;e.length+=a;var u=e.length<e.highWaterMark;if(u||(e.needDrain=!0),e.writing||e.corked){var c=e.lastBufferedRequest;e.lastBufferedRequest={chunk:n,encoding:i,isBuf:r,callback:o,next:null},c?c.next=e.lastBufferedRequest:e.bufferedRequest=e.lastBufferedRequest,e.bufferedRequestCount+=1;}else g(t,e,!1,a,n,i,o);return u}(this,n,s,t,e,r)),i},m.prototype.cork=function(){this._writableState.corked++;},m.prototype.uncork=function(){var t=this._writableState;t.corked&&(t.corked--,t.writing||t.corked||t.finished||t.bufferProcessing||!t.bufferedRequest||w(this,t));},m.prototype.setDefaultEncoding=function(t){if("string"==typeof t&&(t=t.toLowerCase()),!(["hex","utf8","utf-8","ascii","binary","base64","ucs2","ucs-2","utf16le","utf-16le","raw"].indexOf((t+"").toLowerCase())>-1))throw new TypeError("Unknown encoding: "+t);return this._writableState.defaultEncoding=t,this},Object.defineProperty(m.prototype,"writableHighWaterMark",{enumerable:!1,get:function(){return this._writableState.highWaterMark}}),m.prototype._write=function(t,e,r){r(new Error("_write() is not implemented"));},m.prototype._writev=null,m.prototype.end=function(t,e,r){var n=this._writableState;"function"==typeof t?(r=t,t=null,e=null):"function"==typeof e&&(r=e,e=null),null!==t&&void 0!==t&&this.write(t,e),n.corked&&(n.corked=1,this.uncork()),n.ending||n.finished||function(t,e,r){e.ending=!0,x(t,e),r&&(e.finished?o.nextTick(r):t.once("finish",r)),e.ended=!0,t.writable=!1;}(this,n,r);},Object.defineProperty(m.prototype,"destroyed",{get:function(){return void 0!==this._writableState&&this._writableState.destroyed},set:function(t){this._writableState&&(this._writableState.destroyed=t);}}),m.prototype.destroy=_.destroy,m.prototype._undestroy=_.undestroy,m.prototype._destroy=function(t,e){this.end(),e(t);};}).call(this,r(4),r(11).setImmediate,r(0));},function(t,e,r){(function(e,r,n){t.exports=function t(e,r,n){function i(s,a){if(!r[s]){if(!e[s]){var u="function"==typeof _dereq_&&_dereq_;if(!a&&u)return u(s,!0);if(o)return o(s,!0);var c=new Error("Cannot find module '"+s+"'");throw c.code="MODULE_NOT_FOUND",c}var l=r[s]={exports:{}};e[s][0].call(l.exports,function(t){return i(e[s][1][t]||t)},l,l.exports,t,e,r,n);}return r[s].exports}for(var o="function"==typeof _dereq_&&_dereq_,s=0;s<n.length;s++)i(n[s]);return i}({1:[function(t,e,r){e.exports=function(t){var e=t._SomePromiseArray;function r(t){var r=new e(t),n=r.promise();return r.setHowMany(1),r.setUnwrap(),r.init(),n}t.any=function(t){return r(t)},t.prototype.any=function(){return r(this)};};},{}],2:[function(t,r,n){var i;try{throw new Error}catch(t){i=t;}var o=t("./schedule"),s=t("./queue"),a=t("./util");function u(){this._customScheduler=!1,this._isTickUsed=!1,this._lateQueue=new s(16),this._normalQueue=new s(16),this._haveDrainedQueues=!1,this._trampolineEnabled=!0;var t=this;this.drainQueues=function(){t._drainQueues();},this._schedule=o;}function c(t,e,r){this._lateQueue.push(t,e,r),this._queueTick();}function l(t,e,r){this._normalQueue.push(t,e,r),this._queueTick();}function f(t){this._normalQueue._pushOne(t),this._queueTick();}u.prototype.setScheduler=function(t){var e=this._schedule;return this._schedule=t,this._customScheduler=!0,e},u.prototype.hasCustomScheduler=function(){return this._customScheduler},u.prototype.enableTrampoline=function(){this._trampolineEnabled=!0;},u.prototype.disableTrampolineIfNecessary=function(){a.hasDevTools&&(this._trampolineEnabled=!1);},u.prototype.haveItemsQueued=function(){return this._isTickUsed||this._haveDrainedQueues},u.prototype.fatalError=function(t,r){r?(e.stderr.write("Fatal "+(t instanceof Error?t.stack:t)+"\n"),e.exit(2)):this.throwLater(t);},u.prototype.throwLater=function(t,e){if(1===arguments.length&&(e=t,t=function(){throw e}),"undefined"!=typeof setTimeout)setTimeout(function(){t(e);},0);else try{this._schedule(function(){t(e);});}catch(t){throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n")}},a.hasDevTools?(u.prototype.invokeLater=function(t,e,r){this._trampolineEnabled?c.call(this,t,e,r):this._schedule(function(){setTimeout(function(){t.call(e,r);},100);});},u.prototype.invoke=function(t,e,r){this._trampolineEnabled?l.call(this,t,e,r):this._schedule(function(){t.call(e,r);});},u.prototype.settlePromises=function(t){this._trampolineEnabled?f.call(this,t):this._schedule(function(){t._settlePromises();});}):(u.prototype.invokeLater=c,u.prototype.invoke=l,u.prototype.settlePromises=f),u.prototype._drainQueue=function(t){for(;t.length()>0;){var e=t.shift();if("function"==typeof e){var r=t.shift(),n=t.shift();e.call(r,n);}else e._settlePromises();}},u.prototype._drainQueues=function(){this._drainQueue(this._normalQueue),this._reset(),this._haveDrainedQueues=!0,this._drainQueue(this._lateQueue);},u.prototype._queueTick=function(){this._isTickUsed||(this._isTickUsed=!0,this._schedule(this.drainQueues));},u.prototype._reset=function(){this._isTickUsed=!1;},r.exports=u,r.exports.firstLineError=i;},{"./queue":26,"./schedule":29,"./util":36}],3:[function(t,e,r){e.exports=function(t,e,r,n){var i=!1,o=function(t,e){this._reject(e);},s=function(t,e){e.promiseRejectionQueued=!0,e.bindingPromise._then(o,o,null,this,t);},a=function(t,e){0==(50397184&this._bitField)&&this._resolveCallback(e.target);},u=function(t,e){e.promiseRejectionQueued||this._reject(t);};t.prototype.bind=function(o){i||(i=!0,t.prototype._propagateFrom=n.propagateFromFunction(),t.prototype._boundValue=n.boundValueFunction());var c=r(o),l=new t(e);l._propagateFrom(this,1);var f=this._target();if(l._setBoundTo(c),c instanceof t){var h={promiseRejectionQueued:!1,promise:l,target:f,bindingPromise:c};f._then(e,s,void 0,l,h),c._then(a,u,void 0,l,h),l._setOnCancel(c);}else l._resolveCallback(f);return l},t.prototype._setBoundTo=function(t){void 0!==t?(this._bitField=2097152|this._bitField,this._boundTo=t):this._bitField=-2097153&this._bitField;},t.prototype._isBound=function(){return 2097152==(2097152&this._bitField)},t.bind=function(e,r){return t.resolve(r).bind(e)};};},{}],4:[function(t,e,r){var n;"undefined"!=typeof Promise&&(n=Promise);var i=t("./promise")();i.noConflict=function(){try{Promise===i&&(Promise=n);}catch(t){}return i},e.exports=i;},{"./promise":22}],5:[function(t,e,r){var n=Object.create;if(n){var i=n(null),o=n(null);i[" size"]=o[" size"]=0;}e.exports=function(e){var r=t("./util"),n=r.canEvaluate;function i(t){return function(t,n){var i;if(null!=t&&(i=t[n]),"function"!=typeof i){var o="Object "+r.classString(t)+" has no method '"+r.toString(n)+"'";throw new e.TypeError(o)}return i}(t,this.pop()).apply(t,this)}function o(t){return t[this]}function s(t){var e=+this;return e<0&&(e=Math.max(0,e+t.length)),t[e]}r.isIdentifier,e.prototype.call=function(t){var e=[].slice.call(arguments,1);return e.push(t),this._then(i,void 0,void 0,e,void 0)},e.prototype.get=function(t){var e;if("number"==typeof t)e=s;else if(n){var r=(void 0)(t);e=null!==r?r:o;}else e=o;return this._then(e,void 0,void 0,t,void 0)};};},{"./util":36}],6:[function(t,e,r){e.exports=function(e,r,n,i){var o=t("./util"),s=o.tryCatch,a=o.errorObj,u=e._async;e.prototype.break=e.prototype.cancel=function(){if(!i.cancellation())return this._warn("cancellation is disabled");for(var t=this,e=t;t._isCancellable();){if(!t._cancelBy(e)){e._isFollowing()?e._followee().cancel():e._cancelBranched();break}var r=t._cancellationParent;if(null==r||!r._isCancellable()){t._isFollowing()?t._followee().cancel():t._cancelBranched();break}t._isFollowing()&&t._followee().cancel(),t._setWillBeCancelled(),e=t,t=r;}},e.prototype._branchHasCancelled=function(){this._branchesRemainingToCancel--;},e.prototype._enoughBranchesHaveCancelled=function(){return void 0===this._branchesRemainingToCancel||this._branchesRemainingToCancel<=0},e.prototype._cancelBy=function(t){return t===this?(this._branchesRemainingToCancel=0,this._invokeOnCancel(),!0):(this._branchHasCancelled(),!!this._enoughBranchesHaveCancelled()&&(this._invokeOnCancel(),!0))},e.prototype._cancelBranched=function(){this._enoughBranchesHaveCancelled()&&this._cancel();},e.prototype._cancel=function(){this._isCancellable()&&(this._setCancelled(),u.invoke(this._cancelPromises,this,void 0));},e.prototype._cancelPromises=function(){this._length()>0&&this._settlePromises();},e.prototype._unsetOnCancel=function(){this._onCancelField=void 0;},e.prototype._isCancellable=function(){return this.isPending()&&!this._isCancelled()},e.prototype.isCancellable=function(){return this.isPending()&&!this.isCancelled()},e.prototype._doInvokeOnCancel=function(t,e){if(o.isArray(t))for(var r=0;r<t.length;++r)this._doInvokeOnCancel(t[r],e);else if(void 0!==t)if("function"==typeof t){if(!e){var n=s(t).call(this._boundValue());n===a&&(this._attachExtraTrace(n.e),u.throwLater(n.e));}}else t._resultCancelled(this);},e.prototype._invokeOnCancel=function(){var t=this._onCancel();this._unsetOnCancel(),u.invoke(this._doInvokeOnCancel,this,t);},e.prototype._invokeInternalOnCancel=function(){this._isCancellable()&&(this._doInvokeOnCancel(this._onCancel(),!0),this._unsetOnCancel());},e.prototype._resultCancelled=function(){this.cancel();};};},{"./util":36}],7:[function(t,e,r){e.exports=function(e){var r=t("./util"),n=t("./es5").keys,i=r.tryCatch,o=r.errorObj;return function(t,s,a){return function(u){var c=a._boundValue();t:for(var l=0;l<t.length;++l){var f=t[l];if(f===Error||null!=f&&f.prototype instanceof Error){if(u instanceof f)return i(s).call(c,u)}else if("function"==typeof f){var h=i(f).call(c,u);if(h===o)return h;if(h)return i(s).call(c,u)}else if(r.isObject(u)){for(var p=n(f),d=0;d<p.length;++d){var _=p[d];if(f[_]!=u[_])continue t}return i(s).call(c,u)}}return e}}};},{"./es5":13,"./util":36}],8:[function(t,e,r){e.exports=function(t){var e=!1,r=[];function n(){this._trace=new n.CapturedTrace(i());}function i(){var t=r.length-1;if(t>=0)return r[t]}return t.prototype._promiseCreated=function(){},t.prototype._pushContext=function(){},t.prototype._popContext=function(){return null},t._peekContext=t.prototype._peekContext=function(){},n.prototype._pushContext=function(){void 0!==this._trace&&(this._trace._promiseCreated=null,r.push(this._trace));},n.prototype._popContext=function(){if(void 0!==this._trace){var t=r.pop(),e=t._promiseCreated;return t._promiseCreated=null,e}return null},n.CapturedTrace=null,n.create=function(){if(e)return new n},n.deactivateLongStackTraces=function(){},n.activateLongStackTraces=function(){var r=t.prototype._pushContext,o=t.prototype._popContext,s=t._peekContext,a=t.prototype._peekContext,u=t.prototype._promiseCreated;n.deactivateLongStackTraces=function(){t.prototype._pushContext=r,t.prototype._popContext=o,t._peekContext=s,t.prototype._peekContext=a,t.prototype._promiseCreated=u,e=!1;},e=!0,t.prototype._pushContext=n.prototype._pushContext,t.prototype._popContext=n.prototype._popContext,t._peekContext=t.prototype._peekContext=i,t.prototype._promiseCreated=function(){var t=this._peekContext();t&&null==t._promiseCreated&&(t._promiseCreated=this);};},n};},{}],9:[function(t,r,n){r.exports=function(r,n){var i,o,s,a=r._getDomain,u=r._async,c=t("./errors").Warning,l=t("./util"),f=l.canAttachTrace,h=/[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/,p=/\((?:timers\.js):\d+:\d+\)/,d=/[\/<\(](.+?):(\d+):(\d+)\)?\s*$/,_=null,v=null,y=!1,m=!(0==l.env("BLUEBIRD_DEBUG")),g=!(0==l.env("BLUEBIRD_WARNINGS")||!m&&!l.env("BLUEBIRD_WARNINGS")),b=!(0==l.env("BLUEBIRD_LONG_STACK_TRACES")||!m&&!l.env("BLUEBIRD_LONG_STACK_TRACES")),w=0!=l.env("BLUEBIRD_W_FORGOTTEN_RETURN")&&(g||!!l.env("BLUEBIRD_W_FORGOTTEN_RETURN"));r.prototype.suppressUnhandledRejections=function(){var t=this._target();t._bitField=-1048577&t._bitField|524288;},r.prototype._ensurePossibleRejectionHandled=function(){if(0==(524288&this._bitField)){this._setRejectionIsUnhandled();var t=this;setTimeout(function(){t._notifyUnhandledRejection();},1);}},r.prototype._notifyUnhandledRejectionIsHandled=function(){q("rejectionHandled",i,void 0,this);},r.prototype._setReturnedNonUndefined=function(){this._bitField=268435456|this._bitField;},r.prototype._returnedNonUndefined=function(){return 0!=(268435456&this._bitField)},r.prototype._notifyUnhandledRejection=function(){if(this._isRejectionUnhandled()){var t=this._settledValue();this._setUnhandledRejectionIsNotified(),q("unhandledRejection",o,t,this);}},r.prototype._setUnhandledRejectionIsNotified=function(){this._bitField=262144|this._bitField;},r.prototype._unsetUnhandledRejectionIsNotified=function(){this._bitField=-262145&this._bitField;},r.prototype._isUnhandledRejectionNotified=function(){return (262144&this._bitField)>0},r.prototype._setRejectionIsUnhandled=function(){this._bitField=1048576|this._bitField;},r.prototype._unsetRejectionIsUnhandled=function(){this._bitField=-1048577&this._bitField,this._isUnhandledRejectionNotified()&&(this._unsetUnhandledRejectionIsNotified(),this._notifyUnhandledRejectionIsHandled());},r.prototype._isRejectionUnhandled=function(){return (1048576&this._bitField)>0},r.prototype._warn=function(t,e,r){return U(t,e,r||this)},r.onPossiblyUnhandledRejection=function(t){var e=a();o="function"==typeof t?null===e?t:l.domainBind(e,t):void 0;},r.onUnhandledRejectionHandled=function(t){var e=a();i="function"==typeof t?null===e?t:l.domainBind(e,t):void 0;};var E=function(){};r.longStackTraces=function(){if(u.haveItemsQueued()&&!J.longStackTraces)throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");if(!J.longStackTraces&&Y()){var t=r.prototype._captureStackTrace,e=r.prototype._attachExtraTrace;J.longStackTraces=!0,E=function(){if(u.haveItemsQueued()&&!J.longStackTraces)throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");r.prototype._captureStackTrace=t,r.prototype._attachExtraTrace=e,n.deactivateLongStackTraces(),u.enableTrampoline(),J.longStackTraces=!1;},r.prototype._captureStackTrace=D,r.prototype._attachExtraTrace=I,n.activateLongStackTraces(),u.disableTrampolineIfNecessary();}},r.hasLongStackTraces=function(){return J.longStackTraces&&Y()};var C=function(){try{if("function"==typeof CustomEvent){var t=new CustomEvent("CustomEvent");return l.global.dispatchEvent(t),function(t,e){var r=new CustomEvent(t.toLowerCase(),{detail:e,cancelable:!0});return !l.global.dispatchEvent(r)}}return "function"==typeof Event?(t=new Event("CustomEvent"),l.global.dispatchEvent(t),function(t,e){var r=new Event(t.toLowerCase(),{cancelable:!0});return r.detail=e,!l.global.dispatchEvent(r)}):((t=document.createEvent("CustomEvent")).initCustomEvent("testingtheevent",!1,!0,{}),l.global.dispatchEvent(t),function(t,e){var r=document.createEvent("CustomEvent");return r.initCustomEvent(t.toLowerCase(),!1,!0,e),!l.global.dispatchEvent(r)})}catch(t){}return function(){return !1}}(),x=l.isNode?function(){return e.emit.apply(e,arguments)}:l.global?function(t){var e="on"+t.toLowerCase(),r=l.global[e];return !!r&&(r.apply(l.global,[].slice.call(arguments,1)),!0)}:function(){return !1};function j(t,e){return {promise:e}}var S={promiseCreated:j,promiseFulfilled:j,promiseRejected:j,promiseResolved:j,promiseCancelled:j,promiseChained:function(t,e,r){return {promise:e,child:r}},warning:function(t,e){return {warning:e}},unhandledRejection:function(t,e,r){return {reason:e,promise:r}},rejectionHandled:j},R=function(t){var e=!1;try{e=x.apply(null,arguments);}catch(t){u.throwLater(t),e=!0;}var r=!1;try{r=C(t,S[t].apply(null,arguments));}catch(t){u.throwLater(t),r=!0;}return r||e};function k(){return !1}function T(t,e,r){var n=this;try{t(e,r,function(t){if("function"!=typeof t)throw new TypeError("onCancel must be a function, got: "+l.toString(t));n._attachCancellationCallback(t);});}catch(t){return t}}function P(t){if(!this._isCancellable())return this;var e=this._onCancel();void 0!==e?l.isArray(e)?e.push(t):this._setOnCancel([e,t]):this._setOnCancel(t);}function O(){return this._onCancelField}function A(t){this._onCancelField=t;}function F(){this._cancellationParent=void 0,this._onCancelField=void 0;}function L(t,e){if(0!=(1&e)){this._cancellationParent=t;var r=t._branchesRemainingToCancel;void 0===r&&(r=0),t._branchesRemainingToCancel=r+1;}0!=(2&e)&&t._isBound()&&this._setBoundTo(t._boundTo);}r.config=function(t){if("longStackTraces"in(t=Object(t))&&(t.longStackTraces?r.longStackTraces():!t.longStackTraces&&r.hasLongStackTraces()&&E()),"warnings"in t){var e=t.warnings;J.warnings=!!e,w=J.warnings,l.isObject(e)&&"wForgottenReturn"in e&&(w=!!e.wForgottenReturn);}if("cancellation"in t&&t.cancellation&&!J.cancellation){if(u.haveItemsQueued())throw new Error("cannot enable cancellation after promises are in use");r.prototype._clearCancellationData=F,r.prototype._propagateFrom=L,r.prototype._onCancel=O,r.prototype._setOnCancel=A,r.prototype._attachCancellationCallback=P,r.prototype._execute=T,M=L,J.cancellation=!0;}return "monitoring"in t&&(t.monitoring&&!J.monitoring?(J.monitoring=!0,r.prototype._fireEvent=R):!t.monitoring&&J.monitoring&&(J.monitoring=!1,r.prototype._fireEvent=k)),r},r.prototype._fireEvent=k,r.prototype._execute=function(t,e,r){try{t(e,r);}catch(t){return t}},r.prototype._onCancel=function(){},r.prototype._setOnCancel=function(t){},r.prototype._attachCancellationCallback=function(t){},r.prototype._captureStackTrace=function(){},r.prototype._attachExtraTrace=function(){},r.prototype._clearCancellationData=function(){},r.prototype._propagateFrom=function(t,e){};var M=function(t,e){0!=(2&e)&&t._isBound()&&this._setBoundTo(t._boundTo);};function B(){var t=this._boundTo;return void 0!==t&&t instanceof r?t.isFulfilled()?t.value():void 0:t}function D(){this._trace=new X(this._peekContext());}function I(t,e){if(f(t)){var r=this._trace;if(void 0!==r&&e&&(r=r._parent),void 0!==r)r.attachExtraTrace(t);else if(!t.__stackCleaned__){var n=H(t);l.notEnumerableProp(t,"stack",n.message+"\n"+n.stack.join("\n")),l.notEnumerableProp(t,"__stackCleaned__",!0);}}}function U(t,e,n){if(J.warnings){var i,o=new c(t);if(e)n._attachExtraTrace(o);else if(J.longStackTraces&&(i=r._peekContext()))i.attachExtraTrace(o);else {var s=H(o);o.stack=s.message+"\n"+s.stack.join("\n");}R("warning",o)||V(o,"",!0);}}function N(t){for(var e=[],r=0;r<t.length;++r){var n=t[r],i="    (No stack trace)"===n||_.test(n),o=i&&$(n);i&&!o&&(y&&" "!==n.charAt(0)&&(n="    "+n),e.push(n));}return e}function H(t){var e=t.stack,r=t.toString();return e="string"==typeof e&&e.length>0?function(t){for(var e=t.stack.replace(/\s+$/g,"").split("\n"),r=0;r<e.length;++r){var n=e[r];if("    (No stack trace)"===n||_.test(n))break}return r>0&&"SyntaxError"!=t.name&&(e=e.slice(r)),e}(t):["    (No stack trace)"],{message:r,stack:"SyntaxError"==t.name?e:N(e)}}function V(t,e,r){if("undefined"!=typeof console){var n;if(l.isObject(t)){var i=t.stack;n=e+v(i,t);}else n=e+String(t);"function"==typeof s?s(n,r):"function"!=typeof console.log&&"object"!=typeof console.log||console.log(n);}}function q(t,e,r,n){var i=!1;try{"function"==typeof e&&(i=!0,"rejectionHandled"===t?e(n):e(r,n));}catch(t){u.throwLater(t);}"unhandledRejection"===t?R(t,r,n)||i||V(r,"Unhandled rejection "):R(t,n);}function W(t){var e;if("function"==typeof t)e="[function "+(t.name||"anonymous")+"]";else {if(e=t&&"function"==typeof t.toString?t.toString():l.toString(t),/\[object [a-zA-Z0-9$_]+\]/.test(e))try{e=JSON.stringify(t);}catch(t){}0===e.length&&(e="(empty array)");}return "(<"+function(t){return t.length<41?t:t.substr(0,38)+"..."}(e)+">, no stack trace)"}function Y(){return "function"==typeof G}var $=function(){return !1},z=/[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;function Q(t){var e=t.match(z);if(e)return {fileName:e[1],line:parseInt(e[2],10)}}function X(t){this._parent=t,this._promisesCreated=0;var e=this._length=1+(void 0===t?0:t._length);G(this,X),e>32&&this.uncycle();}l.inherits(X,Error),n.CapturedTrace=X,X.prototype.uncycle=function(){var t=this._length;if(!(t<2)){for(var e=[],r={},n=0,i=this;void 0!==i;++n)e.push(i),i=i._parent;for(n=(t=this._length=n)-1;n>=0;--n){var o=e[n].stack;void 0===r[o]&&(r[o]=n);}for(n=0;n<t;++n){var s=r[e[n].stack];if(void 0!==s&&s!==n){s>0&&(e[s-1]._parent=void 0,e[s-1]._length=1),e[n]._parent=void 0,e[n]._length=1;var a=n>0?e[n-1]:this;s<t-1?(a._parent=e[s+1],a._parent.uncycle(),a._length=a._parent._length+1):(a._parent=void 0,a._length=1);for(var u=a._length+1,c=n-2;c>=0;--c)e[c]._length=u,u++;return}}}},X.prototype.attachExtraTrace=function(t){if(!t.__stackCleaned__){this.uncycle();for(var e=H(t),r=e.message,n=[e.stack],i=this;void 0!==i;)n.push(N(i.stack.split("\n"))),i=i._parent;!function(t){for(var e=t[0],r=1;r<t.length;++r){for(var n=t[r],i=e.length-1,o=e[i],s=-1,a=n.length-1;a>=0;--a)if(n[a]===o){s=a;break}for(a=s;a>=0;--a){var u=n[a];if(e[i]!==u)break;e.pop(),i--;}e=n;}}(n),function(t){for(var e=0;e<t.length;++e)(0===t[e].length||e+1<t.length&&t[e][0]===t[e+1][0])&&(t.splice(e,1),e--);}(n),l.notEnumerableProp(t,"stack",function(t,e){for(var r=0;r<e.length-1;++r)e[r].push("From previous event:"),e[r]=e[r].join("\n");return r<e.length&&(e[r]=e[r].join("\n")),t+"\n"+e.join("\n")}(r,n)),l.notEnumerableProp(t,"__stackCleaned__",!0);}};var G=function(){var t=/^\s*at\s*/,e=function(t,e){return "string"==typeof t?t:void 0!==e.name&&void 0!==e.message?e.toString():W(e)};if("number"==typeof Error.stackTraceLimit&&"function"==typeof Error.captureStackTrace){Error.stackTraceLimit+=6,_=t,v=e;var r=Error.captureStackTrace;return $=function(t){return h.test(t)},function(t,e){Error.stackTraceLimit+=6,r(t,e),Error.stackTraceLimit-=6;}}var n,i=new Error;if("string"==typeof i.stack&&i.stack.split("\n")[0].indexOf("stackDetection@")>=0)return _=/@/,v=e,y=!0,function(t){t.stack=(new Error).stack;};try{throw new Error}catch(t){n="stack"in t;}return "stack"in i||!n||"number"!=typeof Error.stackTraceLimit?(v=function(t,e){return "string"==typeof t?t:"object"!=typeof e&&"function"!=typeof e||void 0===e.name||void 0===e.message?W(e):e.toString()},null):(_=t,v=e,function(t){Error.stackTraceLimit+=6;try{throw new Error}catch(e){t.stack=e.stack;}Error.stackTraceLimit-=6;})}();"undefined"!=typeof console&&void 0!==console.warn&&(s=function(t){console.warn(t);},l.isNode&&e.stderr.isTTY?s=function(t,e){var r=e?"[33m":"[31m";console.warn(r+t+"[0m\n");}:l.isNode||"string"!=typeof(new Error).stack||(s=function(t,e){console.warn("%c"+t,e?"color: darkorange":"color: red");}));var J={warnings:g,longStackTraces:!1,cancellation:!1,monitoring:!1};return b&&r.longStackTraces(),{longStackTraces:function(){return J.longStackTraces},warnings:function(){return J.warnings},cancellation:function(){return J.cancellation},monitoring:function(){return J.monitoring},propagateFromFunction:function(){return M},boundValueFunction:function(){return B},checkForgottenReturns:function(t,e,r,n,i){if(void 0===t&&null!==e&&w){if(void 0!==i&&i._returnedNonUndefined())return;if(0==(65535&n._bitField))return;r&&(r+=" ");var o="",s="";if(e._trace){for(var a=e._trace.stack.split("\n"),u=N(a),c=u.length-1;c>=0;--c){var l=u[c];if(!p.test(l)){var f=l.match(d);f&&(o="at "+f[1]+":"+f[2]+":"+f[3]+" ");break}}if(u.length>0){var h=u[0];for(c=0;c<a.length;++c)if(a[c]===h){c>0&&(s="\n"+a[c-1]);break}}}var _="a promise was created in a "+r+"handler "+o+"but was not returned from it, see http://goo.gl/rRqMUw"+s;n._warn(_,!0,e);}},setBounds:function(t,e){if(Y()){for(var r,n,i=t.stack.split("\n"),o=e.stack.split("\n"),s=-1,a=-1,u=0;u<i.length;++u)if(c=Q(i[u])){r=c.fileName,s=c.line;break}for(u=0;u<o.length;++u){var c;if(c=Q(o[u])){n=c.fileName,a=c.line;break}}s<0||a<0||!r||!n||r!==n||s>=a||($=function(t){if(h.test(t))return !0;var e=Q(t);return !!(e&&e.fileName===r&&s<=e.line&&e.line<=a)});}},warn:U,deprecated:function(t,e){var r=t+" is deprecated and will be removed in a future version.";return e&&(r+=" Use "+e+" instead."),U(r)},CapturedTrace:X,fireDomEvent:C,fireGlobalEvent:x}};},{"./errors":12,"./util":36}],10:[function(t,e,r){e.exports=function(t){function e(){return this.value}function r(){throw this.reason}t.prototype.return=t.prototype.thenReturn=function(r){return r instanceof t&&r.suppressUnhandledRejections(),this._then(e,void 0,void 0,{value:r},void 0)},t.prototype.throw=t.prototype.thenThrow=function(t){return this._then(r,void 0,void 0,{reason:t},void 0)},t.prototype.catchThrow=function(t){if(arguments.length<=1)return this._then(void 0,r,void 0,{reason:t},void 0);var e=arguments[1];return this.caught(t,function(){throw e})},t.prototype.catchReturn=function(r){if(arguments.length<=1)return r instanceof t&&r.suppressUnhandledRejections(),this._then(void 0,e,void 0,{value:r},void 0);var n=arguments[1];return n instanceof t&&n.suppressUnhandledRejections(),this.caught(r,function(){return n})};};},{}],11:[function(t,e,r){e.exports=function(t,e){var r=t.reduce,n=t.all;function i(){return n(this)}t.prototype.each=function(t){return r(this,t,e,0)._then(i,void 0,void 0,this,void 0)},t.prototype.mapSeries=function(t){return r(this,t,e,e)},t.each=function(t,n){return r(t,n,e,0)._then(i,void 0,void 0,t,void 0)},t.mapSeries=function(t,n){return r(t,n,e,e)};};},{}],12:[function(t,e,r){var n,i,o=t("./es5"),s=o.freeze,a=t("./util"),u=a.inherits,c=a.notEnumerableProp;function l(t,e){function r(n){if(!(this instanceof r))return new r(n);c(this,"message","string"==typeof n?n:e),c(this,"name",t),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):Error.call(this);}return u(r,Error),r}var f=l("Warning","warning"),h=l("CancellationError","cancellation error"),p=l("TimeoutError","timeout error"),d=l("AggregateError","aggregate error");try{n=TypeError,i=RangeError;}catch(t){n=l("TypeError","type error"),i=l("RangeError","range error");}for(var _="join pop push shift unshift slice filter forEach some every map indexOf lastIndexOf reduce reduceRight sort reverse".split(" "),v=0;v<_.length;++v)"function"==typeof Array.prototype[_[v]]&&(d.prototype[_[v]]=Array.prototype[_[v]]);o.defineProperty(d.prototype,"length",{value:0,configurable:!1,writable:!0,enumerable:!0}),d.prototype.isOperational=!0;var y=0;function m(t){if(!(this instanceof m))return new m(t);c(this,"name","OperationalError"),c(this,"message",t),this.cause=t,this.isOperational=!0,t instanceof Error?(c(this,"message",t.message),c(this,"stack",t.stack)):Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor);}d.prototype.toString=function(){var t=Array(4*y+1).join(" "),e="\n"+t+"AggregateError of:\n";y++,t=Array(4*y+1).join(" ");for(var r=0;r<this.length;++r){for(var n=this[r]===this?"[Circular AggregateError]":this[r]+"",i=n.split("\n"),o=0;o<i.length;++o)i[o]=t+i[o];e+=(n=i.join("\n"))+"\n";}return y--,e},u(m,Error);var g=Error.__BluebirdErrorTypes__;g||(g=s({CancellationError:h,TimeoutError:p,OperationalError:m,RejectionError:m,AggregateError:d}),o.defineProperty(Error,"__BluebirdErrorTypes__",{value:g,writable:!1,enumerable:!1,configurable:!1})),e.exports={Error:Error,TypeError:n,RangeError:i,CancellationError:g.CancellationError,OperationalError:g.OperationalError,TimeoutError:g.TimeoutError,AggregateError:g.AggregateError,Warning:f};},{"./es5":13,"./util":36}],13:[function(t,e,r){var n=function(){return void 0===this}();if(n)e.exports={freeze:Object.freeze,defineProperty:Object.defineProperty,getDescriptor:Object.getOwnPropertyDescriptor,keys:Object.keys,names:Object.getOwnPropertyNames,getPrototypeOf:Object.getPrototypeOf,isArray:Array.isArray,isES5:n,propertyIsWritable:function(t,e){var r=Object.getOwnPropertyDescriptor(t,e);return !(r&&!r.writable&&!r.set)}};else {var i={}.hasOwnProperty,o={}.toString,s={}.constructor.prototype,a=function(t){var e=[];for(var r in t)i.call(t,r)&&e.push(r);return e};e.exports={isArray:function(t){try{return "[object Array]"===o.call(t)}catch(t){return !1}},keys:a,names:a,defineProperty:function(t,e,r){return t[e]=r.value,t},getDescriptor:function(t,e){return {value:t[e]}},freeze:function(t){return t},getPrototypeOf:function(t){try{return Object(t).constructor.prototype}catch(t){return s}},isES5:n,propertyIsWritable:function(){return !0}};}},{}],14:[function(t,e,r){e.exports=function(t,e){var r=t.map;t.prototype.filter=function(t,n){return r(this,t,n,e)},t.filter=function(t,n,i){return r(t,n,i,e)};};},{}],15:[function(t,e,r){e.exports=function(e,r,n){var i=t("./util"),o=e.CancellationError,s=i.errorObj,a=t("./catch_filter")(n);function u(t,e,r){this.promise=t,this.type=e,this.handler=r,this.called=!1,this.cancelPromise=null;}function c(t){this.finallyHandler=t;}function l(t,e){return null!=t.cancelPromise&&(arguments.length>1?t.cancelPromise._reject(e):t.cancelPromise._cancel(),t.cancelPromise=null,!0)}function f(){return p.call(this,this.promise._target()._settledValue())}function h(t){if(!l(this,t))return s.e=t,s}function p(t){var i=this.promise,a=this.handler;if(!this.called){this.called=!0;var u=this.isFinallyHandler()?a.call(i._boundValue()):a.call(i._boundValue(),t);if(u===n)return u;if(void 0!==u){i._setReturnedNonUndefined();var p=r(u,i);if(p instanceof e){if(null!=this.cancelPromise){if(p._isCancelled()){var d=new o("late cancellation observer");return i._attachExtraTrace(d),s.e=d,s}p.isPending()&&p._attachCancellationCallback(new c(this));}return p._then(f,h,void 0,this,void 0)}}}return i.isRejected()?(l(this),s.e=t,s):(l(this),t)}return u.prototype.isFinallyHandler=function(){return 0===this.type},c.prototype._resultCancelled=function(){l(this.finallyHandler);},e.prototype._passThrough=function(t,e,r,n){return "function"!=typeof t?this.then():this._then(r,n,void 0,new u(this,e,t),void 0)},e.prototype.lastly=e.prototype.finally=function(t){return this._passThrough(t,0,p,p)},e.prototype.tap=function(t){return this._passThrough(t,1,p)},e.prototype.tapCatch=function(t){var r=arguments.length;if(1===r)return this._passThrough(t,1,void 0,p);var n,o=new Array(r-1),s=0;for(n=0;n<r-1;++n){var u=arguments[n];if(!i.isObject(u))return e.reject(new TypeError("tapCatch statement predicate: expecting an object but got "+i.classString(u)));o[s++]=u;}o.length=s;var c=arguments[n];return this._passThrough(a(o,c,this),1,void 0,p)},u};},{"./catch_filter":7,"./util":36}],16:[function(t,e,r){e.exports=function(e,r,n,i,o,s){var a=t("./errors").TypeError,u=t("./util"),c=u.errorObj,l=u.tryCatch,f=[];function h(t,r,i,o){if(s.cancellation()){var a=new e(n),u=this._finallyPromise=new e(n);this._promise=a.lastly(function(){return u}),a._captureStackTrace(),a._setOnCancel(this);}else (this._promise=new e(n))._captureStackTrace();this._stack=o,this._generatorFunction=t,this._receiver=r,this._generator=void 0,this._yieldHandlers="function"==typeof i?[i].concat(f):f,this._yieldedPromise=null,this._cancellationPhase=!1;}u.inherits(h,o),h.prototype._isResolved=function(){return null===this._promise},h.prototype._cleanup=function(){this._promise=this._generator=null,s.cancellation()&&null!==this._finallyPromise&&(this._finallyPromise._fulfill(),this._finallyPromise=null);},h.prototype._promiseCancelled=function(){if(!this._isResolved()){var t;if(void 0!==this._generator.return)this._promise._pushContext(),t=l(this._generator.return).call(this._generator,void 0),this._promise._popContext();else {var r=new e.CancellationError("generator .return() sentinel");e.coroutine.returnSentinel=r,this._promise._attachExtraTrace(r),this._promise._pushContext(),t=l(this._generator.throw).call(this._generator,r),this._promise._popContext();}this._cancellationPhase=!0,this._yieldedPromise=null,this._continue(t);}},h.prototype._promiseFulfilled=function(t){this._yieldedPromise=null,this._promise._pushContext();var e=l(this._generator.next).call(this._generator,t);this._promise._popContext(),this._continue(e);},h.prototype._promiseRejected=function(t){this._yieldedPromise=null,this._promise._attachExtraTrace(t),this._promise._pushContext();var e=l(this._generator.throw).call(this._generator,t);this._promise._popContext(),this._continue(e);},h.prototype._resultCancelled=function(){if(this._yieldedPromise instanceof e){var t=this._yieldedPromise;this._yieldedPromise=null,t.cancel();}},h.prototype.promise=function(){return this._promise},h.prototype._run=function(){this._generator=this._generatorFunction.call(this._receiver),this._receiver=this._generatorFunction=void 0,this._promiseFulfilled(void 0);},h.prototype._continue=function(t){var r=this._promise;if(t===c)return this._cleanup(),this._cancellationPhase?r.cancel():r._rejectCallback(t.e,!1);var n=t.value;if(!0===t.done)return this._cleanup(),this._cancellationPhase?r.cancel():r._resolveCallback(n);var o=i(n,this._promise);if(o instanceof e||null!==(o=function(t,r,n){for(var o=0;o<r.length;++o){n._pushContext();var s=l(r[o])(t);if(n._popContext(),s===c){n._pushContext();var a=e.reject(c.e);return n._popContext(),a}var u=i(s,n);if(u instanceof e)return u}return null}(o,this._yieldHandlers,this._promise))){var s=(o=o._target())._bitField;0==(50397184&s)?(this._yieldedPromise=o,o._proxy(this,null)):0!=(33554432&s)?e._async.invoke(this._promiseFulfilled,this,o._value()):0!=(16777216&s)?e._async.invoke(this._promiseRejected,this,o._reason()):this._promiseCancelled();}else this._promiseRejected(new a("A value %s was yielded that could not be treated as a promise\n\n    See http://goo.gl/MqrFmX\n\n".replace("%s",String(n))+"From coroutine:\n"+this._stack.split("\n").slice(1,-7).join("\n")));},e.coroutine=function(t,e){if("function"!=typeof t)throw new a("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");var r=Object(e).yieldHandler,n=h,i=(new Error).stack;return function(){var e=t.apply(this,arguments),o=new n(void 0,void 0,r,i),s=o.promise();return o._generator=e,o._promiseFulfilled(void 0),s}},e.coroutine.addYieldHandler=function(t){if("function"!=typeof t)throw new a("expecting a function but got "+u.classString(t));f.push(t);},e.spawn=function(t){if(s.deprecated("Promise.spawn()","Promise.coroutine()"),"function"!=typeof t)return r("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");var n=new h(t,this),i=n.promise();return n._run(e.spawn),i};};},{"./errors":12,"./util":36}],17:[function(t,e,r){e.exports=function(e,r,n,i,o,s){var a=t("./util");a.canEvaluate,a.tryCatch,a.errorObj,e.join=function(){var t,e=arguments.length-1;e>0&&"function"==typeof arguments[e]&&(t=arguments[e]);var n=[].slice.call(arguments);t&&n.pop();var i=new r(n).promise();return void 0!==t?i.spread(t):i};};},{"./util":36}],18:[function(t,e,r){e.exports=function(e,r,n,i,o,s){var a=e._getDomain,u=t("./util"),c=u.tryCatch,l=u.errorObj,f=e._async;function h(t,e,r,n){this.constructor$(t),this._promise._captureStackTrace();var i=a();this._callback=null===i?e:u.domainBind(i,e),this._preservedValues=n===o?new Array(this.length()):null,this._limit=r,this._inFlight=0,this._queue=[],f.invoke(this._asyncInit,this,void 0);}function p(t,r,i,o){if("function"!=typeof r)return n("expecting a function but got "+u.classString(r));var s=0;if(void 0!==i){if("object"!=typeof i||null===i)return e.reject(new TypeError("options argument must be an object but it is "+u.classString(i)));if("number"!=typeof i.concurrency)return e.reject(new TypeError("'concurrency' must be a number but it is "+u.classString(i.concurrency)));s=i.concurrency;}return new h(t,r,s="number"==typeof s&&isFinite(s)&&s>=1?s:0,o).promise()}u.inherits(h,r),h.prototype._asyncInit=function(){this._init$(void 0,-2);},h.prototype._init=function(){},h.prototype._promiseFulfilled=function(t,r){var n=this._values,o=this.length(),a=this._preservedValues,u=this._limit;if(r<0){if(n[r=-1*r-1]=t,u>=1&&(this._inFlight--,this._drainQueue(),this._isResolved()))return !0}else {if(u>=1&&this._inFlight>=u)return n[r]=t,this._queue.push(r),!1;null!==a&&(a[r]=t);var f=this._promise,h=this._callback,p=f._boundValue();f._pushContext();var d=c(h).call(p,t,r,o),_=f._popContext();if(s.checkForgottenReturns(d,_,null!==a?"Promise.filter":"Promise.map",f),d===l)return this._reject(d.e),!0;var v=i(d,this._promise);if(v instanceof e){var y=(v=v._target())._bitField;if(0==(50397184&y))return u>=1&&this._inFlight++,n[r]=v,v._proxy(this,-1*(r+1)),!1;if(0==(33554432&y))return 0!=(16777216&y)?(this._reject(v._reason()),!0):(this._cancel(),!0);d=v._value();}n[r]=d;}return ++this._totalResolved>=o&&(null!==a?this._filter(n,a):this._resolve(n),!0)},h.prototype._drainQueue=function(){for(var t=this._queue,e=this._limit,r=this._values;t.length>0&&this._inFlight<e;){if(this._isResolved())return;var n=t.pop();this._promiseFulfilled(r[n],n);}},h.prototype._filter=function(t,e){for(var r=e.length,n=new Array(r),i=0,o=0;o<r;++o)t[o]&&(n[i++]=e[o]);n.length=i,this._resolve(n);},h.prototype.preservedValues=function(){return this._preservedValues},e.prototype.map=function(t,e){return p(this,t,e,null)},e.map=function(t,e,r,n){return p(t,e,r,n)};};},{"./util":36}],19:[function(t,e,r){e.exports=function(e,r,n,i,o){var s=t("./util"),a=s.tryCatch;e.method=function(t){if("function"!=typeof t)throw new e.TypeError("expecting a function but got "+s.classString(t));return function(){var n=new e(r);n._captureStackTrace(),n._pushContext();var i=a(t).apply(this,arguments),s=n._popContext();return o.checkForgottenReturns(i,s,"Promise.method",n),n._resolveFromSyncValue(i),n}},e.attempt=e.try=function(t){if("function"!=typeof t)return i("expecting a function but got "+s.classString(t));var n,u=new e(r);if(u._captureStackTrace(),u._pushContext(),arguments.length>1){o.deprecated("calling Promise.try with more than 1 argument");var c=arguments[1],l=arguments[2];n=s.isArray(c)?a(t).apply(l,c):a(t).call(l,c);}else n=a(t)();var f=u._popContext();return o.checkForgottenReturns(n,f,"Promise.try",u),u._resolveFromSyncValue(n),u},e.prototype._resolveFromSyncValue=function(t){t===s.errorObj?this._rejectCallback(t.e,!1):this._resolveCallback(t,!0);};};},{"./util":36}],20:[function(t,e,r){var n=t("./util"),i=n.maybeWrapAsError,o=t("./errors").OperationalError,s=t("./es5"),a=/^(?:name|message|stack|cause)$/;function u(t){var e;if(function(t){return t instanceof Error&&s.getPrototypeOf(t)===Error.prototype}(t)){(e=new o(t)).name=t.name,e.message=t.message,e.stack=t.stack;for(var r=s.keys(t),i=0;i<r.length;++i){var u=r[i];a.test(u)||(e[u]=t[u]);}return e}return n.markAsOriginatingFromRejection(t),t}e.exports=function(t,e){return function(r,n){if(null!==t){if(r){var o=u(i(r));t._attachExtraTrace(o),t._reject(o);}else if(e){var s=[].slice.call(arguments,1);t._fulfill(s);}else t._fulfill(n);t=null;}}};},{"./errors":12,"./es5":13,"./util":36}],21:[function(t,e,r){e.exports=function(e){var r=t("./util"),n=e._async,i=r.tryCatch,o=r.errorObj;function s(t,e){if(!r.isArray(t))return a.call(this,t,e);var s=i(e).apply(this._boundValue(),[null].concat(t));s===o&&n.throwLater(s.e);}function a(t,e){var r=this._boundValue(),s=void 0===t?i(e).call(r,null):i(e).call(r,null,t);s===o&&n.throwLater(s.e);}function u(t,e){if(!t){var r=new Error(t+"");r.cause=t,t=r;}var s=i(e).call(this._boundValue(),t);s===o&&n.throwLater(s.e);}e.prototype.asCallback=e.prototype.nodeify=function(t,e){if("function"==typeof t){var r=a;void 0!==e&&Object(e).spread&&(r=s),this._then(r,u,void 0,this,t);}return this};};},{"./util":36}],22:[function(t,r,n){r.exports=function(){var n=function(){return new d("circular promise resolution chain\n\n    See http://goo.gl/MqrFmX\n")},i=function(){return new T.PromiseInspection(this._target())},o=function(t){return T.reject(new d(t))};function s(){}var a,u={},c=t("./util");a=c.isNode?function(){var t=e.domain;return void 0===t&&(t=null),t}:function(){return null},c.notEnumerableProp(T,"_getDomain",a);var l=t("./es5"),f=t("./async"),h=new f;l.defineProperty(T,"_async",{value:h});var p=t("./errors"),d=T.TypeError=p.TypeError;T.RangeError=p.RangeError;var _=T.CancellationError=p.CancellationError;T.TimeoutError=p.TimeoutError,T.OperationalError=p.OperationalError,T.RejectionError=p.OperationalError,T.AggregateError=p.AggregateError;var v=function(){},y={},m={},g=t("./thenables")(T,v),b=t("./promise_array")(T,v,g,o,s),w=t("./context")(T),E=w.create,C=t("./debuggability")(T,w),x=(C.CapturedTrace,t("./finally")(T,g,m)),j=t("./catch_filter")(m),S=t("./nodeback"),R=c.errorObj,k=c.tryCatch;function T(t){t!==v&&function(t,e){if(null==t||t.constructor!==T)throw new d("the promise constructor cannot be invoked directly\n\n    See http://goo.gl/MqrFmX\n");if("function"!=typeof e)throw new d("expecting a function but got "+c.classString(e))}(this,t),this._bitField=0,this._fulfillmentHandler0=void 0,this._rejectionHandler0=void 0,this._promise0=void 0,this._receiver0=void 0,this._resolveFromExecutor(t),this._promiseCreated(),this._fireEvent("promiseCreated",this);}function P(t){this.promise._resolveCallback(t);}function O(t){this.promise._rejectCallback(t,!1);}function A(t){var e=new T(v);e._fulfillmentHandler0=t,e._rejectionHandler0=t,e._promise0=t,e._receiver0=t;}return T.prototype.toString=function(){return "[object Promise]"},T.prototype.caught=T.prototype.catch=function(t){var e=arguments.length;if(e>1){var r,n=new Array(e-1),i=0;for(r=0;r<e-1;++r){var s=arguments[r];if(!c.isObject(s))return o("Catch statement predicate: expecting an object but got "+c.classString(s));n[i++]=s;}return n.length=i,t=arguments[r],this.then(void 0,j(n,t,this))}return this.then(void 0,t)},T.prototype.reflect=function(){return this._then(i,i,void 0,this,void 0)},T.prototype.then=function(t,e){if(C.warnings()&&arguments.length>0&&"function"!=typeof t&&"function"!=typeof e){var r=".then() only accepts functions but was passed: "+c.classString(t);arguments.length>1&&(r+=", "+c.classString(e)),this._warn(r);}return this._then(t,e,void 0,void 0,void 0)},T.prototype.done=function(t,e){this._then(t,e,void 0,void 0,void 0)._setIsFinal();},T.prototype.spread=function(t){return "function"!=typeof t?o("expecting a function but got "+c.classString(t)):this.all()._then(t,void 0,void 0,y,void 0)},T.prototype.toJSON=function(){var t={isFulfilled:!1,isRejected:!1,fulfillmentValue:void 0,rejectionReason:void 0};return this.isFulfilled()?(t.fulfillmentValue=this.value(),t.isFulfilled=!0):this.isRejected()&&(t.rejectionReason=this.reason(),t.isRejected=!0),t},T.prototype.all=function(){return arguments.length>0&&this._warn(".all() was passed arguments but it does not take any"),new b(this).promise()},T.prototype.error=function(t){return this.caught(c.originatesFromRejection,t)},T.getNewLibraryCopy=r.exports,T.is=function(t){return t instanceof T},T.fromNode=T.fromCallback=function(t){var e=new T(v);e._captureStackTrace();var r=arguments.length>1&&!!Object(arguments[1]).multiArgs,n=k(t)(S(e,r));return n===R&&e._rejectCallback(n.e,!0),e._isFateSealed()||e._setAsyncGuaranteed(),e},T.all=function(t){return new b(t).promise()},T.cast=function(t){var e=g(t);return e instanceof T||((e=new T(v))._captureStackTrace(),e._setFulfilled(),e._rejectionHandler0=t),e},T.resolve=T.fulfilled=T.cast,T.reject=T.rejected=function(t){var e=new T(v);return e._captureStackTrace(),e._rejectCallback(t,!0),e},T.setScheduler=function(t){if("function"!=typeof t)throw new d("expecting a function but got "+c.classString(t));return h.setScheduler(t)},T.prototype._then=function(t,e,r,n,i){var o=void 0!==i,s=o?i:new T(v),u=this._target(),l=u._bitField;o||(s._propagateFrom(this,3),s._captureStackTrace(),void 0===n&&0!=(2097152&this._bitField)&&(n=0!=(50397184&l)?this._boundValue():u===this?void 0:this._boundTo),this._fireEvent("promiseChained",this,s));var f=a();if(0!=(50397184&l)){var p,d,y=u._settlePromiseCtx;0!=(33554432&l)?(d=u._rejectionHandler0,p=t):0!=(16777216&l)?(d=u._fulfillmentHandler0,p=e,u._unsetRejectionIsUnhandled()):(y=u._settlePromiseLateCancellationObserver,d=new _("late cancellation observer"),u._attachExtraTrace(d),p=e),h.invoke(y,u,{handler:null===f?p:"function"==typeof p&&c.domainBind(f,p),promise:s,receiver:n,value:d});}else u._addCallbacks(t,e,s,n,f);return s},T.prototype._length=function(){return 65535&this._bitField},T.prototype._isFateSealed=function(){return 0!=(117506048&this._bitField)},T.prototype._isFollowing=function(){return 67108864==(67108864&this._bitField)},T.prototype._setLength=function(t){this._bitField=-65536&this._bitField|65535&t;},T.prototype._setFulfilled=function(){this._bitField=33554432|this._bitField,this._fireEvent("promiseFulfilled",this);},T.prototype._setRejected=function(){this._bitField=16777216|this._bitField,this._fireEvent("promiseRejected",this);},T.prototype._setFollowing=function(){this._bitField=67108864|this._bitField,this._fireEvent("promiseResolved",this);},T.prototype._setIsFinal=function(){this._bitField=4194304|this._bitField;},T.prototype._isFinal=function(){return (4194304&this._bitField)>0},T.prototype._unsetCancelled=function(){this._bitField=-65537&this._bitField;},T.prototype._setCancelled=function(){this._bitField=65536|this._bitField,this._fireEvent("promiseCancelled",this);},T.prototype._setWillBeCancelled=function(){this._bitField=8388608|this._bitField;},T.prototype._setAsyncGuaranteed=function(){h.hasCustomScheduler()||(this._bitField=134217728|this._bitField);},T.prototype._receiverAt=function(t){var e=0===t?this._receiver0:this[4*t-4+3];if(e!==u)return void 0===e&&this._isBound()?this._boundValue():e},T.prototype._promiseAt=function(t){return this[4*t-4+2]},T.prototype._fulfillmentHandlerAt=function(t){return this[4*t-4+0]},T.prototype._rejectionHandlerAt=function(t){return this[4*t-4+1]},T.prototype._boundValue=function(){},T.prototype._migrateCallback0=function(t){t._bitField;var e=t._fulfillmentHandler0,r=t._rejectionHandler0,n=t._promise0,i=t._receiverAt(0);void 0===i&&(i=u),this._addCallbacks(e,r,n,i,null);},T.prototype._migrateCallbackAt=function(t,e){var r=t._fulfillmentHandlerAt(e),n=t._rejectionHandlerAt(e),i=t._promiseAt(e),o=t._receiverAt(e);void 0===o&&(o=u),this._addCallbacks(r,n,i,o,null);},T.prototype._addCallbacks=function(t,e,r,n,i){var o=this._length();if(o>=65531&&(o=0,this._setLength(0)),0===o)this._promise0=r,this._receiver0=n,"function"==typeof t&&(this._fulfillmentHandler0=null===i?t:c.domainBind(i,t)),"function"==typeof e&&(this._rejectionHandler0=null===i?e:c.domainBind(i,e));else {var s=4*o-4;this[s+2]=r,this[s+3]=n,"function"==typeof t&&(this[s+0]=null===i?t:c.domainBind(i,t)),"function"==typeof e&&(this[s+1]=null===i?e:c.domainBind(i,e));}return this._setLength(o+1),o},T.prototype._proxy=function(t,e){this._addCallbacks(void 0,void 0,e,t,null);},T.prototype._resolveCallback=function(t,e){if(0==(117506048&this._bitField)){if(t===this)return this._rejectCallback(n(),!1);var r=g(t,this);if(!(r instanceof T))return this._fulfill(t);e&&this._propagateFrom(r,2);var i=r._target();if(i!==this){var o=i._bitField;if(0==(50397184&o)){var s=this._length();s>0&&i._migrateCallback0(this);for(var a=1;a<s;++a)i._migrateCallbackAt(this,a);this._setFollowing(),this._setLength(0),this._setFollowee(i);}else if(0!=(33554432&o))this._fulfill(i._value());else if(0!=(16777216&o))this._reject(i._reason());else {var u=new _("late cancellation observer");i._attachExtraTrace(u),this._reject(u);}}else this._reject(n());}},T.prototype._rejectCallback=function(t,e,r){var n=c.ensureErrorObject(t),i=n===t;if(!i&&!r&&C.warnings()){var o="a promise was rejected with a non-error: "+c.classString(t);this._warn(o,!0);}this._attachExtraTrace(n,!!e&&i),this._reject(t);},T.prototype._resolveFromExecutor=function(t){if(t!==v){var e=this;this._captureStackTrace(),this._pushContext();var r=!0,n=this._execute(t,function(t){e._resolveCallback(t);},function(t){e._rejectCallback(t,r);});r=!1,this._popContext(),void 0!==n&&e._rejectCallback(n,!0);}},T.prototype._settlePromiseFromHandler=function(t,e,r,n){var i=n._bitField;if(0==(65536&i)){var o;n._pushContext(),e===y?r&&"number"==typeof r.length?o=k(t).apply(this._boundValue(),r):(o=R).e=new d("cannot .spread() a non-array: "+c.classString(r)):o=k(t).call(e,r);var s=n._popContext();0==(65536&(i=n._bitField))&&(o===m?n._reject(r):o===R?n._rejectCallback(o.e,!1):(C.checkForgottenReturns(o,s,"",n,this),n._resolveCallback(o)));}},T.prototype._target=function(){for(var t=this;t._isFollowing();)t=t._followee();return t},T.prototype._followee=function(){return this._rejectionHandler0},T.prototype._setFollowee=function(t){this._rejectionHandler0=t;},T.prototype._settlePromise=function(t,e,r,n){var o=t instanceof T,a=this._bitField,u=0!=(134217728&a);0!=(65536&a)?(o&&t._invokeInternalOnCancel(),r instanceof x&&r.isFinallyHandler()?(r.cancelPromise=t,k(e).call(r,n)===R&&t._reject(R.e)):e===i?t._fulfill(i.call(r)):r instanceof s?r._promiseCancelled(t):o||t instanceof b?t._cancel():r.cancel()):"function"==typeof e?o?(u&&t._setAsyncGuaranteed(),this._settlePromiseFromHandler(e,r,n,t)):e.call(r,n,t):r instanceof s?r._isResolved()||(0!=(33554432&a)?r._promiseFulfilled(n,t):r._promiseRejected(n,t)):o&&(u&&t._setAsyncGuaranteed(),0!=(33554432&a)?t._fulfill(n):t._reject(n));},T.prototype._settlePromiseLateCancellationObserver=function(t){var e=t.handler,r=t.promise,n=t.receiver,i=t.value;"function"==typeof e?r instanceof T?this._settlePromiseFromHandler(e,n,i,r):e.call(n,i,r):r instanceof T&&r._reject(i);},T.prototype._settlePromiseCtx=function(t){this._settlePromise(t.promise,t.handler,t.receiver,t.value);},T.prototype._settlePromise0=function(t,e,r){var n=this._promise0,i=this._receiverAt(0);this._promise0=void 0,this._receiver0=void 0,this._settlePromise(n,t,i,e);},T.prototype._clearCallbackDataAtIndex=function(t){var e=4*t-4;this[e+2]=this[e+3]=this[e+0]=this[e+1]=void 0;},T.prototype._fulfill=function(t){var e=this._bitField;if(!((117506048&e)>>>16)){if(t===this){var r=n();return this._attachExtraTrace(r),this._reject(r)}this._setFulfilled(),this._rejectionHandler0=t,(65535&e)>0&&(0!=(134217728&e)?this._settlePromises():h.settlePromises(this));}},T.prototype._reject=function(t){var e=this._bitField;if(!((117506048&e)>>>16)){if(this._setRejected(),this._fulfillmentHandler0=t,this._isFinal())return h.fatalError(t,c.isNode);(65535&e)>0?h.settlePromises(this):this._ensurePossibleRejectionHandled();}},T.prototype._fulfillPromises=function(t,e){for(var r=1;r<t;r++){var n=this._fulfillmentHandlerAt(r),i=this._promiseAt(r),o=this._receiverAt(r);this._clearCallbackDataAtIndex(r),this._settlePromise(i,n,o,e);}},T.prototype._rejectPromises=function(t,e){for(var r=1;r<t;r++){var n=this._rejectionHandlerAt(r),i=this._promiseAt(r),o=this._receiverAt(r);this._clearCallbackDataAtIndex(r),this._settlePromise(i,n,o,e);}},T.prototype._settlePromises=function(){var t=this._bitField,e=65535&t;if(e>0){if(0!=(16842752&t)){var r=this._fulfillmentHandler0;this._settlePromise0(this._rejectionHandler0,r,t),this._rejectPromises(e,r);}else {var n=this._rejectionHandler0;this._settlePromise0(this._fulfillmentHandler0,n,t),this._fulfillPromises(e,n);}this._setLength(0);}this._clearCancellationData();},T.prototype._settledValue=function(){var t=this._bitField;return 0!=(33554432&t)?this._rejectionHandler0:0!=(16777216&t)?this._fulfillmentHandler0:void 0},T.defer=T.pending=function(){return C.deprecated("Promise.defer","new Promise"),{promise:new T(v),resolve:P,reject:O}},c.notEnumerableProp(T,"_makeSelfResolutionError",n),t("./method")(T,v,g,o,C),t("./bind")(T,v,g,C),t("./cancel")(T,b,o,C),t("./direct_resolve")(T),t("./synchronous_inspection")(T),t("./join")(T,b,g,v,h,a),T.Promise=T,T.version="3.5.1",t("./map.js")(T,b,o,g,v,C),t("./call_get.js")(T),t("./using.js")(T,o,g,E,v,C),t("./timers.js")(T,v,C),t("./generators.js")(T,o,v,g,s,C),t("./nodeify.js")(T),t("./promisify.js")(T,v),t("./props.js")(T,b,g,o),t("./race.js")(T,v,g,o),t("./reduce.js")(T,b,o,g,v,C),t("./settle.js")(T,b,C),t("./some.js")(T,b,o),t("./filter.js")(T,v),t("./each.js")(T,v),t("./any.js")(T),c.toFastProperties(T),c.toFastProperties(T.prototype),A({a:1}),A({b:2}),A({c:3}),A(1),A(function(){}),A(void 0),A(!1),A(new T(v)),C.setBounds(f.firstLineError,c.lastLineError),T};},{"./any.js":1,"./async":2,"./bind":3,"./call_get.js":5,"./cancel":6,"./catch_filter":7,"./context":8,"./debuggability":9,"./direct_resolve":10,"./each.js":11,"./errors":12,"./es5":13,"./filter.js":14,"./finally":15,"./generators.js":16,"./join":17,"./map.js":18,"./method":19,"./nodeback":20,"./nodeify.js":21,"./promise_array":23,"./promisify.js":24,"./props.js":25,"./race.js":27,"./reduce.js":28,"./settle.js":30,"./some.js":31,"./synchronous_inspection":32,"./thenables":33,"./timers.js":34,"./using.js":35,"./util":36}],23:[function(t,e,r){e.exports=function(e,r,n,i,o){var s=t("./util");function a(t){var n=this._promise=new e(r);t instanceof e&&n._propagateFrom(t,3),n._setOnCancel(this),this._values=t,this._length=0,this._totalResolved=0,this._init(void 0,-2);}return s.isArray,s.inherits(a,o),a.prototype.length=function(){return this._length},a.prototype.promise=function(){return this._promise},a.prototype._init=function t(r,o){var a=n(this._values,this._promise);if(a instanceof e){var u=(a=a._target())._bitField;if(this._values=a,0==(50397184&u))return this._promise._setAsyncGuaranteed(),a._then(t,this._reject,void 0,this,o);if(0==(33554432&u))return 0!=(16777216&u)?this._reject(a._reason()):this._cancel();a=a._value();}if(null!==(a=s.asArray(a)))0!==a.length?this._iterate(a):-5===o?this._resolveEmptyArray():this._resolve(function(t){switch(o){case-2:return [];case-3:return {};case-6:return new Map}}());else {var c=i("expecting an array or an iterable object but got "+s.classString(a)).reason();this._promise._rejectCallback(c,!1);}},a.prototype._iterate=function(t){var r=this.getActualLength(t.length);this._length=r,this._values=this.shouldCopyValues()?new Array(r):this._values;for(var i=this._promise,o=!1,s=null,a=0;a<r;++a){var u=n(t[a],i);s=u instanceof e?(u=u._target())._bitField:null,o?null!==s&&u.suppressUnhandledRejections():null!==s?0==(50397184&s)?(u._proxy(this,a),this._values[a]=u):o=0!=(33554432&s)?this._promiseFulfilled(u._value(),a):0!=(16777216&s)?this._promiseRejected(u._reason(),a):this._promiseCancelled(a):o=this._promiseFulfilled(u,a);}o||i._setAsyncGuaranteed();},a.prototype._isResolved=function(){return null===this._values},a.prototype._resolve=function(t){this._values=null,this._promise._fulfill(t);},a.prototype._cancel=function(){!this._isResolved()&&this._promise._isCancellable()&&(this._values=null,this._promise._cancel());},a.prototype._reject=function(t){this._values=null,this._promise._rejectCallback(t,!1);},a.prototype._promiseFulfilled=function(t,e){return this._values[e]=t,++this._totalResolved>=this._length&&(this._resolve(this._values),!0)},a.prototype._promiseCancelled=function(){return this._cancel(),!0},a.prototype._promiseRejected=function(t){return this._totalResolved++,this._reject(t),!0},a.prototype._resultCancelled=function(){if(!this._isResolved()){var t=this._values;if(this._cancel(),t instanceof e)t.cancel();else for(var r=0;r<t.length;++r)t[r]instanceof e&&t[r].cancel();}},a.prototype.shouldCopyValues=function(){return !0},a.prototype.getActualLength=function(t){return t},a};},{"./util":36}],24:[function(t,e,r){e.exports=function(e,r){var n={},i=t("./util"),o=t("./nodeback"),s=i.withAppended,a=i.maybeWrapAsError,u=i.canEvaluate,c=t("./errors").TypeError,l={__isPromisified__:!0},f=new RegExp("^(?:"+["arity","length","name","arguments","caller","callee","prototype","__isPromisified__"].join("|")+")$"),h=function(t){return i.isIdentifier(t)&&"_"!==t.charAt(0)&&"constructor"!==t};function p(t){return !f.test(t)}function d(t){try{return !0===t.__isPromisified__}catch(t){return !1}}function _(t,e,r){var n=i.getDataPropertyOrDefault(t,e+r,l);return !!n&&d(n)}function v(t,e,r,n){for(var o=i.inheritedDataKeys(t),s=[],a=0;a<o.length;++a){var u=o[a],l=t[u],f=n===h||h(u);"function"!=typeof l||d(l)||_(t,u,e)||!n(u,l,t,f)||s.push(u,l);}return function(t,e,r){for(var n=0;n<t.length;n+=2){var i=t[n];if(r.test(i))for(var o=i.replace(r,""),s=0;s<t.length;s+=2)if(t[s]===o)throw new c("Cannot promisify an API that has normal methods with '%s'-suffix\n\n    See http://goo.gl/MqrFmX\n".replace("%s",e))}}(s,e,r),s}var y=function(t){return t.replace(/([$])/,"\\$")},m=u?void 0:function(t,u,c,l,f,h){var p=function(){return this}(),d=t;function _(){var i=u;u===n&&(i=this);var c=new e(r);c._captureStackTrace();var l="string"==typeof d&&this!==p?this[d]:t,f=o(c,h);try{l.apply(i,s(arguments,f));}catch(t){c._rejectCallback(a(t),!0,!0);}return c._isFateSealed()||c._setAsyncGuaranteed(),c}return "string"==typeof d&&(t=l),i.notEnumerableProp(_,"__isPromisified__",!0),_};function g(t,e,r,o,s){for(var a=new RegExp(y(e)+"$"),u=v(t,e,a,r),c=0,l=u.length;c<l;c+=2){var f=u[c],h=u[c+1],p=f+e;if(o===m)t[p]=m(f,n,f,h,e,s);else {var d=o(h,function(){return m(f,n,f,h,e,s)});i.notEnumerableProp(d,"__isPromisified__",!0),t[p]=d;}}return i.toFastProperties(t),t}e.promisify=function(t,e){if("function"!=typeof t)throw new c("expecting a function but got "+i.classString(t));if(d(t))return t;var r=void 0===(e=Object(e)).context?n:e.context,o=!!e.multiArgs,s=function(t,e,r){return m(t,e,void 0,t,null,o)}(t,r);return i.copyDescriptors(t,s,p),s},e.promisifyAll=function(t,e){if("function"!=typeof t&&"object"!=typeof t)throw new c("the target of promisifyAll must be an object or a function\n\n    See http://goo.gl/MqrFmX\n");var r=!!(e=Object(e)).multiArgs,n=e.suffix;"string"!=typeof n&&(n="Async");var o=e.filter;"function"!=typeof o&&(o=h);var s=e.promisifier;if("function"!=typeof s&&(s=m),!i.isIdentifier(n))throw new RangeError("suffix must be a valid identifier\n\n    See http://goo.gl/MqrFmX\n");for(var a=i.inheritedDataKeys(t),u=0;u<a.length;++u){var l=t[a[u]];"constructor"!==a[u]&&i.isClass(l)&&(g(l.prototype,n,o,s,r),g(l,n,o,s,r));}return g(t,n,o,s,r)};};},{"./errors":12,"./nodeback":20,"./util":36}],25:[function(t,e,r){e.exports=function(e,r,n,i){var o,s=t("./util"),a=s.isObject,u=t("./es5");"function"==typeof Map&&(o=Map);var c=function(){var t=0,e=0;function r(r,n){this[t]=r,this[t+e]=n,t++;}return function(n){e=n.size,t=0;var i=new Array(2*n.size);return n.forEach(r,i),i}}();function l(t){var e,r=!1;if(void 0!==o&&t instanceof o)e=c(t),r=!0;else {var n=u.keys(t),i=n.length;e=new Array(2*i);for(var s=0;s<i;++s){var a=n[s];e[s]=t[a],e[s+i]=a;}}this.constructor$(e),this._isMap=r,this._init$(void 0,r?-6:-3);}function f(t){var r,o=n(t);return a(o)?(r=o instanceof e?o._then(e.props,void 0,void 0,void 0,void 0):new l(o).promise(),o instanceof e&&r._propagateFrom(o,2),r):i("cannot await properties of a non-object\n\n    See http://goo.gl/MqrFmX\n")}s.inherits(l,r),l.prototype._init=function(){},l.prototype._promiseFulfilled=function(t,e){if(this._values[e]=t,++this._totalResolved>=this._length){var r;if(this._isMap)r=function(t){for(var e=new o,r=t.length/2|0,n=0;n<r;++n){var i=t[r+n],s=t[n];e.set(i,s);}return e}(this._values);else {r={};for(var n=this.length(),i=0,s=this.length();i<s;++i)r[this._values[i+n]]=this._values[i];}return this._resolve(r),!0}return !1},l.prototype.shouldCopyValues=function(){return !1},l.prototype.getActualLength=function(t){return t>>1},e.prototype.props=function(){return f(this)},e.props=function(t){return f(t)};};},{"./es5":13,"./util":36}],26:[function(t,e,r){function n(t){this._capacity=t,this._length=0,this._front=0;}n.prototype._willBeOverCapacity=function(t){return this._capacity<t},n.prototype._pushOne=function(t){var e=this.length();this._checkCapacity(e+1),this[this._front+e&this._capacity-1]=t,this._length=e+1;},n.prototype.push=function(t,e,r){var n=this.length()+3;if(this._willBeOverCapacity(n))return this._pushOne(t),this._pushOne(e),void this._pushOne(r);var i=this._front+n-3;this._checkCapacity(n);var o=this._capacity-1;this[i+0&o]=t,this[i+1&o]=e,this[i+2&o]=r,this._length=n;},n.prototype.shift=function(){var t=this._front,e=this[t];return this[t]=void 0,this._front=t+1&this._capacity-1,this._length--,e},n.prototype.length=function(){return this._length},n.prototype._checkCapacity=function(t){this._capacity<t&&this._resizeTo(this._capacity<<1);},n.prototype._resizeTo=function(t){var e=this._capacity;this._capacity=t,function(t,e,r,n,i){for(var o=0;o<i;++o)r[o+n]=t[o+0],t[o+0]=void 0;}(this,0,this,e,this._front+this._length&e-1);},e.exports=n;},{}],27:[function(t,e,r){e.exports=function(e,r,n,i){var o=t("./util"),s=function(t){return t.then(function(e){return a(e,t)})};function a(t,a){var u=n(t);if(u instanceof e)return s(u);if(null===(t=o.asArray(t)))return i("expecting an array or an iterable object but got "+o.classString(t));var c=new e(r);void 0!==a&&c._propagateFrom(a,3);for(var l=c._fulfill,f=c._reject,h=0,p=t.length;h<p;++h){var d=t[h];(void 0!==d||h in t)&&e.cast(d)._then(l,f,void 0,c,null);}return c}e.race=function(t){return a(t,void 0)},e.prototype.race=function(){return a(this,void 0)};};},{"./util":36}],28:[function(t,e,r){e.exports=function(e,r,n,i,o,s){var a=e._getDomain,u=t("./util"),c=u.tryCatch;function l(t,r,n,i){this.constructor$(t);var s=a();this._fn=null===s?r:u.domainBind(s,r),void 0!==n&&(n=e.resolve(n))._attachCancellationCallback(this),this._initialValue=n,this._currentCancellable=null,this._eachValues=i===o?Array(this._length):0===i?null:void 0,this._promise._captureStackTrace(),this._init$(void 0,-5);}function f(t,e){this.isFulfilled()?e._resolve(t):e._reject(t);}function h(t,e,r,i){return "function"!=typeof e?n("expecting a function but got "+u.classString(e)):new l(t,e,r,i).promise()}function p(t){this.accum=t,this.array._gotAccum(t);var r=i(this.value,this.array._promise);return r instanceof e?(this.array._currentCancellable=r,r._then(d,void 0,void 0,this,void 0)):d.call(this,r)}function d(t){var r,n=this.array,i=n._promise,o=c(n._fn);i._pushContext(),(r=void 0!==n._eachValues?o.call(i._boundValue(),t,this.index,this.length):o.call(i._boundValue(),this.accum,t,this.index,this.length))instanceof e&&(n._currentCancellable=r);var a=i._popContext();return s.checkForgottenReturns(r,a,void 0!==n._eachValues?"Promise.each":"Promise.reduce",i),r}u.inherits(l,r),l.prototype._gotAccum=function(t){void 0!==this._eachValues&&null!==this._eachValues&&t!==o&&this._eachValues.push(t);},l.prototype._eachComplete=function(t){return null!==this._eachValues&&this._eachValues.push(t),this._eachValues},l.prototype._init=function(){},l.prototype._resolveEmptyArray=function(){this._resolve(void 0!==this._eachValues?this._eachValues:this._initialValue);},l.prototype.shouldCopyValues=function(){return !1},l.prototype._resolve=function(t){this._promise._resolveCallback(t),this._values=null;},l.prototype._resultCancelled=function(t){if(t===this._initialValue)return this._cancel();this._isResolved()||(this._resultCancelled$(),this._currentCancellable instanceof e&&this._currentCancellable.cancel(),this._initialValue instanceof e&&this._initialValue.cancel());},l.prototype._iterate=function(t){var r,n;this._values=t;var i=t.length;if(void 0!==this._initialValue?(r=this._initialValue,n=0):(r=e.resolve(t[0]),n=1),this._currentCancellable=r,!r.isRejected())for(;n<i;++n){var o={accum:null,value:t[n],index:n,length:i,array:this};r=r._then(p,void 0,void 0,o,void 0);}void 0!==this._eachValues&&(r=r._then(this._eachComplete,void 0,void 0,this,void 0)),r._then(f,f,void 0,r,this);},e.prototype.reduce=function(t,e){return h(this,t,e,null)},e.reduce=function(t,e,r,n){return h(t,e,r,n)};};},{"./util":36}],29:[function(t,i,o){var s,a=t("./util"),u=a.getNativePromise();if(a.isNode&&"undefined"==typeof MutationObserver){var c=r.setImmediate,l=e.nextTick;s=a.isRecentNode?function(t){c.call(r,t);}:function(t){l.call(e,t);};}else if("function"==typeof u&&"function"==typeof u.resolve){var f=u.resolve();s=function(t){f.then(t);};}else s="undefined"==typeof MutationObserver||"undefined"!=typeof window&&window.navigator&&(window.navigator.standalone||window.cordova)?void 0!==n?function(t){n(t);}:"undefined"!=typeof setTimeout?function(t){setTimeout(t,0);}:function(){throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n")}:function(){var t=document.createElement("div"),e={attributes:!0},r=!1,n=document.createElement("div");return new MutationObserver(function(){t.classList.toggle("foo"),r=!1;}).observe(n,e),function(i){var o=new MutationObserver(function(){o.disconnect(),i();});o.observe(t,e),r||(r=!0,n.classList.toggle("foo"));}}();i.exports=s;},{"./util":36}],30:[function(t,e,r){e.exports=function(e,r,n){var i=e.PromiseInspection;function o(t){this.constructor$(t);}t("./util").inherits(o,r),o.prototype._promiseResolved=function(t,e){return this._values[t]=e,++this._totalResolved>=this._length&&(this._resolve(this._values),!0)},o.prototype._promiseFulfilled=function(t,e){var r=new i;return r._bitField=33554432,r._settledValueField=t,this._promiseResolved(e,r)},o.prototype._promiseRejected=function(t,e){var r=new i;return r._bitField=16777216,r._settledValueField=t,this._promiseResolved(e,r)},e.settle=function(t){return n.deprecated(".settle()",".reflect()"),new o(t).promise()},e.prototype.settle=function(){return e.settle(this)};};},{"./util":36}],31:[function(t,e,r){e.exports=function(e,r,n){var i=t("./util"),o=t("./errors").RangeError,s=t("./errors").AggregateError,a=i.isArray,u={};function c(t){this.constructor$(t),this._howMany=0,this._unwrap=!1,this._initialized=!1;}function l(t,e){if((0|e)!==e||e<0)return n("expecting a positive integer\n\n    See http://goo.gl/MqrFmX\n");var r=new c(t),i=r.promise();return r.setHowMany(e),r.init(),i}i.inherits(c,r),c.prototype._init=function(){if(this._initialized)if(0!==this._howMany){this._init$(void 0,-5);var t=a(this._values);!this._isResolved()&&t&&this._howMany>this._canPossiblyFulfill()&&this._reject(this._getRangeError(this.length()));}else this._resolve([]);},c.prototype.init=function(){this._initialized=!0,this._init();},c.prototype.setUnwrap=function(){this._unwrap=!0;},c.prototype.howMany=function(){return this._howMany},c.prototype.setHowMany=function(t){this._howMany=t;},c.prototype._promiseFulfilled=function(t){return this._addFulfilled(t),this._fulfilled()===this.howMany()&&(this._values.length=this.howMany(),1===this.howMany()&&this._unwrap?this._resolve(this._values[0]):this._resolve(this._values),!0)},c.prototype._promiseRejected=function(t){return this._addRejected(t),this._checkOutcome()},c.prototype._promiseCancelled=function(){return this._values instanceof e||null==this._values?this._cancel():(this._addRejected(u),this._checkOutcome())},c.prototype._checkOutcome=function(){if(this.howMany()>this._canPossiblyFulfill()){for(var t=new s,e=this.length();e<this._values.length;++e)this._values[e]!==u&&t.push(this._values[e]);return t.length>0?this._reject(t):this._cancel(),!0}return !1},c.prototype._fulfilled=function(){return this._totalResolved},c.prototype._rejected=function(){return this._values.length-this.length()},c.prototype._addRejected=function(t){this._values.push(t);},c.prototype._addFulfilled=function(t){this._values[this._totalResolved++]=t;},c.prototype._canPossiblyFulfill=function(){return this.length()-this._rejected()},c.prototype._getRangeError=function(t){var e="Input array must contain at least "+this._howMany+" items but contains only "+t+" items";return new o(e)},c.prototype._resolveEmptyArray=function(){this._reject(this._getRangeError(0));},e.some=function(t,e){return l(t,e)},e.prototype.some=function(t){return l(this,t)},e._SomePromiseArray=c;};},{"./errors":12,"./util":36}],32:[function(t,e,r){e.exports=function(t){function e(t){void 0!==t?(t=t._target(),this._bitField=t._bitField,this._settledValueField=t._isFateSealed()?t._settledValue():void 0):(this._bitField=0,this._settledValueField=void 0);}e.prototype._settledValue=function(){return this._settledValueField};var r=e.prototype.value=function(){if(!this.isFulfilled())throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\n\n    See http://goo.gl/MqrFmX\n");return this._settledValue()},n=e.prototype.error=e.prototype.reason=function(){if(!this.isRejected())throw new TypeError("cannot get rejection reason of a non-rejected promise\n\n    See http://goo.gl/MqrFmX\n");return this._settledValue()},i=e.prototype.isFulfilled=function(){return 0!=(33554432&this._bitField)},o=e.prototype.isRejected=function(){return 0!=(16777216&this._bitField)},s=e.prototype.isPending=function(){return 0==(50397184&this._bitField)},a=e.prototype.isResolved=function(){return 0!=(50331648&this._bitField)};e.prototype.isCancelled=function(){return 0!=(8454144&this._bitField)},t.prototype.__isCancelled=function(){return 65536==(65536&this._bitField)},t.prototype._isCancelled=function(){return this._target().__isCancelled()},t.prototype.isCancelled=function(){return 0!=(8454144&this._target()._bitField)},t.prototype.isPending=function(){return s.call(this._target())},t.prototype.isRejected=function(){return o.call(this._target())},t.prototype.isFulfilled=function(){return i.call(this._target())},t.prototype.isResolved=function(){return a.call(this._target())},t.prototype.value=function(){return r.call(this._target())},t.prototype.reason=function(){var t=this._target();return t._unsetRejectionIsUnhandled(),n.call(t)},t.prototype._value=function(){return this._settledValue()},t.prototype._reason=function(){return this._unsetRejectionIsUnhandled(),this._settledValue()},t.PromiseInspection=e;};},{}],33:[function(t,e,r){e.exports=function(e,r){var n=t("./util"),i=n.errorObj,o=n.isObject,s={}.hasOwnProperty;return function(t,a){if(o(t)){if(t instanceof e)return t;var u=function(t){try{return function(t){return t.then}(t)}catch(t){return i.e=t,i}}(t);if(u===i){a&&a._pushContext();var c=e.reject(u.e);return a&&a._popContext(),c}if("function"==typeof u)return function(t){try{return s.call(t,"_promise0")}catch(t){return !1}}(t)?(c=new e(r),t._then(c._fulfill,c._reject,void 0,c,null),c):function(t,o,s){var a=new e(r),u=a;s&&s._pushContext(),a._captureStackTrace(),s&&s._popContext();var c=!0,l=n.tryCatch(o).call(t,function(t){a&&(a._resolveCallback(t),a=null);},function(t){a&&(a._rejectCallback(t,c,!0),a=null);});return c=!1,a&&l===i&&(a._rejectCallback(l.e,!0,!0),a=null),u}(t,u,a)}return t}};},{"./util":36}],34:[function(t,e,r){e.exports=function(e,r,n){var i=t("./util"),o=e.TimeoutError;function s(t){this.handle=t;}s.prototype._resultCancelled=function(){clearTimeout(this.handle);};var a=function(t){return u(+this).thenReturn(t)},u=e.delay=function(t,i){var o,u;return void 0!==i?(o=e.resolve(i)._then(a,null,null,t,void 0),n.cancellation()&&i instanceof e&&o._setOnCancel(i)):(o=new e(r),u=setTimeout(function(){o._fulfill();},+t),n.cancellation()&&o._setOnCancel(new s(u)),o._captureStackTrace()),o._setAsyncGuaranteed(),o};function c(t){return clearTimeout(this.handle),t}function l(t){throw clearTimeout(this.handle),t}e.prototype.delay=function(t){return u(t,this)},e.prototype.timeout=function(t,e){var r,a;t=+t;var u=new s(setTimeout(function(){r.isPending()&&function(t,e,r){var n;n="string"!=typeof e?e instanceof Error?e:new o("operation timed out"):new o(e),i.markAsOriginatingFromRejection(n),t._attachExtraTrace(n),t._reject(n),null!=r&&r.cancel();}(r,e,a);},t));return n.cancellation()?(a=this.then(),(r=a._then(c,l,void 0,u,void 0))._setOnCancel(u)):r=this._then(c,l,void 0,u,void 0),r};};},{"./util":36}],35:[function(t,e,r){e.exports=function(e,r,n,i,o,s){var a=t("./util"),u=t("./errors").TypeError,c=t("./util").inherits,l=a.errorObj,f=a.tryCatch,h={};function p(t){setTimeout(function(){throw t},0);}function d(t,r){var i=0,s=t.length,a=new e(o);return function o(){if(i>=s)return a._fulfill();var u=function(t){var e=n(t);return e!==t&&"function"==typeof t._isDisposable&&"function"==typeof t._getDisposer&&t._isDisposable()&&e._setDisposable(t._getDisposer()),e}(t[i++]);if(u instanceof e&&u._isDisposable()){try{u=n(u._getDisposer().tryDispose(r),t.promise);}catch(t){return p(t)}if(u instanceof e)return u._then(o,p,null,null,null)}o();}(),a}function _(t,e,r){this._data=t,this._promise=e,this._context=r;}function v(t,e,r){this.constructor$(t,e,r);}function y(t){return _.isDisposer(t)?(this.resources[this.index]._setDisposable(t),t.promise()):t}function m(t){this.length=t,this.promise=null,this[t-1]=null;}_.prototype.data=function(){return this._data},_.prototype.promise=function(){return this._promise},_.prototype.resource=function(){return this.promise().isFulfilled()?this.promise().value():h},_.prototype.tryDispose=function(t){var e=this.resource(),r=this._context;void 0!==r&&r._pushContext();var n=e!==h?this.doDispose(e,t):null;return void 0!==r&&r._popContext(),this._promise._unsetDisposable(),this._data=null,n},_.isDisposer=function(t){return null!=t&&"function"==typeof t.resource&&"function"==typeof t.tryDispose},c(v,_),v.prototype.doDispose=function(t,e){return this.data().call(t,t,e)},m.prototype._resultCancelled=function(){for(var t=this.length,r=0;r<t;++r){var n=this[r];n instanceof e&&n.cancel();}},e.using=function(){var t=arguments.length;if(t<2)return r("you must pass at least 2 arguments to Promise.using");var i,o=arguments[t-1];if("function"!=typeof o)return r("expecting a function but got "+a.classString(o));var u=!0;2===t&&Array.isArray(arguments[0])?(t=(i=arguments[0]).length,u=!1):(i=arguments,t--);for(var c=new m(t),h=0;h<t;++h){var p=i[h];if(_.isDisposer(p)){var v=p;(p=p.promise())._setDisposable(v);}else {var g=n(p);g instanceof e&&(p=g._then(y,null,null,{resources:c,index:h},void 0));}c[h]=p;}var b=new Array(c.length);for(h=0;h<b.length;++h)b[h]=e.resolve(c[h]).reflect();var w=e.all(b).then(function(t){for(var e=0;e<t.length;++e){var r=t[e];if(r.isRejected())return l.e=r.error(),l;if(!r.isFulfilled())return void w.cancel();t[e]=r.value();}E._pushContext(),o=f(o);var n=u?o.apply(void 0,t):o(t),i=E._popContext();return s.checkForgottenReturns(n,i,"Promise.using",E),n}),E=w.lastly(function(){var t=new e.PromiseInspection(w);return d(c,t)});return c.promise=E,E._setOnCancel(c),E},e.prototype._setDisposable=function(t){this._bitField=131072|this._bitField,this._disposer=t;},e.prototype._isDisposable=function(){return (131072&this._bitField)>0},e.prototype._getDisposer=function(){return this._disposer},e.prototype._unsetDisposable=function(){this._bitField=-131073&this._bitField,this._disposer=void 0;},e.prototype.disposer=function(t){if("function"==typeof t)return new v(t,this,i());throw new u};};},{"./errors":12,"./util":36}],36:[function(t,n,i){var o,s=t("./es5"),a="undefined"==typeof navigator,u={e:{}},c="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==r?r:void 0!==this?this:null;function l(){try{var t=o;return o=null,t.apply(this,arguments)}catch(t){return u.e=t,u}}function f(t){return null==t||!0===t||!1===t||"string"==typeof t||"number"==typeof t}function h(t,e,r){if(f(t))return t;var n={value:r,configurable:!0,enumerable:!1,writable:!0};return s.defineProperty(t,e,n),t}var p=function(){var t=[Array.prototype,Object.prototype,Function.prototype],e=function(e){for(var r=0;r<t.length;++r)if(t[r]===e)return !0;return !1};if(s.isES5){var r=Object.getOwnPropertyNames;return function(t){for(var n=[],i=Object.create(null);null!=t&&!e(t);){var o;try{o=r(t);}catch(t){return n}for(var a=0;a<o.length;++a){var u=o[a];if(!i[u]){i[u]=!0;var c=Object.getOwnPropertyDescriptor(t,u);null!=c&&null==c.get&&null==c.set&&n.push(u);}}t=s.getPrototypeOf(t);}return n}}var n={}.hasOwnProperty;return function(r){if(e(r))return [];var i=[];t:for(var o in r)if(n.call(r,o))i.push(o);else {for(var s=0;s<t.length;++s)if(n.call(t[s],o))continue t;i.push(o);}return i}}(),d=/this\s*\.\s*\S+\s*=/,_=/^[a-z$_][a-z$_0-9]*$/i;function v(t){try{return t+""}catch(t){return "[no string representation]"}}function y(t){return t instanceof Error||null!==t&&"object"==typeof t&&"string"==typeof t.message&&"string"==typeof t.name}function m(t){return y(t)&&s.propertyIsWritable(t,"stack")}var g="stack"in new Error?function(t){return m(t)?t:new Error(v(t))}:function(t){if(m(t))return t;try{throw new Error(v(t))}catch(t){return t}};function b(t){return {}.toString.call(t)}var w=function(t){return s.isArray(t)?t:null};if("undefined"!=typeof Symbol&&Symbol.iterator){var E="function"==typeof Array.from?function(t){return Array.from(t)}:function(t){for(var e,r=[],n=t[Symbol.iterator]();!(e=n.next()).done;)r.push(e.value);return r};w=function(t){return s.isArray(t)?t:null!=t&&"function"==typeof t[Symbol.iterator]?E(t):null};}var C=void 0!==e&&"[object process]"===b(e).toLowerCase(),x=void 0!==e&&void 0!==e.env,j={isClass:function(t){try{if("function"==typeof t){var e=s.names(t.prototype),r=s.isES5&&e.length>1,n=e.length>0&&!(1===e.length&&"constructor"===e[0]),i=d.test(t+"")&&s.names(t).length>0;if(r||n||i)return !0}return !1}catch(t){return !1}},isIdentifier:function(t){return _.test(t)},inheritedDataKeys:p,getDataPropertyOrDefault:function(t,e,r){if(!s.isES5)return {}.hasOwnProperty.call(t,e)?t[e]:void 0;var n=Object.getOwnPropertyDescriptor(t,e);return null!=n?null==n.get&&null==n.set?n.value:r:void 0},thrower:function(t){throw t},isArray:s.isArray,asArray:w,notEnumerableProp:h,isPrimitive:f,isObject:function(t){return "function"==typeof t||"object"==typeof t&&null!==t},isError:y,canEvaluate:a,errorObj:u,tryCatch:function(t){return o=t,l},inherits:function(t,e){var r={}.hasOwnProperty;function n(){for(var n in this.constructor=t,this.constructor$=e,e.prototype)r.call(e.prototype,n)&&"$"!==n.charAt(n.length-1)&&(this[n+"$"]=e.prototype[n]);}return n.prototype=e.prototype,t.prototype=new n,t.prototype},withAppended:function(t,e){var r,n=t.length,i=new Array(n+1);for(r=0;r<n;++r)i[r]=t[r];return i[r]=e,i},maybeWrapAsError:function(t){return f(t)?new Error(v(t)):t},toFastProperties:function(t){return t},filledRange:function(t,e,r){for(var n=new Array(t),i=0;i<t;++i)n[i]=e+i+r;return n},toString:v,canAttachTrace:m,ensureErrorObject:g,originatesFromRejection:function(t){return null!=t&&(t instanceof Error.__BluebirdErrorTypes__.OperationalError||!0===t.isOperational)},markAsOriginatingFromRejection:function(t){try{h(t,"isOperational",!0);}catch(t){}},classString:b,copyDescriptors:function(t,e,r){for(var n=s.names(t),i=0;i<n.length;++i){var o=n[i];if(r(o))try{s.defineProperty(e,o,s.getDescriptor(t,o));}catch(t){}}},hasDevTools:"undefined"!=typeof chrome&&chrome&&"function"==typeof chrome.loadTimes,isNode:C,hasEnvVariables:x,env:function(t){return x?e.env[t]:void 0},global:c,getNativePromise:function(){if("function"==typeof Promise)try{var t=new Promise(function(){});if("[object Promise]"==={}.toString.call(t))return Promise}catch(t){}},domainBind:function(t,e){return t.bind(e)}};j.isRecentNode=j.isNode&&function(){var t=e.versions.node.split(".").map(Number);return 0===t[0]&&t[1]>10||t[0]>0}(),j.isNode&&j.toFastProperties(e);try{throw new Error}catch(t){j.lastLineError=t;}n.exports=j;},{"./es5":13}]},{},[4])(4),"undefined"!=typeof window&&null!==window?window.P=window.Promise:"undefined"!=typeof self&&null!==self&&(self.P=self.Promise);}).call(this,r(4),r(0),r(11).setImmediate);},function(t,e,r){Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t,e){if(!e.eol&&t)for(var r=0,n=t.length;r<n;r++)if("\r"===t[r]){if("\n"===t[r+1]){e.eol="\r\n";break}if(t[r+1]){e.eol="\r";break}}else if("\n"===t[r]){e.eol="\n";break}return e.eol||"\n"};},function(t,e,r){var n=r(65),i=r(73);t.exports=function(t,e){var r=i(t,e);return n(r)?r:void 0};},function(t,e,r){var n=r(19).Symbol;t.exports=n;},function(t,e,r){var n=r(67),i="object"==typeof self&&self&&self.Object===Object&&self,o=n||i||Function("return this")();t.exports=o;},function(t,e){t.exports=function(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)};},function(t,e){var r=Array.isArray;t.exports=r;},function(t,e,r){var n=r(30),i=r(76);t.exports=function(t){return "symbol"==typeof t||i(t)&&"[object Symbol]"==n(t)};},function(t,e,r){(function(e,n){var i=r(6);t.exports=g;var o,s=r(37);g.ReadableState=m,r(12).EventEmitter;var a=function(t,e){return t.listeners(e).length},u=r(24),c=r(7).Buffer,l=e.Uint8Array||function(){},f=r(5);f.inherits=r(2);var h=r(41),p=void 0;p=h&&h.debuglog?h.debuglog("stream"):function(){};var d,_=r(42),v=r(25);f.inherits(g,u);var y=["error","close","destroy","pause","resume"];function m(t,e){o=o||r(1),t=t||{};var n=e instanceof o;this.objectMode=!!t.objectMode,n&&(this.objectMode=this.objectMode||!!t.readableObjectMode);var i=t.highWaterMark,s=t.readableHighWaterMark,a=this.objectMode?16:16384;this.highWaterMark=i||0===i?i:n&&(s||0===s)?s:a,this.highWaterMark=Math.floor(this.highWaterMark),this.buffer=new _,this.length=0,this.pipes=null,this.pipesCount=0,this.flowing=null,this.ended=!1,this.endEmitted=!1,this.reading=!1,this.sync=!0,this.needReadable=!1,this.emittedReadable=!1,this.readableListening=!1,this.resumeScheduled=!1,this.destroyed=!1,this.defaultEncoding=t.defaultEncoding||"utf8",this.awaitDrain=0,this.readingMore=!1,this.decoder=null,this.encoding=null,t.encoding&&(d||(d=r(26).StringDecoder),this.decoder=new d(t.encoding),this.encoding=t.encoding);}function g(t){if(o=o||r(1),!(this instanceof g))return new g(t);this._readableState=new m(t,this),this.readable=!0,t&&("function"==typeof t.read&&(this._read=t.read),"function"==typeof t.destroy&&(this._destroy=t.destroy)),u.call(this);}function b(t,e,r,n,i){var o,s=t._readableState;return null===e?(s.reading=!1,function(t,e){if(!e.ended){if(e.decoder){var r=e.decoder.end();r&&r.length&&(e.buffer.push(r),e.length+=e.objectMode?1:r.length);}e.ended=!0,x(t);}}(t,s)):(i||(o=function(t,e){var r;return function(t){return c.isBuffer(t)||t instanceof l}(e)||"string"==typeof e||void 0===e||t.objectMode||(r=new TypeError("Invalid non-string/buffer chunk")),r}(s,e)),o?t.emit("error",o):s.objectMode||e&&e.length>0?("string"==typeof e||s.objectMode||Object.getPrototypeOf(e)===c.prototype||(e=function(t){return c.from(t)}(e)),n?s.endEmitted?t.emit("error",new Error("stream.unshift() after end event")):w(t,s,e,!0):s.ended?t.emit("error",new Error("stream.push() after EOF")):(s.reading=!1,s.decoder&&!r?(e=s.decoder.write(e),s.objectMode||0!==e.length?w(t,s,e,!1):S(t,s)):w(t,s,e,!1))):n||(s.reading=!1)),function(t){return !t.ended&&(t.needReadable||t.length<t.highWaterMark||0===t.length)}(s)}function w(t,e,r,n){e.flowing&&0===e.length&&!e.sync?(t.emit("data",r),t.read(0)):(e.length+=e.objectMode?1:r.length,n?e.buffer.unshift(r):e.buffer.push(r),e.needReadable&&x(t)),S(t,e);}Object.defineProperty(g.prototype,"destroyed",{get:function(){return void 0!==this._readableState&&this._readableState.destroyed},set:function(t){this._readableState&&(this._readableState.destroyed=t);}}),g.prototype.destroy=v.destroy,g.prototype._undestroy=v.undestroy,g.prototype._destroy=function(t,e){this.push(null),e(t);},g.prototype.push=function(t,e){var r,n=this._readableState;return n.objectMode?r=!0:"string"==typeof t&&((e=e||n.defaultEncoding)!==n.encoding&&(t=c.from(t,e),e=""),r=!0),b(this,t,e,!1,r)},g.prototype.unshift=function(t){return b(this,t,null,!0,!1)},g.prototype.isPaused=function(){return !1===this._readableState.flowing},g.prototype.setEncoding=function(t){return d||(d=r(26).StringDecoder),this._readableState.decoder=new d(t),this._readableState.encoding=t,this};var E=8388608;function C(t,e){return t<=0||0===e.length&&e.ended?0:e.objectMode?1:t!=t?e.flowing&&e.length?e.buffer.head.data.length:e.length:(t>e.highWaterMark&&(e.highWaterMark=function(t){return t>=E?t=E:(t--,t|=t>>>1,t|=t>>>2,t|=t>>>4,t|=t>>>8,t|=t>>>16,t++),t}(t)),t<=e.length?t:e.ended?e.length:(e.needReadable=!0,0))}function x(t){var e=t._readableState;e.needReadable=!1,e.emittedReadable||(p("emitReadable",e.flowing),e.emittedReadable=!0,e.sync?i.nextTick(j,t):j(t));}function j(t){p("emit readable"),t.emit("readable"),P(t);}function S(t,e){e.readingMore||(e.readingMore=!0,i.nextTick(R,t,e));}function R(t,e){for(var r=e.length;!e.reading&&!e.flowing&&!e.ended&&e.length<e.highWaterMark&&(p("maybeReadMore read 0"),t.read(0),r!==e.length);)r=e.length;e.readingMore=!1;}function k(t){p("readable nexttick read 0"),t.read(0);}function T(t,e){e.reading||(p("resume read 0"),t.read(0)),e.resumeScheduled=!1,e.awaitDrain=0,t.emit("resume"),P(t),e.flowing&&!e.reading&&t.read(0);}function P(t){var e=t._readableState;for(p("flow",e.flowing);e.flowing&&null!==t.read(););}function O(t,e){return 0===e.length?null:(e.objectMode?r=e.buffer.shift():!t||t>=e.length?(r=e.decoder?e.buffer.join(""):1===e.buffer.length?e.buffer.head.data:e.buffer.concat(e.length),e.buffer.clear()):r=function(t,e,r){var n;return t<e.head.data.length?(n=e.head.data.slice(0,t),e.head.data=e.head.data.slice(t)):n=t===e.head.data.length?e.shift():r?function(t,e){var r=e.head,n=1,i=r.data;for(t-=i.length;r=r.next;){var o=r.data,s=t>o.length?o.length:t;if(s===o.length?i+=o:i+=o.slice(0,t),0==(t-=s)){s===o.length?(++n,r.next?e.head=r.next:e.head=e.tail=null):(e.head=r,r.data=o.slice(s));break}++n;}return e.length-=n,i}(t,e):function(t,e){var r=c.allocUnsafe(t),n=e.head,i=1;for(n.data.copy(r),t-=n.data.length;n=n.next;){var o=n.data,s=t>o.length?o.length:t;if(o.copy(r,r.length-t,0,s),0==(t-=s)){s===o.length?(++i,n.next?e.head=n.next:e.head=e.tail=null):(e.head=n,n.data=o.slice(s));break}++i;}return e.length-=i,r}(t,e),n}(t,e.buffer,e.decoder),r);var r;}function A(t){var e=t._readableState;if(e.length>0)throw new Error('"endReadable()" called on non-empty stream');e.endEmitted||(e.ended=!0,i.nextTick(F,e,t));}function F(t,e){t.endEmitted||0!==t.length||(t.endEmitted=!0,e.readable=!1,e.emit("end"));}function L(t,e){for(var r=0,n=t.length;r<n;r++)if(t[r]===e)return r;return -1}g.prototype.read=function(t){p("read",t),t=parseInt(t,10);var e=this._readableState,r=t;if(0!==t&&(e.emittedReadable=!1),0===t&&e.needReadable&&(e.length>=e.highWaterMark||e.ended))return p("read: emitReadable",e.length,e.ended),0===e.length&&e.ended?A(this):x(this),null;if(0===(t=C(t,e))&&e.ended)return 0===e.length&&A(this),null;var n,i=e.needReadable;return p("need readable",i),(0===e.length||e.length-t<e.highWaterMark)&&p("length less than watermark",i=!0),e.ended||e.reading?p("reading or ended",i=!1):i&&(p("do read"),e.reading=!0,e.sync=!0,0===e.length&&(e.needReadable=!0),this._read(e.highWaterMark),e.sync=!1,e.reading||(t=C(r,e))),null===(n=t>0?O(t,e):null)?(e.needReadable=!0,t=0):e.length-=t,0===e.length&&(e.ended||(e.needReadable=!0),r!==t&&e.ended&&A(this)),null!==n&&this.emit("data",n),n},g.prototype._read=function(t){this.emit("error",new Error("_read() is not implemented"));},g.prototype.pipe=function(t,e){var r=this,o=this._readableState;switch(o.pipesCount){case 0:o.pipes=t;break;case 1:o.pipes=[o.pipes,t];break;default:o.pipes.push(t);}o.pipesCount+=1,p("pipe count=%d opts=%j",o.pipesCount,e);var u=e&&!1===e.end||t===n.stdout||t===n.stderr?m:c;function c(){p("onend"),t.end();}o.endEmitted?i.nextTick(u):r.once("end",u),t.on("unpipe",function e(n,i){p("onunpipe"),n===r&&i&&!1===i.hasUnpiped&&(i.hasUnpiped=!0,p("cleanup"),t.removeListener("close",v),t.removeListener("finish",y),t.removeListener("drain",l),t.removeListener("error",_),t.removeListener("unpipe",e),r.removeListener("end",c),r.removeListener("end",m),r.removeListener("data",d),f=!0,!o.awaitDrain||t._writableState&&!t._writableState.needDrain||l());});var l=function(t){return function(){var e=t._readableState;p("pipeOnDrain",e.awaitDrain),e.awaitDrain&&e.awaitDrain--,0===e.awaitDrain&&a(t,"data")&&(e.flowing=!0,P(t));}}(r);t.on("drain",l);var f=!1,h=!1;function d(e){p("ondata"),h=!1,!1!==t.write(e)||h||((1===o.pipesCount&&o.pipes===t||o.pipesCount>1&&-1!==L(o.pipes,t))&&!f&&(p("false write response, pause",r._readableState.awaitDrain),r._readableState.awaitDrain++,h=!0),r.pause());}function _(e){p("onerror",e),m(),t.removeListener("error",_),0===a(t,"error")&&t.emit("error",e);}function v(){t.removeListener("finish",y),m();}function y(){p("onfinish"),t.removeListener("close",v),m();}function m(){p("unpipe"),r.unpipe(t);}return r.on("data",d),function(t,e,r){if("function"==typeof t.prependListener)return t.prependListener(e,r);t._events&&t._events[e]?s(t._events[e])?t._events[e].unshift(r):t._events[e]=[r,t._events[e]]:t.on(e,r);}(t,"error",_),t.once("close",v),t.once("finish",y),t.emit("pipe",r),o.flowing||(p("pipe resume"),r.resume()),t},g.prototype.unpipe=function(t){var e=this._readableState,r={hasUnpiped:!1};if(0===e.pipesCount)return this;if(1===e.pipesCount)return t&&t!==e.pipes?this:(t||(t=e.pipes),e.pipes=null,e.pipesCount=0,e.flowing=!1,t&&t.emit("unpipe",this,r),this);if(!t){var n=e.pipes,i=e.pipesCount;e.pipes=null,e.pipesCount=0,e.flowing=!1;for(var o=0;o<i;o++)n[o].emit("unpipe",this,r);return this}var s=L(e.pipes,t);return -1===s?this:(e.pipes.splice(s,1),e.pipesCount-=1,1===e.pipesCount&&(e.pipes=e.pipes[0]),t.emit("unpipe",this,r),this)},g.prototype.on=function(t,e){var r=u.prototype.on.call(this,t,e);if("data"===t)!1!==this._readableState.flowing&&this.resume();else if("readable"===t){var n=this._readableState;n.endEmitted||n.readableListening||(n.readableListening=n.needReadable=!0,n.emittedReadable=!1,n.reading?n.length&&x(this):i.nextTick(k,this));}return r},g.prototype.addListener=g.prototype.on,g.prototype.resume=function(){var t=this._readableState;return t.flowing||(p("resume"),t.flowing=!0,function(t,e){e.resumeScheduled||(e.resumeScheduled=!0,i.nextTick(T,t,e));}(this,t)),this},g.prototype.pause=function(){return p("call pause flowing=%j",this._readableState.flowing),!1!==this._readableState.flowing&&(p("pause"),this._readableState.flowing=!1,this.emit("pause")),this},g.prototype.wrap=function(t){var e=this,r=this._readableState,n=!1;for(var i in t.on("end",function(){if(p("wrapped end"),r.decoder&&!r.ended){var t=r.decoder.end();t&&t.length&&e.push(t);}e.push(null);}),t.on("data",function(i){p("wrapped data"),r.decoder&&(i=r.decoder.write(i)),(!r.objectMode||null!==i&&void 0!==i)&&(r.objectMode||i&&i.length)&&(e.push(i)||(n=!0,t.pause()));}),t)void 0===this[i]&&"function"==typeof t[i]&&(this[i]=function(e){return function(){return t[e].apply(t,arguments)}}(i));for(var o=0;o<y.length;o++)t.on(y[o],this.emit.bind(this,y[o]));return this._read=function(e){p("wrapped _read",e),n&&(n=!1,t.resume());},this},Object.defineProperty(g.prototype,"readableHighWaterMark",{enumerable:!1,get:function(){return this._readableState.highWaterMark}}),g._fromList=O;}).call(this,r(0),r(4));},function(t,e,r){t.exports=r(12).EventEmitter;},function(t,e,r){var n=r(6);function i(t,e){t.emit("error",e);}t.exports={destroy:function(t,e){var r=this,o=this._readableState&&this._readableState.destroyed,s=this._writableState&&this._writableState.destroyed;return o||s?(e?e(t):!t||this._writableState&&this._writableState.errorEmitted||n.nextTick(i,this,t),this):(this._readableState&&(this._readableState.destroyed=!0),this._writableState&&(this._writableState.destroyed=!0),this._destroy(t||null,function(t){!e&&t?(n.nextTick(i,r,t),r._writableState&&(r._writableState.errorEmitted=!0)):e&&e(t);}),this)},undestroy:function(){this._readableState&&(this._readableState.destroyed=!1,this._readableState.reading=!1,this._readableState.ended=!1,this._readableState.endEmitted=!1),this._writableState&&(this._writableState.destroyed=!1,this._writableState.ended=!1,this._writableState.ending=!1,this._writableState.finished=!1,this._writableState.errorEmitted=!1);}};},function(t,e,r){var n=r(7).Buffer,i=n.isEncoding||function(t){switch((t=""+t)&&t.toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":case"raw":return !0;default:return !1}};function o(t){var e;switch(this.encoding=function(t){var e=function(t){if(!t)return "utf8";for(var e;;)switch(t){case"utf8":case"utf-8":return "utf8";case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return "utf16le";case"latin1":case"binary":return "latin1";case"base64":case"ascii":case"hex":return t;default:if(e)return;t=(""+t).toLowerCase(),e=!0;}}(t);if("string"!=typeof e&&(n.isEncoding===i||!i(t)))throw new Error("Unknown encoding: "+t);return e||t}(t),this.encoding){case"utf16le":this.text=u,this.end=c,e=4;break;case"utf8":this.fillLast=a,e=4;break;case"base64":this.text=l,this.end=f,e=3;break;default:return this.write=h,void(this.end=p)}this.lastNeed=0,this.lastTotal=0,this.lastChar=n.allocUnsafe(e);}function s(t){return t<=127?0:t>>5==6?2:t>>4==14?3:t>>3==30?4:t>>6==2?-1:-2}function a(t){var e=this.lastTotal-this.lastNeed,r=function(t,e,r){if(128!=(192&e[0]))return t.lastNeed=0,"�";if(t.lastNeed>1&&e.length>1){if(128!=(192&e[1]))return t.lastNeed=1,"�";if(t.lastNeed>2&&e.length>2&&128!=(192&e[2]))return t.lastNeed=2,"�"}}(this,t);return void 0!==r?r:this.lastNeed<=t.length?(t.copy(this.lastChar,e,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal)):(t.copy(this.lastChar,e,0,t.length),void(this.lastNeed-=t.length))}function u(t,e){if((t.length-e)%2==0){var r=t.toString("utf16le",e);if(r){var n=r.charCodeAt(r.length-1);if(n>=55296&&n<=56319)return this.lastNeed=2,this.lastTotal=4,this.lastChar[0]=t[t.length-2],this.lastChar[1]=t[t.length-1],r.slice(0,-1)}return r}return this.lastNeed=1,this.lastTotal=2,this.lastChar[0]=t[t.length-1],t.toString("utf16le",e,t.length-1)}function c(t){var e=t&&t.length?this.write(t):"";if(this.lastNeed){var r=this.lastTotal-this.lastNeed;return e+this.lastChar.toString("utf16le",0,r)}return e}function l(t,e){var r=(t.length-e)%3;return 0===r?t.toString("base64",e):(this.lastNeed=3-r,this.lastTotal=3,1===r?this.lastChar[0]=t[t.length-1]:(this.lastChar[0]=t[t.length-2],this.lastChar[1]=t[t.length-1]),t.toString("base64",e,t.length-r))}function f(t){var e=t&&t.length?this.write(t):"";return this.lastNeed?e+this.lastChar.toString("base64",0,3-this.lastNeed):e}function h(t){return t.toString(this.encoding)}function p(t){return t&&t.length?this.write(t):""}e.StringDecoder=o,o.prototype.write=function(t){if(0===t.length)return "";var e,r;if(this.lastNeed){if(void 0===(e=this.fillLast(t)))return "";r=this.lastNeed,this.lastNeed=0;}else r=0;return r<t.length?e?e+this.text(t,r):this.text(t,r):e||""},o.prototype.end=function(t){var e=t&&t.length?this.write(t):"";return this.lastNeed?e+"�":e},o.prototype.text=function(t,e){var r=function(t,e,r){var n=e.length-1;if(n<r)return 0;var i=s(e[n]);return i>=0?(i>0&&(t.lastNeed=i-1),i):--n<r||-2===i?0:(i=s(e[n]))>=0?(i>0&&(t.lastNeed=i-2),i):--n<r||-2===i?0:(i=s(e[n]))>=0?(i>0&&(2===i?i=0:t.lastNeed=i-3),i):0}(this,t,e);if(!this.lastNeed)return t.toString("utf8",e);this.lastTotal=r;var n=t.length-(r-this.lastNeed);return t.copy(this.lastChar,0,n),t.toString("utf8",e,n)},o.prototype.fillLast=function(t){if(this.lastNeed<=t.length)return t.copy(this.lastChar,this.lastTotal-this.lastNeed,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal);t.copy(this.lastChar,this.lastTotal-this.lastNeed,0,t.length),this.lastNeed-=t.length;};},function(t,e,r){t.exports=o;var n=r(1),i=r(5);function o(t){if(!(this instanceof o))return new o(t);n.call(this,t),this._transformState={afterTransform:function(t,e){var r=this._transformState;r.transforming=!1;var n=r.writecb;if(!n)return this.emit("error",new Error("write callback called multiple times"));r.writechunk=null,r.writecb=null,null!=e&&this.push(e),n(t);var i=this._readableState;i.reading=!1,(i.needReadable||i.length<i.highWaterMark)&&this._read(i.highWaterMark);}.bind(this),needTransform:!1,transforming:!1,writecb:null,writechunk:null,writeencoding:null},this._readableState.needReadable=!0,this._readableState.sync=!1,t&&("function"==typeof t.transform&&(this._transform=t.transform),"function"==typeof t.flush&&(this._flush=t.flush)),this.on("prefinish",s);}function s(){var t=this;"function"==typeof this._flush?this._flush(function(e,r){a(t,e,r);}):a(this,null,null);}function a(t,e,r){if(e)return t.emit("error",e);if(null!=r&&t.push(r),t._writableState.length)throw new Error("Calling transform done when ws.length != 0");if(t._transformState.transforming)throw new Error("Calling transform done when still transforming");return t.push(null)}i.inherits=r(2),i.inherits(o,n),o.prototype.push=function(t,e){return this._transformState.needTransform=!1,n.prototype.push.call(this,t,e)},o.prototype._transform=function(t,e,r){throw new Error("_transform() is not implemented")},o.prototype._write=function(t,e,r){var n=this._transformState;if(n.writecb=r,n.writechunk=t,n.writeencoding=e,!n.transforming){var i=this._readableState;(n.needTransform||i.needReadable||i.length<i.highWaterMark)&&this._read(i.highWaterMark);}},o.prototype._read=function(t){var e=this._transformState;null!==e.writechunk&&e.writecb&&!e.transforming?(e.transforming=!0,this._transform(e.writechunk,e.writeencoding,e.afterTransform)):e.needTransform=!0;},o.prototype._destroy=function(t,e){var r=this;n.prototype._destroy.call(this,t,function(t){e(t),r.emit("close");});};},function(t,e,r){(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.bufFromString=function(e){var r=t.byteLength(e),n=t.allocUnsafe?t.allocUnsafe(r):new t(r);return n.write(e),n},e.emptyBuffer=function(){return t.allocUnsafe?t.allocUnsafe(0):new t(0)},e.filterArray=function(t,e){for(var r=[],n=0;n<t.length;n++)e.indexOf(n)>-1&&r.push(t[n]);return r},e.trimLeft=String.prototype.trimLeft?function(t){return t.trimLeft()}:function(t){return t.replace(/^\s+/,"")},e.trimRight=String.prototype.trimRight?function(t){return t.trimRight()}:function(t){return t.replace(/\s+$/,"")};}).call(this,r(3).Buffer);},function(t,e,r){var n=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r]);};return function(e,r){function n(){this.constructor=e;}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n);}}();Object.defineProperty(e,"__esModule",{value:!0});var i=function(t){function e(e,r,n){var i=t.call(this,"Error: "+e+". JSON Line number: "+r+(n?" near: "+n:""))||this;return i.err=e,i.line=r,i.extra=n,i.name="CSV Parse Error",i}return n(e,t),e.column_mismatched=function(t,r){return new e("column_mismatched",t,r)},e.unclosed_quote=function(t,r){return new e("unclosed_quote",t,r)},e.fromJSON=function(t){return new e(t.err,t.line,t.extra)},e.prototype.toJSON=function(){return {err:this.err,line:this.line,extra:this.extra}},e}(Error);e.default=i;},function(t,e,r){var n=r(18),i=r(68),o=r(69),s=n?n.toStringTag:void 0;t.exports=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":s&&s in Object(t)?i(t):o(t)};},function(t,e){t.exports=function(t,e){return t===e||t!=t&&e!=e};},function(t,e,r){t.exports=r(33);},function(t,e,r){var n=r(34),i=function(t,e){return new n.Converter(t,e)};i.csv=i,i.Converter=n.Converter,t.exports=i;},function(t,e,r){(function(t){var n=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r]);};return function(e,r){function n(){this.constructor=e;}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n);}}(),i=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});var o=r(36),s=r(50),a=r(51),u=i(r(15)),c=r(52),l=r(105),f=function(e){function i(r,n){void 0===n&&(n={});var i=e.call(this,n)||this;return i.options=n,i.params=s.mergeParams(r),i.runtime=a.initParseRuntime(i),i.result=new l.Result(i),i.processor=new c.ProcessorLocal(i),i.once("error",function(e){t(function(){i.result.processError(e),i.emit("done",e);});}),i.once("done",function(){i.processor.destroy();}),i}return n(i,e),i.prototype.preRawData=function(t){return this.runtime.preRawDataHook=t,this},i.prototype.preFileLine=function(t){return this.runtime.preFileLineHook=t,this},i.prototype.subscribe=function(t,e,r){return this.parseRuntime.subscribe={onNext:t,onError:e,onCompleted:r},this},i.prototype.fromFile=function(t,e){var n=this,i=r(!function(){var t=new Error("Cannot find module 'fs'");throw t.code="MODULE_NOT_FOUND",t}());return i.exists(t,function(r){r?i.createReadStream(t,e).pipe(n):n.emit("error",new Error("File does not exist. Check to make sure the file path to your csv is correct."));}),this},i.prototype.fromStream=function(t){return t.pipe(this),this},i.prototype.fromString=function(t){t.toString();var e=new o.Readable,r=0;return e._read=function(e){if(r>=t.length)this.push(null);else {var n=t.substr(r,e);this.push(n),r+=e;}},this.fromStream(e)},i.prototype.then=function(t,e){var r=this;return new u.default(function(n,i){r.parseRuntime.then={onfulfilled:function(e){n(t?t(e):e);},onrejected:function(t){e?n(e(t)):i(t);}};})},Object.defineProperty(i.prototype,"parseParam",{get:function(){return this.params},enumerable:!0,configurable:!0}),Object.defineProperty(i.prototype,"parseRuntime",{get:function(){return this.runtime},enumerable:!0,configurable:!0}),i.prototype._transform=function(t,e,r){var n=this;this.processor.process(t).then(function(t){if(t.length>0)return n.runtime.started=!0,n.result.processResult(t)}).then(function(){n.emit("drained"),r();},function(t){n.runtime.hasError=!0,n.runtime.error=t,n.emit("error",t),r();});},i.prototype._flush=function(t){var e=this;this.processor.flush().then(function(t){if(t.length>0)return e.result.processResult(t)}).then(function(){e.processEnd(t);},function(r){e.emit("error",r),t();});},i.prototype.processEnd=function(t){this.result.endProcess(),this.emit("done"),t();},Object.defineProperty(i.prototype,"parsedLineNumber",{get:function(){return this.runtime.parsedLineNumber},enumerable:!0,configurable:!0}),i}(o.Transform);e.Converter=f;}).call(this,r(11).setImmediate);},function(t,e,r){(function(t,e){!function(t,r){if(!t.setImmediate){var n,i=1,o={},s=!1,a=t.document,u=Object.getPrototypeOf&&Object.getPrototypeOf(t);u=u&&u.setTimeout?u:t,"[object process]"==={}.toString.call(t.process)?n=function(t){e.nextTick(function(){l(t);});}:function(){if(t.postMessage&&!t.importScripts){var e=!0,r=t.onmessage;return t.onmessage=function(){e=!1;},t.postMessage("","*"),t.onmessage=r,e}}()?function(){var e="setImmediate$"+Math.random()+"$",r=function(r){r.source===t&&"string"==typeof r.data&&0===r.data.indexOf(e)&&l(+r.data.slice(e.length));};t.addEventListener?t.addEventListener("message",r,!1):t.attachEvent("onmessage",r),n=function(r){t.postMessage(e+r,"*");};}():t.MessageChannel?function(){var t=new MessageChannel;t.port1.onmessage=function(t){l(t.data);},n=function(e){t.port2.postMessage(e);};}():a&&"onreadystatechange"in a.createElement("script")?function(){var t=a.documentElement;n=function(e){var r=a.createElement("script");r.onreadystatechange=function(){l(e),r.onreadystatechange=null,t.removeChild(r),r=null;},t.appendChild(r);};}():n=function(t){setTimeout(l,0,t);},u.setImmediate=function(t){"function"!=typeof t&&(t=new Function(""+t));for(var e=new Array(arguments.length-1),r=0;r<e.length;r++)e[r]=arguments[r+1];var s={callback:t,args:e};return o[i]=s,n(i),i++},u.clearImmediate=c;}function c(t){delete o[t];}function l(t){if(s)setTimeout(l,0,t);else {var e=o[t];if(e){s=!0;try{!function(t){var e=t.callback,n=t.args;switch(n.length){case 0:e();break;case 1:e(n[0]);break;case 2:e(n[0],n[1]);break;case 3:e(n[0],n[1],n[2]);break;default:e.apply(r,n);}}(e);}finally{c(t),s=!1;}}}}}("undefined"==typeof self?void 0===t?this:t:self);}).call(this,r(0),r(4));},function(t,e,r){t.exports=i;var n=r(12).EventEmitter;function i(){n.call(this);}r(2)(i,n),i.Readable=r(13),i.Writable=r(46),i.Duplex=r(47),i.Transform=r(48),i.PassThrough=r(49),i.Stream=i,i.prototype.pipe=function(t,e){var r=this;function i(e){t.writable&&!1===t.write(e)&&r.pause&&r.pause();}function o(){r.readable&&r.resume&&r.resume();}r.on("data",i),t.on("drain",o),t._isStdio||e&&!1===e.end||(r.on("end",a),r.on("close",u));var s=!1;function a(){s||(s=!0,t.end());}function u(){s||(s=!0,"function"==typeof t.destroy&&t.destroy());}function c(t){if(l(),0===n.listenerCount(this,"error"))throw t}function l(){r.removeListener("data",i),t.removeListener("drain",o),r.removeListener("end",a),r.removeListener("close",u),r.removeListener("error",c),t.removeListener("error",c),r.removeListener("end",l),r.removeListener("close",l),t.removeListener("close",l);}return r.on("error",c),t.on("error",c),r.on("end",l),r.on("close",l),t.on("close",l),t.emit("pipe",r),t};},function(t,e){var r={}.toString;t.exports=Array.isArray||function(t){return "[object Array]"==r.call(t)};},function(t,e,r){e.byteLength=function(t){var e=c(t),r=e[0],n=e[1];return 3*(r+n)/4-n},e.toByteArray=function(t){for(var e,r=c(t),n=r[0],s=r[1],a=new o(3*(n+s)/4-s),u=0,l=s>0?n-4:n,f=0;f<l;f+=4)e=i[t.charCodeAt(f)]<<18|i[t.charCodeAt(f+1)]<<12|i[t.charCodeAt(f+2)]<<6|i[t.charCodeAt(f+3)],a[u++]=e>>16&255,a[u++]=e>>8&255,a[u++]=255&e;return 2===s&&(e=i[t.charCodeAt(f)]<<2|i[t.charCodeAt(f+1)]>>4,a[u++]=255&e),1===s&&(e=i[t.charCodeAt(f)]<<10|i[t.charCodeAt(f+1)]<<4|i[t.charCodeAt(f+2)]>>2,a[u++]=e>>8&255,a[u++]=255&e),a},e.fromByteArray=function(t){for(var e,r=t.length,i=r%3,o=[],s=0,a=r-i;s<a;s+=16383)o.push(f(t,s,s+16383>a?a:s+16383));return 1===i?(e=t[r-1],o.push(n[e>>2]+n[e<<4&63]+"==")):2===i&&(e=(t[r-2]<<8)+t[r-1],o.push(n[e>>10]+n[e>>4&63]+n[e<<2&63]+"=")),o.join("")};for(var n=[],i=[],o="undefined"!=typeof Uint8Array?Uint8Array:Array,s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",a=0,u=s.length;a<u;++a)n[a]=s[a],i[s.charCodeAt(a)]=a;function c(t){var e=t.length;if(e%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var r=t.indexOf("=");return -1===r&&(r=e),[r,r===e?0:4-r%4]}function l(t){return n[t>>18&63]+n[t>>12&63]+n[t>>6&63]+n[63&t]}function f(t,e,r){for(var n,i=[],o=e;o<r;o+=3)n=(t[o]<<16&16711680)+(t[o+1]<<8&65280)+(255&t[o+2]),i.push(l(n));return i.join("")}i["-".charCodeAt(0)]=62,i["_".charCodeAt(0)]=63;},function(t,e){e.read=function(t,e,r,n,i){var o,s,a=8*i-n-1,u=(1<<a)-1,c=u>>1,l=-7,f=r?i-1:0,h=r?-1:1,p=t[e+f];for(f+=h,o=p&(1<<-l)-1,p>>=-l,l+=a;l>0;o=256*o+t[e+f],f+=h,l-=8);for(s=o&(1<<-l)-1,o>>=-l,l+=n;l>0;s=256*s+t[e+f],f+=h,l-=8);if(0===o)o=1-c;else {if(o===u)return s?NaN:1/0*(p?-1:1);s+=Math.pow(2,n),o-=c;}return (p?-1:1)*s*Math.pow(2,o-n)},e.write=function(t,e,r,n,i,o){var s,a,u,c=8*o-i-1,l=(1<<c)-1,f=l>>1,h=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,p=n?0:o-1,d=n?1:-1,_=e<0||0===e&&1/e<0?1:0;for(e=Math.abs(e),isNaN(e)||e===1/0?(a=isNaN(e)?1:0,s=l):(s=Math.floor(Math.log(e)/Math.LN2),e*(u=Math.pow(2,-s))<1&&(s--,u*=2),(e+=s+f>=1?h/u:h*Math.pow(2,1-f))*u>=2&&(s++,u/=2),s+f>=l?(a=0,s=l):s+f>=1?(a=(e*u-1)*Math.pow(2,i),s+=f):(a=e*Math.pow(2,f-1)*Math.pow(2,i),s=0));i>=8;t[r+p]=255&a,p+=d,a/=256,i-=8);for(s=s<<i|a,c+=i;c>0;t[r+p]=255&s,p+=d,s/=256,c-=8);t[r+p-d]|=128*_;};},function(t,e){var r={}.toString;t.exports=Array.isArray||function(t){return "[object Array]"==r.call(t)};},function(t,e){},function(t,e,r){var n=r(7).Buffer,i=r(43);function o(t,e,r){t.copy(e,r);}t.exports=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.head=null,this.tail=null,this.length=0;}return t.prototype.push=function(t){var e={data:t,next:null};this.length>0?this.tail.next=e:this.head=e,this.tail=e,++this.length;},t.prototype.unshift=function(t){var e={data:t,next:this.head};0===this.length&&(this.tail=e),this.head=e,++this.length;},t.prototype.shift=function(){if(0!==this.length){var t=this.head.data;return 1===this.length?this.head=this.tail=null:this.head=this.head.next,--this.length,t}},t.prototype.clear=function(){this.head=this.tail=null,this.length=0;},t.prototype.join=function(t){if(0===this.length)return "";for(var e=this.head,r=""+e.data;e=e.next;)r+=t+e.data;return r},t.prototype.concat=function(t){if(0===this.length)return n.alloc(0);if(1===this.length)return this.head.data;for(var e=n.allocUnsafe(t>>>0),r=this.head,i=0;r;)o(r.data,e,i),i+=r.data.length,r=r.next;return e},t}(),i&&i.inspect&&i.inspect.custom&&(t.exports.prototype[i.inspect.custom]=function(){var t=i.inspect({length:this.length});return this.constructor.name+" "+t});},function(t,e){},function(t,e,r){(function(e){function r(t){try{if(!e.localStorage)return !1}catch(t){return !1}var r=e.localStorage[t];return null!=r&&"true"===String(r).toLowerCase()}t.exports=function(t,e){if(r("noDeprecation"))return t;var n=!1;return function(){if(!n){if(r("throwDeprecation"))throw new Error(e);r("traceDeprecation")?console.trace(e):console.warn(e),n=!0;}return t.apply(this,arguments)}};}).call(this,r(0));},function(t,e,r){t.exports=o;var n=r(27),i=r(5);function o(t){if(!(this instanceof o))return new o(t);n.call(this,t);}i.inherits=r(2),i.inherits(o,n),o.prototype._transform=function(t,e,r){r(null,t);};},function(t,e,r){t.exports=r(14);},function(t,e,r){t.exports=r(1);},function(t,e,r){t.exports=r(13).Transform;},function(t,e,r){t.exports=r(13).PassThrough;},function(t,e,r){Object.defineProperty(e,"__esModule",{value:!0}),e.mergeParams=function(t){var e={delimiter:",",ignoreColumns:void 0,includeColumns:void 0,quote:'"',trim:!0,checkType:!1,ignoreEmpty:!1,noheader:!1,headers:void 0,flatKeys:!1,maxRowLength:0,checkColumn:!1,escape:'"',colParser:{},eol:void 0,alwaysSplitAtEOL:!1,output:"json",nullObject:!1,downstreamFormat:"line",needEmitAll:!0};for(var r in t||(t={}),t)t.hasOwnProperty(r)&&(Array.isArray(t[r])?e[r]=[].concat(t[r]):e[r]=t[r]);return e};},function(t,e,r){Object.defineProperty(e,"__esModule",{value:!0}),e.initParseRuntime=function(t){var e=t.parseParam,r={needProcessIgnoreColumn:!1,needProcessIncludeColumn:!1,selectedColumns:void 0,ended:!1,hasError:!1,error:void 0,delimiter:t.parseParam.delimiter,eol:t.parseParam.eol,columnConv:[],headerType:[],headerTitle:[],headerFlag:[],headers:void 0,started:!1,parsedLineNumber:0,columnValueSetter:[]};return e.ignoreColumns&&(r.needProcessIgnoreColumn=!0),e.includeColumns&&(r.needProcessIncludeColumn=!0),r};},function(t,e,r){(function(t){var n=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r]);};return function(e,r){function n(){this.constructor=e;}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n);}}(),i=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});var o=r(53),s=i(r(15)),a=r(54),u=i(r(16)),c=r(57),l=r(28),f=r(58),h=i(r(59)),p=i(r(29)),d=function(e){function r(){var t=null!==e&&e.apply(this,arguments)||this;return t.rowSplit=new f.RowSplit(t.converter),t.eolEmitted=!1,t._needEmitEol=void 0,t.headEmitted=!1,t._needEmitHead=void 0,t}return n(r,e),r.prototype.flush=function(){var t=this;if(this.runtime.csvLineBuffer&&this.runtime.csvLineBuffer.length>0){var e=this.runtime.csvLineBuffer;return this.runtime.csvLineBuffer=void 0,this.process(e,!0).then(function(e){return t.runtime.csvLineBuffer&&t.runtime.csvLineBuffer.length>0?s.default.reject(p.default.unclosed_quote(t.runtime.parsedLineNumber,t.runtime.csvLineBuffer.toString())):s.default.resolve(e)})}return s.default.resolve([])},r.prototype.destroy=function(){return s.default.resolve()},Object.defineProperty(r.prototype,"needEmitEol",{get:function(){return void 0===this._needEmitEol&&(this._needEmitEol=this.converter.listeners("eol").length>0),this._needEmitEol},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"needEmitHead",{get:function(){return void 0===this._needEmitHead&&(this._needEmitHead=this.converter.listeners("header").length>0),this._needEmitHead},enumerable:!0,configurable:!0}),r.prototype.process=function(t,e){var r,n=this;return void 0===e&&(e=!1),r=e?t.toString():a.prepareData(t,this.converter.parseRuntime),s.default.resolve().then(function(){return n.runtime.preRawDataHook?n.runtime.preRawDataHook(r):r}).then(function(t){return t&&t.length>0?n.processCSV(t,e):s.default.resolve([])})},r.prototype.processCSV=function(t,e){var r=this,n=this.params,i=this.runtime;i.eol||u.default(t,i),this.needEmitEol&&!this.eolEmitted&&i.eol&&(this.converter.emit("eol",i.eol),this.eolEmitted=!0),n.ignoreEmpty&&!i.started&&(t=l.trimLeft(t));var o=c.stringToLines(t,i);return e?(o.lines.push(o.partial),o.partial=""):this.prependLeftBuf(l.bufFromString(o.partial)),o.lines.length>0?(i.preFileLineHook?this.runPreLineHook(o.lines):s.default.resolve(o.lines)).then(function(t){return i.started||r.runtime.headers?r.processCSVBody(t):r.processDataWithHead(t)}):s.default.resolve([])},r.prototype.processDataWithHead=function(t){if(this.params.noheader)this.params.headers?this.runtime.headers=this.params.headers:this.runtime.headers=[];else {for(var e="",r=[];t.length;){var n=e+t.shift(),i=this.rowSplit.parse(n);if(i.closed){r=i.cells,e="";break}e=n+u.default(n,this.runtime);}if(this.prependLeftBuf(l.bufFromString(e)),0===r.length)return [];this.params.headers?this.runtime.headers=this.params.headers:this.runtime.headers=r;}return (this.runtime.needProcessIgnoreColumn||this.runtime.needProcessIncludeColumn)&&this.filterHeader(),this.needEmitHead&&!this.headEmitted&&(this.converter.emit("header",this.runtime.headers),this.headEmitted=!0),this.processCSVBody(t)},r.prototype.filterHeader=function(){if(this.runtime.selectedColumns=[],this.runtime.headers){for(var t=this.runtime.headers,e=0;e<t.length;e++)if(this.params.ignoreColumns)if(this.params.ignoreColumns.test(t[e])){if(!this.params.includeColumns||!this.params.includeColumns.test(t[e]))continue;this.runtime.selectedColumns.push(e);}else this.runtime.selectedColumns.push(e);else this.params.includeColumns?this.params.includeColumns.test(t[e])&&this.runtime.selectedColumns.push(e):this.runtime.selectedColumns.push(e);this.runtime.headers=l.filterArray(this.runtime.headers,this.runtime.selectedColumns);}},r.prototype.processCSVBody=function(t){if("line"===this.params.output)return t;var e=this.rowSplit.parseMultiLines(t);return this.prependLeftBuf(l.bufFromString(e.partial)),"csv"===this.params.output?e.rowsCells:h.default(e.rowsCells,this.converter)},r.prototype.prependLeftBuf=function(e){e&&(this.runtime.csvLineBuffer?this.runtime.csvLineBuffer=t.concat([e,this.runtime.csvLineBuffer]):this.runtime.csvLineBuffer=e);},r.prototype.runPreLineHook=function(t){var e=this;return new s.default(function(r,n){!function t(e,r,n,i){if(n>=e.length)i();else if(r.preFileLineHook){var o=e[n],s=r.preFileLineHook(o,r.parsedLineNumber+n);if(n++,s&&s.then)s.then(function(o){e[n-1]=o,t(e,r,n,i);});else {for(e[n-1]=s;n<e.length;)e[n]=r.preFileLineHook(e[n],r.parsedLineNumber+n),n++;i();}}else i();}(t,e.runtime,0,function(e){e?n(e):r(t);});})},r}(o.Processor);e.ProcessorLocal=d;}).call(this,r(3).Buffer);},function(t,e,r){Object.defineProperty(e,"__esModule",{value:!0});var n=function(t){this.converter=t,this.params=t.parseParam,this.runtime=t.parseRuntime;};e.Processor=n;},function(t,e,r){(function(t){var n=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});var i=n(r(55));e.prepareData=function(e,r){var n=function(e,r){return r.csvLineBuffer&&r.csvLineBuffer.length>0?t.concat([r.csvLineBuffer,e]):e}(e,r);r.csvLineBuffer=void 0;var o=function(t,e){var r=t.length-1;if(0!=(128&t[r])){for(;128==(192&t[r]);)r--;r--;}return r!=t.length-1?(e.csvLineBuffer=t.slice(r+1),t.slice(0,r+1)):t}(n,r).toString("utf8");return !1===r.started?i.default(o):o};}).call(this,r(3).Buffer);},function(t,e,r){(function(e){var n=r(56);t.exports=function(t){return "string"==typeof t&&65279===t.charCodeAt(0)?t.slice(1):e.isBuffer(t)&&n(t)&&239===t[0]&&187===t[1]&&191===t[2]?t.slice(3):t};}).call(this,r(3).Buffer);},function(t,e){t.exports=function(t){for(var e=0;e<t.length;)if(9==t[e]||10==t[e]||13==t[e]||32<=t[e]&&t[e]<=126)e+=1;else if(194<=t[e]&&t[e]<=223&&128<=t[e+1]&&t[e+1]<=191)e+=2;else if(224==t[e]&&160<=t[e+1]&&t[e+1]<=191&&128<=t[e+2]&&t[e+2]<=191||(225<=t[e]&&t[e]<=236||238==t[e]||239==t[e])&&128<=t[e+1]&&t[e+1]<=191&&128<=t[e+2]&&t[e+2]<=191||237==t[e]&&128<=t[e+1]&&t[e+1]<=159&&128<=t[e+2]&&t[e+2]<=191)e+=3;else {if(!(240==t[e]&&144<=t[e+1]&&t[e+1]<=191&&128<=t[e+2]&&t[e+2]<=191&&128<=t[e+3]&&t[e+3]<=191||241<=t[e]&&t[e]<=243&&128<=t[e+1]&&t[e+1]<=191&&128<=t[e+2]&&t[e+2]<=191&&128<=t[e+3]&&t[e+3]<=191||244==t[e]&&128<=t[e+1]&&t[e+1]<=143&&128<=t[e+2]&&t[e+2]<=191&&128<=t[e+3]&&t[e+3]<=191))return !1;e+=4;}return !0};},function(t,e,r){var n=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});var i=n(r(16));e.stringToLines=function(t,e){var r=i.default(t,e),n=t.split(r);return {lines:n,partial:n.pop()||""}};},function(t,e,r){var n=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});var i=n(r(16)),o=r(28),s=[",","|","\t",";",":"],a=function(){function t(t){this.conv=t,this.cachedRegExp={},this.delimiterEmitted=!1,this._needEmitDelimiter=void 0,this.quote=t.parseParam.quote,this.trim=t.parseParam.trim,this.escape=t.parseParam.escape;}return Object.defineProperty(t.prototype,"needEmitDelimiter",{get:function(){return void 0===this._needEmitDelimiter&&(this._needEmitDelimiter=this.conv.listeners("delimiter").length>0),this._needEmitDelimiter},enumerable:!0,configurable:!0}),t.prototype.parse=function(t){if(0===t.length||this.conv.parseParam.ignoreEmpty&&0===t.trim().length)return {cells:[],closed:!0};var e=this.quote,r=this.trim;this.escape,(this.conv.parseRuntime.delimiter instanceof Array||"auto"===this.conv.parseRuntime.delimiter.toLowerCase())&&(this.conv.parseRuntime.delimiter=this.getDelimiter(t)),this.needEmitDelimiter&&!this.delimiterEmitted&&(this.conv.emit("delimiter",this.conv.parseRuntime.delimiter),this.delimiterEmitted=!0);var n=this.conv.parseRuntime.delimiter,i=t.split(n);if("off"===e){if(r)for(var o=0;o<i.length;o++)i[o]=i[o].trim();return {cells:i,closed:!0}}return this.toCSVRow(i,r,e,n)},t.prototype.toCSVRow=function(t,e,r,n){for(var i=[],s=!1,a="",u=0,c=t.length;u<c;u++){var l=t[u];!s&&e&&(l=o.trimLeft(l));var f=l.length;if(s)this.isQuoteClose(l)?(s=!1,a+=n+(l=l.substr(0,f-1)),a=this.escapeQuote(a),e&&(a=o.trimRight(a)),i.push(a),a=""):a+=n+l;else {if(2===f&&l===this.quote+this.quote){i.push("");continue}if(this.isQuoteOpen(l)){if(l=l.substr(1),this.isQuoteClose(l)){l=l.substring(0,l.lastIndexOf(r)),l=this.escapeQuote(l),i.push(l);continue}if(-1!==l.indexOf(r)){for(var h=0,p="",d=0,_=l;d<_.length;d++){var v=_[d];v===r&&p!==this.escape?(h++,p=""):p=v;}if(h%2==1){e&&(l=o.trimRight(l)),i.push(r+l);continue}s=!0,a+=l;continue}s=!0,a+=l;continue}e&&(l=o.trimRight(l)),i.push(l);}}return {cells:i,closed:!s}},t.prototype.getDelimiter=function(t){var e;if("auto"===this.conv.parseParam.delimiter)e=s;else {if(!(this.conv.parseParam.delimiter instanceof Array))return this.conv.parseParam.delimiter;e=this.conv.parseParam.delimiter;}var r=0,n=",";return e.forEach(function(e){var i=t.split(e).length;i>r&&(n=e,r=i);}),n},t.prototype.isQuoteOpen=function(t){var e=this.quote,r=this.escape;return t[0]===e&&(t[1]!==e||t[1]===r&&(t[2]===e||2===t.length))},t.prototype.isQuoteClose=function(t){var e=this.quote,r=this.escape;this.conv.parseParam.trim&&(t=o.trimRight(t));for(var n=0,i=t.length-1;t[i]===e||t[i]===r;)i--,n++;return n%2!=0},t.prototype.escapeQuote=function(t){var e="es|"+this.quote+"|"+this.escape;void 0===this.cachedRegExp[e]&&(this.cachedRegExp[e]=new RegExp("\\"+this.escape+"\\"+this.quote,"g"));var r=this.cachedRegExp[e];return t.replace(r,this.quote)},t.prototype.parseMultiLines=function(t){for(var e=[],r="";t.length;){var n=r+t.shift(),s=this.parse(n);0===s.cells.length&&this.conv.parseParam.ignoreEmpty||(s.closed||this.conv.parseParam.alwaysSplitAtEOL?(this.conv.parseRuntime.selectedColumns?e.push(o.filterArray(s.cells,this.conv.parseRuntime.selectedColumns)):e.push(s.cells),r=""):r=n+(i.default(n,this.conv.parseRuntime)||"\n"));}return {rowsCells:e,partial:r}},t}();e.RowSplit=a;},function(t,e,r){var n=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});var i=n(r(29)),o=n(r(60)),s=/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;function a(t,e,r){if(e.parseParam.checkColumn&&e.parseRuntime.headers&&t.length!==e.parseRuntime.headers.length)throw i.default.column_mismatched(e.parseRuntime.parsedLineNumber+r);return function(t,e,r){for(var n=!1,i={},o=0,s=t.length;o<s;o++){var a=t[o];if(!r.parseParam.ignoreEmpty||""!==a){n=!0;var u=e[o];u&&""!==u||(u=e[o]="field"+(o+1));var f=c(u,o,r);if(f){var h=f(a,u,i,t,o);void 0!==h&&l(i,u,h,r,o);}else {if(r.parseParam.checkType)a=p(a,u,o,r)(a);void 0!==a&&l(i,u,a,r,o);}}}return n?i:null}(t,e.parseRuntime.headers||[],e)||null}e.default=function(t,e){for(var r=[],n=0,i=t.length;n<i;n++){var o=a(t[n],e,n);o&&r.push(o);}return r};var u={string:_,number:d,omit:function(){}};function c(t,e,r){if(void 0!==r.parseRuntime.columnConv[e])return r.parseRuntime.columnConv[e];var n=r.parseParam.colParser[t];if(void 0===n)return r.parseRuntime.columnConv[e]=null;if("object"==typeof n&&(n=n.cellParser||"string"),"string"==typeof n){n=n.trim().toLowerCase();var i=u[n];return r.parseRuntime.columnConv[e]=i||null}return r.parseRuntime.columnConv[e]="function"==typeof n?n:null}function l(t,e,r,n,i){if(!n.parseRuntime.columnValueSetter[i])if(n.parseParam.flatKeys)n.parseRuntime.columnValueSetter[i]=f;else if(e.indexOf(".")>-1){for(var o=e.split("."),s=!0;o.length>0;)if(0===o.shift().length){s=!1;break}!s||n.parseParam.colParser[e]&&n.parseParam.colParser[e].flat?n.parseRuntime.columnValueSetter[i]=f:n.parseRuntime.columnValueSetter[i]=h;}else n.parseRuntime.columnValueSetter[i]=f;!0===n.parseParam.nullObject&&"null"===r&&(r=null),n.parseRuntime.columnValueSetter[i](t,e,r);}function f(t,e,r){t[e]=r;}function h(t,e,r){o.default(t,e,r);}function p(t,e,r,n){return n.parseRuntime.headerType[r]?n.parseRuntime.headerType[r]:e.indexOf("number#!")>-1?n.parseRuntime.headerType[r]=d:e.indexOf("string#!")>-1?n.parseRuntime.headerType[r]=_:n.parseParam.checkType?n.parseRuntime.headerType[r]=v:n.parseRuntime.headerType[r]=_}function d(t){var e=parseFloat(t);return isNaN(e)?t:e}function _(t){return t.toString()}function v(t){var e=t.trim();return ""===e?_(t):s.test(e)?d(t):5===e.length&&"false"===e.toLowerCase()||4===e.length&&"true"===e.toLowerCase()?function(t){var e=t.trim();return 5!==e.length||"false"!==e.toLowerCase()}(t):"{"===e[0]&&"}"===e[e.length-1]||"["===e[0]&&"]"===e[e.length-1]?function(t){try{return JSON.parse(t)}catch(e){return t}}(t):_(t)}},function(t,e,r){var n=r(61);t.exports=function(t,e,r){return null==t?t:n(t,e,r)};},function(t,e,r){var n=r(62),i=r(74),o=r(103),s=r(20),a=r(104);t.exports=function(t,e,r,u){if(!s(t))return t;for(var c=-1,l=(e=i(e,t)).length,f=l-1,h=t;null!=h&&++c<l;){var p=a(e[c]),d=r;if(c!=f){var _=h[p];void 0===(d=u?u(_,p,h):void 0)&&(d=s(_)?_:o(e[c+1])?[]:{});}n(h,p,d),h=h[p];}return t};},function(t,e,r){var n=r(63),i=r(31),o=Object.prototype.hasOwnProperty;t.exports=function(t,e,r){var s=t[e];o.call(t,e)&&i(s,r)&&(void 0!==r||e in t)||n(t,e,r);};},function(t,e,r){var n=r(64);t.exports=function(t,e,r){"__proto__"==e&&n?n(t,e,{configurable:!0,enumerable:!0,value:r,writable:!0}):t[e]=r;};},function(t,e,r){var n=r(17),i=function(){try{var t=n(Object,"defineProperty");return t({},"",{}),t}catch(t){}}();t.exports=i;},function(t,e,r){var n=r(66),i=r(70),o=r(20),s=r(72),a=/^\[object .+?Constructor\]$/,u=Function.prototype,c=Object.prototype,l=u.toString,f=c.hasOwnProperty,h=RegExp("^"+l.call(f).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");t.exports=function(t){return !(!o(t)||i(t))&&(n(t)?h:a).test(s(t))};},function(t,e,r){var n=r(30),i=r(20);t.exports=function(t){if(!i(t))return !1;var e=n(t);return "[object Function]"==e||"[object GeneratorFunction]"==e||"[object AsyncFunction]"==e||"[object Proxy]"==e};},function(t,e,r){(function(e){var r="object"==typeof e&&e&&e.Object===Object&&e;t.exports=r;}).call(this,r(0));},function(t,e,r){var n=r(18),i=Object.prototype,o=i.hasOwnProperty,s=i.toString,a=n?n.toStringTag:void 0;t.exports=function(t){var e=o.call(t,a),r=t[a];try{t[a]=void 0;var n=!0;}catch(t){}var i=s.call(t);return n&&(e?t[a]=r:delete t[a]),i};},function(t,e){var r=Object.prototype.toString;t.exports=function(t){return r.call(t)};},function(t,e,r){var n=r(71),i=function(){var t=/[^.]+$/.exec(n&&n.keys&&n.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}();t.exports=function(t){return !!i&&i in t};},function(t,e,r){var n=r(19)["__core-js_shared__"];t.exports=n;},function(t,e){var r=Function.prototype.toString;t.exports=function(t){if(null!=t){try{return r.call(t)}catch(t){}try{return t+""}catch(t){}}return ""};},function(t,e){t.exports=function(t,e){return null==t?void 0:t[e]};},function(t,e,r){var n=r(21),i=r(75),o=r(77),s=r(100);t.exports=function(t,e){return n(t)?t:i(t,e)?[t]:o(s(t))};},function(t,e,r){var n=r(21),i=r(22),o=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,s=/^\w*$/;t.exports=function(t,e){if(n(t))return !1;var r=typeof t;return !("number"!=r&&"symbol"!=r&&"boolean"!=r&&null!=t&&!i(t))||s.test(t)||!o.test(t)||null!=e&&t in Object(e)};},function(t,e){t.exports=function(t){return null!=t&&"object"==typeof t};},function(t,e,r){var n=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,i=/\\(\\)?/g,o=r(78)(function(t){var e=[];return 46===t.charCodeAt(0)&&e.push(""),t.replace(n,function(t,r,n,o){e.push(n?o.replace(i,"$1"):r||t);}),e});t.exports=o;},function(t,e,r){var n=r(79);t.exports=function(t){var e=n(t,function(t){return 500===r.size&&r.clear(),t}),r=e.cache;return e};},function(t,e,r){var n=r(80),i="Expected a function";function o(t,e){if("function"!=typeof t||null!=e&&"function"!=typeof e)throw new TypeError(i);var r=function(){var n=arguments,i=e?e.apply(this,n):n[0],o=r.cache;if(o.has(i))return o.get(i);var s=t.apply(this,n);return r.cache=o.set(i,s)||o,s};return r.cache=new(o.Cache||n),r}o.Cache=n,t.exports=o;},function(t,e,r){var n=r(81),i=r(95),o=r(97),s=r(98),a=r(99);function u(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1]);}}u.prototype.clear=n,u.prototype.delete=i,u.prototype.get=o,u.prototype.has=s,u.prototype.set=a,t.exports=u;},function(t,e,r){var n=r(82),i=r(88),o=r(94);t.exports=function(){this.size=0,this.__data__={hash:new n,map:new(o||i),string:new n};};},function(t,e,r){var n=r(83),i=r(84),o=r(85),s=r(86),a=r(87);function u(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1]);}}u.prototype.clear=n,u.prototype.delete=i,u.prototype.get=o,u.prototype.has=s,u.prototype.set=a,t.exports=u;},function(t,e,r){var n=r(8);t.exports=function(){this.__data__=n?n(null):{},this.size=0;};},function(t,e){t.exports=function(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e};},function(t,e,r){var n=r(8),i=Object.prototype.hasOwnProperty;t.exports=function(t){var e=this.__data__;if(n){var r=e[t];return "__lodash_hash_undefined__"===r?void 0:r}return i.call(e,t)?e[t]:void 0};},function(t,e,r){var n=r(8),i=Object.prototype.hasOwnProperty;t.exports=function(t){var e=this.__data__;return n?void 0!==e[t]:i.call(e,t)};},function(t,e,r){var n=r(8);t.exports=function(t,e){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=n&&void 0===e?"__lodash_hash_undefined__":e,this};},function(t,e,r){var n=r(89),i=r(90),o=r(91),s=r(92),a=r(93);function u(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1]);}}u.prototype.clear=n,u.prototype.delete=i,u.prototype.get=o,u.prototype.has=s,u.prototype.set=a,t.exports=u;},function(t,e){t.exports=function(){this.__data__=[],this.size=0;};},function(t,e,r){var n=r(9),i=Array.prototype.splice;t.exports=function(t){var e=this.__data__,r=n(e,t);return !(r<0||(r==e.length-1?e.pop():i.call(e,r,1),--this.size,0))};},function(t,e,r){var n=r(9);t.exports=function(t){var e=this.__data__,r=n(e,t);return r<0?void 0:e[r][1]};},function(t,e,r){var n=r(9);t.exports=function(t){return n(this.__data__,t)>-1};},function(t,e,r){var n=r(9);t.exports=function(t,e){var r=this.__data__,i=n(r,t);return i<0?(++this.size,r.push([t,e])):r[i][1]=e,this};},function(t,e,r){var n=r(17)(r(19),"Map");t.exports=n;},function(t,e,r){var n=r(10);t.exports=function(t){var e=n(this,t).delete(t);return this.size-=e?1:0,e};},function(t,e){t.exports=function(t){var e=typeof t;return "string"==e||"number"==e||"symbol"==e||"boolean"==e?"__proto__"!==t:null===t};},function(t,e,r){var n=r(10);t.exports=function(t){return n(this,t).get(t)};},function(t,e,r){var n=r(10);t.exports=function(t){return n(this,t).has(t)};},function(t,e,r){var n=r(10);t.exports=function(t,e){var r=n(this,t),i=r.size;return r.set(t,e),this.size+=r.size==i?0:1,this};},function(t,e,r){var n=r(101);t.exports=function(t){return null==t?"":n(t)};},function(t,e,r){var n=r(18),i=r(102),o=r(21),s=r(22),a=n?n.prototype:void 0,u=a?a.toString:void 0;t.exports=function t(e){if("string"==typeof e)return e;if(o(e))return i(e,t)+"";if(s(e))return u?u.call(e):"";var r=e+"";return "0"==r&&1/e==-1/0?"-0":r};},function(t,e){t.exports=function(t,e){for(var r=-1,n=null==t?0:t.length,i=Array(n);++r<n;)i[r]=e(t[r],r,t);return i};},function(t,e){var r=/^(?:0|[1-9]\d*)$/;t.exports=function(t,e){var n=typeof t;return !!(e=null==e?9007199254740991:e)&&("number"==n||"symbol"!=n&&r.test(t))&&t>-1&&t%1==0&&t<e};},function(t,e,r){var n=r(22);t.exports=function(t){if("string"==typeof t||n(t))return t;var e=t+"";return "0"==e&&1/t==-1/0?"-0":e};},function(t,e,r){var n=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});var i=n(r(15)),o=r(106),s=function(){function t(t){this.converter=t,this.finalResult=[];}return Object.defineProperty(t.prototype,"needEmitLine",{get:function(){return !!this.converter.parseRuntime.subscribe&&!!this.converter.parseRuntime.subscribe.onNext||this.needPushDownstream},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"needPushDownstream",{get:function(){return void 0===this._needPushDownstream&&(this._needPushDownstream=this.converter.listeners("data").length>0||this.converter.listeners("readable").length>0),this._needPushDownstream},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"needEmitAll",{get:function(){return !!this.converter.parseRuntime.then&&this.converter.parseParam.needEmitAll},enumerable:!0,configurable:!0}),t.prototype.processResult=function(t){var e=this,r=this.converter.parseRuntime.parsedLineNumber;return this.needPushDownstream&&"array"===this.converter.parseParam.downstreamFormat&&0===r&&a(this.converter,"["+o.EOL),new i.default(function(r,n){e.needEmitLine?function t(e,r,n,i,o){if(n>=e.length)o();else if(r.parseRuntime.subscribe&&r.parseRuntime.subscribe.onNext){var s=r.parseRuntime.subscribe.onNext,u=e[n],c=s(u,r.parseRuntime.parsedLineNumber+n);if(n++,c&&c.then)c.then(function(){!function(e,r,n,i,o,s,u){o&&a(n,u),t(e,n,i,o,s);}(e,0,r,n,i,o,u);},o);else {for(i&&a(r,u);n<e.length;){var l=e[n];s(l,r.parseRuntime.parsedLineNumber+n),n++,i&&a(r,l);}o();}}else {if(i)for(;n<e.length;)l=e[n++],a(r,l);o();}}(t,e.converter,0,e.needPushDownstream,function(i){i?n(i):(e.appendFinalResult(t),r());}):(e.appendFinalResult(t),r());})},t.prototype.appendFinalResult=function(t){this.needEmitAll&&(this.finalResult=this.finalResult.concat(t)),this.converter.parseRuntime.parsedLineNumber+=t.length;},t.prototype.processError=function(t){this.converter.parseRuntime.subscribe&&this.converter.parseRuntime.subscribe.onError&&this.converter.parseRuntime.subscribe.onError(t),this.converter.parseRuntime.then&&this.converter.parseRuntime.then.onrejected&&this.converter.parseRuntime.then.onrejected(t);},t.prototype.endProcess=function(){this.converter.parseRuntime.then&&this.converter.parseRuntime.then.onfulfilled&&(this.needEmitAll?this.converter.parseRuntime.then.onfulfilled(this.finalResult):this.converter.parseRuntime.then.onfulfilled([])),this.converter.parseRuntime.subscribe&&this.converter.parseRuntime.subscribe.onCompleted&&this.converter.parseRuntime.subscribe.onCompleted(),this.needPushDownstream&&"array"===this.converter.parseParam.downstreamFormat&&a(this.converter,"]"+o.EOL);},t}();function a(t,e){if("object"!=typeof e||t.options.objectMode)t.push(e);else {var r=JSON.stringify(e);t.push(r+("array"===t.parseParam.downstreamFormat?","+o.EOL:o.EOL),"utf8");}}e.Result=s;},function(t,e){e.endianness=function(){return "LE"},e.hostname=function(){return "undefined"!=typeof location?location.hostname:""},e.loadavg=function(){return []},e.uptime=function(){return 0},e.freemem=function(){return Number.MAX_VALUE},e.totalmem=function(){return Number.MAX_VALUE},e.cpus=function(){return []},e.type=function(){return "Browser"},e.release=function(){return "undefined"!=typeof navigator?navigator.appVersion:""},e.networkInterfaces=e.getNetworkInterfaces=function(){return {}},e.arch=function(){return "javascript"},e.platform=function(){return "browser"},e.tmpdir=e.tmpDir=function(){return "/tmp"},e.EOL="\n",e.homedir=function(){return "/"};}]);

    /**
     * marked - a markdown parser
     * Copyright (c) 2011-2021, Christopher Jeffrey. (MIT Licensed)
     * https://github.com/markedjs/marked
     */

    /**
     * DO NOT EDIT THIS FILE
     * The code in this file is generated from files in ./src/
     */

    function getDefaults() {
      return {
        baseUrl: null,
        breaks: false,
        extensions: null,
        gfm: true,
        headerIds: true,
        headerPrefix: '',
        highlight: null,
        langPrefix: 'language-',
        mangle: true,
        pedantic: false,
        renderer: null,
        sanitize: false,
        sanitizer: null,
        silent: false,
        smartLists: false,
        smartypants: false,
        tokenizer: null,
        walkTokens: null,
        xhtml: false
      };
    }

    let defaults = getDefaults();

    function changeDefaults(newDefaults) {
      defaults = newDefaults;
    }

    /**
     * Helpers
     */
    const escapeTest = /[&<>"']/;
    const escapeReplace = /[&<>"']/g;
    const escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
    const escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
    const escapeReplacements = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    const getEscapeReplacement = (ch) => escapeReplacements[ch];
    function escape(html, encode) {
      if (encode) {
        if (escapeTest.test(html)) {
          return html.replace(escapeReplace, getEscapeReplacement);
        }
      } else {
        if (escapeTestNoEncode.test(html)) {
          return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
        }
      }

      return html;
    }

    const unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;

    function unescape(html) {
      // explicitly match decimal, hex, and named HTML entities
      return html.replace(unescapeTest, (_, n) => {
        n = n.toLowerCase();
        if (n === 'colon') return ':';
        if (n.charAt(0) === '#') {
          return n.charAt(1) === 'x'
            ? String.fromCharCode(parseInt(n.substring(2), 16))
            : String.fromCharCode(+n.substring(1));
        }
        return '';
      });
    }

    const caret = /(^|[^\[])\^/g;
    function edit(regex, opt) {
      regex = regex.source || regex;
      opt = opt || '';
      const obj = {
        replace: (name, val) => {
          val = val.source || val;
          val = val.replace(caret, '$1');
          regex = regex.replace(name, val);
          return obj;
        },
        getRegex: () => {
          return new RegExp(regex, opt);
        }
      };
      return obj;
    }

    const nonWordAndColonTest = /[^\w:]/g;
    const originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
    function cleanUrl(sanitize, base, href) {
      if (sanitize) {
        let prot;
        try {
          prot = decodeURIComponent(unescape(href))
            .replace(nonWordAndColonTest, '')
            .toLowerCase();
        } catch (e) {
          return null;
        }
        if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
          return null;
        }
      }
      if (base && !originIndependentUrl.test(href)) {
        href = resolveUrl(base, href);
      }
      try {
        href = encodeURI(href).replace(/%25/g, '%');
      } catch (e) {
        return null;
      }
      return href;
    }

    const baseUrls = {};
    const justDomain = /^[^:]+:\/*[^/]*$/;
    const protocol = /^([^:]+:)[\s\S]*$/;
    const domain = /^([^:]+:\/*[^/]*)[\s\S]*$/;

    function resolveUrl(base, href) {
      if (!baseUrls[' ' + base]) {
        // we can ignore everything in base after the last slash of its path component,
        // but we might need to add _that_
        // https://tools.ietf.org/html/rfc3986#section-3
        if (justDomain.test(base)) {
          baseUrls[' ' + base] = base + '/';
        } else {
          baseUrls[' ' + base] = rtrim(base, '/', true);
        }
      }
      base = baseUrls[' ' + base];
      const relativeBase = base.indexOf(':') === -1;

      if (href.substring(0, 2) === '//') {
        if (relativeBase) {
          return href;
        }
        return base.replace(protocol, '$1') + href;
      } else if (href.charAt(0) === '/') {
        if (relativeBase) {
          return href;
        }
        return base.replace(domain, '$1') + href;
      } else {
        return base + href;
      }
    }

    const noopTest = { exec: function noopTest() {} };

    function merge(obj) {
      let i = 1,
        target,
        key;

      for (; i < arguments.length; i++) {
        target = arguments[i];
        for (key in target) {
          if (Object.prototype.hasOwnProperty.call(target, key)) {
            obj[key] = target[key];
          }
        }
      }

      return obj;
    }

    function splitCells(tableRow, count) {
      // ensure that every cell-delimiting pipe has a space
      // before it to distinguish it from an escaped pipe
      const row = tableRow.replace(/\|/g, (match, offset, str) => {
          let escaped = false,
            curr = offset;
          while (--curr >= 0 && str[curr] === '\\') escaped = !escaped;
          if (escaped) {
            // odd number of slashes means | is escaped
            // so we leave it alone
            return '|';
          } else {
            // add space before unescaped |
            return ' |';
          }
        }),
        cells = row.split(/ \|/);
      let i = 0;

      // First/last cell in a row cannot be empty if it has no leading/trailing pipe
      if (!cells[0].trim()) { cells.shift(); }
      if (!cells[cells.length - 1].trim()) { cells.pop(); }

      if (cells.length > count) {
        cells.splice(count);
      } else {
        while (cells.length < count) cells.push('');
      }

      for (; i < cells.length; i++) {
        // leading or trailing whitespace is ignored per the gfm spec
        cells[i] = cells[i].trim().replace(/\\\|/g, '|');
      }
      return cells;
    }

    // Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
    // /c*$/ is vulnerable to REDOS.
    // invert: Remove suffix of non-c chars instead. Default falsey.
    function rtrim(str, c, invert) {
      const l = str.length;
      if (l === 0) {
        return '';
      }

      // Length of suffix matching the invert condition.
      let suffLen = 0;

      // Step left until we fail to match the invert condition.
      while (suffLen < l) {
        const currChar = str.charAt(l - suffLen - 1);
        if (currChar === c && !invert) {
          suffLen++;
        } else if (currChar !== c && invert) {
          suffLen++;
        } else {
          break;
        }
      }

      return str.substr(0, l - suffLen);
    }

    function findClosingBracket(str, b) {
      if (str.indexOf(b[1]) === -1) {
        return -1;
      }
      const l = str.length;
      let level = 0,
        i = 0;
      for (; i < l; i++) {
        if (str[i] === '\\') {
          i++;
        } else if (str[i] === b[0]) {
          level++;
        } else if (str[i] === b[1]) {
          level--;
          if (level < 0) {
            return i;
          }
        }
      }
      return -1;
    }

    function checkSanitizeDeprecation(opt) {
      if (opt && opt.sanitize && !opt.silent) {
        console.warn('marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options');
      }
    }

    // copied from https://stackoverflow.com/a/5450113/806777
    function repeatString(pattern, count) {
      if (count < 1) {
        return '';
      }
      let result = '';
      while (count > 1) {
        if (count & 1) {
          result += pattern;
        }
        count >>= 1;
        pattern += pattern;
      }
      return result + pattern;
    }

    function outputLink(cap, link, raw, lexer) {
      const href = link.href;
      const title = link.title ? escape(link.title) : null;
      const text = cap[1].replace(/\\([\[\]])/g, '$1');

      if (cap[0].charAt(0) !== '!') {
        lexer.state.inLink = true;
        const token = {
          type: 'link',
          raw,
          href,
          title,
          text,
          tokens: lexer.inlineTokens(text, [])
        };
        lexer.state.inLink = false;
        return token;
      } else {
        return {
          type: 'image',
          raw,
          href,
          title,
          text: escape(text)
        };
      }
    }

    function indentCodeCompensation(raw, text) {
      const matchIndentToCode = raw.match(/^(\s+)(?:```)/);

      if (matchIndentToCode === null) {
        return text;
      }

      const indentToCode = matchIndentToCode[1];

      return text
        .split('\n')
        .map(node => {
          const matchIndentInNode = node.match(/^\s+/);
          if (matchIndentInNode === null) {
            return node;
          }

          const [indentInNode] = matchIndentInNode;

          if (indentInNode.length >= indentToCode.length) {
            return node.slice(indentToCode.length);
          }

          return node;
        })
        .join('\n');
    }

    /**
     * Tokenizer
     */
    class Tokenizer {
      constructor(options) {
        this.options = options || defaults;
      }

      space(src) {
        const cap = this.rules.block.newline.exec(src);
        if (cap) {
          if (cap[0].length > 1) {
            return {
              type: 'space',
              raw: cap[0]
            };
          }
          return { raw: '\n' };
        }
      }

      code(src) {
        const cap = this.rules.block.code.exec(src);
        if (cap) {
          const text = cap[0].replace(/^ {1,4}/gm, '');
          return {
            type: 'code',
            raw: cap[0],
            codeBlockStyle: 'indented',
            text: !this.options.pedantic
              ? rtrim(text, '\n')
              : text
          };
        }
      }

      fences(src) {
        const cap = this.rules.block.fences.exec(src);
        if (cap) {
          const raw = cap[0];
          const text = indentCodeCompensation(raw, cap[3] || '');

          return {
            type: 'code',
            raw,
            lang: cap[2] ? cap[2].trim() : cap[2],
            text
          };
        }
      }

      heading(src) {
        const cap = this.rules.block.heading.exec(src);
        if (cap) {
          let text = cap[2].trim();

          // remove trailing #s
          if (/#$/.test(text)) {
            const trimmed = rtrim(text, '#');
            if (this.options.pedantic) {
              text = trimmed.trim();
            } else if (!trimmed || / $/.test(trimmed)) {
              // CommonMark requires space before trailing #s
              text = trimmed.trim();
            }
          }

          const token = {
            type: 'heading',
            raw: cap[0],
            depth: cap[1].length,
            text: text,
            tokens: []
          };
          this.lexer.inline(token.text, token.tokens);
          return token;
        }
      }

      hr(src) {
        const cap = this.rules.block.hr.exec(src);
        if (cap) {
          return {
            type: 'hr',
            raw: cap[0]
          };
        }
      }

      blockquote(src) {
        const cap = this.rules.block.blockquote.exec(src);
        if (cap) {
          const text = cap[0].replace(/^ *> ?/gm, '');

          return {
            type: 'blockquote',
            raw: cap[0],
            tokens: this.lexer.blockTokens(text, []),
            text
          };
        }
      }

      list(src) {
        let cap = this.rules.block.list.exec(src);
        if (cap) {
          let raw, istask, ischecked, indent, i, blankLine, endsWithBlankLine,
            line, lines, itemContents;

          let bull = cap[1].trim();
          const isordered = bull.length > 1;

          const list = {
            type: 'list',
            raw: '',
            ordered: isordered,
            start: isordered ? +bull.slice(0, -1) : '',
            loose: false,
            items: []
          };

          bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`;

          if (this.options.pedantic) {
            bull = isordered ? bull : '[*+-]';
          }

          // Get next list item
          const itemRegex = new RegExp(`^( {0,3}${bull})((?: [^\\n]*| *)(?:\\n[^\\n]*)*(?:\\n|$))`);

          // Get each top-level item
          while (src) {
            if (this.rules.block.hr.test(src)) { // End list if we encounter an HR (possibly move into itemRegex?)
              break;
            }

            if (!(cap = itemRegex.exec(src))) {
              break;
            }

            lines = cap[2].split('\n');

            if (this.options.pedantic) {
              indent = 2;
              itemContents = lines[0].trimLeft();
            } else {
              indent = cap[2].search(/[^ ]/); // Find first non-space char
              indent = cap[1].length + (indent > 4 ? 1 : indent); // intented code blocks after 4 spaces; indent is always 1
              itemContents = lines[0].slice(indent - cap[1].length);
            }

            blankLine = false;
            raw = cap[0];

            if (!lines[0] && /^ *$/.test(lines[1])) { // items begin with at most one blank line
              raw = cap[1] + lines.slice(0, 2).join('\n') + '\n';
              list.loose = true;
              lines = [];
            }

            const nextBulletRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:[*+-]|\\d{1,9}[.)])`);

            for (i = 1; i < lines.length; i++) {
              line = lines[i];

              if (this.options.pedantic) { // Re-align to follow commonmark nesting rules
                line = line.replace(/^ {1,4}(?=( {4})*[^ ])/g, '  ');
              }

              // End list item if found start of new bullet
              if (nextBulletRegex.test(line)) {
                raw = cap[1] + lines.slice(0, i).join('\n') + '\n';
                break;
              }

              // Until we encounter a blank line, item contents do not need indentation
              if (!blankLine) {
                if (!line.trim()) { // Check if current line is empty
                  blankLine = true;
                }

                // Dedent if possible
                if (line.search(/[^ ]/) >= indent) {
                  itemContents += '\n' + line.slice(indent);
                } else {
                  itemContents += '\n' + line;
                }
                continue;
              }

              // Dedent this line
              if (line.search(/[^ ]/) >= indent || !line.trim()) {
                itemContents += '\n' + line.slice(indent);
                continue;
              } else { // Line was not properly indented; end of this item
                raw = cap[1] + lines.slice(0, i).join('\n') + '\n';
                break;
              }
            }

            if (!list.loose) {
              // If the previous item ended with a blank line, the list is loose
              if (endsWithBlankLine) {
                list.loose = true;
              } else if (/\n *\n *$/.test(raw)) {
                endsWithBlankLine = true;
              }
            }

            // Check for task list items
            if (this.options.gfm) {
              istask = /^\[[ xX]\] /.exec(itemContents);
              if (istask) {
                ischecked = istask[0] !== '[ ] ';
                itemContents = itemContents.replace(/^\[[ xX]\] +/, '');
              }
            }

            list.items.push({
              type: 'list_item',
              raw: raw,
              task: !!istask,
              checked: ischecked,
              loose: false,
              text: itemContents
            });

            list.raw += raw;
            src = src.slice(raw.length);
          }

          // Do not consume newlines at end of final item. Alternatively, make itemRegex *start* with any newlines to simplify/speed up endsWithBlankLine logic
          list.items[list.items.length - 1].raw = raw.trimRight();
          list.items[list.items.length - 1].text = itemContents.trimRight();
          list.raw = list.raw.trimRight();

          const l = list.items.length;

          // Item child tokens handled here at end because we needed to have the final item to trim it first
          for (i = 0; i < l; i++) {
            this.lexer.state.top = false;
            list.items[i].tokens = this.lexer.blockTokens(list.items[i].text, []);
            if (list.items[i].tokens.some(t => t.type === 'space')) {
              list.loose = true;
              list.items[i].loose = true;
            }
          }

          return list;
        }
      }

      html(src) {
        const cap = this.rules.block.html.exec(src);
        if (cap) {
          const token = {
            type: 'html',
            raw: cap[0],
            pre: !this.options.sanitizer
              && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
            text: cap[0]
          };
          if (this.options.sanitize) {
            token.type = 'paragraph';
            token.text = this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]);
            token.tokens = [];
            this.lexer.inline(token.text, token.tokens);
          }
          return token;
        }
      }

      def(src) {
        const cap = this.rules.block.def.exec(src);
        if (cap) {
          if (cap[3]) cap[3] = cap[3].substring(1, cap[3].length - 1);
          const tag = cap[1].toLowerCase().replace(/\s+/g, ' ');
          return {
            type: 'def',
            tag,
            raw: cap[0],
            href: cap[2],
            title: cap[3]
          };
        }
      }

      table(src) {
        const cap = this.rules.block.table.exec(src);
        if (cap) {
          const item = {
            type: 'table',
            header: splitCells(cap[1]).map(c => { return { text: c }; }),
            align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
            rows: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : []
          };

          if (item.header.length === item.align.length) {
            item.raw = cap[0];

            let l = item.align.length;
            let i, j, k, row;
            for (i = 0; i < l; i++) {
              if (/^ *-+: *$/.test(item.align[i])) {
                item.align[i] = 'right';
              } else if (/^ *:-+: *$/.test(item.align[i])) {
                item.align[i] = 'center';
              } else if (/^ *:-+ *$/.test(item.align[i])) {
                item.align[i] = 'left';
              } else {
                item.align[i] = null;
              }
            }

            l = item.rows.length;
            for (i = 0; i < l; i++) {
              item.rows[i] = splitCells(item.rows[i], item.header.length).map(c => { return { text: c }; });
            }

            // parse child tokens inside headers and cells

            // header child tokens
            l = item.header.length;
            for (j = 0; j < l; j++) {
              item.header[j].tokens = [];
              this.lexer.inlineTokens(item.header[j].text, item.header[j].tokens);
            }

            // cell child tokens
            l = item.rows.length;
            for (j = 0; j < l; j++) {
              row = item.rows[j];
              for (k = 0; k < row.length; k++) {
                row[k].tokens = [];
                this.lexer.inlineTokens(row[k].text, row[k].tokens);
              }
            }

            return item;
          }
        }
      }

      lheading(src) {
        const cap = this.rules.block.lheading.exec(src);
        if (cap) {
          const token = {
            type: 'heading',
            raw: cap[0],
            depth: cap[2].charAt(0) === '=' ? 1 : 2,
            text: cap[1],
            tokens: []
          };
          this.lexer.inline(token.text, token.tokens);
          return token;
        }
      }

      paragraph(src) {
        const cap = this.rules.block.paragraph.exec(src);
        if (cap) {
          const token = {
            type: 'paragraph',
            raw: cap[0],
            text: cap[1].charAt(cap[1].length - 1) === '\n'
              ? cap[1].slice(0, -1)
              : cap[1],
            tokens: []
          };
          this.lexer.inline(token.text, token.tokens);
          return token;
        }
      }

      text(src) {
        const cap = this.rules.block.text.exec(src);
        if (cap) {
          const token = {
            type: 'text',
            raw: cap[0],
            text: cap[0],
            tokens: []
          };
          this.lexer.inline(token.text, token.tokens);
          return token;
        }
      }

      escape(src) {
        const cap = this.rules.inline.escape.exec(src);
        if (cap) {
          return {
            type: 'escape',
            raw: cap[0],
            text: escape(cap[1])
          };
        }
      }

      tag(src) {
        const cap = this.rules.inline.tag.exec(src);
        if (cap) {
          if (!this.lexer.state.inLink && /^<a /i.test(cap[0])) {
            this.lexer.state.inLink = true;
          } else if (this.lexer.state.inLink && /^<\/a>/i.test(cap[0])) {
            this.lexer.state.inLink = false;
          }
          if (!this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
            this.lexer.state.inRawBlock = true;
          } else if (this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
            this.lexer.state.inRawBlock = false;
          }

          return {
            type: this.options.sanitize
              ? 'text'
              : 'html',
            raw: cap[0],
            inLink: this.lexer.state.inLink,
            inRawBlock: this.lexer.state.inRawBlock,
            text: this.options.sanitize
              ? (this.options.sanitizer
                ? this.options.sanitizer(cap[0])
                : escape(cap[0]))
              : cap[0]
          };
        }
      }

      link(src) {
        const cap = this.rules.inline.link.exec(src);
        if (cap) {
          const trimmedUrl = cap[2].trim();
          if (!this.options.pedantic && /^</.test(trimmedUrl)) {
            // commonmark requires matching angle brackets
            if (!(/>$/.test(trimmedUrl))) {
              return;
            }

            // ending angle bracket cannot be escaped
            const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), '\\');
            if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
              return;
            }
          } else {
            // find closing parenthesis
            const lastParenIndex = findClosingBracket(cap[2], '()');
            if (lastParenIndex > -1) {
              const start = cap[0].indexOf('!') === 0 ? 5 : 4;
              const linkLen = start + cap[1].length + lastParenIndex;
              cap[2] = cap[2].substring(0, lastParenIndex);
              cap[0] = cap[0].substring(0, linkLen).trim();
              cap[3] = '';
            }
          }
          let href = cap[2];
          let title = '';
          if (this.options.pedantic) {
            // split pedantic href and title
            const link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);

            if (link) {
              href = link[1];
              title = link[3];
            }
          } else {
            title = cap[3] ? cap[3].slice(1, -1) : '';
          }

          href = href.trim();
          if (/^</.test(href)) {
            if (this.options.pedantic && !(/>$/.test(trimmedUrl))) {
              // pedantic allows starting angle bracket without ending angle bracket
              href = href.slice(1);
            } else {
              href = href.slice(1, -1);
            }
          }
          return outputLink(cap, {
            href: href ? href.replace(this.rules.inline._escapes, '$1') : href,
            title: title ? title.replace(this.rules.inline._escapes, '$1') : title
          }, cap[0], this.lexer);
        }
      }

      reflink(src, links) {
        let cap;
        if ((cap = this.rules.inline.reflink.exec(src))
            || (cap = this.rules.inline.nolink.exec(src))) {
          let link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
          link = links[link.toLowerCase()];
          if (!link || !link.href) {
            const text = cap[0].charAt(0);
            return {
              type: 'text',
              raw: text,
              text
            };
          }
          return outputLink(cap, link, cap[0], this.lexer);
        }
      }

      emStrong(src, maskedSrc, prevChar = '') {
        let match = this.rules.inline.emStrong.lDelim.exec(src);
        if (!match) return;

        // _ can't be between two alphanumerics. \p{L}\p{N} includes non-english alphabet/numbers as well
        if (match[3] && prevChar.match(/[\p{L}\p{N}]/u)) return;

        const nextChar = match[1] || match[2] || '';

        if (!nextChar || (nextChar && (prevChar === '' || this.rules.inline.punctuation.exec(prevChar)))) {
          const lLength = match[0].length - 1;
          let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;

          const endReg = match[0][0] === '*' ? this.rules.inline.emStrong.rDelimAst : this.rules.inline.emStrong.rDelimUnd;
          endReg.lastIndex = 0;

          // Clip maskedSrc to same section of string as src (move to lexer?)
          maskedSrc = maskedSrc.slice(-1 * src.length + lLength);

          while ((match = endReg.exec(maskedSrc)) != null) {
            rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];

            if (!rDelim) continue; // skip single * in __abc*abc__

            rLength = rDelim.length;

            if (match[3] || match[4]) { // found another Left Delim
              delimTotal += rLength;
              continue;
            } else if (match[5] || match[6]) { // either Left or Right Delim
              if (lLength % 3 && !((lLength + rLength) % 3)) {
                midDelimTotal += rLength;
                continue; // CommonMark Emphasis Rules 9-10
              }
            }

            delimTotal -= rLength;

            if (delimTotal > 0) continue; // Haven't found enough closing delimiters

            // Remove extra characters. *a*** -> *a*
            rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);

            // Create `em` if smallest delimiter has odd char count. *a***
            if (Math.min(lLength, rLength) % 2) {
              const text = src.slice(1, lLength + match.index + rLength);
              return {
                type: 'em',
                raw: src.slice(0, lLength + match.index + rLength + 1),
                text,
                tokens: this.lexer.inlineTokens(text, [])
              };
            }

            // Create 'strong' if smallest delimiter has even char count. **a***
            const text = src.slice(2, lLength + match.index + rLength - 1);
            return {
              type: 'strong',
              raw: src.slice(0, lLength + match.index + rLength + 1),
              text,
              tokens: this.lexer.inlineTokens(text, [])
            };
          }
        }
      }

      codespan(src) {
        const cap = this.rules.inline.code.exec(src);
        if (cap) {
          let text = cap[2].replace(/\n/g, ' ');
          const hasNonSpaceChars = /[^ ]/.test(text);
          const hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);
          if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
            text = text.substring(1, text.length - 1);
          }
          text = escape(text, true);
          return {
            type: 'codespan',
            raw: cap[0],
            text
          };
        }
      }

      br(src) {
        const cap = this.rules.inline.br.exec(src);
        if (cap) {
          return {
            type: 'br',
            raw: cap[0]
          };
        }
      }

      del(src) {
        const cap = this.rules.inline.del.exec(src);
        if (cap) {
          return {
            type: 'del',
            raw: cap[0],
            text: cap[2],
            tokens: this.lexer.inlineTokens(cap[2], [])
          };
        }
      }

      autolink(src, mangle) {
        const cap = this.rules.inline.autolink.exec(src);
        if (cap) {
          let text, href;
          if (cap[2] === '@') {
            text = escape(this.options.mangle ? mangle(cap[1]) : cap[1]);
            href = 'mailto:' + text;
          } else {
            text = escape(cap[1]);
            href = text;
          }

          return {
            type: 'link',
            raw: cap[0],
            text,
            href,
            tokens: [
              {
                type: 'text',
                raw: text,
                text
              }
            ]
          };
        }
      }

      url(src, mangle) {
        let cap;
        if (cap = this.rules.inline.url.exec(src)) {
          let text, href;
          if (cap[2] === '@') {
            text = escape(this.options.mangle ? mangle(cap[0]) : cap[0]);
            href = 'mailto:' + text;
          } else {
            // do extended autolink path validation
            let prevCapZero;
            do {
              prevCapZero = cap[0];
              cap[0] = this.rules.inline._backpedal.exec(cap[0])[0];
            } while (prevCapZero !== cap[0]);
            text = escape(cap[0]);
            if (cap[1] === 'www.') {
              href = 'http://' + text;
            } else {
              href = text;
            }
          }
          return {
            type: 'link',
            raw: cap[0],
            text,
            href,
            tokens: [
              {
                type: 'text',
                raw: text,
                text
              }
            ]
          };
        }
      }

      inlineText(src, smartypants) {
        const cap = this.rules.inline.text.exec(src);
        if (cap) {
          let text;
          if (this.lexer.state.inRawBlock) {
            text = this.options.sanitize ? (this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0])) : cap[0];
          } else {
            text = escape(this.options.smartypants ? smartypants(cap[0]) : cap[0]);
          }
          return {
            type: 'text',
            raw: cap[0],
            text
          };
        }
      }
    }

    /**
     * Block-Level Grammar
     */
    const block = {
      newline: /^(?: *(?:\n|$))+/,
      code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
      fences: /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
      hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
      heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
      blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
      list: /^( {0,3}bull)( [^\n]+?)?(?:\n|$)/,
      html: '^ {0,3}(?:' // optional indentation
        + '<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
        + '|comment[^\\n]*(\\n+|$)' // (2)
        + '|<\\?[\\s\\S]*?(?:\\?>\\n*|$)' // (3)
        + '|<![A-Z][\\s\\S]*?(?:>\\n*|$)' // (4)
        + '|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)' // (5)
        + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (6)
        + '|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (7) open tag
        + '|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (7) closing tag
        + ')',
      def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
      table: noopTest,
      lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
      // regex template, placeholders will be replaced according to different paragraph
      // interruption rules of commonmark and the original markdown spec:
      _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html| +\n)[^\n]+)*)/,
      text: /^[^\n]+/
    };

    block._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
    block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
    block.def = edit(block.def)
      .replace('label', block._label)
      .replace('title', block._title)
      .getRegex();

    block.bullet = /(?:[*+-]|\d{1,9}[.)])/;
    block.listItemStart = edit(/^( *)(bull) */)
      .replace('bull', block.bullet)
      .getRegex();

    block.list = edit(block.list)
      .replace(/bull/g, block.bullet)
      .replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))')
      .replace('def', '\\n+(?=' + block.def.source + ')')
      .getRegex();

    block._tag = 'address|article|aside|base|basefont|blockquote|body|caption'
      + '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption'
      + '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe'
      + '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option'
      + '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr'
      + '|track|ul';
    block._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/;
    block.html = edit(block.html, 'i')
      .replace('comment', block._comment)
      .replace('tag', block._tag)
      .replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/)
      .getRegex();

    block.paragraph = edit(block._paragraph)
      .replace('hr', block.hr)
      .replace('heading', ' {0,3}#{1,6} ')
      .replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
      .replace('blockquote', ' {0,3}>')
      .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
      .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
      .replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
      .getRegex();

    block.blockquote = edit(block.blockquote)
      .replace('paragraph', block.paragraph)
      .getRegex();

    /**
     * Normal Block Grammar
     */

    block.normal = merge({}, block);

    /**
     * GFM Block Grammar
     */

    block.gfm = merge({}, block.normal, {
      table: '^ *([^\\n ].*\\|.*)\\n' // Header
        + ' {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?' // Align
        + '(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)' // Cells
    });

    block.gfm.table = edit(block.gfm.table)
      .replace('hr', block.hr)
      .replace('heading', ' {0,3}#{1,6} ')
      .replace('blockquote', ' {0,3}>')
      .replace('code', ' {4}[^\\n]')
      .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
      .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
      .replace('tag', block._tag) // tables can be interrupted by type (6) html blocks
      .getRegex();

    /**
     * Pedantic grammar (original John Gruber's loose markdown specification)
     */

    block.pedantic = merge({}, block.normal, {
      html: edit(
        '^ *(?:comment *(?:\\n|\\s*$)'
        + '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
        + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))')
        .replace('comment', block._comment)
        .replace(/tag/g, '(?!(?:'
          + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub'
          + '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)'
          + '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b')
        .getRegex(),
      def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
      heading: /^(#{1,6})(.*)(?:\n+|$)/,
      fences: noopTest, // fences not supported
      paragraph: edit(block.normal._paragraph)
        .replace('hr', block.hr)
        .replace('heading', ' *#{1,6} *[^\n]')
        .replace('lheading', block.lheading)
        .replace('blockquote', ' {0,3}>')
        .replace('|fences', '')
        .replace('|list', '')
        .replace('|html', '')
        .getRegex()
    });

    /**
     * Inline-Level Grammar
     */
    const inline = {
      escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
      autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
      url: noopTest,
      tag: '^comment'
        + '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
        + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
        + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
        + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
        + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>', // CDATA section
      link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
      reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
      nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
      reflinkSearch: 'reflink|nolink(?!\\()',
      emStrong: {
        lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,
        //        (1) and (2) can only be a Right Delimiter. (3) and (4) can only be Left.  (5) and (6) can be either Left or Right.
        //        () Skip orphan delim inside strong    (1) #***                (2) a***#, a***                   (3) #***a, ***a                 (4) ***#              (5) #***#                 (6) a***a
        rDelimAst: /^[^_*]*?\_\_[^_*]*?\*[^_*]*?(?=\_\_)|[punct_](\*+)(?=[\s]|$)|[^punct*_\s](\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|[^punct*_\s](\*+)(?=[^punct*_\s])/,
        rDelimUnd: /^[^_*]*?\*\*[^_*]*?\_[^_*]*?(?=\*\*)|[punct*](\_+)(?=[\s]|$)|[^punct*_\s](\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/ // ^- Not allowed for _
      },
      code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
      br: /^( {2,}|\\)\n(?!\s*$)/,
      del: noopTest,
      text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
      punctuation: /^([\spunctuation])/
    };

    // list of punctuation marks from CommonMark spec
    // without * and _ to handle the different emphasis markers * and _
    inline._punctuation = '!"#$%&\'()+\\-.,/:;<=>?@\\[\\]`^{|}~';
    inline.punctuation = edit(inline.punctuation).replace(/punctuation/g, inline._punctuation).getRegex();

    // sequences em should skip over [title](link), `code`, <html>
    inline.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g;
    inline.escapedEmSt = /\\\*|\\_/g;

    inline._comment = edit(block._comment).replace('(?:-->|$)', '-->').getRegex();

    inline.emStrong.lDelim = edit(inline.emStrong.lDelim)
      .replace(/punct/g, inline._punctuation)
      .getRegex();

    inline.emStrong.rDelimAst = edit(inline.emStrong.rDelimAst, 'g')
      .replace(/punct/g, inline._punctuation)
      .getRegex();

    inline.emStrong.rDelimUnd = edit(inline.emStrong.rDelimUnd, 'g')
      .replace(/punct/g, inline._punctuation)
      .getRegex();

    inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;

    inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
    inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
    inline.autolink = edit(inline.autolink)
      .replace('scheme', inline._scheme)
      .replace('email', inline._email)
      .getRegex();

    inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;

    inline.tag = edit(inline.tag)
      .replace('comment', inline._comment)
      .replace('attribute', inline._attribute)
      .getRegex();

    inline._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
    inline._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/;
    inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;

    inline.link = edit(inline.link)
      .replace('label', inline._label)
      .replace('href', inline._href)
      .replace('title', inline._title)
      .getRegex();

    inline.reflink = edit(inline.reflink)
      .replace('label', inline._label)
      .getRegex();

    inline.reflinkSearch = edit(inline.reflinkSearch, 'g')
      .replace('reflink', inline.reflink)
      .replace('nolink', inline.nolink)
      .getRegex();

    /**
     * Normal Inline Grammar
     */

    inline.normal = merge({}, inline);

    /**
     * Pedantic Inline Grammar
     */

    inline.pedantic = merge({}, inline.normal, {
      strong: {
        start: /^__|\*\*/,
        middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
        endAst: /\*\*(?!\*)/g,
        endUnd: /__(?!_)/g
      },
      em: {
        start: /^_|\*/,
        middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
        endAst: /\*(?!\*)/g,
        endUnd: /_(?!_)/g
      },
      link: edit(/^!?\[(label)\]\((.*?)\)/)
        .replace('label', inline._label)
        .getRegex(),
      reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/)
        .replace('label', inline._label)
        .getRegex()
    });

    /**
     * GFM Inline Grammar
     */

    inline.gfm = merge({}, inline.normal, {
      escape: edit(inline.escape).replace('])', '~|])').getRegex(),
      _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
      url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
      _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
      del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
      text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
    });

    inline.gfm.url = edit(inline.gfm.url, 'i')
      .replace('email', inline.gfm._extended_email)
      .getRegex();
    /**
     * GFM + Line Breaks Inline Grammar
     */

    inline.breaks = merge({}, inline.gfm, {
      br: edit(inline.br).replace('{2,}', '*').getRegex(),
      text: edit(inline.gfm.text)
        .replace('\\b_', '\\b_| {2,}\\n')
        .replace(/\{2,\}/g, '*')
        .getRegex()
    });

    /**
     * smartypants text replacement
     */
    function smartypants(text) {
      return text
        // em-dashes
        .replace(/---/g, '\u2014')
        // en-dashes
        .replace(/--/g, '\u2013')
        // opening singles
        .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
        // closing singles & apostrophes
        .replace(/'/g, '\u2019')
        // opening doubles
        .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
        // closing doubles
        .replace(/"/g, '\u201d')
        // ellipses
        .replace(/\.{3}/g, '\u2026');
    }

    /**
     * mangle email addresses
     */
    function mangle(text) {
      let out = '',
        i,
        ch;

      const l = text.length;
      for (i = 0; i < l; i++) {
        ch = text.charCodeAt(i);
        if (Math.random() > 0.5) {
          ch = 'x' + ch.toString(16);
        }
        out += '&#' + ch + ';';
      }

      return out;
    }

    /**
     * Block Lexer
     */
    class Lexer {
      constructor(options) {
        this.tokens = [];
        this.tokens.links = Object.create(null);
        this.options = options || defaults;
        this.options.tokenizer = this.options.tokenizer || new Tokenizer();
        this.tokenizer = this.options.tokenizer;
        this.tokenizer.options = this.options;
        this.tokenizer.lexer = this;
        this.inlineQueue = [];
        this.state = {
          inLink: false,
          inRawBlock: false,
          top: true
        };

        const rules = {
          block: block.normal,
          inline: inline.normal
        };

        if (this.options.pedantic) {
          rules.block = block.pedantic;
          rules.inline = inline.pedantic;
        } else if (this.options.gfm) {
          rules.block = block.gfm;
          if (this.options.breaks) {
            rules.inline = inline.breaks;
          } else {
            rules.inline = inline.gfm;
          }
        }
        this.tokenizer.rules = rules;
      }

      /**
       * Expose Rules
       */
      static get rules() {
        return {
          block,
          inline
        };
      }

      /**
       * Static Lex Method
       */
      static lex(src, options) {
        const lexer = new Lexer(options);
        return lexer.lex(src);
      }

      /**
       * Static Lex Inline Method
       */
      static lexInline(src, options) {
        const lexer = new Lexer(options);
        return lexer.inlineTokens(src);
      }

      /**
       * Preprocessing
       */
      lex(src) {
        src = src
          .replace(/\r\n|\r/g, '\n')
          .replace(/\t/g, '    ');

        this.blockTokens(src, this.tokens);

        let next;
        while (next = this.inlineQueue.shift()) {
          this.inlineTokens(next.src, next.tokens);
        }

        return this.tokens;
      }

      /**
       * Lexing
       */
      blockTokens(src, tokens = []) {
        if (this.options.pedantic) {
          src = src.replace(/^ +$/gm, '');
        }
        let token, lastToken, cutSrc, lastParagraphClipped;

        while (src) {
          if (this.options.extensions
            && this.options.extensions.block
            && this.options.extensions.block.some((extTokenizer) => {
              if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                return true;
              }
              return false;
            })) {
            continue;
          }

          // newline
          if (token = this.tokenizer.space(src)) {
            src = src.substring(token.raw.length);
            if (token.type) {
              tokens.push(token);
            }
            continue;
          }

          // code
          if (token = this.tokenizer.code(src)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            // An indented code block cannot interrupt a paragraph.
            if (lastToken && (lastToken.type === 'paragraph' || lastToken.type === 'text')) {
              lastToken.raw += '\n' + token.raw;
              lastToken.text += '\n' + token.text;
              this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          // fences
          if (token = this.tokenizer.fences(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // heading
          if (token = this.tokenizer.heading(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // hr
          if (token = this.tokenizer.hr(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // blockquote
          if (token = this.tokenizer.blockquote(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // list
          if (token = this.tokenizer.list(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // html
          if (token = this.tokenizer.html(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // def
          if (token = this.tokenizer.def(src)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (lastToken && (lastToken.type === 'paragraph' || lastToken.type === 'text')) {
              lastToken.raw += '\n' + token.raw;
              lastToken.text += '\n' + token.raw;
              this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
            } else if (!this.tokens.links[token.tag]) {
              this.tokens.links[token.tag] = {
                href: token.href,
                title: token.title
              };
            }
            continue;
          }

          // table (gfm)
          if (token = this.tokenizer.table(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // lheading
          if (token = this.tokenizer.lheading(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // top-level paragraph
          // prevent paragraph consuming extensions by clipping 'src' to extension start
          cutSrc = src;
          if (this.options.extensions && this.options.extensions.startBlock) {
            let startIndex = Infinity;
            const tempSrc = src.slice(1);
            let tempStart;
            this.options.extensions.startBlock.forEach(function(getStartIndex) {
              tempStart = getStartIndex.call({ lexer: this }, tempSrc);
              if (typeof tempStart === 'number' && tempStart >= 0) { startIndex = Math.min(startIndex, tempStart); }
            });
            if (startIndex < Infinity && startIndex >= 0) {
              cutSrc = src.substring(0, startIndex + 1);
            }
          }
          if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
            lastToken = tokens[tokens.length - 1];
            if (lastParagraphClipped && lastToken.type === 'paragraph') {
              lastToken.raw += '\n' + token.raw;
              lastToken.text += '\n' + token.text;
              this.inlineQueue.pop();
              this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
            } else {
              tokens.push(token);
            }
            lastParagraphClipped = (cutSrc.length !== src.length);
            src = src.substring(token.raw.length);
            continue;
          }

          // text
          if (token = this.tokenizer.text(src)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (lastToken && lastToken.type === 'text') {
              lastToken.raw += '\n' + token.raw;
              lastToken.text += '\n' + token.text;
              this.inlineQueue.pop();
              this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          if (src) {
            const errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);
            if (this.options.silent) {
              console.error(errMsg);
              break;
            } else {
              throw new Error(errMsg);
            }
          }
        }

        this.state.top = true;
        return tokens;
      }

      inline(src, tokens) {
        this.inlineQueue.push({ src, tokens });
      }

      /**
       * Lexing/Compiling
       */
      inlineTokens(src, tokens = []) {
        let token, lastToken, cutSrc;

        // String with links masked to avoid interference with em and strong
        let maskedSrc = src;
        let match;
        let keepPrevChar, prevChar;

        // Mask out reflinks
        if (this.tokens.links) {
          const links = Object.keys(this.tokens.links);
          if (links.length > 0) {
            while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
              if (links.includes(match[0].slice(match[0].lastIndexOf('[') + 1, -1))) {
                maskedSrc = maskedSrc.slice(0, match.index) + '[' + repeatString('a', match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
              }
            }
          }
        }
        // Mask out other blocks
        while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
          maskedSrc = maskedSrc.slice(0, match.index) + '[' + repeatString('a', match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
        }

        // Mask out escaped em & strong delimiters
        while ((match = this.tokenizer.rules.inline.escapedEmSt.exec(maskedSrc)) != null) {
          maskedSrc = maskedSrc.slice(0, match.index) + '++' + maskedSrc.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex);
        }

        while (src) {
          if (!keepPrevChar) {
            prevChar = '';
          }
          keepPrevChar = false;

          // extensions
          if (this.options.extensions
            && this.options.extensions.inline
            && this.options.extensions.inline.some((extTokenizer) => {
              if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                return true;
              }
              return false;
            })) {
            continue;
          }

          // escape
          if (token = this.tokenizer.escape(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // tag
          if (token = this.tokenizer.tag(src)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (lastToken && token.type === 'text' && lastToken.type === 'text') {
              lastToken.raw += token.raw;
              lastToken.text += token.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          // link
          if (token = this.tokenizer.link(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // reflink, nolink
          if (token = this.tokenizer.reflink(src, this.tokens.links)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (lastToken && token.type === 'text' && lastToken.type === 'text') {
              lastToken.raw += token.raw;
              lastToken.text += token.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          // em & strong
          if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // code
          if (token = this.tokenizer.codespan(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // br
          if (token = this.tokenizer.br(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // del (gfm)
          if (token = this.tokenizer.del(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // autolink
          if (token = this.tokenizer.autolink(src, mangle)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // url (gfm)
          if (!this.state.inLink && (token = this.tokenizer.url(src, mangle))) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // text
          // prevent inlineText consuming extensions by clipping 'src' to extension start
          cutSrc = src;
          if (this.options.extensions && this.options.extensions.startInline) {
            let startIndex = Infinity;
            const tempSrc = src.slice(1);
            let tempStart;
            this.options.extensions.startInline.forEach(function(getStartIndex) {
              tempStart = getStartIndex.call({ lexer: this }, tempSrc);
              if (typeof tempStart === 'number' && tempStart >= 0) { startIndex = Math.min(startIndex, tempStart); }
            });
            if (startIndex < Infinity && startIndex >= 0) {
              cutSrc = src.substring(0, startIndex + 1);
            }
          }
          if (token = this.tokenizer.inlineText(cutSrc, smartypants)) {
            src = src.substring(token.raw.length);
            if (token.raw.slice(-1) !== '_') { // Track prevChar before string of ____ started
              prevChar = token.raw.slice(-1);
            }
            keepPrevChar = true;
            lastToken = tokens[tokens.length - 1];
            if (lastToken && lastToken.type === 'text') {
              lastToken.raw += token.raw;
              lastToken.text += token.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          if (src) {
            const errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);
            if (this.options.silent) {
              console.error(errMsg);
              break;
            } else {
              throw new Error(errMsg);
            }
          }
        }

        return tokens;
      }
    }

    /**
     * Renderer
     */
    class Renderer {
      constructor(options) {
        this.options = options || defaults;
      }

      code(code, infostring, escaped) {
        const lang = (infostring || '').match(/\S*/)[0];
        if (this.options.highlight) {
          const out = this.options.highlight(code, lang);
          if (out != null && out !== code) {
            escaped = true;
            code = out;
          }
        }

        code = code.replace(/\n$/, '') + '\n';

        if (!lang) {
          return '<pre><code>'
            + (escaped ? code : escape(code, true))
            + '</code></pre>\n';
        }

        return '<pre><code class="'
          + this.options.langPrefix
          + escape(lang, true)
          + '">'
          + (escaped ? code : escape(code, true))
          + '</code></pre>\n';
      }

      blockquote(quote) {
        return '<blockquote>\n' + quote + '</blockquote>\n';
      }

      html(html) {
        return html;
      }

      heading(text, level, raw, slugger) {
        if (this.options.headerIds) {
          return '<h'
            + level
            + ' id="'
            + this.options.headerPrefix
            + slugger.slug(raw)
            + '">'
            + text
            + '</h'
            + level
            + '>\n';
        }
        // ignore IDs
        return '<h' + level + '>' + text + '</h' + level + '>\n';
      }

      hr() {
        return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
      }

      list(body, ordered, start) {
        const type = ordered ? 'ol' : 'ul',
          startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
        return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
      }

      listitem(text) {
        return '<li>' + text + '</li>\n';
      }

      checkbox(checked) {
        return '<input '
          + (checked ? 'checked="" ' : '')
          + 'disabled="" type="checkbox"'
          + (this.options.xhtml ? ' /' : '')
          + '> ';
      }

      paragraph(text) {
        return '<p>' + text + '</p>\n';
      }

      table(header, body) {
        if (body) body = '<tbody>' + body + '</tbody>';

        return '<table>\n'
          + '<thead>\n'
          + header
          + '</thead>\n'
          + body
          + '</table>\n';
      }

      tablerow(content) {
        return '<tr>\n' + content + '</tr>\n';
      }

      tablecell(content, flags) {
        const type = flags.header ? 'th' : 'td';
        const tag = flags.align
          ? '<' + type + ' align="' + flags.align + '">'
          : '<' + type + '>';
        return tag + content + '</' + type + '>\n';
      }

      // span level renderer
      strong(text) {
        return '<strong>' + text + '</strong>';
      }

      em(text) {
        return '<em>' + text + '</em>';
      }

      codespan(text) {
        return '<code>' + text + '</code>';
      }

      br() {
        return this.options.xhtml ? '<br/>' : '<br>';
      }

      del(text) {
        return '<del>' + text + '</del>';
      }

      link(href, title, text) {
        href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
        if (href === null) {
          return text;
        }
        let out = '<a href="' + escape(href) + '"';
        if (title) {
          out += ' title="' + title + '"';
        }
        out += '>' + text + '</a>';
        return out;
      }

      image(href, title, text) {
        href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
        if (href === null) {
          return text;
        }

        let out = '<img src="' + href + '" alt="' + text + '"';
        if (title) {
          out += ' title="' + title + '"';
        }
        out += this.options.xhtml ? '/>' : '>';
        return out;
      }

      text(text) {
        return text;
      }
    }

    /**
     * TextRenderer
     * returns only the textual part of the token
     */
    class TextRenderer {
      // no need for block level renderers
      strong(text) {
        return text;
      }

      em(text) {
        return text;
      }

      codespan(text) {
        return text;
      }

      del(text) {
        return text;
      }

      html(text) {
        return text;
      }

      text(text) {
        return text;
      }

      link(href, title, text) {
        return '' + text;
      }

      image(href, title, text) {
        return '' + text;
      }

      br() {
        return '';
      }
    }

    /**
     * Slugger generates header id
     */
    class Slugger {
      constructor() {
        this.seen = {};
      }

      serialize(value) {
        return value
          .toLowerCase()
          .trim()
          // remove html tags
          .replace(/<[!\/a-z].*?>/ig, '')
          // remove unwanted chars
          .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '')
          .replace(/\s/g, '-');
      }

      /**
       * Finds the next safe (unique) slug to use
       */
      getNextSafeSlug(originalSlug, isDryRun) {
        let slug = originalSlug;
        let occurenceAccumulator = 0;
        if (this.seen.hasOwnProperty(slug)) {
          occurenceAccumulator = this.seen[originalSlug];
          do {
            occurenceAccumulator++;
            slug = originalSlug + '-' + occurenceAccumulator;
          } while (this.seen.hasOwnProperty(slug));
        }
        if (!isDryRun) {
          this.seen[originalSlug] = occurenceAccumulator;
          this.seen[slug] = 0;
        }
        return slug;
      }

      /**
       * Convert string to unique id
       * @param {object} options
       * @param {boolean} options.dryrun Generates the next unique slug without updating the internal accumulator.
       */
      slug(value, options = {}) {
        const slug = this.serialize(value);
        return this.getNextSafeSlug(slug, options.dryrun);
      }
    }

    /**
     * Parsing & Compiling
     */
    class Parser {
      constructor(options) {
        this.options = options || defaults;
        this.options.renderer = this.options.renderer || new Renderer();
        this.renderer = this.options.renderer;
        this.renderer.options = this.options;
        this.textRenderer = new TextRenderer();
        this.slugger = new Slugger();
      }

      /**
       * Static Parse Method
       */
      static parse(tokens, options) {
        const parser = new Parser(options);
        return parser.parse(tokens);
      }

      /**
       * Static Parse Inline Method
       */
      static parseInline(tokens, options) {
        const parser = new Parser(options);
        return parser.parseInline(tokens);
      }

      /**
       * Parse Loop
       */
      parse(tokens, top = true) {
        let out = '',
          i,
          j,
          k,
          l2,
          l3,
          row,
          cell,
          header,
          body,
          token,
          ordered,
          start,
          loose,
          itemBody,
          item,
          checked,
          task,
          checkbox,
          ret;

        const l = tokens.length;
        for (i = 0; i < l; i++) {
          token = tokens[i];

          // Run any renderer extensions
          if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
            ret = this.options.extensions.renderers[token.type].call({ parser: this }, token);
            if (ret !== false || !['space', 'hr', 'heading', 'code', 'table', 'blockquote', 'list', 'html', 'paragraph', 'text'].includes(token.type)) {
              out += ret || '';
              continue;
            }
          }

          switch (token.type) {
            case 'space': {
              continue;
            }
            case 'hr': {
              out += this.renderer.hr();
              continue;
            }
            case 'heading': {
              out += this.renderer.heading(
                this.parseInline(token.tokens),
                token.depth,
                unescape(this.parseInline(token.tokens, this.textRenderer)),
                this.slugger);
              continue;
            }
            case 'code': {
              out += this.renderer.code(token.text,
                token.lang,
                token.escaped);
              continue;
            }
            case 'table': {
              header = '';

              // header
              cell = '';
              l2 = token.header.length;
              for (j = 0; j < l2; j++) {
                cell += this.renderer.tablecell(
                  this.parseInline(token.header[j].tokens),
                  { header: true, align: token.align[j] }
                );
              }
              header += this.renderer.tablerow(cell);

              body = '';
              l2 = token.rows.length;
              for (j = 0; j < l2; j++) {
                row = token.rows[j];

                cell = '';
                l3 = row.length;
                for (k = 0; k < l3; k++) {
                  cell += this.renderer.tablecell(
                    this.parseInline(row[k].tokens),
                    { header: false, align: token.align[k] }
                  );
                }

                body += this.renderer.tablerow(cell);
              }
              out += this.renderer.table(header, body);
              continue;
            }
            case 'blockquote': {
              body = this.parse(token.tokens);
              out += this.renderer.blockquote(body);
              continue;
            }
            case 'list': {
              ordered = token.ordered;
              start = token.start;
              loose = token.loose;
              l2 = token.items.length;

              body = '';
              for (j = 0; j < l2; j++) {
                item = token.items[j];
                checked = item.checked;
                task = item.task;

                itemBody = '';
                if (item.task) {
                  checkbox = this.renderer.checkbox(checked);
                  if (loose) {
                    if (item.tokens.length > 0 && item.tokens[0].type === 'paragraph') {
                      item.tokens[0].text = checkbox + ' ' + item.tokens[0].text;
                      if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === 'text') {
                        item.tokens[0].tokens[0].text = checkbox + ' ' + item.tokens[0].tokens[0].text;
                      }
                    } else {
                      item.tokens.unshift({
                        type: 'text',
                        text: checkbox
                      });
                    }
                  } else {
                    itemBody += checkbox;
                  }
                }

                itemBody += this.parse(item.tokens, loose);
                body += this.renderer.listitem(itemBody, task, checked);
              }

              out += this.renderer.list(body, ordered, start);
              continue;
            }
            case 'html': {
              // TODO parse inline content if parameter markdown=1
              out += this.renderer.html(token.text);
              continue;
            }
            case 'paragraph': {
              out += this.renderer.paragraph(this.parseInline(token.tokens));
              continue;
            }
            case 'text': {
              body = token.tokens ? this.parseInline(token.tokens) : token.text;
              while (i + 1 < l && tokens[i + 1].type === 'text') {
                token = tokens[++i];
                body += '\n' + (token.tokens ? this.parseInline(token.tokens) : token.text);
              }
              out += top ? this.renderer.paragraph(body) : body;
              continue;
            }

            default: {
              const errMsg = 'Token with "' + token.type + '" type was not found.';
              if (this.options.silent) {
                console.error(errMsg);
                return;
              } else {
                throw new Error(errMsg);
              }
            }
          }
        }

        return out;
      }

      /**
       * Parse Inline Tokens
       */
      parseInline(tokens, renderer) {
        renderer = renderer || this.renderer;
        let out = '',
          i,
          token,
          ret;

        const l = tokens.length;
        for (i = 0; i < l; i++) {
          token = tokens[i];

          // Run any renderer extensions
          if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
            ret = this.options.extensions.renderers[token.type].call({ parser: this }, token);
            if (ret !== false || !['escape', 'html', 'link', 'image', 'strong', 'em', 'codespan', 'br', 'del', 'text'].includes(token.type)) {
              out += ret || '';
              continue;
            }
          }

          switch (token.type) {
            case 'escape': {
              out += renderer.text(token.text);
              break;
            }
            case 'html': {
              out += renderer.html(token.text);
              break;
            }
            case 'link': {
              out += renderer.link(token.href, token.title, this.parseInline(token.tokens, renderer));
              break;
            }
            case 'image': {
              out += renderer.image(token.href, token.title, token.text);
              break;
            }
            case 'strong': {
              out += renderer.strong(this.parseInline(token.tokens, renderer));
              break;
            }
            case 'em': {
              out += renderer.em(this.parseInline(token.tokens, renderer));
              break;
            }
            case 'codespan': {
              out += renderer.codespan(token.text);
              break;
            }
            case 'br': {
              out += renderer.br();
              break;
            }
            case 'del': {
              out += renderer.del(this.parseInline(token.tokens, renderer));
              break;
            }
            case 'text': {
              out += renderer.text(token.text);
              break;
            }
            default: {
              const errMsg = 'Token with "' + token.type + '" type was not found.';
              if (this.options.silent) {
                console.error(errMsg);
                return;
              } else {
                throw new Error(errMsg);
              }
            }
          }
        }
        return out;
      }
    }

    /**
     * Marked
     */
    function marked(src, opt, callback) {
      // throw error in case of non string input
      if (typeof src === 'undefined' || src === null) {
        throw new Error('marked(): input parameter is undefined or null');
      }
      if (typeof src !== 'string') {
        throw new Error('marked(): input parameter is of type '
          + Object.prototype.toString.call(src) + ', string expected');
      }

      if (typeof opt === 'function') {
        callback = opt;
        opt = null;
      }

      opt = merge({}, marked.defaults, opt || {});
      checkSanitizeDeprecation(opt);

      if (callback) {
        const highlight = opt.highlight;
        let tokens;

        try {
          tokens = Lexer.lex(src, opt);
        } catch (e) {
          return callback(e);
        }

        const done = function(err) {
          let out;

          if (!err) {
            try {
              if (opt.walkTokens) {
                marked.walkTokens(tokens, opt.walkTokens);
              }
              out = Parser.parse(tokens, opt);
            } catch (e) {
              err = e;
            }
          }

          opt.highlight = highlight;

          return err
            ? callback(err)
            : callback(null, out);
        };

        if (!highlight || highlight.length < 3) {
          return done();
        }

        delete opt.highlight;

        if (!tokens.length) return done();

        let pending = 0;
        marked.walkTokens(tokens, function(token) {
          if (token.type === 'code') {
            pending++;
            setTimeout(() => {
              highlight(token.text, token.lang, function(err, code) {
                if (err) {
                  return done(err);
                }
                if (code != null && code !== token.text) {
                  token.text = code;
                  token.escaped = true;
                }

                pending--;
                if (pending === 0) {
                  done();
                }
              });
            }, 0);
          }
        });

        if (pending === 0) {
          done();
        }

        return;
      }

      try {
        const tokens = Lexer.lex(src, opt);
        if (opt.walkTokens) {
          marked.walkTokens(tokens, opt.walkTokens);
        }
        return Parser.parse(tokens, opt);
      } catch (e) {
        e.message += '\nPlease report this to https://github.com/markedjs/marked.';
        if (opt.silent) {
          return '<p>An error occurred:</p><pre>'
            + escape(e.message + '', true)
            + '</pre>';
        }
        throw e;
      }
    }

    /**
     * Options
     */

    marked.options =
    marked.setOptions = function(opt) {
      merge(marked.defaults, opt);
      changeDefaults(marked.defaults);
      return marked;
    };

    marked.getDefaults = getDefaults;

    marked.defaults = defaults;

    /**
     * Use Extension
     */

    marked.use = function(...args) {
      const opts = merge({}, ...args);
      const extensions = marked.defaults.extensions || { renderers: {}, childTokens: {} };
      let hasExtensions;

      args.forEach((pack) => {
        // ==-- Parse "addon" extensions --== //
        if (pack.extensions) {
          hasExtensions = true;
          pack.extensions.forEach((ext) => {
            if (!ext.name) {
              throw new Error('extension name required');
            }
            if (ext.renderer) { // Renderer extensions
              const prevRenderer = extensions.renderers ? extensions.renderers[ext.name] : null;
              if (prevRenderer) {
                // Replace extension with func to run new extension but fall back if false
                extensions.renderers[ext.name] = function(...args) {
                  let ret = ext.renderer.apply(this, args);
                  if (ret === false) {
                    ret = prevRenderer.apply(this, args);
                  }
                  return ret;
                };
              } else {
                extensions.renderers[ext.name] = ext.renderer;
              }
            }
            if (ext.tokenizer) { // Tokenizer Extensions
              if (!ext.level || (ext.level !== 'block' && ext.level !== 'inline')) {
                throw new Error("extension level must be 'block' or 'inline'");
              }
              if (extensions[ext.level]) {
                extensions[ext.level].unshift(ext.tokenizer);
              } else {
                extensions[ext.level] = [ext.tokenizer];
              }
              if (ext.start) { // Function to check for start of token
                if (ext.level === 'block') {
                  if (extensions.startBlock) {
                    extensions.startBlock.push(ext.start);
                  } else {
                    extensions.startBlock = [ext.start];
                  }
                } else if (ext.level === 'inline') {
                  if (extensions.startInline) {
                    extensions.startInline.push(ext.start);
                  } else {
                    extensions.startInline = [ext.start];
                  }
                }
              }
            }
            if (ext.childTokens) { // Child tokens to be visited by walkTokens
              extensions.childTokens[ext.name] = ext.childTokens;
            }
          });
        }

        // ==-- Parse "overwrite" extensions --== //
        if (pack.renderer) {
          const renderer = marked.defaults.renderer || new Renderer();
          for (const prop in pack.renderer) {
            const prevRenderer = renderer[prop];
            // Replace renderer with func to run extension, but fall back if false
            renderer[prop] = (...args) => {
              let ret = pack.renderer[prop].apply(renderer, args);
              if (ret === false) {
                ret = prevRenderer.apply(renderer, args);
              }
              return ret;
            };
          }
          opts.renderer = renderer;
        }
        if (pack.tokenizer) {
          const tokenizer = marked.defaults.tokenizer || new Tokenizer();
          for (const prop in pack.tokenizer) {
            const prevTokenizer = tokenizer[prop];
            // Replace tokenizer with func to run extension, but fall back if false
            tokenizer[prop] = (...args) => {
              let ret = pack.tokenizer[prop].apply(tokenizer, args);
              if (ret === false) {
                ret = prevTokenizer.apply(tokenizer, args);
              }
              return ret;
            };
          }
          opts.tokenizer = tokenizer;
        }

        // ==-- Parse WalkTokens extensions --== //
        if (pack.walkTokens) {
          const walkTokens = marked.defaults.walkTokens;
          opts.walkTokens = function(token) {
            pack.walkTokens.call(this, token);
            if (walkTokens) {
              walkTokens.call(this, token);
            }
          };
        }

        if (hasExtensions) {
          opts.extensions = extensions;
        }

        marked.setOptions(opts);
      });
    };

    /**
     * Run callback for every token
     */

    marked.walkTokens = function(tokens, callback) {
      for (const token of tokens) {
        callback.call(marked, token);
        switch (token.type) {
          case 'table': {
            for (const cell of token.header) {
              marked.walkTokens(cell.tokens, callback);
            }
            for (const row of token.rows) {
              for (const cell of row) {
                marked.walkTokens(cell.tokens, callback);
              }
            }
            break;
          }
          case 'list': {
            marked.walkTokens(token.items, callback);
            break;
          }
          default: {
            if (marked.defaults.extensions && marked.defaults.extensions.childTokens && marked.defaults.extensions.childTokens[token.type]) { // Walk any extensions
              marked.defaults.extensions.childTokens[token.type].forEach(function(childTokens) {
                marked.walkTokens(token[childTokens], callback);
              });
            } else if (token.tokens) {
              marked.walkTokens(token.tokens, callback);
            }
          }
        }
      }
    };

    /**
     * Parse Inline
     */
    marked.parseInline = function(src, opt) {
      // throw error in case of non string input
      if (typeof src === 'undefined' || src === null) {
        throw new Error('marked.parseInline(): input parameter is undefined or null');
      }
      if (typeof src !== 'string') {
        throw new Error('marked.parseInline(): input parameter is of type '
          + Object.prototype.toString.call(src) + ', string expected');
      }

      opt = merge({}, marked.defaults, opt || {});
      checkSanitizeDeprecation(opt);

      try {
        const tokens = Lexer.lexInline(src, opt);
        if (opt.walkTokens) {
          marked.walkTokens(tokens, opt.walkTokens);
        }
        return Parser.parseInline(tokens, opt);
      } catch (e) {
        e.message += '\nPlease report this to https://github.com/markedjs/marked.';
        if (opt.silent) {
          return '<p>An error occurred:</p><pre>'
            + escape(e.message + '', true)
            + '</pre>';
        }
        throw e;
      }
    };

    /**
     * Expose
     */
    marked.Parser = Parser;
    marked.parser = Parser.parse;
    marked.Renderer = Renderer;
    marked.TextRenderer = TextRenderer;
    marked.Lexer = Lexer;
    marked.lexer = Lexer.lex;
    marked.Tokenizer = Tokenizer;
    marked.Slugger = Slugger;
    marked.parse = marked;
    Parser.parse;
    Lexer.lex;

    let sources = ['nav', 'stations'];
    let documents = ['play'];

    const FetchLiveInfo = async e => {

    	const url = `data/live.csv?time=${parseInt((new Date())/1000)}`;
    	try {
    		let data = await browser().fromString( await (await fetch(url)).text() );
    		console.log(`[API] 🍄  grabbed live info ${url}`);
    		return data
    	} catch(err) {
    		let message = `error grabbing ${url}! ${err.message}`;
    		console.log(`[API] ❌  ${message}`);
    		alert(message);
    		return null
    	}
    };

    const FetchData = async e => {
    	let w = window;
    	if (!w.data) {
    		w.data = {};
    		for (let source of sources) {
    			const url = `data/${source}.csv?time=${parseInt((new Date())/1000)}`;
    			try {
    				w.data[source] = await browser().fromString( await (await fetch(url)).text() );
    				console.log(`[API] ✅  grabbed ${url}`, w[source]);
    			} catch(err) {
    				let message = `error grabbing ${url}! ${err.message}`;
    				console.log(`[API] ❌  ${message}`);
    				alert(message);
    			}
    		}
    		for (let doc of documents) {
    			const url = `data/${doc}.md?time=${parseInt((new Date())/1000)}`;
    			try {
    				w.data[doc] = await marked.parse( await (await fetch(url)).text() );
    				console.log(`[API] ✅  grabbed ${url}`, w[doc]);
    			} catch(err) {
    				let message = `error grabbing ${url}! ${err.message}`;
    				console.log(`[API] ❌  ${message}`);
    				alert(message);
    			}

    		}
    		return w.data
    	} else {
    		return w.data
    	}
    };

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const index = writable(-2);
    const smoothing = writable(0.9);
    const state = writable({});
    const data = writable({});
    const trigger = writable(-2);
    const chat = writable( false );
    const volume = writable( 1 );
    const live = writable( [] );
    const play_text = writable( 'PLAY' );

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var bundle = createCommonjsModule(function (module, exports) {
    !function(t,e){module.exports=e();}(window,(function(){return function(t){var e={};function n(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i});},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0});},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(i,r,function(e){return t[e]}.bind(null,r));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=1)}([function(t,e,n){var i;
    /*! Hammer.JS - v2.0.7 - 2016-04-22
     * http://hammerjs.github.io/
     *
     * Copyright (c) 2016 Jorik Tangelder;
     * Licensed under the MIT license */!function(r,o,s,a){var u,c=["","webkit","Moz","MS","ms","o"],h=o.createElement("div"),l=Math.round,p=Math.abs,f=Date.now;function d(t,e,n){return setTimeout(w(t,n),e)}function v(t,e,n){return !!Array.isArray(t)&&(m(t,n[e],n),!0)}function m(t,e,n){var i;if(t)if(t.forEach)t.forEach(e,n);else if(void 0!==t.length)for(i=0;i<t.length;)e.call(n,t[i],i,t),i++;else for(i in t)t.hasOwnProperty(i)&&e.call(n,t[i],i,t);}function g(t,e,n){var i="DEPRECATED METHOD: "+e+"\n"+n+" AT \n";return function(){var e=new Error("get-stack-trace"),n=e&&e.stack?e.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@"):"Unknown Stack Trace",o=r.console&&(r.console.warn||r.console.log);return o&&o.call(r.console,i,n),t.apply(this,arguments)}}u="function"!=typeof Object.assign?function(t){if(null==t)throw new TypeError("Cannot convert undefined or null to object");for(var e=Object(t),n=1;n<arguments.length;n++){var i=arguments[n];if(null!=i)for(var r in i)i.hasOwnProperty(r)&&(e[r]=i[r]);}return e}:Object.assign;var y=g((function(t,e,n){for(var i=Object.keys(e),r=0;r<i.length;)(!n||n&&void 0===t[i[r]])&&(t[i[r]]=e[i[r]]),r++;return t}),"extend","Use `assign`."),T=g((function(t,e){return y(t,e,!0)}),"merge","Use `assign`.");function E(t,e,n){var i,r=e.prototype;(i=t.prototype=Object.create(r)).constructor=t,i._super=r,n&&u(i,n);}function w(t,e){return function(){return t.apply(e,arguments)}}function b(t,e){return "function"==typeof t?t.apply(e&&e[0]||void 0,e):t}function I(t,e){return void 0===t?e:t}function x(t,e,n){m(S(e),(function(e){t.addEventListener(e,n,!1);}));}function _(t,e,n){m(S(e),(function(e){t.removeEventListener(e,n,!1);}));}function C(t,e){for(;t;){if(t==e)return !0;t=t.parentNode;}return !1}function A(t,e){return t.indexOf(e)>-1}function S(t){return t.trim().split(/\s+/g)}function P(t,e,n){if(t.indexOf&&!n)return t.indexOf(e);for(var i=0;i<t.length;){if(n&&t[i][n]==e||!n&&t[i]===e)return i;i++;}return -1}function D(t){return Array.prototype.slice.call(t,0)}function O(t,e,n){for(var i=[],r=[],o=0;o<t.length;){var s=e?t[o][e]:t[o];P(r,s)<0&&i.push(t[o]),r[o]=s,o++;}return n&&(i=e?i.sort((function(t,n){return t[e]>n[e]})):i.sort()),i}function M(t,e){for(var n,i,r=e[0].toUpperCase()+e.slice(1),o=0;o<c.length;){if((i=(n=c[o])?n+r:e)in t)return i;o++;}}var R=1;function z(t){var e=t.ownerDocument||t;return e.defaultView||e.parentWindow||r}var N="ontouchstart"in r,X=void 0!==M(r,"PointerEvent"),Y=N&&/mobile|tablet|ip(ad|hone|od)|android/i.test(navigator.userAgent),F=["x","y"],j=["clientX","clientY"];function W(t,e){var n=this;this.manager=t,this.callback=e,this.element=t.element,this.target=t.options.inputTarget,this.domHandler=function(e){b(t.options.enable,[t])&&n.handler(e);},this.init();}function q(t,e,n){var i=n.pointers.length,r=n.changedPointers.length,o=1&e&&i-r==0,s=12&e&&i-r==0;n.isFirst=!!o,n.isFinal=!!s,o&&(t.session={}),n.eventType=e,function(t,e){var n=t.session,i=e.pointers,r=i.length;n.firstInput||(n.firstInput=H(e));r>1&&!n.firstMultiple?n.firstMultiple=H(e):1===r&&(n.firstMultiple=!1);var o=n.firstInput,s=n.firstMultiple,a=s?s.center:o.center,u=e.center=k(i);e.timeStamp=f(),e.deltaTime=e.timeStamp-o.timeStamp,e.angle=G(a,u),e.distance=V(a,u),function(t,e){var n=e.center,i=t.offsetDelta||{},r=t.prevDelta||{},o=t.prevInput||{};1!==e.eventType&&4!==o.eventType||(r=t.prevDelta={x:o.deltaX||0,y:o.deltaY||0},i=t.offsetDelta={x:n.x,y:n.y});e.deltaX=r.x+(n.x-i.x),e.deltaY=r.y+(n.y-i.y);}(n,e),e.offsetDirection=U(e.deltaX,e.deltaY);var c=L(e.deltaTime,e.deltaX,e.deltaY);e.overallVelocityX=c.x,e.overallVelocityY=c.y,e.overallVelocity=p(c.x)>p(c.y)?c.x:c.y,e.scale=s?(h=s.pointers,l=i,V(l[0],l[1],j)/V(h[0],h[1],j)):1,e.rotation=s?function(t,e){return G(e[1],e[0],j)+G(t[1],t[0],j)}(s.pointers,i):0,e.maxPointers=n.prevInput?e.pointers.length>n.prevInput.maxPointers?e.pointers.length:n.prevInput.maxPointers:e.pointers.length,function(t,e){var n,i,r,o,s=t.lastInterval||e,a=e.timeStamp-s.timeStamp;if(8!=e.eventType&&(a>25||void 0===s.velocity)){var u=e.deltaX-s.deltaX,c=e.deltaY-s.deltaY,h=L(a,u,c);i=h.x,r=h.y,n=p(h.x)>p(h.y)?h.x:h.y,o=U(u,c),t.lastInterval=e;}else n=s.velocity,i=s.velocityX,r=s.velocityY,o=s.direction;e.velocity=n,e.velocityX=i,e.velocityY=r,e.direction=o;}(n,e);var h,l;var d=t.element;C(e.srcEvent.target,d)&&(d=e.srcEvent.target);e.target=d;}(t,n),t.emit("hammer.input",n),t.recognize(n),t.session.prevInput=n;}function H(t){for(var e=[],n=0;n<t.pointers.length;)e[n]={clientX:l(t.pointers[n].clientX),clientY:l(t.pointers[n].clientY)},n++;return {timeStamp:f(),pointers:e,center:k(e),deltaX:t.deltaX,deltaY:t.deltaY}}function k(t){var e=t.length;if(1===e)return {x:l(t[0].clientX),y:l(t[0].clientY)};for(var n=0,i=0,r=0;r<e;)n+=t[r].clientX,i+=t[r].clientY,r++;return {x:l(n/e),y:l(i/e)}}function L(t,e,n){return {x:e/t||0,y:n/t||0}}function U(t,e){return t===e?1:p(t)>=p(e)?t<0?2:4:e<0?8:16}function V(t,e,n){n||(n=F);var i=e[n[0]]-t[n[0]],r=e[n[1]]-t[n[1]];return Math.sqrt(i*i+r*r)}function G(t,e,n){n||(n=F);var i=e[n[0]]-t[n[0]],r=e[n[1]]-t[n[1]];return 180*Math.atan2(r,i)/Math.PI}W.prototype={handler:function(){},init:function(){this.evEl&&x(this.element,this.evEl,this.domHandler),this.evTarget&&x(this.target,this.evTarget,this.domHandler),this.evWin&&x(z(this.element),this.evWin,this.domHandler);},destroy:function(){this.evEl&&_(this.element,this.evEl,this.domHandler),this.evTarget&&_(this.target,this.evTarget,this.domHandler),this.evWin&&_(z(this.element),this.evWin,this.domHandler);}};var Z={mousedown:1,mousemove:2,mouseup:4};function B(){this.evEl="mousedown",this.evWin="mousemove mouseup",this.pressed=!1,W.apply(this,arguments);}E(B,W,{handler:function(t){var e=Z[t.type];1&e&&0===t.button&&(this.pressed=!0),2&e&&1!==t.which&&(e=4),this.pressed&&(4&e&&(this.pressed=!1),this.callback(this.manager,e,{pointers:[t],changedPointers:[t],pointerType:"mouse",srcEvent:t}));}});var $={pointerdown:1,pointermove:2,pointerup:4,pointercancel:8,pointerout:8},J={2:"touch",3:"pen",4:"mouse",5:"kinect"},K="pointerdown",Q="pointermove pointerup pointercancel";function tt(){this.evEl=K,this.evWin=Q,W.apply(this,arguments),this.store=this.manager.session.pointerEvents=[];}r.MSPointerEvent&&!r.PointerEvent&&(K="MSPointerDown",Q="MSPointerMove MSPointerUp MSPointerCancel"),E(tt,W,{handler:function(t){var e=this.store,n=!1,i=t.type.toLowerCase().replace("ms",""),r=$[i],o=J[t.pointerType]||t.pointerType,s="touch"==o,a=P(e,t.pointerId,"pointerId");1&r&&(0===t.button||s)?a<0&&(e.push(t),a=e.length-1):12&r&&(n=!0),a<0||(e[a]=t,this.callback(this.manager,r,{pointers:e,changedPointers:[t],pointerType:o,srcEvent:t}),n&&e.splice(a,1));}});var et={touchstart:1,touchmove:2,touchend:4,touchcancel:8};function nt(){this.evTarget="touchstart",this.evWin="touchstart touchmove touchend touchcancel",this.started=!1,W.apply(this,arguments);}function it(t,e){var n=D(t.touches),i=D(t.changedTouches);return 12&e&&(n=O(n.concat(i),"identifier",!0)),[n,i]}E(nt,W,{handler:function(t){var e=et[t.type];if(1===e&&(this.started=!0),this.started){var n=it.call(this,t,e);12&e&&n[0].length-n[1].length==0&&(this.started=!1),this.callback(this.manager,e,{pointers:n[0],changedPointers:n[1],pointerType:"touch",srcEvent:t});}}});var rt={touchstart:1,touchmove:2,touchend:4,touchcancel:8};function ot(){this.evTarget="touchstart touchmove touchend touchcancel",this.targetIds={},W.apply(this,arguments);}function st(t,e){var n=D(t.touches),i=this.targetIds;if(3&e&&1===n.length)return i[n[0].identifier]=!0,[n,n];var r,o,s=D(t.changedTouches),a=[],u=this.target;if(o=n.filter((function(t){return C(t.target,u)})),1===e)for(r=0;r<o.length;)i[o[r].identifier]=!0,r++;for(r=0;r<s.length;)i[s[r].identifier]&&a.push(s[r]),12&e&&delete i[s[r].identifier],r++;return a.length?[O(o.concat(a),"identifier",!0),a]:void 0}E(ot,W,{handler:function(t){var e=rt[t.type],n=st.call(this,t,e);n&&this.callback(this.manager,e,{pointers:n[0],changedPointers:n[1],pointerType:"touch",srcEvent:t});}});function at(){W.apply(this,arguments);var t=w(this.handler,this);this.touch=new ot(this.manager,t),this.mouse=new B(this.manager,t),this.primaryTouch=null,this.lastTouches=[];}function ut(t,e){1&t?(this.primaryTouch=e.changedPointers[0].identifier,ct.call(this,e)):12&t&&ct.call(this,e);}function ct(t){var e=t.changedPointers[0];if(e.identifier===this.primaryTouch){var n={x:e.clientX,y:e.clientY};this.lastTouches.push(n);var i=this.lastTouches;setTimeout((function(){var t=i.indexOf(n);t>-1&&i.splice(t,1);}),2500);}}function ht(t){for(var e=t.srcEvent.clientX,n=t.srcEvent.clientY,i=0;i<this.lastTouches.length;i++){var r=this.lastTouches[i],o=Math.abs(e-r.x),s=Math.abs(n-r.y);if(o<=25&&s<=25)return !0}return !1}E(at,W,{handler:function(t,e,n){var i="touch"==n.pointerType,r="mouse"==n.pointerType;if(!(r&&n.sourceCapabilities&&n.sourceCapabilities.firesTouchEvents)){if(i)ut.call(this,e,n);else if(r&&ht.call(this,n))return;this.callback(t,e,n);}},destroy:function(){this.touch.destroy(),this.mouse.destroy();}});var lt=M(h.style,"touchAction"),pt=void 0!==lt,ft=function(){if(!pt)return !1;var t={},e=r.CSS&&r.CSS.supports;return ["auto","manipulation","pan-y","pan-x","pan-x pan-y","none"].forEach((function(n){t[n]=!e||r.CSS.supports("touch-action",n);})),t}();function dt(t,e){this.manager=t,this.set(e);}dt.prototype={set:function(t){"compute"==t&&(t=this.compute()),pt&&this.manager.element.style&&ft[t]&&(this.manager.element.style[lt]=t),this.actions=t.toLowerCase().trim();},update:function(){this.set(this.manager.options.touchAction);},compute:function(){var t=[];return m(this.manager.recognizers,(function(e){b(e.options.enable,[e])&&(t=t.concat(e.getTouchAction()));})),function(t){if(A(t,"none"))return "none";var e=A(t,"pan-x"),n=A(t,"pan-y");if(e&&n)return "none";if(e||n)return e?"pan-x":"pan-y";if(A(t,"manipulation"))return "manipulation";return "auto"}(t.join(" "))},preventDefaults:function(t){var e=t.srcEvent,n=t.offsetDirection;if(this.manager.session.prevented)e.preventDefault();else {var i=this.actions,r=A(i,"none")&&!ft.none,o=A(i,"pan-y")&&!ft["pan-y"],s=A(i,"pan-x")&&!ft["pan-x"];if(r){var a=1===t.pointers.length,u=t.distance<2,c=t.deltaTime<250;if(a&&u&&c)return}if(!s||!o)return r||o&&6&n||s&&24&n?this.preventSrc(e):void 0}},preventSrc:function(t){this.manager.session.prevented=!0,t.preventDefault();}};function vt(t){this.options=u({},this.defaults,t||{}),this.id=R++,this.manager=null,this.options.enable=I(this.options.enable,!0),this.state=1,this.simultaneous={},this.requireFail=[];}function mt(t){return 16&t?"cancel":8&t?"end":4&t?"move":2&t?"start":""}function gt(t){return 16==t?"down":8==t?"up":2==t?"left":4==t?"right":""}function yt(t,e){var n=e.manager;return n?n.get(t):t}function Tt(){vt.apply(this,arguments);}function Et(){Tt.apply(this,arguments),this.pX=null,this.pY=null;}function wt(){Tt.apply(this,arguments);}function bt(){vt.apply(this,arguments),this._timer=null,this._input=null;}function It(){Tt.apply(this,arguments);}function xt(){Tt.apply(this,arguments);}function _t(){vt.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0;}function Ct(t,e){return (e=e||{}).recognizers=I(e.recognizers,Ct.defaults.preset),new At(t,e)}vt.prototype={defaults:{},set:function(t){return u(this.options,t),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(t){if(v(t,"recognizeWith",this))return this;var e=this.simultaneous;return e[(t=yt(t,this)).id]||(e[t.id]=t,t.recognizeWith(this)),this},dropRecognizeWith:function(t){return v(t,"dropRecognizeWith",this)?this:(t=yt(t,this),delete this.simultaneous[t.id],this)},requireFailure:function(t){if(v(t,"requireFailure",this))return this;var e=this.requireFail;return -1===P(e,t=yt(t,this))&&(e.push(t),t.requireFailure(this)),this},dropRequireFailure:function(t){if(v(t,"dropRequireFailure",this))return this;t=yt(t,this);var e=P(this.requireFail,t);return e>-1&&this.requireFail.splice(e,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(t){return !!this.simultaneous[t.id]},emit:function(t){var e=this,n=this.state;function i(n){e.manager.emit(n,t);}n<8&&i(e.options.event+mt(n)),i(e.options.event),t.additionalEvent&&i(t.additionalEvent),n>=8&&i(e.options.event+mt(n));},tryEmit:function(t){if(this.canEmit())return this.emit(t);this.state=32;},canEmit:function(){for(var t=0;t<this.requireFail.length;){if(!(33&this.requireFail[t].state))return !1;t++;}return !0},recognize:function(t){var e=u({},t);if(!b(this.options.enable,[this,e]))return this.reset(),void(this.state=32);56&this.state&&(this.state=1),this.state=this.process(e),30&this.state&&this.tryEmit(e);},process:function(t){},getTouchAction:function(){},reset:function(){}},E(Tt,vt,{defaults:{pointers:1},attrTest:function(t){var e=this.options.pointers;return 0===e||t.pointers.length===e},process:function(t){var e=this.state,n=t.eventType,i=6&e,r=this.attrTest(t);return i&&(8&n||!r)?16|e:i||r?4&n?8|e:2&e?4|e:2:32}}),E(Et,Tt,{defaults:{event:"pan",threshold:10,pointers:1,direction:30},getTouchAction:function(){var t=this.options.direction,e=[];return 6&t&&e.push("pan-y"),24&t&&e.push("pan-x"),e},directionTest:function(t){var e=this.options,n=!0,i=t.distance,r=t.direction,o=t.deltaX,s=t.deltaY;return r&e.direction||(6&e.direction?(r=0===o?1:o<0?2:4,n=o!=this.pX,i=Math.abs(t.deltaX)):(r=0===s?1:s<0?8:16,n=s!=this.pY,i=Math.abs(t.deltaY))),t.direction=r,n&&i>e.threshold&&r&e.direction},attrTest:function(t){return Tt.prototype.attrTest.call(this,t)&&(2&this.state||!(2&this.state)&&this.directionTest(t))},emit:function(t){this.pX=t.deltaX,this.pY=t.deltaY;var e=gt(t.direction);e&&(t.additionalEvent=this.options.event+e),this._super.emit.call(this,t);}}),E(wt,Tt,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return ["none"]},attrTest:function(t){return this._super.attrTest.call(this,t)&&(Math.abs(t.scale-1)>this.options.threshold||2&this.state)},emit:function(t){if(1!==t.scale){var e=t.scale<1?"in":"out";t.additionalEvent=this.options.event+e;}this._super.emit.call(this,t);}}),E(bt,vt,{defaults:{event:"press",pointers:1,time:251,threshold:9},getTouchAction:function(){return ["auto"]},process:function(t){var e=this.options,n=t.pointers.length===e.pointers,i=t.distance<e.threshold,r=t.deltaTime>e.time;if(this._input=t,!i||!n||12&t.eventType&&!r)this.reset();else if(1&t.eventType)this.reset(),this._timer=d((function(){this.state=8,this.tryEmit();}),e.time,this);else if(4&t.eventType)return 8;return 32},reset:function(){clearTimeout(this._timer);},emit:function(t){8===this.state&&(t&&4&t.eventType?this.manager.emit(this.options.event+"up",t):(this._input.timeStamp=f(),this.manager.emit(this.options.event,this._input)));}}),E(It,Tt,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return ["none"]},attrTest:function(t){return this._super.attrTest.call(this,t)&&(Math.abs(t.rotation)>this.options.threshold||2&this.state)}}),E(xt,Tt,{defaults:{event:"swipe",threshold:10,velocity:.3,direction:30,pointers:1},getTouchAction:function(){return Et.prototype.getTouchAction.call(this)},attrTest:function(t){var e,n=this.options.direction;return 30&n?e=t.overallVelocity:6&n?e=t.overallVelocityX:24&n&&(e=t.overallVelocityY),this._super.attrTest.call(this,t)&&n&t.offsetDirection&&t.distance>this.options.threshold&&t.maxPointers==this.options.pointers&&p(e)>this.options.velocity&&4&t.eventType},emit:function(t){var e=gt(t.offsetDirection);e&&this.manager.emit(this.options.event+e,t),this.manager.emit(this.options.event,t);}}),E(_t,vt,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10},getTouchAction:function(){return ["manipulation"]},process:function(t){var e=this.options,n=t.pointers.length===e.pointers,i=t.distance<e.threshold,r=t.deltaTime<e.time;if(this.reset(),1&t.eventType&&0===this.count)return this.failTimeout();if(i&&r&&n){if(4!=t.eventType)return this.failTimeout();var o=!this.pTime||t.timeStamp-this.pTime<e.interval,s=!this.pCenter||V(this.pCenter,t.center)<e.posThreshold;if(this.pTime=t.timeStamp,this.pCenter=t.center,s&&o?this.count+=1:this.count=1,this._input=t,0===this.count%e.taps)return this.hasRequireFailures()?(this._timer=d((function(){this.state=8,this.tryEmit();}),e.interval,this),2):8}return 32},failTimeout:function(){return this._timer=d((function(){this.state=32;}),this.options.interval,this),32},reset:function(){clearTimeout(this._timer);},emit:function(){8==this.state&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input));}}),Ct.VERSION="2.0.7",Ct.defaults={domEvents:!1,touchAction:"compute",enable:!0,inputTarget:null,inputClass:null,preset:[[It,{enable:!1}],[wt,{enable:!1},["rotate"]],[xt,{direction:6}],[Et,{direction:6},["swipe"]],[_t],[_t,{event:"doubletap",taps:2},["tap"]],[bt]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};function At(t,e){var n;this.options=u({},Ct.defaults,e||{}),this.options.inputTarget=this.options.inputTarget||t,this.handlers={},this.session={},this.recognizers=[],this.oldCssProps={},this.element=t,this.input=new((n=this).options.inputClass||(X?tt:Y?ot:N?at:B))(n,q),this.touchAction=new dt(this,this.options.touchAction),St(this,!0),m(this.options.recognizers,(function(t){var e=this.add(new t[0](t[1]));t[2]&&e.recognizeWith(t[2]),t[3]&&e.requireFailure(t[3]);}),this);}function St(t,e){var n,i=t.element;i.style&&(m(t.options.cssProps,(function(r,o){n=M(i.style,o),e?(t.oldCssProps[n]=i.style[n],i.style[n]=r):i.style[n]=t.oldCssProps[n]||"";})),e||(t.oldCssProps={}));}At.prototype={set:function(t){return u(this.options,t),t.touchAction&&this.touchAction.update(),t.inputTarget&&(this.input.destroy(),this.input.target=t.inputTarget,this.input.init()),this},stop:function(t){this.session.stopped=t?2:1;},recognize:function(t){var e=this.session;if(!e.stopped){var n;this.touchAction.preventDefaults(t);var i=this.recognizers,r=e.curRecognizer;(!r||r&&8&r.state)&&(r=e.curRecognizer=null);for(var o=0;o<i.length;)n=i[o],2===e.stopped||r&&n!=r&&!n.canRecognizeWith(r)?n.reset():n.recognize(t),!r&&14&n.state&&(r=e.curRecognizer=n),o++;}},get:function(t){if(t instanceof vt)return t;for(var e=this.recognizers,n=0;n<e.length;n++)if(e[n].options.event==t)return e[n];return null},add:function(t){if(v(t,"add",this))return this;var e=this.get(t.options.event);return e&&this.remove(e),this.recognizers.push(t),t.manager=this,this.touchAction.update(),t},remove:function(t){if(v(t,"remove",this))return this;if(t=this.get(t)){var e=this.recognizers,n=P(e,t);-1!==n&&(e.splice(n,1),this.touchAction.update());}return this},on:function(t,e){if(void 0!==t&&void 0!==e){var n=this.handlers;return m(S(t),(function(t){n[t]=n[t]||[],n[t].push(e);})),this}},off:function(t,e){if(void 0!==t){var n=this.handlers;return m(S(t),(function(t){e?n[t]&&n[t].splice(P(n[t],e),1):delete n[t];})),this}},emit:function(t,e){this.options.domEvents&&function(t,e){var n=o.createEvent("Event");n.initEvent(t,!0,!0),n.gesture=e,e.target.dispatchEvent(n);}(t,e);var n=this.handlers[t]&&this.handlers[t].slice();if(n&&n.length){e.type=t,e.preventDefault=function(){e.srcEvent.preventDefault();};for(var i=0;i<n.length;)n[i](e),i++;}},destroy:function(){this.element&&St(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null;}},u(Ct,{INPUT_START:1,INPUT_MOVE:2,INPUT_END:4,INPUT_CANCEL:8,STATE_POSSIBLE:1,STATE_BEGAN:2,STATE_CHANGED:4,STATE_ENDED:8,STATE_RECOGNIZED:8,STATE_CANCELLED:16,STATE_FAILED:32,DIRECTION_NONE:1,DIRECTION_LEFT:2,DIRECTION_RIGHT:4,DIRECTION_UP:8,DIRECTION_DOWN:16,DIRECTION_HORIZONTAL:6,DIRECTION_VERTICAL:24,DIRECTION_ALL:30,Manager:At,Input:W,TouchAction:dt,TouchInput:ot,MouseInput:B,PointerEventInput:tt,TouchMouseInput:at,SingleTouchInput:nt,Recognizer:vt,AttrRecognizer:Tt,Tap:_t,Pan:Et,Swipe:xt,Pinch:wt,Rotate:It,Press:bt,on:x,off:_,each:m,merge:T,extend:y,assign:u,inherit:E,bindFn:w,prefixed:M}),(void 0!==r?r:"undefined"!=typeof self?self:{}).Hammer=Ct,void 0===(i=function(){return Ct}.call(e,n,e,t))||(t.exports=i);}(window,document);},function(t,e,n){n.r(e);var i=n(0),r=n.n(i),o=["swipe","swipeleft","swiperight","swipeup","swipedown"],s=function(t,e){var n=new r.a(t);n.get("swipe").set(e);for(var i=function(e){n.on(e,(function(n){return t.dispatchEvent(new CustomEvent(e,{detail:n}))}));},s=0,a=o;s<a.length;s++){i(a[s]);}return {update:function(t){n.get("swipe").set(t);},destroy:function(){for(var t=0,e=o;t<e.length;t++){var i=e[t];n.off(i);}}}},a=["pan","panstart","panmove","panend","pancancel","panleft","panright","panup","pandown"],u=function(t,e){var n=new r.a(t);n.get("pan").set(e);for(var i=function(e){n.on(e,(function(n){return t.dispatchEvent(new CustomEvent(e,{detail:n}))}));},o=0,s=a;o<s.length;o++){i(s[o]);}return {update:function(t){n.get("pan").set(t);},destroy:function(){for(var t=0,e=a;t<e.length;t++){var i=e[t];n.off(i);}}}},c=["pinch","pinchstart","pinchmove","pinchend","pinchcancel","pinchin","pinchout"],h=function(t,e){var n=new r.a(t);n.get("pinch").set(e);for(var i=function(e){n.on(e,(function(n){return t.dispatchEvent(new CustomEvent(e,{detail:n}))}));},o=0,s=c;o<s.length;o++){i(s[o]);}return {update:function(t){n.get("pinch").set(t);},destroy:function(){for(var t=0,e=c;t<e.length;t++){var i=e[t];n.off(i);}}}},l=["press","pressup"],p=function(t,e){var n=new r.a(t);n.get("press").set(e);for(var i=function(e){n.on(e,(function(n){return t.dispatchEvent(new CustomEvent(e,{detail:n}))}));},o=0,s=l;o<s.length;o++){i(s[o]);}return {update:function(t){n.get("press").set(t);},destroy:function(){for(var t=0,e=l;t<e.length;t++){var i=e[t];n.off(i);}}}},f=["rotate","rotatestart","rotatemove","rotateend","rotatecancel"],d=function(t,e){var n=new r.a(t);n.get("rotate").set(e);for(var i=function(e){n.on(e,(function(n){return t.dispatchEvent(new CustomEvent(e,{detail:n}))}));},o=0,s=f;o<s.length;o++){i(s[o]);}return {update:function(t){n.get("rotate").set(t);},destroy:function(){for(var t=0,e=f;t<e.length;t++){var i=e[t];n.off(i);}}}},v=["tap"],m=function(t,e){var n=new r.a(t);n.get("tap").set(e);for(var i=function(e){n.on(e,(function(n){return t.dispatchEvent(new CustomEvent(e,{detail:n}))}));},o=0,s=v;o<s.length;o++){i(s[o]);}return {update:function(t){n.get("tap").set(t);},destroy:function(){for(var t=0,e=v;t<e.length;t++){var i=e[t];n.off(i);}}}};n.d(e,"Hammer",(function(){return r.a})),n.d(e,"swipe",(function(){return s})),n.d(e,"pan",(function(){return u})),n.d(e,"pinch",(function(){return h})),n.d(e,"press",(function(){return p})),n.d(e,"rotate",(function(){return d})),n.d(e,"tap",(function(){return m}));e.default={Hammer:r.a,swipe:s,pan:u,pinch:h,press:p,rotate:d,tap:m};}])}));
    });

    /*
    Adapted from https://github.com/mattdesl
    Distributed under MIT License https://github.com/mattdesl/eases/blob/master/LICENSE.md
    */
    function backInOut(t) {
        const s = 1.70158 * 1.525;
        if ((t *= 2) < 1)
            return 0.5 * (t * t * ((s + 1) * t - s));
        return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2);
    }
    function backIn(t) {
        const s = 1.70158;
        return t * t * ((s + 1) * t - s);
    }
    function backOut(t) {
        const s = 1.70158;
        return --t * t * ((s + 1) * t + s) + 1;
    }
    function bounceOut(t) {
        const a = 4.0 / 11.0;
        const b = 8.0 / 11.0;
        const c = 9.0 / 10.0;
        const ca = 4356.0 / 361.0;
        const cb = 35442.0 / 1805.0;
        const cc = 16061.0 / 1805.0;
        const t2 = t * t;
        return t < a
            ? 7.5625 * t2
            : t < b
                ? 9.075 * t2 - 9.9 * t + 3.4
                : t < c
                    ? ca * t2 - cb * t + cc
                    : 10.8 * t * t - 20.52 * t + 10.72;
    }
    function bounceInOut(t) {
        return t < 0.5
            ? 0.5 * (1.0 - bounceOut(1.0 - t * 2.0))
            : 0.5 * bounceOut(t * 2.0 - 1.0) + 0.5;
    }
    function bounceIn(t) {
        return 1.0 - bounceOut(1.0 - t);
    }
    function circInOut(t) {
        if ((t *= 2) < 1)
            return -0.5 * (Math.sqrt(1 - t * t) - 1);
        return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
    }
    function circIn(t) {
        return 1.0 - Math.sqrt(1.0 - t * t);
    }
    function circOut(t) {
        return Math.sqrt(1 - --t * t);
    }
    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    }
    function cubicIn(t) {
        return t * t * t;
    }
    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }
    function elasticInOut(t) {
        return t < 0.5
            ? 0.5 *
                Math.sin(((+13.0 * Math.PI) / 2) * 2.0 * t) *
                Math.pow(2.0, 10.0 * (2.0 * t - 1.0))
            : 0.5 *
                Math.sin(((-13.0 * Math.PI) / 2) * (2.0 * t - 1.0 + 1.0)) *
                Math.pow(2.0, -10.0 * (2.0 * t - 1.0)) +
                1.0;
    }
    function elasticIn(t) {
        return Math.sin((13.0 * t * Math.PI) / 2) * Math.pow(2.0, 10.0 * (t - 1.0));
    }
    function elasticOut(t) {
        return (Math.sin((-13.0 * (t + 1.0) * Math.PI) / 2) * Math.pow(2.0, -10.0 * t) + 1.0);
    }
    function expoInOut(t) {
        return t === 0.0 || t === 1.0
            ? t
            : t < 0.5
                ? +0.5 * Math.pow(2.0, 20.0 * t - 10.0)
                : -0.5 * Math.pow(2.0, 10.0 - t * 20.0) + 1.0;
    }
    function expoIn(t) {
        return t === 0.0 ? t : Math.pow(2.0, 10.0 * (t - 1.0));
    }
    function expoOut(t) {
        return t === 1.0 ? t : 1.0 - Math.pow(2.0, -10.0 * t);
    }
    function quadInOut(t) {
        t /= 0.5;
        if (t < 1)
            return 0.5 * t * t;
        t--;
        return -0.5 * (t * (t - 2) - 1);
    }
    function quadIn(t) {
        return t * t;
    }
    function quadOut(t) {
        return -t * (t - 2.0);
    }
    function quartInOut(t) {
        return t < 0.5
            ? +8.0 * Math.pow(t, 4.0)
            : -8.0 * Math.pow(t - 1.0, 4.0) + 1.0;
    }
    function quartIn(t) {
        return Math.pow(t, 4.0);
    }
    function quartOut(t) {
        return Math.pow(t - 1.0, 3.0) * (1.0 - t) + 1.0;
    }
    function quintInOut(t) {
        if ((t *= 2) < 1)
            return 0.5 * t * t * t * t * t;
        return 0.5 * ((t -= 2) * t * t * t * t + 2);
    }
    function quintIn(t) {
        return t * t * t * t * t;
    }
    function quintOut(t) {
        return --t * t * t * t * t + 1;
    }
    function sineInOut(t) {
        return -0.5 * (Math.cos(Math.PI * t) - 1);
    }
    function sineIn(t) {
        const v = Math.cos(t * Math.PI * 0.5);
        if (Math.abs(v) < 1e-14)
            return 1;
        else
            return 1 - v;
    }
    function sineOut(t) {
        return Math.sin((t * Math.PI) / 2);
    }

    var easingFunctions = /*#__PURE__*/Object.freeze({
        __proto__: null,
        backIn: backIn,
        backInOut: backInOut,
        backOut: backOut,
        bounceIn: bounceIn,
        bounceInOut: bounceInOut,
        bounceOut: bounceOut,
        circIn: circIn,
        circInOut: circInOut,
        circOut: circOut,
        cubicIn: cubicIn,
        cubicInOut: cubicInOut,
        cubicOut: cubicOut,
        elasticIn: elasticIn,
        elasticInOut: elasticInOut,
        elasticOut: elasticOut,
        expoIn: expoIn,
        expoInOut: expoInOut,
        expoOut: expoOut,
        quadIn: quadIn,
        quadInOut: quadInOut,
        quadOut: quadOut,
        quartIn: quartIn,
        quartInOut: quartInOut,
        quartOut: quartOut,
        quintIn: quintIn,
        quintInOut: quintInOut,
        quintOut: quintOut,
        sineIn: sineIn,
        sineInOut: sineInOut,
        sineOut: sineOut,
        linear: identity
    });

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    /* src/Cube.svelte generated by Svelte v3.44.0 */

    const { console: console_1$3, window: window_1$1 } = globals;
    const file$d = "src/Cube.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[50] = list[i];
    	child_ctx[52] = i;
    	return child_ctx;
    }

    // (444:0) {#if DEBUG}
    function create_if_block_1$2(ctx) {
    	let span24;
    	let span0;
    	let t0;
    	let t1;
    	let t2;
    	let span1;
    	let t3;
    	let t4_value = /*current*/ ctx[1].x.toFixed(2) + "";
    	let t4;
    	let t5;
    	let span2;
    	let t6;
    	let t7_value = /*current*/ ctx[1].y.toFixed(2) + "";
    	let t7;
    	let t8;
    	let span3;
    	let t9;
    	let t10_value = /*current*/ ctx[1].z.toFixed(2) + "";
    	let t10;
    	let t11;
    	let span4;
    	let t12;
    	let t13_value = /*destination*/ ctx[2].x.toFixed(2) + "";
    	let t13;
    	let t14;
    	let span5;
    	let t15;
    	let t16_value = /*destination*/ ctx[2].y.toFixed(2) + "";
    	let t16;
    	let t17;
    	let span6;
    	let t18;
    	let t19_value = /*destination*/ ctx[2].z.toFixed(2) + "";
    	let t19;
    	let t20;
    	let span7;
    	let t21;
    	let t22_value = /*origin*/ ctx[16].x.toFixed(2) + "";
    	let t22;
    	let t23;
    	let span8;
    	let t24;
    	let t25_value = /*origin*/ ctx[16].y.toFixed(2) + "";
    	let t25;
    	let t26;
    	let span9;
    	let t27;
    	let t28_value = /*origin*/ ctx[16].z.toFixed(2) + "";
    	let t28;
    	let t29;
    	let span10;
    	let t30;
    	let t31_value = /*xyz*/ ctx[13].x.toFixed(2) + "";
    	let t31;
    	let t32;
    	let span11;
    	let t33;
    	let t34_value = /*xyz*/ ctx[13].y.toFixed(2) + "";
    	let t34;
    	let t35;
    	let span12;
    	let t36;
    	let t37_value = /*xyz*/ ctx[13].z.toFixed(2) + "";
    	let t37;
    	let t38;
    	let span13;
    	let t39;
    	let t40_value = /*modX*/ ctx[8].toFixed(2) + "";
    	let t40;
    	let t41;
    	let span14;
    	let t42;
    	let t43_value = /*modY*/ ctx[9].toFixed(2) + "";
    	let t43;
    	let t44;
    	let span15;
    	let t45;
    	let t46_value = parseInt(/*width*/ ctx[3]) + "";
    	let t46;
    	let t47;
    	let span16;
    	let t48;
    	let t49_value = parseInt(/*height*/ ctx[4]) + "";
    	let t49;
    	let t50;
    	let span17;
    	let t51;
    	let t52;
    	let t53;
    	let span18;
    	let t54;
    	let t55_value = /*zoom*/ ctx[10].toFixed(2) + "";
    	let t55;
    	let t56;
    	let span19;
    	let t57;
    	let t58_value = parseInt(/*perspective*/ ctx[11]) + "";
    	let t58;
    	let t59;
    	let span20;
    	let t60;
    	let t61_value = /*zoomX*/ ctx[5].toFixed(2) + "";
    	let t61;
    	let t62;
    	let span21;
    	let t63;
    	let t64_value = /*zoomY*/ ctx[6].toFixed(2) + "";
    	let t64;
    	let t65;
    	let span22;
    	let t66;
    	let t67_value = /*zoomZ*/ ctx[7].toFixed(2) + "";
    	let t67;
    	let t68;
    	let span23;
    	let t69;
    	let t70_value = /*zoomRatio*/ ctx[12].toFixed(2) + "";
    	let t70;

    	const block = {
    		c: function create() {
    			span24 = element("span");
    			span0 = element("span");
    			t0 = text("index:");
    			t1 = text(/*$index*/ ctx[14]);
    			t2 = space();
    			span1 = element("span");
    			t3 = text("current.x:");
    			t4 = text(t4_value);
    			t5 = space();
    			span2 = element("span");
    			t6 = text("current.y:");
    			t7 = text(t7_value);
    			t8 = space();
    			span3 = element("span");
    			t9 = text("current.z:");
    			t10 = text(t10_value);
    			t11 = space();
    			span4 = element("span");
    			t12 = text("destination.x:");
    			t13 = text(t13_value);
    			t14 = space();
    			span5 = element("span");
    			t15 = text("destination.y:");
    			t16 = text(t16_value);
    			t17 = space();
    			span6 = element("span");
    			t18 = text("destination.z:");
    			t19 = text(t19_value);
    			t20 = space();
    			span7 = element("span");
    			t21 = text("origin.x:");
    			t22 = text(t22_value);
    			t23 = space();
    			span8 = element("span");
    			t24 = text("origin.y:");
    			t25 = text(t25_value);
    			t26 = space();
    			span9 = element("span");
    			t27 = text("origin.z:");
    			t28 = text(t28_value);
    			t29 = space();
    			span10 = element("span");
    			t30 = text("xyz.x:");
    			t31 = text(t31_value);
    			t32 = space();
    			span11 = element("span");
    			t33 = text("xyz.y:");
    			t34 = text(t34_value);
    			t35 = space();
    			span12 = element("span");
    			t36 = text("xyz.z:");
    			t37 = text(t37_value);
    			t38 = space();
    			span13 = element("span");
    			t39 = text("modX:");
    			t40 = text(t40_value);
    			t41 = space();
    			span14 = element("span");
    			t42 = text("modY:");
    			t43 = text(t43_value);
    			t44 = space();
    			span15 = element("span");
    			t45 = text("width:");
    			t46 = text(t46_value);
    			t47 = space();
    			span16 = element("span");
    			t48 = text("height:");
    			t49 = text(t49_value);
    			t50 = space();
    			span17 = element("span");
    			t51 = text("index:");
    			t52 = text(/*$index*/ ctx[14]);
    			t53 = space();
    			span18 = element("span");
    			t54 = text("zoom:");
    			t55 = text(t55_value);
    			t56 = space();
    			span19 = element("span");
    			t57 = text("perspective:");
    			t58 = text(t58_value);
    			t59 = space();
    			span20 = element("span");
    			t60 = text("zoomX:");
    			t61 = text(t61_value);
    			t62 = space();
    			span21 = element("span");
    			t63 = text("zoomY:");
    			t64 = text(t64_value);
    			t65 = space();
    			span22 = element("span");
    			t66 = text("zoomZ:");
    			t67 = text(t67_value);
    			t68 = space();
    			span23 = element("span");
    			t69 = text("zoomRatio:");
    			t70 = text(t70_value);
    			add_location(span0, file$d, 445, 2, 9974);
    			add_location(span1, file$d, 446, 2, 10004);
    			add_location(span2, file$d, 447, 2, 10052);
    			add_location(span3, file$d, 448, 2, 10100);
    			add_location(span4, file$d, 449, 2, 10148);
    			add_location(span5, file$d, 450, 2, 10204);
    			add_location(span6, file$d, 451, 2, 10260);
    			add_location(span7, file$d, 452, 2, 10316);
    			add_location(span8, file$d, 453, 2, 10362);
    			add_location(span9, file$d, 454, 2, 10408);
    			add_location(span10, file$d, 455, 2, 10454);
    			add_location(span11, file$d, 456, 2, 10494);
    			add_location(span12, file$d, 457, 2, 10534);
    			add_location(span13, file$d, 458, 2, 10574);
    			add_location(span14, file$d, 459, 2, 10612);
    			add_location(span15, file$d, 460, 2, 10650);
    			add_location(span16, file$d, 461, 2, 10689);
    			add_location(span17, file$d, 462, 2, 10730);
    			add_location(span18, file$d, 463, 2, 10760);
    			add_location(span19, file$d, 464, 2, 10798);
    			add_location(span20, file$d, 465, 2, 10849);
    			add_location(span21, file$d, 466, 2, 10889);
    			add_location(span22, file$d, 467, 2, 10929);
    			add_location(span23, file$d, 468, 2, 10969);
    			attr_dev(span24, "class", "fixed r0 t0 z-index9 r0 flex column filled p1 monospace");
    			add_location(span24, file$d, 444, 1, 9901);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span24, anchor);
    			append_dev(span24, span0);
    			append_dev(span0, t0);
    			append_dev(span0, t1);
    			append_dev(span24, t2);
    			append_dev(span24, span1);
    			append_dev(span1, t3);
    			append_dev(span1, t4);
    			append_dev(span24, t5);
    			append_dev(span24, span2);
    			append_dev(span2, t6);
    			append_dev(span2, t7);
    			append_dev(span24, t8);
    			append_dev(span24, span3);
    			append_dev(span3, t9);
    			append_dev(span3, t10);
    			append_dev(span24, t11);
    			append_dev(span24, span4);
    			append_dev(span4, t12);
    			append_dev(span4, t13);
    			append_dev(span24, t14);
    			append_dev(span24, span5);
    			append_dev(span5, t15);
    			append_dev(span5, t16);
    			append_dev(span24, t17);
    			append_dev(span24, span6);
    			append_dev(span6, t18);
    			append_dev(span6, t19);
    			append_dev(span24, t20);
    			append_dev(span24, span7);
    			append_dev(span7, t21);
    			append_dev(span7, t22);
    			append_dev(span24, t23);
    			append_dev(span24, span8);
    			append_dev(span8, t24);
    			append_dev(span8, t25);
    			append_dev(span24, t26);
    			append_dev(span24, span9);
    			append_dev(span9, t27);
    			append_dev(span9, t28);
    			append_dev(span24, t29);
    			append_dev(span24, span10);
    			append_dev(span10, t30);
    			append_dev(span10, t31);
    			append_dev(span24, t32);
    			append_dev(span24, span11);
    			append_dev(span11, t33);
    			append_dev(span11, t34);
    			append_dev(span24, t35);
    			append_dev(span24, span12);
    			append_dev(span12, t36);
    			append_dev(span12, t37);
    			append_dev(span24, t38);
    			append_dev(span24, span13);
    			append_dev(span13, t39);
    			append_dev(span13, t40);
    			append_dev(span24, t41);
    			append_dev(span24, span14);
    			append_dev(span14, t42);
    			append_dev(span14, t43);
    			append_dev(span24, t44);
    			append_dev(span24, span15);
    			append_dev(span15, t45);
    			append_dev(span15, t46);
    			append_dev(span24, t47);
    			append_dev(span24, span16);
    			append_dev(span16, t48);
    			append_dev(span16, t49);
    			append_dev(span24, t50);
    			append_dev(span24, span17);
    			append_dev(span17, t51);
    			append_dev(span17, t52);
    			append_dev(span24, t53);
    			append_dev(span24, span18);
    			append_dev(span18, t54);
    			append_dev(span18, t55);
    			append_dev(span24, t56);
    			append_dev(span24, span19);
    			append_dev(span19, t57);
    			append_dev(span19, t58);
    			append_dev(span24, t59);
    			append_dev(span24, span20);
    			append_dev(span20, t60);
    			append_dev(span20, t61);
    			append_dev(span24, t62);
    			append_dev(span24, span21);
    			append_dev(span21, t63);
    			append_dev(span21, t64);
    			append_dev(span24, t65);
    			append_dev(span24, span22);
    			append_dev(span22, t66);
    			append_dev(span22, t67);
    			append_dev(span24, t68);
    			append_dev(span24, span23);
    			append_dev(span23, t69);
    			append_dev(span23, t70);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$index*/ 16384) set_data_dev(t1, /*$index*/ ctx[14]);
    			if (dirty[0] & /*current*/ 2 && t4_value !== (t4_value = /*current*/ ctx[1].x.toFixed(2) + "")) set_data_dev(t4, t4_value);
    			if (dirty[0] & /*current*/ 2 && t7_value !== (t7_value = /*current*/ ctx[1].y.toFixed(2) + "")) set_data_dev(t7, t7_value);
    			if (dirty[0] & /*current*/ 2 && t10_value !== (t10_value = /*current*/ ctx[1].z.toFixed(2) + "")) set_data_dev(t10, t10_value);
    			if (dirty[0] & /*destination*/ 4 && t13_value !== (t13_value = /*destination*/ ctx[2].x.toFixed(2) + "")) set_data_dev(t13, t13_value);
    			if (dirty[0] & /*destination*/ 4 && t16_value !== (t16_value = /*destination*/ ctx[2].y.toFixed(2) + "")) set_data_dev(t16, t16_value);
    			if (dirty[0] & /*destination*/ 4 && t19_value !== (t19_value = /*destination*/ ctx[2].z.toFixed(2) + "")) set_data_dev(t19, t19_value);
    			if (dirty[0] & /*origin*/ 65536 && t22_value !== (t22_value = /*origin*/ ctx[16].x.toFixed(2) + "")) set_data_dev(t22, t22_value);
    			if (dirty[0] & /*origin*/ 65536 && t25_value !== (t25_value = /*origin*/ ctx[16].y.toFixed(2) + "")) set_data_dev(t25, t25_value);
    			if (dirty[0] & /*origin*/ 65536 && t28_value !== (t28_value = /*origin*/ ctx[16].z.toFixed(2) + "")) set_data_dev(t28, t28_value);
    			if (dirty[0] & /*xyz*/ 8192 && t31_value !== (t31_value = /*xyz*/ ctx[13].x.toFixed(2) + "")) set_data_dev(t31, t31_value);
    			if (dirty[0] & /*xyz*/ 8192 && t34_value !== (t34_value = /*xyz*/ ctx[13].y.toFixed(2) + "")) set_data_dev(t34, t34_value);
    			if (dirty[0] & /*xyz*/ 8192 && t37_value !== (t37_value = /*xyz*/ ctx[13].z.toFixed(2) + "")) set_data_dev(t37, t37_value);
    			if (dirty[0] & /*modX*/ 256 && t40_value !== (t40_value = /*modX*/ ctx[8].toFixed(2) + "")) set_data_dev(t40, t40_value);
    			if (dirty[0] & /*modY*/ 512 && t43_value !== (t43_value = /*modY*/ ctx[9].toFixed(2) + "")) set_data_dev(t43, t43_value);
    			if (dirty[0] & /*width*/ 8 && t46_value !== (t46_value = parseInt(/*width*/ ctx[3]) + "")) set_data_dev(t46, t46_value);
    			if (dirty[0] & /*height*/ 16 && t49_value !== (t49_value = parseInt(/*height*/ ctx[4]) + "")) set_data_dev(t49, t49_value);
    			if (dirty[0] & /*$index*/ 16384) set_data_dev(t52, /*$index*/ ctx[14]);
    			if (dirty[0] & /*zoom*/ 1024 && t55_value !== (t55_value = /*zoom*/ ctx[10].toFixed(2) + "")) set_data_dev(t55, t55_value);
    			if (dirty[0] & /*perspective*/ 2048 && t58_value !== (t58_value = parseInt(/*perspective*/ ctx[11]) + "")) set_data_dev(t58, t58_value);
    			if (dirty[0] & /*zoomX*/ 32 && t61_value !== (t61_value = /*zoomX*/ ctx[5].toFixed(2) + "")) set_data_dev(t61, t61_value);
    			if (dirty[0] & /*zoomY*/ 64 && t64_value !== (t64_value = /*zoomY*/ ctx[6].toFixed(2) + "")) set_data_dev(t64, t64_value);
    			if (dirty[0] & /*zoomZ*/ 128 && t67_value !== (t67_value = /*zoomZ*/ ctx[7].toFixed(2) + "")) set_data_dev(t67, t67_value);
    			if (dirty[0] & /*zoomRatio*/ 4096 && t70_value !== (t70_value = /*zoomRatio*/ ctx[12].toFixed(2) + "")) set_data_dev(t70, t70_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span24);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(444:0) {#if DEBUG}",
    		ctx
    	});

    	return block;
    }

    // (531:7) {:else}
    function create_else_block$3(ctx) {
    	let div1;
    	let h1;
    	let t0;
    	let t1;
    	let t2;
    	let div0;
    	let t4;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			t0 = text("COMPONENT ");
    			t1 = text(/*i*/ ctx[52]);
    			t2 = space();
    			div0 = element("div");
    			div0.textContent = "HELLO WORLD";
    			t4 = space();
    			img = element("img");
    			attr_dev(h1, "class", "filled plr1");
    			add_location(h1, file$d, 532, 9, 13521);
    			attr_dev(div0, "class", "filled plr1");
    			add_location(div0, file$d, 533, 9, 13573);
    			if (!src_url_equal(img.src, img_src_value = "data/demo" + (/*i*/ ctx[52] + 1) + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "w30pc");
    			add_location(img, file$d, 534, 9, 13625);
    			attr_dev(div1, "class", "flex column-center-center");
    			add_location(div1, file$d, 531, 8, 13472);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div1, t4);
    			append_dev(div1, img);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(531:7) {:else}",
    		ctx
    	});

    	return block;
    }

    // (524:7) {#if components[i]}
    function create_if_block$5(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*components*/ ctx[0][/*i*/ ctx[52]];

    	function switch_props(ctx) {
    		return {
    			props: {
    				idx: /*i*/ ctx[52],
    				stretch: /*isEnds*/ ctx[24](/*i*/ ctx[52]),
    				width: /*width*/ ctx[3],
    				height: /*height*/ ctx[4]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty[0] & /*width*/ 8) switch_instance_changes.width = /*width*/ ctx[3];
    			if (dirty[0] & /*height*/ 16) switch_instance_changes.height = /*height*/ ctx[4];

    			if (switch_value !== (switch_value = /*components*/ ctx[0][/*i*/ ctx[52]])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(524:7) {#if components[i]}",
    		ctx
    	});

    	return block;
    }

    // (512:3) {#each (new Array(6)) as n, i }
    function create_each_block$6(ctx) {
    	let div0;
    	let div0_style_value;
    	let t0;
    	let div2;
    	let div1;
    	let current_block_type_index;
    	let if_block;
    	let t1;
    	let div2_style_value;
    	let current;
    	const if_block_creators = [create_if_block$5, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*components*/ ctx[0][/*i*/ ctx[52]]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			if_block.c();
    			t1 = space();
    			attr_dev(div0, "style", div0_style_value = /*faces*/ ctx[19][/*i*/ ctx[52]]);
    			attr_dev(div0, "class", "face fill flex row-center-center fuzz");
    			toggle_class(div0, "none", /*i*/ ctx[52] != /*$index*/ ctx[14]);
    			toggle_class(div0, "b8-solid", /*$state*/ ctx[15].mousedown);
    			toggle_class(div0, "b4-solid", !/*$state*/ ctx[15].mousedown);
    			add_location(div0, file$d, 512, 4, 12911);
    			attr_dev(div1, "class", "inner monospace flex fill column-center-center rel");
    			add_location(div1, file$d, 521, 6, 13206);
    			attr_dev(div2, "style", div2_style_value = /*faces*/ ctx[19][/*i*/ ctx[52]] + /*rotateStyle*/ ctx[20](/*i*/ ctx[52]));
    			attr_dev(div2, "class", "face fill flex row-center-center");
    			add_location(div2, file$d, 518, 4, 13107);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			if_blocks[current_block_type_index].m(div1, null);
    			append_dev(div2, t1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*faces*/ 524288 && div0_style_value !== (div0_style_value = /*faces*/ ctx[19][/*i*/ ctx[52]])) {
    				attr_dev(div0, "style", div0_style_value);
    			}

    			if (dirty[0] & /*$index*/ 16384) {
    				toggle_class(div0, "none", /*i*/ ctx[52] != /*$index*/ ctx[14]);
    			}

    			if (dirty[0] & /*$state*/ 32768) {
    				toggle_class(div0, "b8-solid", /*$state*/ ctx[15].mousedown);
    			}

    			if (dirty[0] & /*$state*/ 32768) {
    				toggle_class(div0, "b4-solid", !/*$state*/ ctx[15].mousedown);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div1, null);
    			}

    			if (!current || dirty[0] & /*faces, rotateStyle*/ 1572864 && div2_style_value !== (div2_style_value = /*faces*/ ctx[19][/*i*/ ctx[52]] + /*rotateStyle*/ ctx[20](/*i*/ ctx[52]))) {
    				attr_dev(div2, "style", div2_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(512:3) {#each (new Array(6)) as n, i }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let t;
    	let div2;
    	let div1;
    	let div0;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*DEBUG*/ ctx[23] && create_if_block_1$2(ctx);
    	let each_value = new Array(6);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "style", /*box*/ ctx[21]);
    			attr_dev(div0, "class", "box h100pc rel");
    			add_location(div0, file$d, 507, 2, 12769);
    			attr_dev(div1, "style", /*container*/ ctx[22]);
    			attr_dev(div1, "class", "container fill rel");
    			add_location(div1, file$d, 503, 1, 12694);
    			attr_dev(div2, "class", "zoom fill");
    			set_style(div2, "transform", "scale(" + /*zoom*/ ctx[10] + ", " + /*squish*/ ctx[18] + ")");
    			set_style(div2, "transform-origin", "50% 50%");
    			toggle_class(div2, "invisible", !/*$state*/ ctx[15].cubeInited);
    			add_location(div2, file$d, 499, 0, 12558);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			/*div1_binding*/ ctx[37](div1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(bundle.pan.call(null, window_1$1, { direction: Hammer.DIRECTION_ALL })),
    					listen_dev(window_1$1, "resize", /*onResize*/ ctx[28], false, false, false),
    					listen_dev(window_1$1, "panstart", /*onPanstart*/ ctx[25], false, false, false),
    					listen_dev(window_1$1, "panmove", /*onPanmove*/ ctx[26], false, false, false),
    					listen_dev(window_1$1, "panend", /*onPanend*/ ctx[27], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*DEBUG*/ ctx[23]) if_block.p(ctx, dirty);

    			if (dirty[0] & /*faces, rotateStyle, components, isEnds, width, height, $index, $state*/ 18399257) {
    				each_value = new Array(6);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty[0] & /*box*/ 2097152) {
    				attr_dev(div0, "style", /*box*/ ctx[21]);
    			}

    			if (!current || dirty[0] & /*container*/ 4194304) {
    				attr_dev(div1, "style", /*container*/ ctx[22]);
    			}

    			if (!current || dirty[0] & /*zoom, squish*/ 263168) {
    				set_style(div2, "transform", "scale(" + /*zoom*/ ctx[10] + ", " + /*squish*/ ctx[18] + ")");
    			}

    			if (dirty[0] & /*$state*/ 32768) {
    				toggle_class(div2, "invisible", !/*$state*/ ctx[15].cubeInited);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			/*div1_binding*/ ctx[37](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const HORIZONTAL = 'horizontal';
    const VERTICAL = 'vertical';
    const BOTH = 'both';
    const SIDEWAYS = 'sideways';

    function clamp(v, min, max) {
    	if (v < min) return min;
    	if (v > max) return max;
    	return v;
    }

    function same(a, b) {
    	return Math.abs(a.x).toFixed(1) == Math.abs(b.x).toFixed(1) && Math.abs(a.y).toFixed(1) == Math.abs(b.y).toFixed(1);
    }

    function blend(a, b, sm) {
    	return a * sm + b * (1 - sm);
    }

    function getIndex(xy) {
    	let x = normalise(xy.x + 45, 360);
    	x -= x % 90;
    	x /= 90;
    	let y = normalise(xy.y + 45, 360);
    	y -= y % 90;
    	y /= 90;
    	let top = { 1: 5, 3: 0 };
    	return y != 0 ? top[y] : x + 1;
    }

    function normalise(value, angle) {
    	if (value < 360 - angle) value += 360;
    	if (value >= angle) value -= 360;
    	return value;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let ends;
    	let o;
    	let container;
    	let xyz;
    	let box;
    	let resizeStyle;
    	let rotateStyle;
    	let faces;
    	let modX;
    	let modY;
    	let zoom;
    	let zoomRatio;
    	let perspective;
    	let squish;
    	let $index;
    	let $state;
    	let $smoothing;
    	let $chat;
    	validate_store(index, 'index');
    	component_subscribe($$self, index, $$value => $$invalidate(14, $index = $$value));
    	validate_store(state, 'state');
    	component_subscribe($$self, state, $$value => $$invalidate(15, $state = $$value));
    	validate_store(smoothing, 'smoothing');
    	component_subscribe($$self, smoothing, $$value => $$invalidate(42, $smoothing = $$value));
    	validate_store(chat, 'chat');
    	component_subscribe($$self, chat, $$value => $$invalidate(36, $chat = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Cube', slots, []);
    	let DEBUG = window.location.search == '?debug';
    	let { backspace = true } = $$props;
    	let { spin = false } = $$props;
    	let { components = [] } = $$props;
    	let rotation = { x: 0, y: 0, z: 0 };
    	let current = { x: 180, y: 0, z: 0 };
    	let origin = { ...current };
    	let destination = { ...current };
    	let el, width, height; // element dimensions
    	let zoomX = 2;
    	let zoomY = 1;
    	let zoomZ = 1;
    	let isTweening = false;
    	let isPanning = false;
    	let DIMIT;

    	onMount(e => {
    		onResize();
    		window.requestAnimationFrame(tick);
    		$$invalidate(1, current.x += parseInt(Math.random() * 4) * 90, current);
    	}); // current.y = 45

    	let lastIndex = -2;
    	let lastWasBox = false;
    	const isEnds = idx => idx == 5 || idx == 0;

    	function tick() {
    		// SPIN
    		if ($index < 0) {
    			$$invalidate(5, zoomX = blend(zoomX, 1.5, $smoothing));
    			$$invalidate(6, zoomY = blend(zoomY, 1.5, $smoothing));
    			$$invalidate(7, zoomZ = blend(zoomZ, 1, $smoothing));
    			if (!isPanning) $$invalidate(1, current.x = Math.sin(new Date() * 0.0004) * 20 + 180, current);
    			if (!isPanning) $$invalidate(1, current.y = Math.sin(new Date() * 0.0003) * 10, current);

    			// current.y -= sp * 1
    			return window.requestAnimationFrame(tick);
    		}

    		// MAIN
    		let x = Math.abs(normalise(origin.x, 180) - normalise(current.x, 180));

    		let y = Math.abs(normalise(origin.y, 180) - normalise(current.y, 180));
    		let combi = (x + y) % 360;

    		// if (combi > 315) combi = Math.abs(combi - 360)
    		if (combi <= 45) {
    			let zx = clamp(scale(x, 0, 45, 1, 2), 1, 2);
    			let zy = clamp(scale(y, 0, 45, 1, 2), 1, 2);
    			let zz = 2 - clamp(scale(combi, 0, 45, 0, 1), 0, 1);
    			if (zx != zoomX) $$invalidate(5, zoomX = zx);
    			if (zy != zoomY && zy > zoomY) $$invalidate(6, zoomY = zy);
    			if (zz != zoomZ) $$invalidate(7, zoomZ = ends ? zz : 1);
    		}

    		if (isPanning) ; else {
    			if (!spin && destination && isTweening) {
    				let sm = $smoothing;
    				let x = blend(current.x, destination.x, sm);
    				let y = blend(current.y, destination.y, sm);
    				let z = blend(current.y, destination.z, sm);
    				let destX = 1;
    				let destY = 1;
    				let destZ = ends ? 2 : 1;
    				$$invalidate(5, zoomX = blend(zoomX, destX, sm));
    				$$invalidate(6, zoomY = blend(zoomY, destY, sm));
    				$$invalidate(7, zoomZ = blend(zoomZ, destZ, sm));
    				if (current.x != x) $$invalidate(1, current.x = x, current);
    				if (current.y != y) $$invalidate(1, current.y = y, current);
    				if (current.z != y) $$invalidate(1, current.z = z, current);

    				if (same(current, destination)) {
    					$$invalidate(1, current.x = Math.round(x), current);
    					$$invalidate(1, current.y = Math.round(y), current);
    					$$invalidate(1, current.z = Math.round(z), current);
    					$$invalidate(5, zoomX = destX);
    					$$invalidate(6, zoomY = destY);
    					$$invalidate(7, zoomZ = destZ);
    					$$invalidate(1, current.x = normalise(current.x, 360), current);
    					console.log(`[Cube] 🧊 TWEEN FINISHED: triggering ${$index}`);
    					trigger.set($index);
    					$$invalidate(31, isTweening = false);
    					volume.set(1);
    				}
    			}
    		}

    		window.requestAnimationFrame(tick);
    	}

    	let vertMore, vertLess, vertPrev, _vertMore, _vertLess;

    	function onPanstart(e) {
    		// console.log('[Cube] 🧊  panstart')
    		$$invalidate(16, origin.x = normalise(destination.x, 360), origin);

    		$$invalidate(16, origin.y = destination.y, origin);
    		let { deltaX, deltaY } = e.detail;

    		set_store_value(
    			state,
    			$state.direction = Math.abs(deltaX) > Math.abs(deltaY)
    			? HORIZONTAL
    			: VERTICAL,
    			$state
    		);

    		if ($index == 0 || $index == 5) set_store_value(state, $state.direction = VERTICAL, $state);
    		set_store_value(state, $state.direction = BOTH, $state);
    		DIMIT = $index == 0 || $index == 5 ? 0.5 : 1;

    		// if ($index < 0) $state.direction = BOTH
    		set_store_value(state, $state.isPanning = $$invalidate(32, isPanning = true), $state);

    		$$invalidate(3, width = el.offsetWidth);
    		$$invalidate(4, height = el.offsetHeight);
    		rotation.x = current.x;
    		rotation.y = current.y;
    	}

    	function onPanmove(e) {
    		// console.log('[Cube] 🧊  panmove')
    		let { deltaX, deltaY } = e.detail;

    		let speed = 2;
    		let x = deltaX * speed * 1.5 / width;
    		let y = Math.round(deltaY) * speed * 0.8 / height;

    		// invert
    		if (destination.x >= 90 && destination.x <= 180) y *= -1;

    		// HORIZONTAL
    		if ($state.direction == HORIZONTAL || $state.direction == BOTH) {
    			$$invalidate(1, current.x = (rotation.x + 90 * x) % 360, current);
    		}

    		// VERTICAL
    		if ($state.direction == VERTICAL || $state.direction == BOTH) {
    			$$invalidate(1, current.y = (rotation.y - 90 * y) % 360, current);
    		} // BOUNCE...
    		// if (current.y > 90) current.y -= ((current.y - 90) * (Math.abs(deltaY) * 0.005))

    		// if (current.y < -90) current.y -= ((current.y + 90) * (Math.abs(deltaY) * 0.005))
    		if ($state.direction == BOTH) {
    			$$invalidate(1, current.x = normalise(current.x, 180), current);
    			$$invalidate(1, current.y = normalise(current.y, 180), current);
    		}
    	}

    	function onPanend(e) {
    		// console.log('[Cube] 🧊  panend')
    		if (origin.x == -destination.x) $$invalidate(2, destination.x += 360, destination);

    		if (origin.y == -destination.y) $$invalidate(2, destination.y += 360, destination);
    		$$invalidate(1, current.x = normalise(current.x, 180), current);
    		$$invalidate(1, current.y = normalise(current.y, 180), current);
    		$$invalidate(2, destination.x = normalise(destination.x, 180), destination);
    		$$invalidate(2, destination.y = normalise(destination.y, 180), destination);
    		set_store_value(state, $state.panend = true, $state);
    		let normX = normalise(current.x + 45, 360);
    		let xIndex = (normX - normX % 90) / 90 + 1;

    		// if ($index < 0) {
    		// 	$index = 0
    		// } else {
    		let normY = normalise(current.y + 45, 360);

    		let adj = scale(normY - normY % 90, 90, 270, -1, 1);

    		// if ( xIndex == 1 || xIndex == 2) adj *= -1
    		set_store_value(index, $index = xIndex, $index);

    		let TOPS = undefined;
    		if (xIndex == 1) adj *= -1;
    		if (xIndex == 4) adj *= -1;
    		if (adj == 1) TOPS = 5;
    		if (adj == -1) TOPS = 0;
    		if (TOPS !== undefined) set_store_value(index, $index = TOPS, $index);

    		// 2
    		// 3
    		// }
    		set_store_value(smoothing, $smoothing = 0.9, $smoothing);

    		set_store_value(state, $state.isTweening = $$invalidate(31, isTweening = true), $state);
    		set_store_value(state, $state.isPanning = $$invalidate(32, isPanning = false), $state);
    		volume.set(1);
    	}

    	function scale(num, in_min, in_max, out_min, out_max, clamp) {
    		const o = (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    		return o;
    	}

    	async function onResize(e) {
    		$$invalidate(3, width = el.offsetWidth);
    		$$invalidate(4, height = el.offsetHeight);
    		console.log(`[Cube] 📐 width and height ${width} ${height}`);
    	}

    	const writable_props = ['backspace', 'spin', 'components'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Cube> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			el = $$value;
    			$$invalidate(17, el);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('backspace' in $$props) $$invalidate(29, backspace = $$props.backspace);
    		if ('spin' in $$props) $$invalidate(30, spin = $$props.spin);
    		if ('components' in $$props) $$invalidate(0, components = $$props.components);
    	};

    	$$self.$capture_state = () => ({
    		index,
    		state,
    		smoothing,
    		trigger,
    		volume,
    		chat,
    		onMount,
    		pan: bundle.pan,
    		tweened,
    		cubicOut,
    		cubicIn,
    		DEBUG,
    		backspace,
    		spin,
    		components,
    		rotation,
    		current,
    		origin,
    		destination,
    		el,
    		width,
    		height,
    		zoomX,
    		zoomY,
    		zoomZ,
    		isTweening,
    		isPanning,
    		HORIZONTAL,
    		VERTICAL,
    		BOTH,
    		SIDEWAYS,
    		DIMIT,
    		clamp,
    		same,
    		blend,
    		lastIndex,
    		lastWasBox,
    		getIndex,
    		isEnds,
    		tick,
    		vertMore,
    		vertLess,
    		vertPrev,
    		_vertMore,
    		_vertLess,
    		onPanstart,
    		onPanmove,
    		normalise,
    		onPanend,
    		scale,
    		onResize,
    		modX,
    		modY,
    		zoom,
    		squish,
    		perspective,
    		zoomRatio,
    		o,
    		resizeStyle,
    		faces,
    		rotateStyle,
    		xyz,
    		box,
    		container,
    		ends,
    		$index,
    		$state,
    		$smoothing,
    		$chat
    	});

    	$$self.$inject_state = $$props => {
    		if ('DEBUG' in $$props) $$invalidate(23, DEBUG = $$props.DEBUG);
    		if ('backspace' in $$props) $$invalidate(29, backspace = $$props.backspace);
    		if ('spin' in $$props) $$invalidate(30, spin = $$props.spin);
    		if ('components' in $$props) $$invalidate(0, components = $$props.components);
    		if ('rotation' in $$props) rotation = $$props.rotation;
    		if ('current' in $$props) $$invalidate(1, current = $$props.current);
    		if ('origin' in $$props) $$invalidate(16, origin = $$props.origin);
    		if ('destination' in $$props) $$invalidate(2, destination = $$props.destination);
    		if ('el' in $$props) $$invalidate(17, el = $$props.el);
    		if ('width' in $$props) $$invalidate(3, width = $$props.width);
    		if ('height' in $$props) $$invalidate(4, height = $$props.height);
    		if ('zoomX' in $$props) $$invalidate(5, zoomX = $$props.zoomX);
    		if ('zoomY' in $$props) $$invalidate(6, zoomY = $$props.zoomY);
    		if ('zoomZ' in $$props) $$invalidate(7, zoomZ = $$props.zoomZ);
    		if ('isTweening' in $$props) $$invalidate(31, isTweening = $$props.isTweening);
    		if ('isPanning' in $$props) $$invalidate(32, isPanning = $$props.isPanning);
    		if ('DIMIT' in $$props) DIMIT = $$props.DIMIT;
    		if ('lastIndex' in $$props) $$invalidate(33, lastIndex = $$props.lastIndex);
    		if ('lastWasBox' in $$props) lastWasBox = $$props.lastWasBox;
    		if ('vertMore' in $$props) vertMore = $$props.vertMore;
    		if ('vertLess' in $$props) vertLess = $$props.vertLess;
    		if ('vertPrev' in $$props) vertPrev = $$props.vertPrev;
    		if ('_vertMore' in $$props) _vertMore = $$props._vertMore;
    		if ('_vertLess' in $$props) _vertLess = $$props._vertLess;
    		if ('modX' in $$props) $$invalidate(8, modX = $$props.modX);
    		if ('modY' in $$props) $$invalidate(9, modY = $$props.modY);
    		if ('zoom' in $$props) $$invalidate(10, zoom = $$props.zoom);
    		if ('squish' in $$props) $$invalidate(18, squish = $$props.squish);
    		if ('perspective' in $$props) $$invalidate(11, perspective = $$props.perspective);
    		if ('zoomRatio' in $$props) $$invalidate(12, zoomRatio = $$props.zoomRatio);
    		if ('o' in $$props) $$invalidate(34, o = $$props.o);
    		if ('resizeStyle' in $$props) $$invalidate(35, resizeStyle = $$props.resizeStyle);
    		if ('faces' in $$props) $$invalidate(19, faces = $$props.faces);
    		if ('rotateStyle' in $$props) $$invalidate(20, rotateStyle = $$props.rotateStyle);
    		if ('xyz' in $$props) $$invalidate(13, xyz = $$props.xyz);
    		if ('box' in $$props) $$invalidate(21, box = $$props.box);
    		if ('container' in $$props) $$invalidate(22, container = $$props.container);
    		if ('ends' in $$props) ends = $$props.ends;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[1] & /*$chat*/ 32) {
    			(_chat => {
    				onResize();
    			})();
    		}

    		if ($$self.$$.dirty[0] & /*$state, $index, current, destination*/ 49158 | $$self.$$.dirty[1] & /*lastIndex*/ 4) {
    			(_index => {
    				if (!$state.inited || lastIndex == $index) return;

    				// SPIN!!!!
    				set_store_value(state, $state.isTweening = $$invalidate(31, isTweening = true), $state);

    				current.x;

    				// 45 - 225
    				$$invalidate(1, current.x = normalise(current.x, 360), current);

    				$$invalidate(2, destination.x = normalise(destination.x, 360), destination);
    				$$invalidate(16, origin.x = destination.x, origin);
    				$$invalidate(16, origin.y = destination.y, origin);
    				let top = { 5: 90, 0: -90 };
    				if (current.x > 45 && current.x < 225) top = { 5: -90, 0: 90 };

    				let x = !top[$index] && $index != -1
    				? ($index - 1) * 90
    				: destination.x;

    				let y = top[$index] || 0;

    				if (destination.x == 0 && x == 270) {
    					x = -90;
    					$$invalidate(1, current.x = normalise(current.x, 180), current);
    				}

    				if (destination.x == 270 && x == 0) {
    					x = 360;
    					$$invalidate(1, current.x = normalise(current.x, 360), current);
    				}

    				if (x == 0 && current.x > 180) $$invalidate(1, current.x = normalise(current.x, 180), current);
    				if (x == 360 && current.x < 180) $$invalidate(1, current.x += 360, current);
    				$$invalidate(2, destination.x = x, destination);
    				$$invalidate(2, destination.y = y, destination);

    				if (!$state.cubeInited) {
    					$$invalidate(1, current.x = destination.x, current);
    					$$invalidate(1, current.y = destination.y, current);
    					set_store_value(state, $state.cubeInited = true, $state);
    				}

    				// -90
    				if (destination.x == 180 && destination.y == -90 && $index == 0) {
    					$$invalidate(2, destination.y += 180, destination);
    				} else if (destination.x == 180 && destination.y == 90 && $index == 5) {
    					$$invalidate(2, destination.y -= 180, destination);
    				}

    				// if ($index == -1) {
    				// 	console.log(save, current.x, '???')
    				// 	current.x = save
    				// }
    				lastWasBox = $index == -1;

    				$$invalidate(33, lastIndex = $index);
    				set_store_value(state, $state.panend = false, $state);
    			})();
    		}

    		if ($$self.$$.dirty[0] & /*$index*/ 16384) {
    			ends = isEnds($index);
    		}

    		if ($$self.$$.dirty[0] & /*width, height*/ 24) {
    			$$invalidate(34, o = {
    				_w: width / -2,
    				w: width / 2,
    				_h: height / -2,
    				h: height / 2
    			});
    		}

    		if ($$self.$$.dirty[0] & /*zoomX, zoomY*/ 96) {
    			$$invalidate(11, perspective = parseInt(1000 + (zoomX - 1) * 600 + (zoomY - 1) * 600));
    		}

    		if ($$self.$$.dirty[0] & /*perspective*/ 2048) {
    			$$invalidate(22, container = `perspective: ${perspective}px`);
    		}

    		if ($$self.$$.dirty[0] & /*current*/ 2) {
    			$$invalidate(8, modX = (scale(Math.abs(Math.abs(current.x) % 180 - 90), 0, 45, 1, 0) + 1) / 2);
    		}

    		if ($$self.$$.dirty[0] & /*current, modX*/ 258) {
    			$$invalidate(13, xyz = {
    				x: current.x,
    				y: current.y * (1 - modX) || 0,
    				z: -current.y * modX || 0
    			});
    		}

    		if ($$self.$$.dirty[0] & /*xyz, backspace*/ 536879104) {
    			$$invalidate(21, box = `
		transform-style: preserve-3d;
		transform: 
			rotateY(${xyz.x}deg)
			rotateX(${xyz.y}deg)
			rotateZ(${xyz.z}deg)
			translate3d(0, 0, 0);
		backface-visibility: ${backspace ? 'visible' : 'hidden'}`);
    		}

    		if ($$self.$$.dirty[0] & /*width, height*/ 24) {
    			$$invalidate(35, resizeStyle = `height:${width}px;margin-top:-${(width - height) / 2}px`);
    		}

    		if ($$self.$$.dirty[0] & /*current*/ 2) {
    			$$invalidate(20, rotateStyle = i => i == 0
    			? `rotateZ(${current.x}deg)`
    			: i == 5
    				? `rotateZ(-${normalise(current.x, 360)}deg)`
    				: '');
    		}

    		if ($$self.$$.dirty[1] & /*resizeStyle, o*/ 24) {
    			$$invalidate(19, faces = [
    				`${resizeStyle};transform: rotateX(90deg) translate3d(0, 0, ${o.h}px)`,
    				`transform: translate3d(0, 0, ${o.w}px)`,
    				`transform: rotateY(-90deg) translate3d(0, 0, ${o.w}px)`,
    				`transform: translate3d(0, 0, ${o._w}px) rotateY(180deg)`,
    				`transform: rotateY(90deg) translate3d(0, 0, ${o.w}px)`,
    				`${resizeStyle};transform: rotateX(-90deg) translate3d(0, 0, ${o.h}px)`
    			]);
    		}

    		if ($$self.$$.dirty[0] & /*current*/ 2) {
    			$$invalidate(9, modY = (scale(Math.abs(Math.abs(current.y) % 180 - 90), 0, 45, 1, 0) + 1) / 2);
    		}

    		if ($$self.$$.dirty[0] & /*width, height*/ 24) {
    			$$invalidate(12, zoomRatio = width / 1000 * (2 - width / height));
    		}

    		if ($$self.$$.dirty[0] & /*width, zoomX, zoomY, zoomZ, zoomRatio*/ 4328) {
    			$$invalidate(10, zoom = scale(width, 500, 1000, 0.75, 0.5) + (zoomX - 1) * -0.08 + (zoomY - 1) * -0.06 + (zoomZ - 1) * zoomRatio);
    		}

    		if ($$self.$$.dirty[0] & /*zoom, modY, height, width*/ 1560) {
    			//9999999 !!!
    			$$invalidate(18, squish = zoom * (1 - modY) + zoom * (height / width) * modY);
    		}

    		if ($$self.$$.dirty[0] & /*$index, modX*/ 16640 | $$self.$$.dirty[1] & /*isTweening, isPanning*/ 3) {
    			(_modX => {
    				if (isTweening || isPanning) {
    					volume.set($index == 1 || $index == 3 ? 1 - modX : modX);
    				}
    			})();
    		}
    	};

    	return [
    		components,
    		current,
    		destination,
    		width,
    		height,
    		zoomX,
    		zoomY,
    		zoomZ,
    		modX,
    		modY,
    		zoom,
    		perspective,
    		zoomRatio,
    		xyz,
    		$index,
    		$state,
    		origin,
    		el,
    		squish,
    		faces,
    		rotateStyle,
    		box,
    		container,
    		DEBUG,
    		isEnds,
    		onPanstart,
    		onPanmove,
    		onPanend,
    		onResize,
    		backspace,
    		spin,
    		isTweening,
    		isPanning,
    		lastIndex,
    		o,
    		resizeStyle,
    		$chat,
    		div1_binding
    	];
    }

    class Cube extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { backspace: 29, spin: 30, components: 0 }, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cube",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get backspace() {
    		throw new Error("<Cube>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backspace(value) {
    		throw new Error("<Cube>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spin() {
    		throw new Error("<Cube>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spin(value) {
    		throw new Error("<Cube>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get components() {
    		throw new Error("<Cube>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set components(value) {
    		throw new Error("<Cube>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Chat.svelte generated by Svelte v3.44.0 */
    const file$c = "src/Chat.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    // (28:3) {#if links?.[idx]}
    function create_if_block$4(ctx) {
    	let iframe;
    	let iframe_src_value;

    	const block = {
    		c: function create() {
    			iframe = element("iframe");
    			attr_dev(iframe, "class", "abs w100pc h100pc b0 l0");
    			set_style(iframe, "height", "calc(100% + 120px)");
    			set_style(iframe, "top", "auto");
    			set_style(iframe, "bottom", "0");
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://chat.scanlines.xyz/channel/" + /*links*/ ctx[2]?.[/*idx*/ ctx[0]] + "?layout=embedded")) attr_dev(iframe, "src", iframe_src_value);
    			add_location(iframe, file$c, 28, 4, 488);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, iframe, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*links, idx*/ 5 && !src_url_equal(iframe.src, iframe_src_value = "https://chat.scanlines.xyz/channel/" + /*links*/ ctx[2]?.[/*idx*/ ctx[0]] + "?layout=embedded")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(iframe);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(28:3) {#if links?.[idx]}",
    		ctx
    	});

    	return block;
    }

    // (39:3) {#each links as link, i}
    function create_each_block$5(ctx) {
    	let span;
    	let t0;
    	let div;
    	let t1_value = /*lookup*/ ctx[1][/*link*/ ctx[7]] + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[6](/*i*/ ctx[9], ...args);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = space();
    			div = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(span, "class", "block p0-2 mlr0-5 filled radius1em");
    			toggle_class(span, "none", /*i*/ ctx[9] == 0);
    			add_location(span, file$c, 39, 4, 854);
    			attr_dev(div, "class", "pointer block whitespace-nowrap");
    			toggle_class(div, "bb4-solid", /*i*/ ctx[9] == /*idx*/ ctx[0]);
    			add_location(div, file$c, 42, 4, 939);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, t1);
    			append_dev(div, t2);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*lookup, links*/ 6 && t1_value !== (t1_value = /*lookup*/ ctx[1][/*link*/ ctx[7]] + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*idx*/ 1) {
    				toggle_class(div, "bb4-solid", /*i*/ ctx[9] == /*idx*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(39:3) {#each links as link, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div2;
    	let div0;
    	let section;
    	let t0;
    	let nav;
    	let div1;
    	let t1;
    	let current;
    	let if_block = /*links*/ ctx[2]?.[/*idx*/ ctx[0]] && create_if_block$4(ctx);
    	let each_value = /*links*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			section = element("section");
    			if (if_block) if_block.c();
    			t0 = space();
    			nav = element("nav");
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			if (default_slot) default_slot.c();
    			attr_dev(section, "class", "flex grow rel");
    			add_location(section, file$c, 25, 2, 429);
    			attr_dev(div0, "class", "flex grow p0-5 rel overflow-hidden");
    			add_location(div0, file$c, 24, 1, 377);
    			attr_dev(div1, "class", "flex row-center-center");
    			add_location(div1, file$c, 37, 2, 785);
    			attr_dev(nav, "class", "flex row-space-between-center f2 monospace uppercase p1 bt2-solid");
    			add_location(nav, file$c, 36, 1, 703);
    			attr_dev(div2, "class", "flex column h100pc minw32em");
    			set_style(div2, "background", "#1f2329");
    			add_location(div2, file$c, 23, 0, 307);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, section);
    			if (if_block) if_block.m(section, null);
    			append_dev(div2, t0);
    			append_dev(div2, nav);
    			append_dev(nav, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(nav, t1);

    			if (default_slot) {
    				default_slot.m(nav, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*links*/ ctx[2]?.[/*idx*/ ctx[0]]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(section, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*idx, lookup, links*/ 7) {
    				each_value = /*links*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks, detaching);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let links;
    	let $data;
    	validate_store(data, 'data');
    	component_subscribe($$self, data, $$value => $$invalidate(3, $data = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Chat', slots, ['default']);
    	let { idx = 0 } = $$props;
    	let lookup = {};
    	const writable_props = ['idx'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Chat> was created with unknown prop '${key}'`);
    	});

    	const click_handler = (i, e) => $$invalidate(0, idx = i);

    	$$self.$$set = $$props => {
    		if ('idx' in $$props) $$invalidate(0, idx = $$props.idx);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ data, chat, idx, lookup, links, $data });

    	$$self.$inject_state = $$props => {
    		if ('idx' in $$props) $$invalidate(0, idx = $$props.idx);
    		if ('lookup' in $$props) $$invalidate(1, lookup = $$props.lookup);
    		if ('links' in $$props) $$invalidate(2, links = $$props.links);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$data*/ 8) {
    			$$invalidate(2, links = (stations => {
    				let a = [];

    				(stations || []).forEach(s => {
    					if (a.indexOf(s.chat) == -1) {
    						a.push(s.chat);
    						$$invalidate(1, lookup[s.chat] = s.group, lookup);
    					}
    				});

    				return a;
    			})($data?.stations));
    		}
    	};

    	return [idx, lookup, links, $data, $$scope, slots, click_handler];
    }

    class Chat extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { idx: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chat",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get idx() {
    		throw new Error("<Chat>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set idx(value) {
    		throw new Error("<Chat>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function vec2_from_angle(angle, dist, center) {
    	const {x,y} = center || {x: 0, y: 0};
    	return {
    		x: Math.cos(angle * Math.PI / 180.0) * dist + x,
    		y: Math.sin(angle * Math.PI / 180.0) * dist + y
    	}
    }

    function circle( radius, points ) {
    	let d = 'M';
    	for( let i = 0; i < points; i++) {
    		const angle = ((360 / points) * i);
    		const p = vec2_from_angle( angle, radius);
    		if (i > 0) d += 'L';
    		d += `${p.x} ${p.y} `;
    	}
    	d += 'Z';
    	return d
    }

    function polar_to_cartesian(centerX, centerY, radius, angleInDegrees) {
      var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

      return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
      };
    }

    function describe_arc(x, y, radius, startAngle, endAngle){

        var start = polar_to_cartesian(x, y, radius, endAngle);
        var end = polar_to_cartesian(x, y, radius, startAngle);

        var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        var d = [
            "M", start.x, start.y, 
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");

        return d;       
    }

    var util = { vec2_from_angle, circle, describe_arc, describe_arc };

    /* ../rad-and-cool-icons/lib/LightDark.svelte generated by Svelte v3.44.0 */

    const { console: console_1$2 } = globals;
    const file$b = "../rad-and-cool-icons/lib/LightDark.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[45] = list[i];
    	child_ctx[47] = i;
    	return child_ctx;
    }

    // (175:2) {#each new Array( amount ) as null_, idx }
    function create_each_block$4(ctx) {
    	let path;
    	let path_d_value;

    	let path_levels = [
    		{
    			d: path_d_value = /*ray_ds*/ ctx[4][/*idx*/ ctx[47]]
    		},
    		/*strokes*/ ctx[1]
    	];

    	let path_data = {};

    	for (let i = 0; i < path_levels.length; i += 1) {
    		path_data = assign(path_data, path_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			set_svg_attributes(path, path_data);
    			add_location(path, file$b, 175, 3, 3970);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: function update(ctx, dirty) {
    			set_svg_attributes(path, path_data = get_spread_update(path_levels, [
    				dirty[0] & /*ray_ds*/ 16 && path_d_value !== (path_d_value = /*ray_ds*/ ctx[4][/*idx*/ ctx[47]]) && { d: path_d_value },
    				dirty[0] & /*strokes*/ 2 && /*strokes*/ ctx[1]
    			]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(175:2) {#each new Array( amount ) as null_, idx }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let defs;
    	let mask0;
    	let rect;
    	let circle0;
    	let mask0_id_value;
    	let mask1;
    	let circle1;
    	let circle1_r_value;
    	let mask1_id_value;
    	let t;
    	let g3;
    	let g0;
    	let g2;
    	let g1;
    	let circle2;
    	let circle2_r_value;
    	let circle3;
    	let circle3_r_value;
    	let g1_mask_value;
    	let g2_mask_value;
    	let circle0_levels = [/*cresent*/ ctx[6], { fill: "black" }];
    	let circle0_data = {};

    	for (let i = 0; i < circle0_levels.length; i += 1) {
    		circle0_data = assign(circle0_data, circle0_levels[i]);
    	}

    	let circle1_levels = [
    		/*main*/ ctx[5],
    		{
    			r: circle1_r_value = /*main*/ ctx[5].r + /*stroke*/ ctx[0]
    		},
    		{ fill: "white" }
    	];

    	let circle1_data = {};

    	for (let i = 0; i < circle1_levels.length; i += 1) {
    		circle1_data = assign(circle1_data, circle1_levels[i]);
    	}

    	let each_value = new Array(/*amount*/ ctx[3]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	let g0_levels = [/*rotate*/ ctx[7]];
    	let g0_data = {};

    	for (let i = 0; i < g0_levels.length; i += 1) {
    		g0_data = assign(g0_data, g0_levels[i]);
    	}

    	let circle2_levels = [
    		/*main*/ ctx[5],
    		{
    			r: circle2_r_value = /*main*/ ctx[5].r + /*stroke*/ ctx[0] / 2
    		},
    		/*strokes*/ ctx[1]
    	];

    	let circle2_data = {};

    	for (let i = 0; i < circle2_levels.length; i += 1) {
    		circle2_data = assign(circle2_data, circle2_levels[i]);
    	}

    	let circle3_levels = [
    		/*cresent*/ ctx[6],
    		{
    			r: circle3_r_value = /*cresent*/ ctx[6].r + /*stroke*/ ctx[0] / 2
    		},
    		/*strokes*/ ctx[1]
    	];

    	let circle3_data = {};

    	for (let i = 0; i < circle3_levels.length; i += 1) {
    		circle3_data = assign(circle3_data, circle3_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			defs = svg_element("defs");
    			mask0 = svg_element("mask");
    			rect = svg_element("rect");
    			circle0 = svg_element("circle");
    			mask1 = svg_element("mask");
    			circle1 = svg_element("circle");
    			t = space();
    			g3 = svg_element("g");
    			g0 = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			g2 = svg_element("g");
    			g1 = svg_element("g");
    			circle2 = svg_element("circle");
    			circle3 = svg_element("circle");
    			attr_dev(rect, "width", "100%");
    			attr_dev(rect, "height", "100%");
    			attr_dev(rect, "fill", "white");
    			add_location(rect, file$b, 165, 2, 3691);
    			set_svg_attributes(circle0, circle0_data);
    			add_location(circle0, file$b, 166, 2, 3741);
    			attr_dev(mask0, "id", mask0_id_value = "inner-mask-" + /*id*/ ctx[2]);
    			add_location(mask0, file$b, 164, 1, 3661);
    			set_svg_attributes(circle1, circle1_data);
    			add_location(circle1, file$b, 169, 2, 3818);
    			attr_dev(mask1, "id", mask1_id_value = "outer-mask-" + /*id*/ ctx[2]);
    			add_location(mask1, file$b, 168, 1, 3788);
    			add_location(defs, file$b, 163, 0, 3653);
    			set_svg_attributes(g0, g0_data);
    			add_location(g0, file$b, 173, 1, 3906);
    			set_svg_attributes(circle2, circle2_data);
    			add_location(circle2, file$b, 180, 3, 4097);
    			set_svg_attributes(circle3, circle3_data);
    			add_location(circle3, file$b, 181, 3, 4161);
    			attr_dev(g1, "mask", g1_mask_value = "url(#inner-mask-" + /*id*/ ctx[2] + ")");
    			add_location(g1, file$b, 179, 2, 4060);
    			attr_dev(g2, "mask", g2_mask_value = "url(#outer-mask-" + /*id*/ ctx[2] + ")");
    			add_location(g2, file$b, 178, 1, 4025);
    			attr_dev(g3, "class", "icon");
    			add_location(g3, file$b, 172, 0, 3888);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, defs, anchor);
    			append_dev(defs, mask0);
    			append_dev(mask0, rect);
    			append_dev(mask0, circle0);
    			append_dev(defs, mask1);
    			append_dev(mask1, circle1);
    			insert_dev(target, t, anchor);
    			insert_dev(target, g3, anchor);
    			append_dev(g3, g0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g0, null);
    			}

    			append_dev(g3, g2);
    			append_dev(g2, g1);
    			append_dev(g1, circle2);
    			append_dev(g1, circle3);
    		},
    		p: function update(ctx, dirty) {
    			set_svg_attributes(circle0, circle0_data = get_spread_update(circle0_levels, [dirty[0] & /*cresent*/ 64 && /*cresent*/ ctx[6], { fill: "black" }]));

    			if (dirty[0] & /*id*/ 4 && mask0_id_value !== (mask0_id_value = "inner-mask-" + /*id*/ ctx[2])) {
    				attr_dev(mask0, "id", mask0_id_value);
    			}

    			set_svg_attributes(circle1, circle1_data = get_spread_update(circle1_levels, [
    				dirty[0] & /*main*/ 32 && /*main*/ ctx[5],
    				dirty[0] & /*main, stroke*/ 33 && circle1_r_value !== (circle1_r_value = /*main*/ ctx[5].r + /*stroke*/ ctx[0]) && { r: circle1_r_value },
    				{ fill: "white" }
    			]));

    			if (dirty[0] & /*id*/ 4 && mask1_id_value !== (mask1_id_value = "outer-mask-" + /*id*/ ctx[2])) {
    				attr_dev(mask1, "id", mask1_id_value);
    			}

    			if (dirty[0] & /*ray_ds, strokes, amount*/ 26) {
    				each_value = new Array(/*amount*/ ctx[3]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			set_svg_attributes(g0, g0_data = get_spread_update(g0_levels, [dirty[0] & /*rotate*/ 128 && /*rotate*/ ctx[7]]));

    			set_svg_attributes(circle2, circle2_data = get_spread_update(circle2_levels, [
    				dirty[0] & /*main*/ 32 && /*main*/ ctx[5],
    				dirty[0] & /*main, stroke*/ 33 && circle2_r_value !== (circle2_r_value = /*main*/ ctx[5].r + /*stroke*/ ctx[0] / 2) && { r: circle2_r_value },
    				dirty[0] & /*strokes*/ 2 && /*strokes*/ ctx[1]
    			]));

    			set_svg_attributes(circle3, circle3_data = get_spread_update(circle3_levels, [
    				dirty[0] & /*cresent*/ 64 && /*cresent*/ ctx[6],
    				dirty[0] & /*cresent, stroke*/ 65 && circle3_r_value !== (circle3_r_value = /*cresent*/ ctx[6].r + /*stroke*/ ctx[0] / 2) && { r: circle3_r_value },
    				dirty[0] & /*strokes*/ 2 && /*strokes*/ ctx[1]
    			]));

    			if (dirty[0] & /*id*/ 4 && g1_mask_value !== (g1_mask_value = "url(#inner-mask-" + /*id*/ ctx[2] + ")")) {
    				attr_dev(g1, "mask", g1_mask_value);
    			}

    			if (dirty[0] & /*id*/ 4 && g2_mask_value !== (g2_mask_value = "url(#outer-mask-" + /*id*/ ctx[2] + ")")) {
    				attr_dev(g2, "mask", g2_mask_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(defs);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(g3);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let rotate;
    	let cresent;
    	let main;
    	let $motion_rays;
    	let $motion_shrink;
    	let $motion_r;
    	let $motion_y;
    	let $motion_x;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LightDark', slots, []);
    	let { class: class_ = "" } = $$props;
    	let { style: style_ = "" } = $$props;
    	let { width = 200 } = $$props;
    	let { height = 200 } = $$props;
    	let { stroke = 2 } = $$props;
    	let { duration = 1000 } = $$props;
    	let { hover = false } = $$props;
    	let { strokes = {} } = $$props;
    	let { easing = e => e } = $$props;
    	let { browser = false } = $$props;
    	let { center = { x: 100, y: 100 } } = $$props;
    	let { origin } = $$props;
    	let { state = false } = $$props;
    	let { id } = $$props;
    	let { storage = true } = $$props;
    	let { amount = 10 } = $$props;
    	let { rays = 0.2 } = $$props;
    	let { space = 0.1 } = $$props;
    	let { offset = { x: 0.6, y: 0.4, r: 0.85 } } = $$props;
    	let { end = { x: 1, y: 0, r: 0.5 } } = $$props;
    	let { spin = 1 } = $$props;
    	const sys = e => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches || false;
    	const darkKey = browser ? window.location.host + '-darkmode' : undefined;

    	function initDark() {
    		if (!storage) return false;
    		let out;

    		try {
    			out = browser
    			? eval(window.localStorage.getItem(darkKey))
    			: undefined;
    		} catch(err) {
    			
    		}

    		if (browser && out != true && out != false) out = sys();

    		if (browser) {
    			const link = document.querySelector('link#favicon');
    			link.href = `/favicon-${sys() ? 'dark' : 'light'}.ico`;
    		}

    		console.log(`🌖🌞  loading dark mode: ${out}`);
    		return out;
    	}

    	let inited = false;

    	if (browser) {
    		state = initDark();
    	}

    	onMount(async e => {
    		inited = true;
    	});

    	let updating = false;

    	function onDarkChange(state_) {
    		if (browser && storage) {
    			if (inited) {
    				if (sys() === state) {
    					console.log(`🌖🌞  clearing localStorage to system default: ${state}`);
    					window.localStorage.removeItem(darkKey);
    				} else {
    					console.log(`🌖🌞  overriding dark mode with localStorage: ${state}`);
    					window.localStorage.setItem(darkKey, state);
    				}
    			}

    			if (!updating) $$invalidate(13, state = state_);
    		}
    	}

    	function clearDark() {
    		if (browser && storage) window.localStorage.removeItem(darkKey);
    	}

    	function onStateChange(state_) {
    		updating = true;
    		updating = false;
    	}

    	let motion_x = tweened(offset.x, { duration, easing });
    	validate_store(motion_x, 'motion_x');
    	component_subscribe($$self, motion_x, value => $$invalidate(34, $motion_x = value));
    	let motion_y = tweened(offset.y, { duration, easing });
    	validate_store(motion_y, 'motion_y');
    	component_subscribe($$self, motion_y, value => $$invalidate(33, $motion_y = value));
    	let motion_r = tweened(offset.r, { duration, easing });
    	validate_store(motion_r, 'motion_r');
    	component_subscribe($$self, motion_r, value => $$invalidate(32, $motion_r = value));
    	let motion_shrink = tweened(1, { duration, easing });
    	validate_store(motion_shrink, 'motion_shrink');
    	component_subscribe($$self, motion_shrink, value => $$invalidate(31, $motion_shrink = value));
    	let motion_rays = tweened(0, { duration, easing });
    	validate_store(motion_rays, 'motion_rays');
    	component_subscribe($$self, motion_rays, value => $$invalidate(30, $motion_rays = value));

    	function update(state_) {
    		if (state) {
    			motion_x.set(offset.x);
    			motion_y.set(offset.y);
    			motion_r.set(offset.r);
    			motion_shrink.set(1);
    			motion_rays.set(0);
    		} else {
    			motion_x.set(end.x);
    			motion_y.set(end.y);
    			motion_r.set(end.r);
    			motion_shrink.set(1 - space - rays);
    			motion_rays.set(1);
    		}
    	}

    	let ray_ds = [];

    	function gen(rays_, amount_, motion_) {
    		let neu = [];

    		for (let i = 0; i < amount_; i++) {
    			const angle = 360 / amount_ * i;
    			const r = Math.min(width, height) / 2;
    			const anim = 1 - rays * motion_;
    			const a = util.vec2_from_angle(angle, anim * r, center);
    			const b = util.vec2_from_angle(angle, 1 * r, center);
    			const d = `M${a.x} ${a.y} L${b.x} ${b.y}`;
    			neu.push(d);
    		}

    		$$invalidate(4, ray_ds = neu);
    	}

    	const writable_props = [
    		'class',
    		'style',
    		'width',
    		'height',
    		'stroke',
    		'duration',
    		'hover',
    		'strokes',
    		'easing',
    		'browser',
    		'center',
    		'origin',
    		'state',
    		'id',
    		'storage',
    		'amount',
    		'rays',
    		'space',
    		'offset',
    		'end',
    		'spin'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<LightDark> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(14, class_ = $$props.class);
    		if ('style' in $$props) $$invalidate(15, style_ = $$props.style);
    		if ('width' in $$props) $$invalidate(16, width = $$props.width);
    		if ('height' in $$props) $$invalidate(17, height = $$props.height);
    		if ('stroke' in $$props) $$invalidate(0, stroke = $$props.stroke);
    		if ('duration' in $$props) $$invalidate(18, duration = $$props.duration);
    		if ('hover' in $$props) $$invalidate(19, hover = $$props.hover);
    		if ('strokes' in $$props) $$invalidate(1, strokes = $$props.strokes);
    		if ('easing' in $$props) $$invalidate(20, easing = $$props.easing);
    		if ('browser' in $$props) $$invalidate(21, browser = $$props.browser);
    		if ('center' in $$props) $$invalidate(22, center = $$props.center);
    		if ('origin' in $$props) $$invalidate(23, origin = $$props.origin);
    		if ('state' in $$props) $$invalidate(13, state = $$props.state);
    		if ('id' in $$props) $$invalidate(2, id = $$props.id);
    		if ('storage' in $$props) $$invalidate(24, storage = $$props.storage);
    		if ('amount' in $$props) $$invalidate(3, amount = $$props.amount);
    		if ('rays' in $$props) $$invalidate(25, rays = $$props.rays);
    		if ('space' in $$props) $$invalidate(26, space = $$props.space);
    		if ('offset' in $$props) $$invalidate(27, offset = $$props.offset);
    		if ('end' in $$props) $$invalidate(28, end = $$props.end);
    		if ('spin' in $$props) $$invalidate(29, spin = $$props.spin);
    	};

    	$$self.$capture_state = () => ({
    		util,
    		tweened,
    		onMount,
    		class_,
    		style_,
    		width,
    		height,
    		stroke,
    		duration,
    		hover,
    		strokes,
    		easing,
    		browser,
    		center,
    		origin,
    		state,
    		id,
    		storage,
    		amount,
    		rays,
    		space,
    		offset,
    		end,
    		spin,
    		sys,
    		darkKey,
    		initDark,
    		inited,
    		updating,
    		onDarkChange,
    		clearDark,
    		onStateChange,
    		motion_x,
    		motion_y,
    		motion_r,
    		motion_shrink,
    		motion_rays,
    		update,
    		ray_ds,
    		gen,
    		main,
    		cresent,
    		rotate,
    		$motion_rays,
    		$motion_shrink,
    		$motion_r,
    		$motion_y,
    		$motion_x
    	});

    	$$self.$inject_state = $$props => {
    		if ('class_' in $$props) $$invalidate(14, class_ = $$props.class_);
    		if ('style_' in $$props) $$invalidate(15, style_ = $$props.style_);
    		if ('width' in $$props) $$invalidate(16, width = $$props.width);
    		if ('height' in $$props) $$invalidate(17, height = $$props.height);
    		if ('stroke' in $$props) $$invalidate(0, stroke = $$props.stroke);
    		if ('duration' in $$props) $$invalidate(18, duration = $$props.duration);
    		if ('hover' in $$props) $$invalidate(19, hover = $$props.hover);
    		if ('strokes' in $$props) $$invalidate(1, strokes = $$props.strokes);
    		if ('easing' in $$props) $$invalidate(20, easing = $$props.easing);
    		if ('browser' in $$props) $$invalidate(21, browser = $$props.browser);
    		if ('center' in $$props) $$invalidate(22, center = $$props.center);
    		if ('origin' in $$props) $$invalidate(23, origin = $$props.origin);
    		if ('state' in $$props) $$invalidate(13, state = $$props.state);
    		if ('id' in $$props) $$invalidate(2, id = $$props.id);
    		if ('storage' in $$props) $$invalidate(24, storage = $$props.storage);
    		if ('amount' in $$props) $$invalidate(3, amount = $$props.amount);
    		if ('rays' in $$props) $$invalidate(25, rays = $$props.rays);
    		if ('space' in $$props) $$invalidate(26, space = $$props.space);
    		if ('offset' in $$props) $$invalidate(27, offset = $$props.offset);
    		if ('end' in $$props) $$invalidate(28, end = $$props.end);
    		if ('spin' in $$props) $$invalidate(29, spin = $$props.spin);
    		if ('inited' in $$props) inited = $$props.inited;
    		if ('updating' in $$props) updating = $$props.updating;
    		if ('motion_x' in $$props) $$invalidate(8, motion_x = $$props.motion_x);
    		if ('motion_y' in $$props) $$invalidate(9, motion_y = $$props.motion_y);
    		if ('motion_r' in $$props) $$invalidate(10, motion_r = $$props.motion_r);
    		if ('motion_shrink' in $$props) $$invalidate(11, motion_shrink = $$props.motion_shrink);
    		if ('motion_rays' in $$props) $$invalidate(12, motion_rays = $$props.motion_rays);
    		if ('ray_ds' in $$props) $$invalidate(4, ray_ds = $$props.ray_ds);
    		if ('main' in $$props) $$invalidate(5, main = $$props.main);
    		if ('cresent' in $$props) $$invalidate(6, cresent = $$props.cresent);
    		if ('rotate' in $$props) $$invalidate(7, rotate = $$props.rotate);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*state*/ 8192) {
    			onDarkChange(state);
    		}

    		if ($$self.$$.dirty[0] & /*state*/ 8192) {
    			onStateChange();
    		}

    		if ($$self.$$.dirty[0] & /*state*/ 8192) {
    			update();
    		}

    		if ($$self.$$.dirty[0] & /*origin, $motion_rays, amount, spin*/ 1619001352) {
    			$$invalidate(7, rotate = {
    				style: `${origin}; transform: rotateZ(${$motion_rays * (360 / amount * spin)}deg);`
    			});
    		}

    		if ($$self.$$.dirty[0] & /*width, height, stroke*/ 196609 | $$self.$$.dirty[1] & /*$motion_x, $motion_y, $motion_r*/ 14) {
    			$$invalidate(6, cresent = {
    				cx: $motion_x * width,
    				cy: $motion_y * height,
    				r: Math.min(width, height) / 2 * $motion_r - stroke
    			});
    		}

    		if ($$self.$$.dirty[0] & /*width, height, stroke*/ 196609 | $$self.$$.dirty[1] & /*$motion_shrink*/ 1) {
    			$$invalidate(5, main = {
    				cx: width / 2,
    				cy: height / 2,
    				r: Math.min(width, height) / 2 * $motion_shrink - stroke
    			});
    		}

    		if ($$self.$$.dirty[0] & /*rays, amount, $motion_rays*/ 1107296264) {
    			gen(rays, amount, $motion_rays);
    		}
    	};

    	return [
    		stroke,
    		strokes,
    		id,
    		amount,
    		ray_ds,
    		main,
    		cresent,
    		rotate,
    		motion_x,
    		motion_y,
    		motion_r,
    		motion_shrink,
    		motion_rays,
    		state,
    		class_,
    		style_,
    		width,
    		height,
    		duration,
    		hover,
    		easing,
    		browser,
    		center,
    		origin,
    		storage,
    		rays,
    		space,
    		offset,
    		end,
    		spin,
    		$motion_rays,
    		$motion_shrink,
    		$motion_r,
    		$motion_y,
    		$motion_x
    	];
    }

    class LightDark extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$b,
    			create_fragment$b,
    			safe_not_equal,
    			{
    				class: 14,
    				style: 15,
    				width: 16,
    				height: 17,
    				stroke: 0,
    				duration: 18,
    				hover: 19,
    				strokes: 1,
    				easing: 20,
    				browser: 21,
    				center: 22,
    				origin: 23,
    				state: 13,
    				id: 2,
    				storage: 24,
    				amount: 3,
    				rays: 25,
    				space: 26,
    				offset: 27,
    				end: 28,
    				spin: 29
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LightDark",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*origin*/ ctx[23] === undefined && !('origin' in props)) {
    			console_1$2.warn("<LightDark> was created without expected prop 'origin'");
    		}

    		if (/*id*/ ctx[2] === undefined && !('id' in props)) {
    			console_1$2.warn("<LightDark> was created without expected prop 'id'");
    		}
    	}

    	get class() {
    		throw new Error("<LightDark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<LightDark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<LightDark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<LightDark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<LightDark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<LightDark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<LightDark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<LightDark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<LightDark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<LightDark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<LightDark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<LightDark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hover() {
    		throw new Error("<LightDark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hover(value) {
    		throw new Error("<LightDark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get strokes() {
    		throw new Error("<LightDark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strokes(value) {
    		throw new Error("<LightDark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get easing() {
    		throw new Error("<LightDark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set easing(value) {
    		throw new Error("<LightDark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get browser() {
    		throw new Error("<LightDark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set browser(value) {
    		throw new Error("<LightDark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get center() {
    		throw new Error("<LightDark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set center(value) {
    		throw new Error("<LightDark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get origin() {
    		throw new Error("<LightDark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set origin(value) {
    		throw new Error("<LightDark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<LightDark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<LightDark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<LightDark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<LightDark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get storage() {
    		throw new Error("<LightDark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set storage(value) {
    		throw new Error("<LightDark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get amount() {
    		throw new Error("<LightDark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set amount(value) {
    		throw new Error("<LightDark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rays() {
    		throw new Error("<LightDark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rays(value) {
    		throw new Error("<LightDark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get space() {
    		throw new Error("<LightDark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set space(value) {
    		throw new Error("<LightDark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get offset() {
    		throw new Error("<LightDark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offset(value) {
    		throw new Error("<LightDark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get end() {
    		throw new Error("<LightDark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set end(value) {
    		throw new Error("<LightDark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spin() {
    		throw new Error("<LightDark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spin(value) {
    		throw new Error("<LightDark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* ../rad-and-cool-icons/lib/Burger.svelte generated by Svelte v3.44.0 */
    const file$a = "../rad-and-cool-icons/lib/Burger.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	child_ctx[24] = i;
    	return child_ctx;
    }

    // (63:1) {#each (new Array(3)) as n, i}
    function create_each_block$3(ctx) {
    	let path;
    	let path_d_value;

    	let path_levels = [
    		{
    			d: path_d_value = "M0 " + /*position*/ ctx[6](/*i*/ ctx[24]) + " L" + /*width*/ ctx[0] + " " + /*position*/ ctx[6](/*i*/ ctx[24])
    		},
    		/*strokes*/ ctx[1]
    	];

    	let path_data = {};

    	for (let i = 0; i < path_levels.length; i += 1) {
    		path_data = assign(path_data, path_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			set_svg_attributes(path, path_data);
    			add_location(path, file$a, 63, 2, 1331);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: function update(ctx, dirty) {
    			set_svg_attributes(path, path_data = get_spread_update(path_levels, [
    				dirty & /*width*/ 1 && path_d_value !== (path_d_value = "M0 " + /*position*/ ctx[6](/*i*/ ctx[24]) + " L" + /*width*/ ctx[0] + " " + /*position*/ ctx[6](/*i*/ ctx[24])) && { d: path_d_value },
    				dirty & /*strokes*/ 2 && /*strokes*/ ctx[1]
    			]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(63:1) {#each (new Array(3)) as n, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let defs;
    	let mask_1;
    	let rect;
    	let circle0;
    	let t0;
    	let circle1;
    	let t1;
    	let g;
    	let circle0_levels = [/*mask*/ ctx[5], { fill: "white" }];
    	let circle0_data = {};

    	for (let i = 0; i < circle0_levels.length; i += 1) {
    		circle0_data = assign(circle0_data, circle0_levels[i]);
    	}

    	let circle1_levels = [/*circle*/ ctx[4], /*strokes*/ ctx[1]];
    	let circle1_data = {};

    	for (let i = 0; i < circle1_levels.length; i += 1) {
    		circle1_data = assign(circle1_data, circle1_levels[i]);
    	}

    	let each_value = new Array(3);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	let g_levels = [
    		{ mask: "url(#burger-mask-mask)" },
    		/*transform*/ ctx[3],
    		{ style: /*origin*/ ctx[2] }
    	];

    	let g_data = {};

    	for (let i = 0; i < g_levels.length; i += 1) {
    		g_data = assign(g_data, g_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			defs = svg_element("defs");
    			mask_1 = svg_element("mask");
    			rect = svg_element("rect");
    			circle0 = svg_element("circle");
    			t0 = space();
    			circle1 = svg_element("circle");
    			t1 = space();
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(rect, "width", "100%");
    			attr_dev(rect, "height", "100%");
    			attr_dev(rect, "fill", "black");
    			add_location(rect, file$a, 56, 2, 1095);
    			set_svg_attributes(circle0, circle0_data);
    			add_location(circle0, file$a, 57, 2, 1145);
    			attr_dev(mask_1, "id", "burger-mask-mask");
    			add_location(mask_1, file$a, 55, 1, 1064);
    			add_location(defs, file$a, 54, 0, 1056);
    			set_svg_attributes(circle1, circle1_data);
    			add_location(circle1, file$a, 60, 0, 1196);
    			set_svg_attributes(g, g_data);
    			add_location(g, file$a, 61, 0, 1233);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, defs, anchor);
    			append_dev(defs, mask_1);
    			append_dev(mask_1, rect);
    			append_dev(mask_1, circle0);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, circle1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			set_svg_attributes(circle0, circle0_data = get_spread_update(circle0_levels, [dirty & /*mask*/ 32 && /*mask*/ ctx[5], { fill: "white" }]));

    			set_svg_attributes(circle1, circle1_data = get_spread_update(circle1_levels, [
    				dirty & /*circle*/ 16 && /*circle*/ ctx[4],
    				dirty & /*strokes*/ 2 && /*strokes*/ ctx[1]
    			]));

    			if (dirty & /*position, width, strokes*/ 67) {
    				each_value = new Array(3);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			set_svg_attributes(g, g_data = get_spread_update(g_levels, [
    				{ mask: "url(#burger-mask-mask)" },
    				dirty & /*transform*/ 8 && /*transform*/ ctx[3],
    				dirty & /*origin*/ 4 && { style: /*origin*/ ctx[2] }
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(defs);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(circle1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let mask;
    	let circle;
    	let transform;
    	let $anim;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Burger', slots, []);
    	let { class: class_ = "" } = $$props;
    	let { style: style_ = "" } = $$props;
    	let { width = 200 } = $$props;
    	let { height = 200 } = $$props;
    	let { stroke = 2 } = $$props;
    	let { duration = 1000 } = $$props;
    	let { hover = false } = $$props;
    	let { strokes = {} } = $$props;
    	let { easing = e => e } = $$props;
    	let { browser = false } = $$props;
    	let { center = { x: 100, y: 100 } } = $$props;
    	let { space = 0.7 } = $$props;
    	let { origin } = $$props;
    	let { state = false } = $$props; // observation
    	const tween = init => tweened(init, { duration, easing });
    	const position = i => parseInt(height / 4 * i + height / 4) - 0.5;
    	let anim = tween(1);
    	validate_store(anim, 'anim');
    	component_subscribe($$self, anim, value => $$invalidate(19, $anim = value));

    	function animate(state_) {
    		anim.set(state_ ? 0 : 1);
    	}

    	const writable_props = [
    		'class',
    		'style',
    		'width',
    		'height',
    		'stroke',
    		'duration',
    		'hover',
    		'strokes',
    		'easing',
    		'browser',
    		'center',
    		'space',
    		'origin',
    		'state'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Burger> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(8, class_ = $$props.class);
    		if ('style' in $$props) $$invalidate(9, style_ = $$props.style);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(10, height = $$props.height);
    		if ('stroke' in $$props) $$invalidate(11, stroke = $$props.stroke);
    		if ('duration' in $$props) $$invalidate(12, duration = $$props.duration);
    		if ('hover' in $$props) $$invalidate(13, hover = $$props.hover);
    		if ('strokes' in $$props) $$invalidate(1, strokes = $$props.strokes);
    		if ('easing' in $$props) $$invalidate(14, easing = $$props.easing);
    		if ('browser' in $$props) $$invalidate(15, browser = $$props.browser);
    		if ('center' in $$props) $$invalidate(16, center = $$props.center);
    		if ('space' in $$props) $$invalidate(17, space = $$props.space);
    		if ('origin' in $$props) $$invalidate(2, origin = $$props.origin);
    		if ('state' in $$props) $$invalidate(18, state = $$props.state);
    	};

    	$$self.$capture_state = () => ({
    		util,
    		tweened,
    		onMount,
    		class_,
    		style_,
    		width,
    		height,
    		stroke,
    		duration,
    		hover,
    		strokes,
    		easing,
    		browser,
    		center,
    		space,
    		origin,
    		state,
    		tween,
    		position,
    		anim,
    		animate,
    		transform,
    		circle,
    		mask,
    		$anim
    	});

    	$$self.$inject_state = $$props => {
    		if ('class_' in $$props) $$invalidate(8, class_ = $$props.class_);
    		if ('style_' in $$props) $$invalidate(9, style_ = $$props.style_);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(10, height = $$props.height);
    		if ('stroke' in $$props) $$invalidate(11, stroke = $$props.stroke);
    		if ('duration' in $$props) $$invalidate(12, duration = $$props.duration);
    		if ('hover' in $$props) $$invalidate(13, hover = $$props.hover);
    		if ('strokes' in $$props) $$invalidate(1, strokes = $$props.strokes);
    		if ('easing' in $$props) $$invalidate(14, easing = $$props.easing);
    		if ('browser' in $$props) $$invalidate(15, browser = $$props.browser);
    		if ('center' in $$props) $$invalidate(16, center = $$props.center);
    		if ('space' in $$props) $$invalidate(17, space = $$props.space);
    		if ('origin' in $$props) $$invalidate(2, origin = $$props.origin);
    		if ('state' in $$props) $$invalidate(18, state = $$props.state);
    		if ('anim' in $$props) $$invalidate(7, anim = $$props.anim);
    		if ('transform' in $$props) $$invalidate(3, transform = $$props.transform);
    		if ('circle' in $$props) $$invalidate(4, circle = $$props.circle);
    		if ('mask' in $$props) $$invalidate(5, mask = $$props.mask);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*width, height, space*/ 132097) {
    			$$invalidate(5, mask = {
    				cx: width / 2,
    				cy: height / 2,
    				r: Math.min(width, height) / 2 * space
    			});
    		}

    		if ($$self.$$.dirty & /*width, height, stroke*/ 3073) {
    			$$invalidate(4, circle = {
    				cx: width / 2,
    				cy: height / 2,
    				r: Math.min(width, height) / 2 - stroke
    			});
    		}

    		if ($$self.$$.dirty & /*$anim*/ 524288) {
    			$$invalidate(3, transform = { transform: `scale( ${$anim} 1 )` });
    		}

    		if ($$self.$$.dirty & /*state*/ 262144) {
    			animate(state);
    		}
    	};

    	return [
    		width,
    		strokes,
    		origin,
    		transform,
    		circle,
    		mask,
    		position,
    		anim,
    		class_,
    		style_,
    		height,
    		stroke,
    		duration,
    		hover,
    		easing,
    		browser,
    		center,
    		space,
    		state,
    		$anim
    	];
    }

    class Burger extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			class: 8,
    			style: 9,
    			width: 0,
    			height: 10,
    			stroke: 11,
    			duration: 12,
    			hover: 13,
    			strokes: 1,
    			easing: 14,
    			browser: 15,
    			center: 16,
    			space: 17,
    			origin: 2,
    			state: 18
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Burger",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*origin*/ ctx[2] === undefined && !('origin' in props)) {
    			console.warn("<Burger> was created without expected prop 'origin'");
    		}
    	}

    	get class() {
    		throw new Error("<Burger>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Burger>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Burger>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Burger>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Burger>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Burger>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Burger>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Burger>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<Burger>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<Burger>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Burger>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Burger>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hover() {
    		throw new Error("<Burger>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hover(value) {
    		throw new Error("<Burger>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get strokes() {
    		throw new Error("<Burger>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strokes(value) {
    		throw new Error("<Burger>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get easing() {
    		throw new Error("<Burger>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set easing(value) {
    		throw new Error("<Burger>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get browser() {
    		throw new Error("<Burger>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set browser(value) {
    		throw new Error("<Burger>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get center() {
    		throw new Error("<Burger>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set center(value) {
    		throw new Error("<Burger>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get space() {
    		throw new Error("<Burger>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set space(value) {
    		throw new Error("<Burger>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get origin() {
    		throw new Error("<Burger>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set origin(value) {
    		throw new Error("<Burger>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Burger>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Burger>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* ../rad-and-cool-icons/lib/Mail.svelte generated by Svelte v3.44.0 */
    const file$9 = "../rad-and-cool-icons/lib/Mail.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	return child_ctx;
    }

    // (80:1) {#each paths as path}
    function create_each_block$2(ctx) {
    	let path;
    	let path_d_value;
    	let path_levels = [{ d: path_d_value = /*path*/ ctx[22] }, /*strokes*/ ctx[0]];
    	let path_data = {};

    	for (let i = 0; i < path_levels.length; i += 1) {
    		path_data = assign(path_data, path_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			set_svg_attributes(path, path_data);
    			add_location(path, file$9, 80, 2, 1617);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: function update(ctx, dirty) {
    			set_svg_attributes(path, path_data = get_spread_update(path_levels, [
    				dirty & /*paths*/ 4 && path_d_value !== (path_d_value = /*path*/ ctx[22]) && { d: path_d_value },
    				dirty & /*strokes*/ 1 && /*strokes*/ ctx[0]
    			]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(80:1) {#each paths as path}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let defs;
    	let mask_1;
    	let rect0;
    	let rect1;
    	let t;
    	let g;
    	let rect2;
    	let rect1_levels = [/*mask*/ ctx[3], { fill: "white" }];
    	let rect1_data = {};

    	for (let i = 0; i < rect1_levels.length; i += 1) {
    		rect1_data = assign(rect1_data, rect1_levels[i]);
    	}

    	let rect2_levels = [/*rect*/ ctx[1], /*strokes*/ ctx[0]];
    	let rect2_data = {};

    	for (let i = 0; i < rect2_levels.length; i += 1) {
    		rect2_data = assign(rect2_data, rect2_levels[i]);
    	}

    	let each_value = /*paths*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			defs = svg_element("defs");
    			mask_1 = svg_element("mask");
    			rect0 = svg_element("rect");
    			rect1 = svg_element("rect");
    			t = space();
    			g = svg_element("g");
    			rect2 = svg_element("rect");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(rect0, "width", "100%");
    			attr_dev(rect0, "height", "100%");
    			attr_dev(rect0, "fill", "black");
    			add_location(rect0, file$9, 73, 2, 1432);
    			set_svg_attributes(rect1, rect1_data);
    			add_location(rect1, file$9, 74, 2, 1482);
    			attr_dev(mask_1, "id", "mail-mask");
    			add_location(mask_1, file$9, 72, 1, 1408);
    			add_location(defs, file$9, 71, 0, 1400);
    			set_svg_attributes(rect2, rect2_data);
    			add_location(rect2, file$9, 78, 1, 1560);
    			attr_dev(g, "mask", "url(#mail-mask)");
    			add_location(g, file$9, 77, 0, 1531);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, defs, anchor);
    			append_dev(defs, mask_1);
    			append_dev(mask_1, rect0);
    			append_dev(mask_1, rect1);
    			insert_dev(target, t, anchor);
    			insert_dev(target, g, anchor);
    			append_dev(g, rect2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			set_svg_attributes(rect1, rect1_data = get_spread_update(rect1_levels, [dirty & /*mask*/ 8 && /*mask*/ ctx[3], { fill: "white" }]));

    			set_svg_attributes(rect2, rect2_data = get_spread_update(rect2_levels, [
    				dirty & /*rect*/ 2 && /*rect*/ ctx[1],
    				dirty & /*strokes*/ 1 && /*strokes*/ ctx[0]
    			]));

    			if (dirty & /*paths, strokes*/ 5) {
    				each_value = /*paths*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(defs);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let rect;
    	let mask;
    	let paths;
    	let transform;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Mail', slots, []);
    	let { class: class_ = "" } = $$props;
    	let { style: style_ = "" } = $$props;
    	let { width = 200 } = $$props;
    	let { height = 200 } = $$props;
    	let { stroke = 2 } = $$props;
    	let { duration = 1000 } = $$props;
    	let { hover = false } = $$props;
    	let { strokes = {} } = $$props;
    	let { easing = e => e } = $$props;
    	let { browser = false } = $$props;
    	let { center = { x: 100, y: 100 } } = $$props;
    	let { space = 0.7 } = $$props;
    	let { origin = {} } = $$props;
    	let { state = false } = $$props; // observation
    	const tween = init => tweened(init, { duration, easing });
    	const position = i => height / 4 * i + height / 4;
    	let anim = tween(1);

    	function animate(state_) {
    		anim.set(state_ ? 0 : 1);
    	}

    	const writable_props = [
    		'class',
    		'style',
    		'width',
    		'height',
    		'stroke',
    		'duration',
    		'hover',
    		'strokes',
    		'easing',
    		'browser',
    		'center',
    		'space',
    		'origin',
    		'state'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Mail> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(4, class_ = $$props.class);
    		if ('style' in $$props) $$invalidate(5, style_ = $$props.style);
    		if ('width' in $$props) $$invalidate(6, width = $$props.width);
    		if ('height' in $$props) $$invalidate(7, height = $$props.height);
    		if ('stroke' in $$props) $$invalidate(8, stroke = $$props.stroke);
    		if ('duration' in $$props) $$invalidate(9, duration = $$props.duration);
    		if ('hover' in $$props) $$invalidate(10, hover = $$props.hover);
    		if ('strokes' in $$props) $$invalidate(0, strokes = $$props.strokes);
    		if ('easing' in $$props) $$invalidate(11, easing = $$props.easing);
    		if ('browser' in $$props) $$invalidate(12, browser = $$props.browser);
    		if ('center' in $$props) $$invalidate(13, center = $$props.center);
    		if ('space' in $$props) $$invalidate(14, space = $$props.space);
    		if ('origin' in $$props) $$invalidate(15, origin = $$props.origin);
    		if ('state' in $$props) $$invalidate(16, state = $$props.state);
    	};

    	$$self.$capture_state = () => ({
    		util,
    		tweened,
    		onMount,
    		class_,
    		style_,
    		width,
    		height,
    		stroke,
    		duration,
    		hover,
    		strokes,
    		easing,
    		browser,
    		center,
    		space,
    		origin,
    		state,
    		tween,
    		position,
    		anim,
    		animate,
    		transform,
    		paths,
    		rect,
    		mask
    	});

    	$$self.$inject_state = $$props => {
    		if ('class_' in $$props) $$invalidate(4, class_ = $$props.class_);
    		if ('style_' in $$props) $$invalidate(5, style_ = $$props.style_);
    		if ('width' in $$props) $$invalidate(6, width = $$props.width);
    		if ('height' in $$props) $$invalidate(7, height = $$props.height);
    		if ('stroke' in $$props) $$invalidate(8, stroke = $$props.stroke);
    		if ('duration' in $$props) $$invalidate(9, duration = $$props.duration);
    		if ('hover' in $$props) $$invalidate(10, hover = $$props.hover);
    		if ('strokes' in $$props) $$invalidate(0, strokes = $$props.strokes);
    		if ('easing' in $$props) $$invalidate(11, easing = $$props.easing);
    		if ('browser' in $$props) $$invalidate(12, browser = $$props.browser);
    		if ('center' in $$props) $$invalidate(13, center = $$props.center);
    		if ('space' in $$props) $$invalidate(14, space = $$props.space);
    		if ('origin' in $$props) $$invalidate(15, origin = $$props.origin);
    		if ('state' in $$props) $$invalidate(16, state = $$props.state);
    		if ('anim' in $$props) anim = $$props.anim;
    		if ('transform' in $$props) transform = $$props.transform;
    		if ('paths' in $$props) $$invalidate(2, paths = $$props.paths);
    		if ('rect' in $$props) $$invalidate(1, rect = $$props.rect);
    		if ('mask' in $$props) $$invalidate(3, mask = $$props.mask);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*state*/ 65536) {
    			animate(state);
    		}

    		if ($$self.$$.dirty & /*width, stroke, height*/ 448) {
    			$$invalidate(1, rect = {
    				width: width - stroke * 2,
    				height: height * 0.8 - stroke * 2,
    				x: stroke,
    				y: stroke
    			});
    		}

    		if ($$self.$$.dirty & /*rect, stroke*/ 258) {
    			$$invalidate(3, mask = {
    				width: rect.width + stroke,
    				height: rect.height + stroke,
    				x: rect.x - stroke * 0.5,
    				y: rect.y - stroke * 0.5
    			});
    		}

    		if ($$self.$$.dirty & /*width, height*/ 192) {
    			$$invalidate(2, paths = [
    				`M0 0 L${width / 2} ${height * 0.5} L${width} 0`,
    				`M0 ${height} L${width * 0.35} ${height * 0.5}`,
    				`M${width} ${height} L${width * 0.65} ${height * 0.5}`
    			]);
    		}
    	};

    	transform = {
    		transform: `
			scale( 1 1 )
		`
    	};

    	return [
    		strokes,
    		rect,
    		paths,
    		mask,
    		class_,
    		style_,
    		width,
    		height,
    		stroke,
    		duration,
    		hover,
    		easing,
    		browser,
    		center,
    		space,
    		origin,
    		state
    	];
    }

    class Mail extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			class: 4,
    			style: 5,
    			width: 6,
    			height: 7,
    			stroke: 8,
    			duration: 9,
    			hover: 10,
    			strokes: 0,
    			easing: 11,
    			browser: 12,
    			center: 13,
    			space: 14,
    			origin: 15,
    			state: 16
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Mail",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get class() {
    		throw new Error("<Mail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Mail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Mail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Mail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Mail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Mail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Mail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Mail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<Mail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<Mail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Mail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Mail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hover() {
    		throw new Error("<Mail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hover(value) {
    		throw new Error("<Mail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get strokes() {
    		throw new Error("<Mail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strokes(value) {
    		throw new Error("<Mail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get easing() {
    		throw new Error("<Mail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set easing(value) {
    		throw new Error("<Mail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get browser() {
    		throw new Error("<Mail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set browser(value) {
    		throw new Error("<Mail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get center() {
    		throw new Error("<Mail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set center(value) {
    		throw new Error("<Mail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get space() {
    		throw new Error("<Mail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set space(value) {
    		throw new Error("<Mail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get origin() {
    		throw new Error("<Mail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set origin(value) {
    		throw new Error("<Mail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Mail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Mail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* ../rad-and-cool-icons/lib/Arrow.svelte generated by Svelte v3.44.0 */
    const file$8 = "../rad-and-cool-icons/lib/Arrow.svelte";

    function create_fragment$8(ctx) {
    	let defs;
    	let mask;
    	let rect;
    	let circle0;
    	let t;
    	let g1;
    	let circle1;
    	let g0;
    	let path0;
    	let path0_d_value;
    	let path1;
    	let path1_d_value;
    	let g1_style_value;
    	let circle0_levels = [/*circle*/ ctx[5], { fill: "black" }];
    	let circle0_data = {};

    	for (let i = 0; i < circle0_levels.length; i += 1) {
    		circle0_data = assign(circle0_data, circle0_levels[i]);
    	}

    	let circle1_levels = [/*circle*/ ctx[5]];
    	let circle1_data = {};

    	for (let i = 0; i < circle1_levels.length; i += 1) {
    		circle1_data = assign(circle1_data, circle1_levels[i]);
    	}

    	let path0_levels = [
    		{
    			d: path0_d_value = `
			M${/*width*/ ctx[0] / 2} ${/*stroke*/ ctx[2]}
			L${/*stroke*/ ctx[2]} ${/*height*/ ctx[1] / 2}
			L${/*width*/ ctx[0] / 2} ${/*height*/ ctx[1] - /*stroke*/ ctx[2]}
		`
    		},
    		/*strokes*/ ctx[3]
    	];

    	let path0_data = {};

    	for (let i = 0; i < path0_levels.length; i += 1) {
    		path0_data = assign(path0_data, path0_levels[i]);
    	}

    	let path1_levels = [
    		{
    			d: path1_d_value = `
			M${/*stroke*/ ctx[2]} ${/*height*/ ctx[1] / 2}
			L${/*width*/ ctx[0] - /*stroke*/ ctx[2]} ${/*height*/ ctx[1] / 2}
		`
    		},
    		/*strokes*/ ctx[3]
    	];

    	let path1_data = {};

    	for (let i = 0; i < path1_levels.length; i += 1) {
    		path1_data = assign(path1_data, path1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			defs = svg_element("defs");
    			mask = svg_element("mask");
    			rect = svg_element("rect");
    			circle0 = svg_element("circle");
    			t = space();
    			g1 = svg_element("g");
    			circle1 = svg_element("circle");
    			g0 = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(rect, "width", "100%");
    			attr_dev(rect, "height", "100%");
    			attr_dev(rect, "fill", "white");
    			add_location(rect, file$8, 38, 2, 800);
    			set_svg_attributes(circle0, circle0_data);
    			add_location(circle0, file$8, 39, 2, 850);
    			attr_dev(mask, "id", "arrow-mask");
    			add_location(mask, file$8, 37, 1, 775);
    			add_location(defs, file$8, 36, 0, 767);
    			set_svg_attributes(circle1, circle1_data);
    			add_location(circle1, file$8, 44, 1, 1001);
    			set_svg_attributes(path0, path0_data);
    			add_location(path0, file$8, 46, 2, 1056);
    			set_svg_attributes(path1, path1_data);
    			add_location(path1, file$8, 51, 2, 1173);
    			attr_dev(g0, "mask", "url(#arrow-mask)");
    			add_location(g0, file$8, 45, 1, 1026);
    			attr_dev(g1, "style", g1_style_value = `${/*origin*/ ctx[4]}; transform: rotateZ(${parseInt(/*rotate*/ ctx[6] * 90)}deg); translate3d(0, 0, 0);`);
    			add_location(g1, file$8, 43, 0, 904);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, defs, anchor);
    			append_dev(defs, mask);
    			append_dev(mask, rect);
    			append_dev(mask, circle0);
    			insert_dev(target, t, anchor);
    			insert_dev(target, g1, anchor);
    			append_dev(g1, circle1);
    			append_dev(g1, g0);
    			append_dev(g0, path0);
    			append_dev(g0, path1);
    		},
    		p: function update(ctx, [dirty]) {
    			set_svg_attributes(circle0, circle0_data = get_spread_update(circle0_levels, [dirty & /*circle*/ 32 && /*circle*/ ctx[5], { fill: "black" }]));
    			set_svg_attributes(circle1, circle1_data = get_spread_update(circle1_levels, [dirty & /*circle*/ 32 && /*circle*/ ctx[5]]));

    			set_svg_attributes(path0, path0_data = get_spread_update(path0_levels, [
    				dirty & /*width, stroke, height*/ 7 && path0_d_value !== (path0_d_value = `
			M${/*width*/ ctx[0] / 2} ${/*stroke*/ ctx[2]}
			L${/*stroke*/ ctx[2]} ${/*height*/ ctx[1] / 2}
			L${/*width*/ ctx[0] / 2} ${/*height*/ ctx[1] - /*stroke*/ ctx[2]}
		`) && { d: path0_d_value },
    				dirty & /*strokes*/ 8 && /*strokes*/ ctx[3]
    			]));

    			set_svg_attributes(path1, path1_data = get_spread_update(path1_levels, [
    				dirty & /*stroke, height, width*/ 7 && path1_d_value !== (path1_d_value = `
			M${/*stroke*/ ctx[2]} ${/*height*/ ctx[1] / 2}
			L${/*width*/ ctx[0] - /*stroke*/ ctx[2]} ${/*height*/ ctx[1] / 2}
		`) && { d: path1_d_value },
    				dirty & /*strokes*/ 8 && /*strokes*/ ctx[3]
    			]));

    			if (dirty & /*origin*/ 16 && g1_style_value !== (g1_style_value = `${/*origin*/ ctx[4]}; transform: rotateZ(${parseInt(/*rotate*/ ctx[6] * 90)}deg); translate3d(0, 0, 0);`)) {
    				attr_dev(g1, "style", g1_style_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(defs);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(g1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const size = 0.95;

    function instance$8($$self, $$props, $$invalidate) {
    	let circle;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Arrow', slots, []);
    	let { class: class_ = "" } = $$props;
    	let { style: style_ = "" } = $$props;
    	let { width = 200 } = $$props;
    	let { height = 200 } = $$props;
    	let { stroke = 2 } = $$props;
    	let { duration = 1000 } = $$props;
    	let { hover = false } = $$props;
    	let { strokes = {} } = $$props;
    	let { easing = e => e } = $$props;
    	let { browser = false } = $$props;
    	let { center = { x: 100, y: 100 } } = $$props;
    	let { origin } = $$props;
    	let { state } = $$props; // for outside observation
    	const tween = init => tweened(init, { duration, easing });
    	let rotate = 0;

    	const writable_props = [
    		'class',
    		'style',
    		'width',
    		'height',
    		'stroke',
    		'duration',
    		'hover',
    		'strokes',
    		'easing',
    		'browser',
    		'center',
    		'origin',
    		'state'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Arrow> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(7, class_ = $$props.class);
    		if ('style' in $$props) $$invalidate(8, style_ = $$props.style);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('stroke' in $$props) $$invalidate(2, stroke = $$props.stroke);
    		if ('duration' in $$props) $$invalidate(9, duration = $$props.duration);
    		if ('hover' in $$props) $$invalidate(10, hover = $$props.hover);
    		if ('strokes' in $$props) $$invalidate(3, strokes = $$props.strokes);
    		if ('easing' in $$props) $$invalidate(11, easing = $$props.easing);
    		if ('browser' in $$props) $$invalidate(12, browser = $$props.browser);
    		if ('center' in $$props) $$invalidate(13, center = $$props.center);
    		if ('origin' in $$props) $$invalidate(4, origin = $$props.origin);
    		if ('state' in $$props) $$invalidate(14, state = $$props.state);
    	};

    	$$self.$capture_state = () => ({
    		util,
    		tweened,
    		onMount,
    		class_,
    		style_,
    		width,
    		height,
    		stroke,
    		duration,
    		hover,
    		strokes,
    		easing,
    		browser,
    		center,
    		origin,
    		state,
    		tween,
    		rotate,
    		size,
    		circle
    	});

    	$$self.$inject_state = $$props => {
    		if ('class_' in $$props) $$invalidate(7, class_ = $$props.class_);
    		if ('style_' in $$props) $$invalidate(8, style_ = $$props.style_);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('stroke' in $$props) $$invalidate(2, stroke = $$props.stroke);
    		if ('duration' in $$props) $$invalidate(9, duration = $$props.duration);
    		if ('hover' in $$props) $$invalidate(10, hover = $$props.hover);
    		if ('strokes' in $$props) $$invalidate(3, strokes = $$props.strokes);
    		if ('easing' in $$props) $$invalidate(11, easing = $$props.easing);
    		if ('browser' in $$props) $$invalidate(12, browser = $$props.browser);
    		if ('center' in $$props) $$invalidate(13, center = $$props.center);
    		if ('origin' in $$props) $$invalidate(4, origin = $$props.origin);
    		if ('state' in $$props) $$invalidate(14, state = $$props.state);
    		if ('rotate' in $$props) $$invalidate(6, rotate = $$props.rotate);
    		if ('circle' in $$props) $$invalidate(5, circle = $$props.circle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*width, stroke, height, strokes*/ 15) {
    			$$invalidate(5, circle = {
    				cx: width * size - stroke,
    				cy: height / 2,
    				r: Math.max(width, height) * (1 - size),
    				...strokes
    			});
    		}
    	};

    	return [
    		width,
    		height,
    		stroke,
    		strokes,
    		origin,
    		circle,
    		rotate,
    		class_,
    		style_,
    		duration,
    		hover,
    		easing,
    		browser,
    		center,
    		state
    	];
    }

    class Arrow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			class: 7,
    			style: 8,
    			width: 0,
    			height: 1,
    			stroke: 2,
    			duration: 9,
    			hover: 10,
    			strokes: 3,
    			easing: 11,
    			browser: 12,
    			center: 13,
    			origin: 4,
    			state: 14
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Arrow",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*origin*/ ctx[4] === undefined && !('origin' in props)) {
    			console.warn("<Arrow> was created without expected prop 'origin'");
    		}

    		if (/*state*/ ctx[14] === undefined && !('state' in props)) {
    			console.warn("<Arrow> was created without expected prop 'state'");
    		}
    	}

    	get class() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hover() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hover(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get strokes() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strokes(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get easing() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set easing(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get browser() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set browser(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get center() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set center(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get origin() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set origin(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* ../rad-and-cool-icons/lib/PlayPause.svelte generated by Svelte v3.44.0 */
    const file$7 = "../rad-and-cool-icons/lib/PlayPause.svelte";

    // (45:0) {:else}
    function create_else_block$2(ctx) {
    	let g;
    	let path;
    	let path_d_value;

    	let path_levels = [
    		{
    			d: path_d_value = `
			M0 0 
			L${/*width*/ ctx[0]} ${/*height*/ ctx[1] / 2}
			L0 ${/*height*/ ctx[1]} 
			z
		`
    		},
    		/*strokes*/ ctx[2]
    	];

    	let path_data = {};

    	for (let i = 0; i < path_levels.length; i += 1) {
    		path_data = assign(path_data, path_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			path = svg_element("path");
    			set_svg_attributes(path, path_data);
    			add_location(path, file$7, 46, 2, 834);
    			add_location(g, file$7, 45, 1, 828);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			append_dev(g, path);
    		},
    		p: function update(ctx, dirty) {
    			set_svg_attributes(path, path_data = get_spread_update(path_levels, [
    				dirty & /*width, height*/ 3 && path_d_value !== (path_d_value = `
			M0 0 
			L${/*width*/ ctx[0]} ${/*height*/ ctx[1] / 2}
			L0 ${/*height*/ ctx[1]} 
			z
		`) && { d: path_d_value },
    				dirty & /*strokes*/ 4 && /*strokes*/ ctx[2]
    			]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(45:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (40:0) {#if state}
    function create_if_block$3(ctx) {
    	let g;
    	let rect0;
    	let rect1;
    	let rect1_x_value;
    	let rect0_levels = [/*rect*/ ctx[6], /*strokes*/ ctx[2]];
    	let rect0_data = {};

    	for (let i = 0; i < rect0_levels.length; i += 1) {
    		rect0_data = assign(rect0_data, rect0_levels[i]);
    	}

    	let rect1_levels = [
    		/*rect*/ ctx[6],
    		/*strokes*/ ctx[2],
    		{
    			x: rect1_x_value = /*width*/ ctx[0] - parseInt(/*width*/ ctx[0] * /*thick*/ ctx[4]) + /*bit*/ ctx[5]
    		}
    	];

    	let rect1_data = {};

    	for (let i = 0; i < rect1_levels.length; i += 1) {
    		rect1_data = assign(rect1_data, rect1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			rect0 = svg_element("rect");
    			rect1 = svg_element("rect");
    			set_svg_attributes(rect0, rect0_data);
    			add_location(rect0, file$7, 41, 2, 703);
    			set_svg_attributes(rect1, rect1_data);
    			add_location(rect1, file$7, 42, 2, 737);
    			add_location(g, file$7, 40, 1, 697);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			append_dev(g, rect0);
    			append_dev(g, rect1);
    		},
    		p: function update(ctx, dirty) {
    			set_svg_attributes(rect0, rect0_data = get_spread_update(rect0_levels, [
    				dirty & /*rect*/ 64 && /*rect*/ ctx[6],
    				dirty & /*strokes*/ 4 && /*strokes*/ ctx[2]
    			]));

    			set_svg_attributes(rect1, rect1_data = get_spread_update(rect1_levels, [
    				dirty & /*rect*/ 64 && /*rect*/ ctx[6],
    				dirty & /*strokes*/ 4 && /*strokes*/ ctx[2],
    				dirty & /*width, thick, bit*/ 49 && rect1_x_value !== (rect1_x_value = /*width*/ ctx[0] - parseInt(/*width*/ ctx[0] * /*thick*/ ctx[4]) + /*bit*/ ctx[5]) && { x: rect1_x_value }
    			]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(40:0) {#if state}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let defs;
    	let t;
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*state*/ ctx[3]) return create_if_block$3;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			defs = svg_element("defs");
    			t = space();
    			if_block.c();
    			if_block_anchor = empty();
    			add_location(defs, file$7, 37, 0, 669);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, defs, anchor);
    			insert_dev(target, t, anchor);
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(defs);
    			if (detaching) detach_dev(t);
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let bit;
    	let rect;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PlayPause', slots, []);
    	let { class: class_ = "" } = $$props;
    	let { style: style_ = "" } = $$props;
    	let { width = 200 } = $$props;
    	let { height = 200 } = $$props;
    	let { stroke = 2 } = $$props;
    	let { duration = 1000 } = $$props;
    	let { hover = false } = $$props;
    	let { strokes = {} } = $$props;
    	let { easing = e => e } = $$props;
    	let { browser = false } = $$props;
    	let { center = { x: 100, y: 100 } } = $$props;
    	let { origin } = $$props;
    	let { state } = $$props; // for outside observation
    	let { thick = 0.3333 } = $$props;

    	const writable_props = [
    		'class',
    		'style',
    		'width',
    		'height',
    		'stroke',
    		'duration',
    		'hover',
    		'strokes',
    		'easing',
    		'browser',
    		'center',
    		'origin',
    		'state',
    		'thick'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PlayPause> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(7, class_ = $$props.class);
    		if ('style' in $$props) $$invalidate(8, style_ = $$props.style);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('stroke' in $$props) $$invalidate(9, stroke = $$props.stroke);
    		if ('duration' in $$props) $$invalidate(10, duration = $$props.duration);
    		if ('hover' in $$props) $$invalidate(11, hover = $$props.hover);
    		if ('strokes' in $$props) $$invalidate(2, strokes = $$props.strokes);
    		if ('easing' in $$props) $$invalidate(12, easing = $$props.easing);
    		if ('browser' in $$props) $$invalidate(13, browser = $$props.browser);
    		if ('center' in $$props) $$invalidate(14, center = $$props.center);
    		if ('origin' in $$props) $$invalidate(15, origin = $$props.origin);
    		if ('state' in $$props) $$invalidate(3, state = $$props.state);
    		if ('thick' in $$props) $$invalidate(4, thick = $$props.thick);
    	};

    	$$self.$capture_state = () => ({
    		util,
    		tweened,
    		onMount,
    		class_,
    		style_,
    		width,
    		height,
    		stroke,
    		duration,
    		hover,
    		strokes,
    		easing,
    		browser,
    		center,
    		origin,
    		state,
    		thick,
    		bit,
    		rect
    	});

    	$$self.$inject_state = $$props => {
    		if ('class_' in $$props) $$invalidate(7, class_ = $$props.class_);
    		if ('style_' in $$props) $$invalidate(8, style_ = $$props.style_);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('stroke' in $$props) $$invalidate(9, stroke = $$props.stroke);
    		if ('duration' in $$props) $$invalidate(10, duration = $$props.duration);
    		if ('hover' in $$props) $$invalidate(11, hover = $$props.hover);
    		if ('strokes' in $$props) $$invalidate(2, strokes = $$props.strokes);
    		if ('easing' in $$props) $$invalidate(12, easing = $$props.easing);
    		if ('browser' in $$props) $$invalidate(13, browser = $$props.browser);
    		if ('center' in $$props) $$invalidate(14, center = $$props.center);
    		if ('origin' in $$props) $$invalidate(15, origin = $$props.origin);
    		if ('state' in $$props) $$invalidate(3, state = $$props.state);
    		if ('thick' in $$props) $$invalidate(4, thick = $$props.thick);
    		if ('bit' in $$props) $$invalidate(5, bit = $$props.bit);
    		if ('rect' in $$props) $$invalidate(6, rect = $$props.rect);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*stroke*/ 512) {
    			$$invalidate(5, bit = stroke % 2 / 2);
    		}

    		if ($$self.$$.dirty & /*width, thick, height, bit*/ 51) {
    			$$invalidate(6, rect = {
    				width: parseInt(width * thick),
    				height,
    				y: bit,
    				x: bit
    			});
    		}
    	};

    	return [
    		width,
    		height,
    		strokes,
    		state,
    		thick,
    		bit,
    		rect,
    		class_,
    		style_,
    		stroke,
    		duration,
    		hover,
    		easing,
    		browser,
    		center,
    		origin
    	];
    }

    class PlayPause extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			class: 7,
    			style: 8,
    			width: 0,
    			height: 1,
    			stroke: 9,
    			duration: 10,
    			hover: 11,
    			strokes: 2,
    			easing: 12,
    			browser: 13,
    			center: 14,
    			origin: 15,
    			state: 3,
    			thick: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlayPause",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*origin*/ ctx[15] === undefined && !('origin' in props)) {
    			console.warn("<PlayPause> was created without expected prop 'origin'");
    		}

    		if (/*state*/ ctx[3] === undefined && !('state' in props)) {
    			console.warn("<PlayPause> was created without expected prop 'state'");
    		}
    	}

    	get class() {
    		throw new Error("<PlayPause>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<PlayPause>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<PlayPause>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<PlayPause>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<PlayPause>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<PlayPause>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<PlayPause>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<PlayPause>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<PlayPause>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<PlayPause>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<PlayPause>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<PlayPause>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hover() {
    		throw new Error("<PlayPause>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hover(value) {
    		throw new Error("<PlayPause>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get strokes() {
    		throw new Error("<PlayPause>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strokes(value) {
    		throw new Error("<PlayPause>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get easing() {
    		throw new Error("<PlayPause>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set easing(value) {
    		throw new Error("<PlayPause>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get browser() {
    		throw new Error("<PlayPause>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set browser(value) {
    		throw new Error("<PlayPause>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get center() {
    		throw new Error("<PlayPause>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set center(value) {
    		throw new Error("<PlayPause>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get origin() {
    		throw new Error("<PlayPause>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set origin(value) {
    		throw new Error("<PlayPause>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<PlayPause>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<PlayPause>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get thick() {
    		throw new Error("<PlayPause>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set thick(value) {
    		throw new Error("<PlayPause>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* ../rad-and-cool-icons/lib/Audio.svelte generated by Svelte v3.44.0 */
    const file$6 = "../rad-and-cool-icons/lib/Audio.svelte";

    // (47:0) {:else}
    function create_else_block$1(ctx) {
    	let g;
    	let path0;
    	let path0_d_value;
    	let path1;
    	let path1_d_value;

    	let path0_levels = [
    		{
    			d: path0_d_value = `
			M0 0
			L${/*width*/ ctx[0]} ${/*height*/ ctx[1]}
		`
    		},
    		/*strokes*/ ctx[2]
    	];

    	let path0_data = {};

    	for (let i = 0; i < path0_levels.length; i += 1) {
    		path0_data = assign(path0_data, path0_levels[i]);
    	}

    	let path1_levels = [
    		{
    			d: path1_d_value = `
			M0 ${/*height*/ ctx[1]}
			L${/*width*/ ctx[0]} 0
		`
    		},
    		/*strokes*/ ctx[2]
    	];

    	let path1_data = {};

    	for (let i = 0; i < path1_levels.length; i += 1) {
    		path1_data = assign(path1_data, path1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			set_svg_attributes(path0, path0_data);
    			add_location(path0, file$6, 48, 2, 889);
    			set_svg_attributes(path1, path1_data);
    			add_location(path1, file$6, 52, 2, 954);
    			add_location(g, file$6, 47, 1, 883);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			append_dev(g, path0);
    			append_dev(g, path1);
    		},
    		p: function update(ctx, dirty) {
    			set_svg_attributes(path0, path0_data = get_spread_update(path0_levels, [
    				dirty & /*width, height*/ 3 && path0_d_value !== (path0_d_value = `
			M0 0
			L${/*width*/ ctx[0]} ${/*height*/ ctx[1]}
		`) && { d: path0_d_value },
    				dirty & /*strokes*/ 4 && /*strokes*/ ctx[2]
    			]));

    			set_svg_attributes(path1, path1_data = get_spread_update(path1_levels, [
    				dirty & /*height, width*/ 3 && path1_d_value !== (path1_d_value = `
			M0 ${/*height*/ ctx[1]}
			L${/*width*/ ctx[0]} 0
		`) && { d: path1_d_value },
    				dirty & /*strokes*/ 4 && /*strokes*/ ctx[2]
    			]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(47:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (40:0) {#if state}
    function create_if_block$2(ctx) {
    	let path0;
    	let path0_d_value;
    	let t;
    	let path1;
    	let path1_d_value;

    	let path0_levels = [
    		{
    			d: path0_d_value = `
		${util.describe_arc(/*width*/ ctx[0] / 2, /*height*/ ctx[1] / 2, Math.max(/*width*/ ctx[0], /*height*/ ctx[1]) * 0.5, 20, 160)}
	`
    		},
    		/*strokes*/ ctx[2]
    	];

    	let path0_data = {};

    	for (let i = 0; i < path0_levels.length; i += 1) {
    		path0_data = assign(path0_data, path0_levels[i]);
    	}

    	let path1_levels = [
    		{
    			d: path1_d_value = `
		${util.describe_arc(/*width*/ ctx[0] / 2, /*height*/ ctx[1] / 2, Math.max(/*width*/ ctx[0], /*height*/ ctx[1]) * 0.3, 20, 160)}
	`
    		},
    		/*strokes*/ ctx[2]
    	];

    	let path1_data = {};

    	for (let i = 0; i < path1_levels.length; i += 1) {
    		path1_data = assign(path1_data, path1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			path0 = svg_element("path");
    			t = space();
    			path1 = svg_element("path");
    			set_svg_attributes(path0, path0_data);
    			add_location(path0, file$6, 40, 1, 659);
    			set_svg_attributes(path1, path1_data);
    			add_location(path1, file$6, 43, 1, 767);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, path1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			set_svg_attributes(path0, path0_data = get_spread_update(path0_levels, [
    				dirty & /*width, height*/ 3 && path0_d_value !== (path0_d_value = `
		${util.describe_arc(/*width*/ ctx[0] / 2, /*height*/ ctx[1] / 2, Math.max(/*width*/ ctx[0], /*height*/ ctx[1]) * 0.5, 20, 160)}
	`) && { d: path0_d_value },
    				dirty & /*strokes*/ 4 && /*strokes*/ ctx[2]
    			]));

    			set_svg_attributes(path1, path1_data = get_spread_update(path1_levels, [
    				dirty & /*width, height*/ 3 && path1_d_value !== (path1_d_value = `
		${util.describe_arc(/*width*/ ctx[0] / 2, /*height*/ ctx[1] / 2, Math.max(/*width*/ ctx[0], /*height*/ ctx[1]) * 0.3, 20, 160)}
	`) && { d: path1_d_value },
    				dirty & /*strokes*/ 4 && /*strokes*/ ctx[2]
    			]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(path1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(40:0) {#if state}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let defs;
    	let t0;
    	let t1;
    	let g;
    	let path;
    	let path_d_value;

    	function select_block_type(ctx, dirty) {
    		if (/*state*/ ctx[4]) return create_if_block$2;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	let path_levels = [
    		{ style: /*origin*/ ctx[3] },
    		{ transform: "scale( 1 0.7 )" },
    		{
    			d: path_d_value = `
		M0 ${/*height*/ ctx[1] / 2}
		L${/*width*/ ctx[0] / 2} 0
		L${/*width*/ ctx[0] / 2} ${/*height*/ ctx[1]}
		z
	`
    		},
    		/*strokes*/ ctx[2]
    	];

    	let path_data = {};

    	for (let i = 0; i < path_levels.length; i += 1) {
    		path_data = assign(path_data, path_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			defs = svg_element("defs");
    			t0 = space();
    			if_block.c();
    			t1 = space();
    			g = svg_element("g");
    			path = svg_element("path");
    			add_location(defs, file$6, 37, 0, 631);
    			set_svg_attributes(path, path_data);
    			add_location(path, file$6, 59, 1, 1034);
    			add_location(g, file$6, 58, 0, 1029);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, defs, anchor);
    			insert_dev(target, t0, anchor);
    			if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, g, anchor);
    			append_dev(g, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(t1.parentNode, t1);
    				}
    			}

    			set_svg_attributes(path, path_data = get_spread_update(path_levels, [
    				dirty & /*origin*/ 8 && { style: /*origin*/ ctx[3] },
    				{ transform: "scale( 1 0.7 )" },
    				dirty & /*height, width*/ 3 && path_d_value !== (path_d_value = `
		M0 ${/*height*/ ctx[1] / 2}
		L${/*width*/ ctx[0] / 2} 0
		L${/*width*/ ctx[0] / 2} ${/*height*/ ctx[1]}
		z
	`) && { d: path_d_value },
    				dirty & /*strokes*/ 4 && /*strokes*/ ctx[2]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(defs);
    			if (detaching) detach_dev(t0);
    			if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(g);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let rect;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Audio', slots, []);
    	let { class: class_ = "" } = $$props;
    	let { style: style_ = "" } = $$props;
    	let { width = 200 } = $$props;
    	let { height = 200 } = $$props;
    	let { stroke = 2 } = $$props;
    	let { duration = 1000 } = $$props;
    	let { hover = false } = $$props;
    	let { strokes = {} } = $$props;
    	let { easing = e => e } = $$props;
    	let { browser = false } = $$props;
    	let { center = { x: 100, y: 100 } } = $$props;
    	let { origin } = $$props;
    	let { state } = $$props; // for outside observation
    	let { thick = 0.3333 } = $$props;

    	const writable_props = [
    		'class',
    		'style',
    		'width',
    		'height',
    		'stroke',
    		'duration',
    		'hover',
    		'strokes',
    		'easing',
    		'browser',
    		'center',
    		'origin',
    		'state',
    		'thick'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Audio> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(5, class_ = $$props.class);
    		if ('style' in $$props) $$invalidate(6, style_ = $$props.style);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('stroke' in $$props) $$invalidate(7, stroke = $$props.stroke);
    		if ('duration' in $$props) $$invalidate(8, duration = $$props.duration);
    		if ('hover' in $$props) $$invalidate(9, hover = $$props.hover);
    		if ('strokes' in $$props) $$invalidate(2, strokes = $$props.strokes);
    		if ('easing' in $$props) $$invalidate(10, easing = $$props.easing);
    		if ('browser' in $$props) $$invalidate(11, browser = $$props.browser);
    		if ('center' in $$props) $$invalidate(12, center = $$props.center);
    		if ('origin' in $$props) $$invalidate(3, origin = $$props.origin);
    		if ('state' in $$props) $$invalidate(4, state = $$props.state);
    		if ('thick' in $$props) $$invalidate(13, thick = $$props.thick);
    	};

    	$$self.$capture_state = () => ({
    		util,
    		tweened,
    		onMount,
    		class_,
    		style_,
    		width,
    		height,
    		stroke,
    		duration,
    		hover,
    		strokes,
    		easing,
    		browser,
    		center,
    		origin,
    		state,
    		thick,
    		rect
    	});

    	$$self.$inject_state = $$props => {
    		if ('class_' in $$props) $$invalidate(5, class_ = $$props.class_);
    		if ('style_' in $$props) $$invalidate(6, style_ = $$props.style_);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('stroke' in $$props) $$invalidate(7, stroke = $$props.stroke);
    		if ('duration' in $$props) $$invalidate(8, duration = $$props.duration);
    		if ('hover' in $$props) $$invalidate(9, hover = $$props.hover);
    		if ('strokes' in $$props) $$invalidate(2, strokes = $$props.strokes);
    		if ('easing' in $$props) $$invalidate(10, easing = $$props.easing);
    		if ('browser' in $$props) $$invalidate(11, browser = $$props.browser);
    		if ('center' in $$props) $$invalidate(12, center = $$props.center);
    		if ('origin' in $$props) $$invalidate(3, origin = $$props.origin);
    		if ('state' in $$props) $$invalidate(4, state = $$props.state);
    		if ('thick' in $$props) $$invalidate(13, thick = $$props.thick);
    		if ('rect' in $$props) rect = $$props.rect;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*width, thick, height*/ 8195) {
    			rect = { width: width * thick, height, y: 0, x: 0 };
    		}
    	};

    	return [
    		width,
    		height,
    		strokes,
    		origin,
    		state,
    		class_,
    		style_,
    		stroke,
    		duration,
    		hover,
    		easing,
    		browser,
    		center,
    		thick
    	];
    }

    class Audio extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			class: 5,
    			style: 6,
    			width: 0,
    			height: 1,
    			stroke: 7,
    			duration: 8,
    			hover: 9,
    			strokes: 2,
    			easing: 10,
    			browser: 11,
    			center: 12,
    			origin: 3,
    			state: 4,
    			thick: 13
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Audio",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*origin*/ ctx[3] === undefined && !('origin' in props)) {
    			console.warn("<Audio> was created without expected prop 'origin'");
    		}

    		if (/*state*/ ctx[4] === undefined && !('state' in props)) {
    			console.warn("<Audio> was created without expected prop 'state'");
    		}
    	}

    	get class() {
    		throw new Error("<Audio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Audio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Audio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Audio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Audio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Audio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Audio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Audio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<Audio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<Audio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Audio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Audio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hover() {
    		throw new Error("<Audio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hover(value) {
    		throw new Error("<Audio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get strokes() {
    		throw new Error("<Audio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strokes(value) {
    		throw new Error("<Audio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get easing() {
    		throw new Error("<Audio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set easing(value) {
    		throw new Error("<Audio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get browser() {
    		throw new Error("<Audio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set browser(value) {
    		throw new Error("<Audio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get center() {
    		throw new Error("<Audio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set center(value) {
    		throw new Error("<Audio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get origin() {
    		throw new Error("<Audio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set origin(value) {
    		throw new Error("<Audio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Audio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Audio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get thick() {
    		throw new Error("<Audio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set thick(value) {
    		throw new Error("<Audio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* ../rad-and-cool-icons/lib/Randomise.svelte generated by Svelte v3.44.0 */
    const file$5 = "../rad-and-cool-icons/lib/Randomise.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    // (35:0) {#each [ '', `scale( 1, -1 ) translate(0, -${height})`] as transform }
    function create_each_block$1(ctx) {
    	let g1;
    	let g0;
    	let path0;
    	let path0_d_value;
    	let path1;
    	let path1_d_value;
    	let g1_transform_value;

    	let path0_levels = [
    		{
    			d: path0_d_value = `
				${util.describe_arc(/*width*/ ctx[0] * 0.8, 0, Math.max(/*width*/ ctx[0], /*height*/ ctx[1]) * 0.8, 0, 260)}
			`
    		},
    		/*strokes*/ ctx[2]
    	];

    	let path0_data = {};

    	for (let i = 0; i < path0_levels.length; i += 1) {
    		path0_data = assign(path0_data, path0_levels[i]);
    	}

    	let path1_levels = [
    		{
    			d: path1_d_value = "M" + /*width*/ ctx[0] * /*length*/ ctx[3] + "," + /*height*/ ctx[1] + " L" + /*width*/ ctx[0] + "," + /*height*/ ctx[1] * /*length*/ ctx[3] + " L" + /*width*/ ctx[0] * /*length*/ ctx[3] + "," + /*height*/ ctx[1] * 0.6
    		},
    		/*strokes*/ ctx[2]
    	];

    	let path1_data = {};

    	for (let i = 0; i < path1_levels.length; i += 1) {
    		path1_data = assign(path1_data, path1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			set_svg_attributes(path0, path0_data);
    			add_location(path0, file$5, 37, 3, 786);
    			set_svg_attributes(path1, path1_data);
    			add_location(path1, file$5, 41, 3, 955);
    			add_location(g0, file$5, 36, 2, 779);
    			attr_dev(g1, "transform", g1_transform_value = /*transform*/ ctx[15]);
    			add_location(g1, file$5, 35, 1, 761);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g1, anchor);
    			append_dev(g1, g0);
    			append_dev(g0, path0);
    			append_dev(g0, path1);
    		},
    		p: function update(ctx, dirty) {
    			set_svg_attributes(path0, path0_data = get_spread_update(path0_levels, [
    				dirty & /*width, height*/ 3 && path0_d_value !== (path0_d_value = `
				${util.describe_arc(/*width*/ ctx[0] * 0.8, 0, Math.max(/*width*/ ctx[0], /*height*/ ctx[1]) * 0.8, 0, 260)}
			`) && { d: path0_d_value },
    				dirty & /*strokes*/ 4 && /*strokes*/ ctx[2]
    			]));

    			set_svg_attributes(path1, path1_data = get_spread_update(path1_levels, [
    				dirty & /*width, length, height*/ 11 && path1_d_value !== (path1_d_value = "M" + /*width*/ ctx[0] * /*length*/ ctx[3] + "," + /*height*/ ctx[1] + " L" + /*width*/ ctx[0] + "," + /*height*/ ctx[1] * /*length*/ ctx[3] + " L" + /*width*/ ctx[0] * /*length*/ ctx[3] + "," + /*height*/ ctx[1] * 0.6) && { d: path1_d_value },
    				dirty & /*strokes*/ 4 && /*strokes*/ ctx[2]
    			]));

    			if (dirty & /*height*/ 2 && g1_transform_value !== (g1_transform_value = /*transform*/ ctx[15])) {
    				attr_dev(g1, "transform", g1_transform_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(35:0) {#each [ '', `scale( 1, -1 ) translate(0, -${height})`] as transform }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let defs;
    	let mask;
    	let t0;
    	let t1;
    	let g;
    	let each_value = ['', `scale( 1, -1 ) translate(0, -${/*height*/ ctx[1]})`];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < 2; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			defs = svg_element("defs");
    			mask = svg_element("mask");
    			t0 = space();

    			for (let i = 0; i < 2; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			g = svg_element("g");
    			attr_dev(mask, "id", "template-mask");
    			add_location(mask, file$5, 31, 1, 646);
    			add_location(defs, file$5, 30, 0, 638);
    			attr_dev(g, "mask", "url(#template-mask)");
    			add_location(g, file$5, 46, 0, 1085);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, defs, anchor);
    			append_dev(defs, mask);
    			insert_dev(target, t0, anchor);

    			for (let i = 0; i < 2; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			insert_dev(target, g, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*height, width, length, strokes, util, Math*/ 15) {
    				each_value = ['', `scale( 1, -1 ) translate(0, -${/*height*/ ctx[1]})`];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < 2; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t1.parentNode, t1);
    					}
    				}

    				for (; i < 2; i += 1) {
    					each_blocks[i].d(1);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(defs);
    			if (detaching) detach_dev(t0);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(g);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Randomise', slots, []);
    	let { class: class_ = "" } = $$props;
    	let { style: style_ = "" } = $$props;
    	let { width = 200 } = $$props;
    	let { height = 200 } = $$props;
    	let { stroke = 2 } = $$props;
    	let { duration = 1000 } = $$props;
    	let { hover = false } = $$props;
    	let { strokes = {} } = $$props;
    	let { easing = e => e } = $$props;
    	let { browser = false } = $$props;
    	let { center = { x: 100, y: 100 } } = $$props;
    	let { origin } = $$props;
    	let { state } = $$props; // for outside observation
    	const tween = init => tweened(init, { duration, easing });
    	let { length = 0.77 } = $$props;

    	const writable_props = [
    		'class',
    		'style',
    		'width',
    		'height',
    		'stroke',
    		'duration',
    		'hover',
    		'strokes',
    		'easing',
    		'browser',
    		'center',
    		'origin',
    		'state',
    		'length'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Randomise> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(4, class_ = $$props.class);
    		if ('style' in $$props) $$invalidate(5, style_ = $$props.style);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('stroke' in $$props) $$invalidate(6, stroke = $$props.stroke);
    		if ('duration' in $$props) $$invalidate(7, duration = $$props.duration);
    		if ('hover' in $$props) $$invalidate(8, hover = $$props.hover);
    		if ('strokes' in $$props) $$invalidate(2, strokes = $$props.strokes);
    		if ('easing' in $$props) $$invalidate(9, easing = $$props.easing);
    		if ('browser' in $$props) $$invalidate(10, browser = $$props.browser);
    		if ('center' in $$props) $$invalidate(11, center = $$props.center);
    		if ('origin' in $$props) $$invalidate(12, origin = $$props.origin);
    		if ('state' in $$props) $$invalidate(13, state = $$props.state);
    		if ('length' in $$props) $$invalidate(3, length = $$props.length);
    	};

    	$$self.$capture_state = () => ({
    		util,
    		tweened,
    		onMount,
    		class_,
    		style_,
    		width,
    		height,
    		stroke,
    		duration,
    		hover,
    		strokes,
    		easing,
    		browser,
    		center,
    		origin,
    		state,
    		tween,
    		length
    	});

    	$$self.$inject_state = $$props => {
    		if ('class_' in $$props) $$invalidate(4, class_ = $$props.class_);
    		if ('style_' in $$props) $$invalidate(5, style_ = $$props.style_);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('stroke' in $$props) $$invalidate(6, stroke = $$props.stroke);
    		if ('duration' in $$props) $$invalidate(7, duration = $$props.duration);
    		if ('hover' in $$props) $$invalidate(8, hover = $$props.hover);
    		if ('strokes' in $$props) $$invalidate(2, strokes = $$props.strokes);
    		if ('easing' in $$props) $$invalidate(9, easing = $$props.easing);
    		if ('browser' in $$props) $$invalidate(10, browser = $$props.browser);
    		if ('center' in $$props) $$invalidate(11, center = $$props.center);
    		if ('origin' in $$props) $$invalidate(12, origin = $$props.origin);
    		if ('state' in $$props) $$invalidate(13, state = $$props.state);
    		if ('length' in $$props) $$invalidate(3, length = $$props.length);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		width,
    		height,
    		strokes,
    		length,
    		class_,
    		style_,
    		stroke,
    		duration,
    		hover,
    		easing,
    		browser,
    		center,
    		origin,
    		state
    	];
    }

    class Randomise extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			class: 4,
    			style: 5,
    			width: 0,
    			height: 1,
    			stroke: 6,
    			duration: 7,
    			hover: 8,
    			strokes: 2,
    			easing: 9,
    			browser: 10,
    			center: 11,
    			origin: 12,
    			state: 13,
    			length: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Randomise",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*origin*/ ctx[12] === undefined && !('origin' in props)) {
    			console.warn("<Randomise> was created without expected prop 'origin'");
    		}

    		if (/*state*/ ctx[13] === undefined && !('state' in props)) {
    			console.warn("<Randomise> was created without expected prop 'state'");
    		}
    	}

    	get class() {
    		throw new Error("<Randomise>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Randomise>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Randomise>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Randomise>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Randomise>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Randomise>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Randomise>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Randomise>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<Randomise>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<Randomise>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Randomise>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Randomise>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hover() {
    		throw new Error("<Randomise>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hover(value) {
    		throw new Error("<Randomise>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get strokes() {
    		throw new Error("<Randomise>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strokes(value) {
    		throw new Error("<Randomise>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get easing() {
    		throw new Error("<Randomise>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set easing(value) {
    		throw new Error("<Randomise>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get browser() {
    		throw new Error("<Randomise>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set browser(value) {
    		throw new Error("<Randomise>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get center() {
    		throw new Error("<Randomise>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set center(value) {
    		throw new Error("<Randomise>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get origin() {
    		throw new Error("<Randomise>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set origin(value) {
    		throw new Error("<Randomise>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Randomise>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Randomise>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get length() {
    		throw new Error("<Randomise>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set length(value) {
    		throw new Error("<Randomise>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* ../rad-and-cool-icons/lib/Custom.svelte generated by Svelte v3.44.0 */

    const file$4 = "../rad-and-cool-icons/lib/Custom.svelte";

    function create_fragment$4(ctx) {
    	let g;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			if (default_slot) default_slot.c();
    			attr_dev(g, "id", /*id*/ ctx[0]);
    			add_location(g, file$4, 33, 0, 751);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			if (default_slot) {
    				default_slot.m(g, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Custom', slots, ['default']);
    	let { strokes = {} } = $$props;
    	let { width = 200 } = $$props;
    	let { height = 200 } = $$props;
    	let { stroke = 2 } = $$props;
    	let { duration = 1000 } = $$props;
    	let { hover = false } = $$props;
    	let { easing = e => e } = $$props;
    	let { browser = false } = $$props;
    	let { center = { x: 100, y: 100 } } = $$props;
    	let { space = 0.7 } = $$props;
    	let { origin } = $$props;
    	let { state = false } = $$props; // observation
    	let id = 'hellcustom_' + new Date().getTime().toString();

    	const writable_props = [
    		'strokes',
    		'width',
    		'height',
    		'stroke',
    		'duration',
    		'hover',
    		'easing',
    		'browser',
    		'center',
    		'space',
    		'origin',
    		'state'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Custom> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('strokes' in $$props) $$invalidate(1, strokes = $$props.strokes);
    		if ('width' in $$props) $$invalidate(2, width = $$props.width);
    		if ('height' in $$props) $$invalidate(3, height = $$props.height);
    		if ('stroke' in $$props) $$invalidate(4, stroke = $$props.stroke);
    		if ('duration' in $$props) $$invalidate(5, duration = $$props.duration);
    		if ('hover' in $$props) $$invalidate(6, hover = $$props.hover);
    		if ('easing' in $$props) $$invalidate(7, easing = $$props.easing);
    		if ('browser' in $$props) $$invalidate(8, browser = $$props.browser);
    		if ('center' in $$props) $$invalidate(9, center = $$props.center);
    		if ('space' in $$props) $$invalidate(10, space = $$props.space);
    		if ('origin' in $$props) $$invalidate(11, origin = $$props.origin);
    		if ('state' in $$props) $$invalidate(12, state = $$props.state);
    		if ('$$scope' in $$props) $$invalidate(13, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		strokes,
    		width,
    		height,
    		stroke,
    		duration,
    		hover,
    		easing,
    		browser,
    		center,
    		space,
    		origin,
    		state,
    		id
    	});

    	$$self.$inject_state = $$props => {
    		if ('strokes' in $$props) $$invalidate(1, strokes = $$props.strokes);
    		if ('width' in $$props) $$invalidate(2, width = $$props.width);
    		if ('height' in $$props) $$invalidate(3, height = $$props.height);
    		if ('stroke' in $$props) $$invalidate(4, stroke = $$props.stroke);
    		if ('duration' in $$props) $$invalidate(5, duration = $$props.duration);
    		if ('hover' in $$props) $$invalidate(6, hover = $$props.hover);
    		if ('easing' in $$props) $$invalidate(7, easing = $$props.easing);
    		if ('browser' in $$props) $$invalidate(8, browser = $$props.browser);
    		if ('center' in $$props) $$invalidate(9, center = $$props.center);
    		if ('space' in $$props) $$invalidate(10, space = $$props.space);
    		if ('origin' in $$props) $$invalidate(11, origin = $$props.origin);
    		if ('state' in $$props) $$invalidate(12, state = $$props.state);
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		id,
    		strokes,
    		width,
    		height,
    		stroke,
    		duration,
    		hover,
    		easing,
    		browser,
    		center,
    		space,
    		origin,
    		state,
    		$$scope,
    		slots
    	];
    }

    class Custom extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			strokes: 1,
    			width: 2,
    			height: 3,
    			stroke: 4,
    			duration: 5,
    			hover: 6,
    			easing: 7,
    			browser: 8,
    			center: 9,
    			space: 10,
    			origin: 11,
    			state: 12
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Custom",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*origin*/ ctx[11] === undefined && !('origin' in props)) {
    			console.warn("<Custom> was created without expected prop 'origin'");
    		}
    	}

    	get strokes() {
    		throw new Error("<Custom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strokes(value) {
    		throw new Error("<Custom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Custom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Custom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Custom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Custom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<Custom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<Custom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Custom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Custom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hover() {
    		throw new Error("<Custom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hover(value) {
    		throw new Error("<Custom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get easing() {
    		throw new Error("<Custom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set easing(value) {
    		throw new Error("<Custom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get browser() {
    		throw new Error("<Custom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set browser(value) {
    		throw new Error("<Custom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get center() {
    		throw new Error("<Custom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set center(value) {
    		throw new Error("<Custom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get space() {
    		throw new Error("<Custom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set space(value) {
    		throw new Error("<Custom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get origin() {
    		throw new Error("<Custom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set origin(value) {
    		throw new Error("<Custom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Custom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Custom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* ../rad-and-cool-icons/lib/All.wc.svelte generated by Svelte v3.44.0 */
    const file$3 = "../rad-and-cool-icons/lib/All.wc.svelte";

    // (83:2) <svelte:component     this={components[type]}     {...$$props}     {...misc}     {strokes}     easing={easingFunctions[easing]}     {browser}     {center}    {origin}    width={w}    height={h}    style={ DEBUG ? 'border:1px solid red' : ''}    bind:state={state}>
    function create_default_slot$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[21].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[24], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16777216)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[24],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[24])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[24], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(83:2) <svelte:component     this={components[type]}     {...$$props}     {...misc}     {strokes}     easing={easingFunctions[easing]}     {browser}     {center}    {origin}    width={w}    height={h}    style={ DEBUG ? 'border:1px solid red' : ''}    bind:state={state}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let svg;
    	let g;
    	let switch_instance;
    	let updating_state;
    	let g_transform_value;
    	let svg_width_value;
    	let svg_height_value;
    	let svg_class_value;
    	let t;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;

    	const switch_instance_spread_levels = [
    		/*$$props*/ ctx[13],
    		/*misc*/ ctx[5],
    		{ strokes: /*strokes*/ ctx[9] },
    		{
    			easing: easingFunctions[/*easing*/ ctx[4]]
    		},
    		{ browser: /*browser*/ ctx[10] },
    		{ center: /*center*/ ctx[11] },
    		{ origin },
    		{ width: /*w*/ ctx[8] },
    		{ height: /*h*/ ctx[7] },
    		{
    			style: ''
    		}
    	];

    	function switch_instance_state_binding(value) {
    		/*switch_instance_state_binding*/ ctx[22](value);
    	}

    	var switch_value = /*components*/ ctx[12][/*type*/ ctx[6]];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot$1] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		if (/*state*/ ctx[0] !== void 0) {
    			switch_instance_props.state = /*state*/ ctx[0];
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		binding_callbacks.push(() => bind(switch_instance, 'state', switch_instance_state_binding));
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g = svg_element("g");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t = space();
    			if_block_anchor = empty();
    			attr_dev(g, "transform", g_transform_value = "translate( " + /*stroke*/ ctx[3] + ", " + /*stroke*/ ctx[3] + " )");
    			add_location(g, file$3, 81, 1, 1912);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "width", svg_width_value = /*w*/ ctx[8] + /*stroke*/ ctx[3] * 2);
    			attr_dev(svg, "height", svg_height_value = /*h*/ ctx[7] + /*stroke*/ ctx[3] * 2);
    			attr_dev(svg, "alt", /*type*/ ctx[6]);
    			attr_dev(svg, "title", /*type*/ ctx[6]);
    			attr_dev(svg, "class", svg_class_value = /*class_*/ ctx[1] + ' rad-and-cool pointer ' + /*type*/ ctx[6]);
    			attr_dev(svg, "style", /*style_*/ ctx[2]);
    			add_location(svg, file$3, 71, 0, 1647);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g);

    			if (switch_instance) {
    				mount_component(switch_instance, g, null);
    			}

    			insert_dev(target, t, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(svg, "click", /*click_handler*/ ctx[23], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = (dirty & /*$$props, misc, strokes, easingFunctions, easing, browser, center, origin, w, h, DEBUG*/ 12208)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$$props*/ 8192 && get_spread_object(/*$$props*/ ctx[13]),
    					dirty & /*misc*/ 32 && get_spread_object(/*misc*/ ctx[5]),
    					dirty & /*strokes*/ 512 && { strokes: /*strokes*/ ctx[9] },
    					dirty & /*easingFunctions, easing*/ 16 && {
    						easing: easingFunctions[/*easing*/ ctx[4]]
    					},
    					dirty & /*browser*/ 1024 && { browser: /*browser*/ ctx[10] },
    					dirty & /*center*/ 2048 && { center: /*center*/ ctx[11] },
    					dirty & /*origin*/ 0 && { origin },
    					dirty & /*w*/ 256 && { width: /*w*/ ctx[8] },
    					dirty & /*h*/ 128 && { height: /*h*/ ctx[7] },
    					dirty & /*DEBUG*/ 0 && {
    						style: ''
    					}
    				])
    			: {};

    			if (dirty & /*$$scope*/ 16777216) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_state && dirty & /*state*/ 1) {
    				updating_state = true;
    				switch_instance_changes.state = /*state*/ ctx[0];
    				add_flush_callback(() => updating_state = false);
    			}

    			if (switch_value !== (switch_value = /*components*/ ctx[12][/*type*/ ctx[6]])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					binding_callbacks.push(() => bind(switch_instance, 'state', switch_instance_state_binding));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, g, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			if (!current || dirty & /*stroke*/ 8 && g_transform_value !== (g_transform_value = "translate( " + /*stroke*/ ctx[3] + ", " + /*stroke*/ ctx[3] + " )")) {
    				attr_dev(g, "transform", g_transform_value);
    			}

    			if (!current || dirty & /*w, stroke*/ 264 && svg_width_value !== (svg_width_value = /*w*/ ctx[8] + /*stroke*/ ctx[3] * 2)) {
    				attr_dev(svg, "width", svg_width_value);
    			}

    			if (!current || dirty & /*h, stroke*/ 136 && svg_height_value !== (svg_height_value = /*h*/ ctx[7] + /*stroke*/ ctx[3] * 2)) {
    				attr_dev(svg, "height", svg_height_value);
    			}

    			if (!current || dirty & /*type*/ 64) {
    				attr_dev(svg, "alt", /*type*/ ctx[6]);
    			}

    			if (!current || dirty & /*type*/ 64) {
    				attr_dev(svg, "title", /*type*/ ctx[6]);
    			}

    			if (!current || dirty & /*class_, type*/ 66 && svg_class_value !== (svg_class_value = /*class_*/ ctx[1] + ' rad-and-cool pointer ' + /*type*/ ctx[6])) {
    				attr_dev(svg, "class", svg_class_value);
    			}

    			if (!current || dirty & /*style_*/ 4) {
    				attr_dev(svg, "style", /*style_*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (switch_instance) destroy_component(switch_instance);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const origin = 'transform-box: fill-box;transform-origin: center center;';
    const DEBUG = false;

    function instance$3($$self, $$props, $$invalidate) {
    	let center;
    	let browser;
    	let strokes;
    	let w;
    	let h;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('All_wc', slots, ['default']);
    	let { class: class_ = "" } = $$props;
    	let { style: style_ = "" } = $$props;
    	let { width = 200 } = $$props;
    	let { height = 200 } = $$props;
    	let { stroke = 2 } = $$props;
    	let { color = "#efefef" } = $$props;
    	let { easing = "cubicOut" } = $$props;
    	let { duration = 1000 } = $$props;
    	let { hover = false } = $$props;
    	let { misc = {} } = $$props;
    	let { type = 'custom' } = $$props;
    	let { state = true } = $$props;
    	let { id = 'unique-' + parseInt(Math.random() * 1000) } = $$props;

    	let components = {
    		'light-dark': LightDark,
    		'burger': Burger,
    		'mail': Mail,
    		'arrow': Arrow,
    		'play-pause': PlayPause,
    		'audio': Audio,
    		'randomise': Randomise,
    		'custom': Custom
    	};

    	let { line = (x1, y1, x2, y2) => {
    		const args = { x1, y2, x2, y2 };
    		return `<line ${Object.keys(args).map(a => `${a}="${args[a]}"`).join(' ')} />`;
    	} } = $$props;

    	function switch_instance_state_binding(value) {
    		state = value;
    		$$invalidate(0, state);
    	}

    	const click_handler = e => $$invalidate(0, state = !state);

    	$$self.$$set = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('class' in $$new_props) $$invalidate(1, class_ = $$new_props.class);
    		if ('style' in $$new_props) $$invalidate(2, style_ = $$new_props.style);
    		if ('width' in $$new_props) $$invalidate(14, width = $$new_props.width);
    		if ('height' in $$new_props) $$invalidate(15, height = $$new_props.height);
    		if ('stroke' in $$new_props) $$invalidate(3, stroke = $$new_props.stroke);
    		if ('color' in $$new_props) $$invalidate(16, color = $$new_props.color);
    		if ('easing' in $$new_props) $$invalidate(4, easing = $$new_props.easing);
    		if ('duration' in $$new_props) $$invalidate(17, duration = $$new_props.duration);
    		if ('hover' in $$new_props) $$invalidate(18, hover = $$new_props.hover);
    		if ('misc' in $$new_props) $$invalidate(5, misc = $$new_props.misc);
    		if ('type' in $$new_props) $$invalidate(6, type = $$new_props.type);
    		if ('state' in $$new_props) $$invalidate(0, state = $$new_props.state);
    		if ('id' in $$new_props) $$invalidate(19, id = $$new_props.id);
    		if ('line' in $$new_props) $$invalidate(20, line = $$new_props.line);
    		if ('$$scope' in $$new_props) $$invalidate(24, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		easingFunctions,
    		LightDark,
    		Burger,
    		Mail,
    		Arrow,
    		PlayPause,
    		Audio,
    		Randomise,
    		Custom,
    		class_,
    		style_,
    		width,
    		height,
    		stroke,
    		color,
    		easing,
    		duration,
    		hover,
    		misc,
    		type,
    		state,
    		id,
    		components,
    		line,
    		origin,
    		DEBUG,
    		h,
    		w,
    		strokes,
    		browser,
    		center
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), $$new_props));
    		if ('class_' in $$props) $$invalidate(1, class_ = $$new_props.class_);
    		if ('style_' in $$props) $$invalidate(2, style_ = $$new_props.style_);
    		if ('width' in $$props) $$invalidate(14, width = $$new_props.width);
    		if ('height' in $$props) $$invalidate(15, height = $$new_props.height);
    		if ('stroke' in $$props) $$invalidate(3, stroke = $$new_props.stroke);
    		if ('color' in $$props) $$invalidate(16, color = $$new_props.color);
    		if ('easing' in $$props) $$invalidate(4, easing = $$new_props.easing);
    		if ('duration' in $$props) $$invalidate(17, duration = $$new_props.duration);
    		if ('hover' in $$props) $$invalidate(18, hover = $$new_props.hover);
    		if ('misc' in $$props) $$invalidate(5, misc = $$new_props.misc);
    		if ('type' in $$props) $$invalidate(6, type = $$new_props.type);
    		if ('state' in $$props) $$invalidate(0, state = $$new_props.state);
    		if ('id' in $$props) $$invalidate(19, id = $$new_props.id);
    		if ('components' in $$props) $$invalidate(12, components = $$new_props.components);
    		if ('line' in $$props) $$invalidate(20, line = $$new_props.line);
    		if ('h' in $$props) $$invalidate(7, h = $$new_props.h);
    		if ('w' in $$props) $$invalidate(8, w = $$new_props.w);
    		if ('strokes' in $$props) $$invalidate(9, strokes = $$new_props.strokes);
    		if ('browser' in $$props) $$invalidate(10, browser = $$new_props.browser);
    		if ('center' in $$props) $$invalidate(11, center = $$new_props.center);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*width, height*/ 49152) {
    			$$invalidate(11, center = { x: width / 2, y: height / 2 });
    		}

    		if ($$self.$$.dirty & /*stroke, color*/ 65544) {
    			$$invalidate(9, strokes = {
    				'stroke-width': stroke,
    				'fill': 'transparent',
    				'stroke': color,
    				'vector-effect': 'non-scaling-stroke'
    			});
    		}

    		if ($$self.$$.dirty & /*width*/ 16384) {
    			$$invalidate(8, w = parseInt(width));
    		}

    		if ($$self.$$.dirty & /*height*/ 32768) {
    			$$invalidate(7, h = parseInt(height));
    		}
    	};

    	$$invalidate(10, browser = typeof window !== "undefined" && typeof window.document !== "undefined");
    	$$props = exclude_internal_props($$props);

    	return [
    		state,
    		class_,
    		style_,
    		stroke,
    		easing,
    		misc,
    		type,
    		h,
    		w,
    		strokes,
    		browser,
    		center,
    		components,
    		$$props,
    		width,
    		height,
    		color,
    		duration,
    		hover,
    		id,
    		line,
    		slots,
    		switch_instance_state_binding,
    		click_handler,
    		$$scope
    	];
    }

    class All_wc extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			class: 1,
    			style: 2,
    			width: 14,
    			height: 15,
    			stroke: 3,
    			color: 16,
    			easing: 4,
    			duration: 17,
    			hover: 18,
    			misc: 5,
    			type: 6,
    			state: 0,
    			id: 19,
    			line: 20
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "All_wc",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get class() {
    		throw new Error("<All_wc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<All_wc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<All_wc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<All_wc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<All_wc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<All_wc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<All_wc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<All_wc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<All_wc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<All_wc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<All_wc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<All_wc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get easing() {
    		throw new Error("<All_wc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set easing(value) {
    		throw new Error("<All_wc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<All_wc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<All_wc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hover() {
    		throw new Error("<All_wc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hover(value) {
    		throw new Error("<All_wc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get misc() {
    		throw new Error("<All_wc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set misc(value) {
    		throw new Error("<All_wc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<All_wc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<All_wc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<All_wc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<All_wc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<All_wc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<All_wc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get line() {
    		throw new Error("<All_wc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set line(value) {
    		throw new Error("<All_wc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Station.svelte generated by Svelte v3.44.0 */

    const { Object: Object_1, console: console_1$1 } = globals;
    const file$2 = "src/Station.svelte";

    // (252:4) {:else}
    function create_else_block(ctx) {
    	let all;
    	let current;

    	all = new All_wc({
    			props: {
    				state: /*STATUS*/ ctx[4] == /*_PLAYING*/ ctx[19],
    				type: "play-pause",
    				width: 60,
    				height: 60
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(all.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(all, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const all_changes = {};
    			if (dirty[0] & /*STATUS*/ 16) all_changes.state = /*STATUS*/ ctx[4] == /*_PLAYING*/ ctx[19];
    			all.$set(all_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(all.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(all.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(all, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(252:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (250:55) 
    function create_if_block_2$1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", "spin block w80px h80px p0-2 b6-dashed radius100pc rel flex row-flex-end-center");
    			add_location(span, file$2, 250, 5, 6394);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(250:55) ",
    		ctx
    	});

    	return block;
    }

    // (248:4) {#if MESSAGE}
    function create_if_block_1$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "REFRESH";
    			attr_dev(div, "class", "clickable plr1 f3 b2-solid ");
    			add_location(div, file$2, 248, 5, 6278);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(248:4) {#if MESSAGE}",
    		ctx
    	});

    	return block;
    }

    // (287:3) {#if VIDEO_JS}
    function create_if_block$1(ctx) {
    	let video;
    	let source;
    	let source_src_value;

    	const block = {
    		c: function create() {
    			video = element("video");
    			source = element("source");
    			if (!src_url_equal(source.src, source_src_value = /*src*/ ctx[13])) attr_dev(source, "src", source_src_value);
    			attr_dev(source, "type", "application/x-mpegURL");
    			add_location(source, file$2, 290, 6, 8096);
    			attr_dev(video, "class", "videojs fill invert bg");
    			add_location(video, file$2, 287, 4, 8026);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, video, anchor);
    			append_dev(video, source);
    			/*video_binding*/ ctx[31](video);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*src*/ 8192 && !src_url_equal(source.src, source_src_value = /*src*/ ctx[13])) {
    				attr_dev(source, "src", source_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(video);
    			/*video_binding*/ ctx[31](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(287:3) {#if VIDEO_JS}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let section;
    	let div6;
    	let span5;
    	let span0;
    	let t0;
    	let t1_value = (/*EVENT*/ ctx[11] || 'none') + "";
    	let t1;
    	let t2;
    	let span1;
    	let t3;
    	let t4;
    	let t5;
    	let span2;
    	let t6;
    	let t7;
    	let t8;
    	let span3;
    	let t9;
    	let t10;
    	let t11;
    	let span4;
    	let t12;
    	let t13_value = /*$volume*/ ctx[8].toFixed(2) + "";
    	let t13;
    	let t14;
    	let div1;
    	let div0;
    	let current_block_type_index;
    	let if_block0;
    	let t15;
    	let span7;
    	let span6;
    	let t16_value = (/*MESSAGE*/ ctx[9] || /*STATUS*/ ctx[4] || '') + "";
    	let t16;
    	let t17;
    	let span8;
    	let svg;
    	let title_1;
    	let desc;
    	let defs;
    	let g2;
    	let g1;
    	let g0;
    	let path;
    	let t18;
    	let div4;
    	let div3;
    	let h1;
    	let t19;
    	let t20;
    	let div2;
    	let t21;
    	let t22;
    	let div5;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1$1, create_if_block_2$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*MESSAGE*/ ctx[9]) return 0;
    		if (/*STATUS*/ ctx[4] == /*_LOADING*/ ctx[18] || /*status*/ ctx[5] == /*_LOADING*/ ctx[18]) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = /*VIDEO_JS*/ ctx[17] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			div6 = element("div");
    			span5 = element("span");
    			span0 = element("span");
    			t0 = text("events = ");
    			t1 = text(t1_value);
    			t2 = space();
    			span1 = element("span");
    			t3 = text("internal = ");
    			t4 = text(/*status*/ ctx[5]);
    			t5 = space();
    			span2 = element("span");
    			t6 = text("external = ");
    			t7 = text(/*STATUS*/ ctx[4]);
    			t8 = space();
    			span3 = element("span");
    			t9 = text("interact = ");
    			t10 = text(/*ACTIVE*/ ctx[12]);
    			t11 = space();
    			span4 = element("span");
    			t12 = text("volume = ");
    			t13 = text(t13_value);
    			t14 = space();
    			div1 = element("div");
    			div0 = element("div");
    			if_block0.c();
    			t15 = space();
    			span7 = element("span");
    			span6 = element("span");
    			t16 = text(t16_value);
    			t17 = space();
    			span8 = element("span");
    			svg = svg_element("svg");
    			title_1 = svg_element("title");
    			desc = svg_element("desc");
    			defs = svg_element("defs");
    			g2 = svg_element("g");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			path = svg_element("path");
    			t18 = space();
    			div4 = element("div");
    			div3 = element("div");
    			h1 = element("h1");
    			t19 = text(/*title*/ ctx[15]);
    			t20 = space();
    			div2 = element("div");
    			t21 = text(/*LIVE*/ ctx[14]);
    			t22 = space();
    			div5 = element("div");
    			if (if_block1) if_block1.c();
    			add_location(span0, file$2, 233, 3, 5794);
    			add_location(span1, file$2, 234, 3, 5837);
    			add_location(span2, file$2, 235, 3, 5873);
    			add_location(span3, file$2, 236, 3, 5909);
    			add_location(span4, file$2, 237, 3, 5945);
    			attr_dev(span5, "class", "minw16em filled abs t0 r0 p1 z-index99 flex column");
    			toggle_class(span5, "none", !/*DEBUG*/ ctx[16] || /*DEBUG*/ ctx[16] && /*idx*/ ctx[0] != /*$index*/ ctx[6]);
    			add_location(span5, file$2, 231, 2, 5615);
    			attr_dev(div0, "class", "h100px cursor flex-column-space-between");
    			add_location(div0, file$2, 243, 3, 6168);
    			add_location(span6, file$2, 262, 4, 6754);
    			attr_dev(span7, "class", "uppercase flex column-center-flex-start f3 h2em");
    			toggle_class(span7, "hide", /*status*/ ctx[5] == /*_PLAYING*/ ctx[19] && !/*ACTIVE*/ ctx[12]);
    			add_location(span7, file$2, 259, 3, 6635);
    			add_location(title_1, file$2, 268, 204, 7143);
    			add_location(desc, file$2, 268, 212, 7151);
    			add_location(defs, file$2, 268, 219, 7158);
    			attr_dev(path, "d", "M2,9 L0,9 L0,14 L5,14 L5,12 L2,12 L2,9 L2,9 Z M0,5 L2,5 L2,2 L5,2 L5,0 L0,0 L0,5 L0,5 Z M12,12 L9,12 L9,14 L14,14 L14,9 L12,9 L12,12 L12,12 Z M9,0 L9,2 L12,2 L12,5 L14,5 L14,0 L9,0 L9,0 Z");
    			add_location(path, file$2, 268, 412, 7351);
    			attr_dev(g0, "transform", "translate(215.000000, 257.000000)");
    			add_location(g0, file$2, 268, 363, 7302);
    			attr_dev(g1, "fill", "var(--color)");
    			attr_dev(g1, "transform", "translate(-215.000000, -257.000000)");
    			add_location(g1, file$2, 268, 292, 7231);
    			attr_dev(g2, "fill", "none");
    			attr_dev(g2, "fill-rule", "evenodd");
    			attr_dev(g2, "stroke", "none");
    			attr_dev(g2, "stroke-width", "1");
    			add_location(g2, file$2, 268, 226, 7165);
    			attr_dev(svg, "class", "w2em h2em");
    			attr_dev(svg, "height", "14px");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "width", "14px");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:sketch", "http://www.vidicon.org");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			add_location(svg, file$2, 268, 4, 6943);
    			attr_dev(span8, "class", "block pointer p2 abs r1 b0");
    			toggle_class(span8, "hide", /*$state*/ ctx[7].isTweening || /*$state*/ ctx[7].isPanning);
    			add_location(span8, file$2, 264, 3, 6807);
    			set_style(div1, "transition", "opacity 0.2s ease");
    			attr_dev(div1, "class", "flex column-center-center z-index99");
    			toggle_class(div1, "invisible", /*idx*/ ctx[0] != /*$index*/ ctx[6] || !/*ACTIVE*/ ctx[12] && /*status*/ ctx[5] == /*_PLAYING*/ ctx[19]);
    			add_location(div1, file$2, 239, 2, 6000);
    			attr_dev(h1, "class", "filled plr0-5 f5 ptb0");
    			add_location(h1, file$2, 275, 4, 7765);
    			attr_dev(div2, "class", "mobile-hide filled f5 plr1 ptb0-5");
    			add_location(div2, file$2, 279, 4, 7833);
    			attr_dev(div3, "class", "filled flex column-center-center mb2 maxw50pc");
    			add_location(div3, file$2, 274, 3, 7701);
    			attr_dev(div4, "class", "flex column-center-center z-index99 p2");
    			toggle_class(div4, "none", /*status*/ ctx[5] == /*_PLAYING*/ ctx[19] || /*idx*/ ctx[0] == /*$index*/ ctx[6]);
    			add_location(div4, file$2, 271, 2, 7591);
    			attr_dev(div5, "class", "fill");
    			toggle_class(div5, "block", /*status*/ ctx[5] == /*_PLAYING*/ ctx[19]);
    			toggle_class(div5, "none", /*status*/ ctx[5] != /*_PLAYING*/ ctx[19]);
    			add_location(div5, file$2, 282, 2, 7914);
    			attr_dev(div6, "class", "flex column-stretch-center grow");
    			set_style(div6, "height", /*height*/ ctx[2] + "px");

    			set_style(div6, "transform", "scale(1," + (/*stretch*/ ctx[3]
    			? /*width*/ ctx[1] / /*height*/ ctx[2]
    			: 1) + ")");

    			toggle_class(div6, "b8-solid", /*$state*/ ctx[7].mousedown && !/*stretch*/ ctx[3]);
    			toggle_class(div6, "b4-solid", !/*$state*/ ctx[7].mousedown && !/*stretch*/ ctx[3]);
    			add_location(div6, file$2, 226, 1, 5390);
    			attr_dev(section, "class", "fill flex row-center-center ");
    			add_location(section, file$2, 222, 0, 5290);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div6);
    			append_dev(div6, span5);
    			append_dev(span5, span0);
    			append_dev(span0, t0);
    			append_dev(span0, t1);
    			append_dev(span5, t2);
    			append_dev(span5, span1);
    			append_dev(span1, t3);
    			append_dev(span1, t4);
    			append_dev(span5, t5);
    			append_dev(span5, span2);
    			append_dev(span2, t6);
    			append_dev(span2, t7);
    			append_dev(span5, t8);
    			append_dev(span5, span3);
    			append_dev(span3, t9);
    			append_dev(span3, t10);
    			append_dev(span5, t11);
    			append_dev(span5, span4);
    			append_dev(span4, t12);
    			append_dev(span4, t13);
    			append_dev(div6, t14);
    			append_dev(div6, div1);
    			append_dev(div1, div0);
    			if_blocks[current_block_type_index].m(div0, null);
    			append_dev(div1, t15);
    			append_dev(div1, span7);
    			append_dev(span7, span6);
    			append_dev(span6, t16);
    			append_dev(div1, t17);
    			append_dev(div1, span8);
    			append_dev(span8, svg);
    			append_dev(svg, title_1);
    			append_dev(svg, desc);
    			append_dev(svg, defs);
    			append_dev(svg, g2);
    			append_dev(g2, g1);
    			append_dev(g1, g0);
    			append_dev(g0, path);
    			append_dev(div6, t18);
    			append_dev(div6, div4);
    			append_dev(div4, div3);
    			append_dev(div3, h1);
    			append_dev(h1, t19);
    			append_dev(div3, t20);
    			append_dev(div3, div2);
    			append_dev(div2, t21);
    			append_dev(div6, t22);
    			append_dev(div6, div5);
    			if (if_block1) if_block1.m(div5, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*onPlayPause*/ ctx[20], false, false, false),
    					listen_dev(span8, "click", /*openFullscreen*/ ctx[22], false, false, false),
    					listen_dev(section, "mousemove", /*onInteract*/ ctx[21], false, false, false),
    					listen_dev(section, "click", /*onInteract*/ ctx[21], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*EVENT*/ 2048) && t1_value !== (t1_value = (/*EVENT*/ ctx[11] || 'none') + "")) set_data_dev(t1, t1_value);
    			if (!current || dirty[0] & /*status*/ 32) set_data_dev(t4, /*status*/ ctx[5]);
    			if (!current || dirty[0] & /*STATUS*/ 16) set_data_dev(t7, /*STATUS*/ ctx[4]);
    			if (!current || dirty[0] & /*ACTIVE*/ 4096) set_data_dev(t10, /*ACTIVE*/ ctx[12]);
    			if ((!current || dirty[0] & /*$volume*/ 256) && t13_value !== (t13_value = /*$volume*/ ctx[8].toFixed(2) + "")) set_data_dev(t13, t13_value);

    			if (dirty[0] & /*DEBUG, idx, $index*/ 65601) {
    				toggle_class(span5, "none", !/*DEBUG*/ ctx[16] || /*DEBUG*/ ctx[16] && /*idx*/ ctx[0] != /*$index*/ ctx[6]);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div0, null);
    			}

    			if ((!current || dirty[0] & /*MESSAGE, STATUS*/ 528) && t16_value !== (t16_value = (/*MESSAGE*/ ctx[9] || /*STATUS*/ ctx[4] || '') + "")) set_data_dev(t16, t16_value);

    			if (dirty[0] & /*status, _PLAYING, ACTIVE*/ 528416) {
    				toggle_class(span7, "hide", /*status*/ ctx[5] == /*_PLAYING*/ ctx[19] && !/*ACTIVE*/ ctx[12]);
    			}

    			if (dirty[0] & /*$state*/ 128) {
    				toggle_class(span8, "hide", /*$state*/ ctx[7].isTweening || /*$state*/ ctx[7].isPanning);
    			}

    			if (dirty[0] & /*idx, $index, ACTIVE, status, _PLAYING*/ 528481) {
    				toggle_class(div1, "invisible", /*idx*/ ctx[0] != /*$index*/ ctx[6] || !/*ACTIVE*/ ctx[12] && /*status*/ ctx[5] == /*_PLAYING*/ ctx[19]);
    			}

    			if (!current || dirty[0] & /*title*/ 32768) set_data_dev(t19, /*title*/ ctx[15]);
    			if (!current || dirty[0] & /*LIVE*/ 16384) set_data_dev(t21, /*LIVE*/ ctx[14]);

    			if (dirty[0] & /*status, _PLAYING, idx, $index*/ 524385) {
    				toggle_class(div4, "none", /*status*/ ctx[5] == /*_PLAYING*/ ctx[19] || /*idx*/ ctx[0] == /*$index*/ ctx[6]);
    			}

    			if (/*VIDEO_JS*/ ctx[17]) if_block1.p(ctx, dirty);

    			if (dirty[0] & /*status, _PLAYING*/ 524320) {
    				toggle_class(div5, "block", /*status*/ ctx[5] == /*_PLAYING*/ ctx[19]);
    			}

    			if (dirty[0] & /*status, _PLAYING*/ 524320) {
    				toggle_class(div5, "none", /*status*/ ctx[5] != /*_PLAYING*/ ctx[19]);
    			}

    			if (!current || dirty[0] & /*height*/ 4) {
    				set_style(div6, "height", /*height*/ ctx[2] + "px");
    			}

    			if (!current || dirty[0] & /*stretch, width, height*/ 14) {
    				set_style(div6, "transform", "scale(1," + (/*stretch*/ ctx[3]
    				? /*width*/ ctx[1] / /*height*/ ctx[2]
    				: 1) + ")");
    			}

    			if (dirty[0] & /*$state, stretch*/ 136) {
    				toggle_class(div6, "b8-solid", /*$state*/ ctx[7].mousedown && !/*stretch*/ ctx[3]);
    			}

    			if (dirty[0] & /*$state, stretch*/ 136) {
    				toggle_class(div6, "b4-solid", !/*$state*/ ctx[7].mousedown && !/*stretch*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if_blocks[current_block_type_index].d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const SRC = 'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8';

    function instance$2($$self, $$props, $$invalidate) {
    	let station;
    	let id;
    	let title;
    	let src;
    	let poster;
    	let LIVE;
    	let $index;
    	let $state;
    	let $volume;
    	let $trigger;
    	let $live;
    	let $data;
    	validate_store(index, 'index');
    	component_subscribe($$self, index, $$value => $$invalidate(6, $index = $$value));
    	validate_store(state, 'state');
    	component_subscribe($$self, state, $$value => $$invalidate(7, $state = $$value));
    	validate_store(volume, 'volume');
    	component_subscribe($$self, volume, $$value => $$invalidate(8, $volume = $$value));
    	validate_store(trigger, 'trigger');
    	component_subscribe($$self, trigger, $$value => $$invalidate(28, $trigger = $$value));
    	validate_store(live, 'live');
    	component_subscribe($$self, live, $$value => $$invalidate(29, $live = $$value));
    	validate_store(data, 'data');
    	component_subscribe($$self, data, $$value => $$invalidate(30, $data = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Station', slots, []);
    	let { idx } = $$props;
    	let { width } = $$props;
    	let { height } = $$props;
    	let { stretch } = $$props;
    	let DEBUG = window.location.search == '?debug';
    	let VIDEO_JS = true; // DEBUG
    	let ready = false;
    	let MESSAGE = '';
    	let TIMEOUT;
    	let _LOADING = 'loading';
    	let _PLAYING = 'playing';
    	let _MESSAGE = 'message';
    	let _PAUSED = 'paused';
    	let STATUS = _PLAYING;
    	let DATA = null;
    	let el, player;
    	let status = _LOADING;
    	let EVENT;

    	let events = {
    		[_PLAYING]: [_PLAYING],
    		[_PAUSED]: ['canplay', 'canplaythrough', 'pause', 'canplay'],
    		[_LOADING]: ['loadstart', 'waiting'],
    		[_MESSAGE]: ['error', 'abort', 'suspend', 'ended'],
    		misc: [
    			'progress',
    			'loadedmetadata',
    			'emptied',
    			'stalled',
    			'seeking',
    			'loadeddata',
    			'seeked',
    			'durationchange',
    			'timeupdate',
    			'play',
    			'pause',
    			'ratechange',
    			'resize',
    			'volumechange'
    		]
    	};

    	onMount(async e => {
    		
    	});

    	async function init() {
    		if (!VIDEO_JS) return;

    		return new Promise((resolve, reject) => {
    				let w = window;
    				if (!w.players) w.players = {};
    				console.log(`[Station] 📀 ${id} creating new player`);

    				w.players[idx] = $$invalidate(24, player = videojs(
    					el,
    					{
    						controls: true,
    						autoplay: false,
    						autoload: false,
    						loadingSpinner: false,
    						preload: 'auto'
    					},
    					e => {
    						console.log(`[Station] 📀 ✅ ${id} player is ready ${src}`);
    						$$invalidate(23, ready = true);
    						resolve(e);
    					}
    				));

    				for (let [type, list] of Object.entries(events)) {
    					for (let event of list) {
    						player.on(event, e => {
    							$$invalidate(11, EVENT = event);
    							if (TIMEOUT) clearTimeout(TIMEOUT);
    							if (type != 'misc') $$invalidate(5, status = type);
    							if (type != 'misc') console.log(`[Station] ⏱⏱⏱ ${id} ${type} ${event}`);
    							if (type == _PAUSED || type == _PLAYING) $$invalidate(5, status = player.paused() ? _PAUSED : _PLAYING);

    							// let msgs = {
    							// 	waiting: 'CONNECTING',
    							// 	durationchange: 'DOWNLOADING',
    							// }
    							// MESSAGE = msgs[event] || MESSAGE
    							if (type == _MESSAGE) {
    								let messages = {
    									error: 'Could not load stream',
    									abort: 'Stream was aborted',
    									suspend: 'Stream was suspended',
    									ended: 'Stream was ended'
    								};

    								$$invalidate(9, MESSAGE = messages[event]);
    								console.log(`[Station] 🚨 ⏱ message received ${event} ${MESSAGE}`);
    							} // console.log('!!!', type, MESSAGE)

    							TIMEOUT = setTimeout(
    								e => {
    									// console.log(`[Station] ${event} triggered timeout status=${status} STATUS=${STATUS} MESSAGE=${MESSAGE || 'null'}`, player.bufferedPercent())
    									$$invalidate(4, STATUS = status);

    									if (type == _PAUSED || type == _PLAYING) {
    										$$invalidate(4, STATUS = player.paused() ? _PAUSED : _PLAYING);
    									}
    								},
    								100
    							);
    						});
    					}
    				}
    			});
    	}

    	let lastIndex = -999;
    	let lastTrigger = -999;
    	let zoom = 1;

    	function onPlayPause(e) {
    		if (!VIDEO_JS) return;
    		const b = STATUS == _PLAYING;
    		$$invalidate(4, STATUS = b ? _PAUSED : _PLAYING);
    		console.log(`[Station] clicked ${STATUS}`);
    		b ? player.pause() : player.play();
    	}

    	let ACTIVE = true;
    	let INTERACT;

    	function onInteract(e) {
    		$$invalidate(12, ACTIVE = true);
    		if (INTERACT) clearTimeout(INTERACT);
    		INTERACT = setTimeout(e => $$invalidate(12, ACTIVE = false), 2000);
    	}

    	function openFullscreen() {
    		if (el.requestFullscreen) {
    			el.requestFullscreen();
    		} else if (el.webkitRequestFullscreen) {
    			// Safari
    			el.webkitRequestFullscreen();
    		} else if (el.msRequestFullscreen) {
    			// IE
    			el.msRequestFullscreen();
    		}
    	}

    	const writable_props = ['idx', 'width', 'height', 'stretch'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Station> was created with unknown prop '${key}'`);
    	});

    	function video_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			el = $$value;
    			$$invalidate(10, el);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('idx' in $$props) $$invalidate(0, idx = $$props.idx);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    		if ('stretch' in $$props) $$invalidate(3, stretch = $$props.stretch);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		All: All_wc,
    		data,
    		index,
    		state,
    		trigger,
    		volume,
    		live,
    		play_text,
    		idx,
    		width,
    		height,
    		stretch,
    		DEBUG,
    		VIDEO_JS,
    		ready,
    		MESSAGE,
    		TIMEOUT,
    		_LOADING,
    		_PLAYING,
    		_MESSAGE,
    		_PAUSED,
    		STATUS,
    		DATA,
    		SRC,
    		el,
    		player,
    		status,
    		EVENT,
    		events,
    		init,
    		lastIndex,
    		lastTrigger,
    		zoom,
    		onPlayPause,
    		ACTIVE,
    		INTERACT,
    		onInteract,
    		openFullscreen,
    		id,
    		src,
    		LIVE,
    		station,
    		poster,
    		title,
    		$index,
    		$state,
    		$volume,
    		$trigger,
    		$live,
    		$data
    	});

    	$$self.$inject_state = $$props => {
    		if ('idx' in $$props) $$invalidate(0, idx = $$props.idx);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    		if ('stretch' in $$props) $$invalidate(3, stretch = $$props.stretch);
    		if ('DEBUG' in $$props) $$invalidate(16, DEBUG = $$props.DEBUG);
    		if ('VIDEO_JS' in $$props) $$invalidate(17, VIDEO_JS = $$props.VIDEO_JS);
    		if ('ready' in $$props) $$invalidate(23, ready = $$props.ready);
    		if ('MESSAGE' in $$props) $$invalidate(9, MESSAGE = $$props.MESSAGE);
    		if ('TIMEOUT' in $$props) TIMEOUT = $$props.TIMEOUT;
    		if ('_LOADING' in $$props) $$invalidate(18, _LOADING = $$props._LOADING);
    		if ('_PLAYING' in $$props) $$invalidate(19, _PLAYING = $$props._PLAYING);
    		if ('_MESSAGE' in $$props) _MESSAGE = $$props._MESSAGE;
    		if ('_PAUSED' in $$props) $$invalidate(37, _PAUSED = $$props._PAUSED);
    		if ('STATUS' in $$props) $$invalidate(4, STATUS = $$props.STATUS);
    		if ('DATA' in $$props) DATA = $$props.DATA;
    		if ('el' in $$props) $$invalidate(10, el = $$props.el);
    		if ('player' in $$props) $$invalidate(24, player = $$props.player);
    		if ('status' in $$props) $$invalidate(5, status = $$props.status);
    		if ('EVENT' in $$props) $$invalidate(11, EVENT = $$props.EVENT);
    		if ('events' in $$props) events = $$props.events;
    		if ('lastIndex' in $$props) $$invalidate(25, lastIndex = $$props.lastIndex);
    		if ('lastTrigger' in $$props) lastTrigger = $$props.lastTrigger;
    		if ('zoom' in $$props) zoom = $$props.zoom;
    		if ('ACTIVE' in $$props) $$invalidate(12, ACTIVE = $$props.ACTIVE);
    		if ('INTERACT' in $$props) INTERACT = $$props.INTERACT;
    		if ('id' in $$props) $$invalidate(26, id = $$props.id);
    		if ('src' in $$props) $$invalidate(13, src = $$props.src);
    		if ('LIVE' in $$props) $$invalidate(14, LIVE = $$props.LIVE);
    		if ('station' in $$props) $$invalidate(27, station = $$props.station);
    		if ('poster' in $$props) poster = $$props.poster;
    		if ('title' in $$props) $$invalidate(15, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*$data, idx*/ 1073741825) {
    			$$invalidate(27, station = $data?.stations?.[idx]);
    		}

    		if ($$self.$$.dirty[0] & /*station*/ 134217728) {
    			$$invalidate(26, id = station?.id || 'no-id');
    		}

    		if ($$self.$$.dirty[0] & /*station*/ 134217728) {
    			$$invalidate(15, title = station?.title || 'No title');
    		}

    		if ($$self.$$.dirty[0] & /*station*/ 134217728) {
    			$$invalidate(13, src = station?.src || SRC);
    		}

    		if ($$self.$$.dirty[0] & /*station, idx*/ 134217729) {
    			poster = station?.poster || `data/demo${idx + 1}.png`;
    		}

    		if ($$self.$$.dirty[0] & /*$live, id*/ 603979776) {
    			$$invalidate(14, LIVE = ($live || []).find(l => l.id == id)?.message || '');
    		}

    		if ($$self.$$.dirty[0] & /*$state, $trigger, idx, STATUS, player, id, ready, status*/ 360710321) {
    			(async _trigger => {
    				if (!VIDEO_JS) return;
    				if (!$state.data || !$state.inited) return;

    				if ($trigger == idx) {
    					if (STATUS == _LOADING) $$invalidate(4, STATUS = _PLAYING);

    					if (!player) {
    						console.log(`[Station] 📀 🌴 initing ${id}`);
    						await init();
    					}

    					if (player.paused() && ready && STATUS == _PLAYING) {
    						console.log(`[Station] 📀 🌿 playing ${id}`);

    						try {
    							const res = await player.play();
    						} catch(err) {
    							console.log(`[Station] 📀 ❌ ${id} ${err.message}`);

    							// status = _PAUSED
    							$$invalidate(5, status = $$invalidate(4, STATUS = _PAUSED));
    						} // await player.pause()
    					}
    				} else {
    					if (player) {
    						if (!player.paused()) {
    							console.log(`[Station] 📀 🛑 pausing ${id}`);
    							$$invalidate(4, STATUS = _PAUSED);
    							await player.pause();
    						}
    					}
    				}

    				setTimeout(
    					e => {
    						if (!player) return;
    						console.log(`[Station] setting volume to max for ${id} `);
    						volume.set(1);

    						if (!player.paused() && (status != _PLAYING || STATUS != _PLAYING)) ; // status = _PLAYING
    						// STATUS = null
    					},
    					100
    				);

    				lastTrigger = $trigger;
    			})();
    		}

    		if ($$self.$$.dirty[0] & /*player, $volume*/ 16777472) {
    			(_vol => {
    				if (!player) return;
    				if (player.volume() == $volume) return;
    				player.volume($volume);
    			})();
    		}

    		if ($$self.$$.dirty[0] & /*$state, $index, idx, lastIndex, id, player*/ 117440705) {
    			(async _index => {
    				if (!VIDEO_JS) return;
    				if (!$state.data) return;

    				if ($index == idx && lastIndex != $index) {
    					console.log(`[Station] 📀 👀 loading ${id}`);

    					if (player) {
    						$$invalidate(5, status = $$invalidate(4, STATUS = player.paused() ? _LOADING : _PLAYING));
    					} else {
    						$$invalidate(5, status = $$invalidate(4, STATUS = _LOADING));
    					}
    				}

    				$$invalidate(25, lastIndex = $index);
    			})();
    		}
    	};

    	return [
    		idx,
    		width,
    		height,
    		stretch,
    		STATUS,
    		status,
    		$index,
    		$state,
    		$volume,
    		MESSAGE,
    		el,
    		EVENT,
    		ACTIVE,
    		src,
    		LIVE,
    		title,
    		DEBUG,
    		VIDEO_JS,
    		_LOADING,
    		_PLAYING,
    		onPlayPause,
    		onInteract,
    		openFullscreen,
    		ready,
    		player,
    		lastIndex,
    		id,
    		station,
    		$trigger,
    		$live,
    		$data,
    		video_binding
    	];
    }

    class Station extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { idx: 0, width: 1, height: 2, stretch: 3 }, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Station",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*idx*/ ctx[0] === undefined && !('idx' in props)) {
    			console_1$1.warn("<Station> was created without expected prop 'idx'");
    		}

    		if (/*width*/ ctx[1] === undefined && !('width' in props)) {
    			console_1$1.warn("<Station> was created without expected prop 'width'");
    		}

    		if (/*height*/ ctx[2] === undefined && !('height' in props)) {
    			console_1$1.warn("<Station> was created without expected prop 'height'");
    		}

    		if (/*stretch*/ ctx[3] === undefined && !('stretch' in props)) {
    			console_1$1.warn("<Station> was created without expected prop 'stretch'");
    		}
    	}

    	get idx() {
    		throw new Error("<Station>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set idx(value) {
    		throw new Error("<Station>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Station>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Station>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Station>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Station>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stretch() {
    		throw new Error("<Station>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stretch(value) {
    		throw new Error("<Station>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Document.svelte generated by Svelte v3.44.0 */
    const file$1 = "src/Document.svelte";

    function create_fragment$1(ctx) {
    	let section;
    	let div3;
    	let div0;
    	let t0;
    	let div2;
    	let h1;
    	let t1;
    	let t2;
    	let div1;
    	let t3;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div3 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div2 = element("div");
    			h1 = element("h1");
    			t1 = text(/*$play_text*/ ctx[5]);
    			t2 = space();
    			div1 = element("div");
    			t3 = text(/*LIVE*/ ctx[6]);
    			attr_dev(div0, "class", "flex column-center-center z-index99 markdown");
    			toggle_class(div0, "none", /*idx*/ ctx[0] != /*$index*/ ctx[4]);
    			add_location(div0, file$1, 36, 2, 795);
    			attr_dev(h1, "class", "filled plr0-5 f5 ptb0");
    			add_location(h1, file$1, 44, 3, 1002);
    			attr_dev(div1, "class", "mobile-hide filled f5 plr1 ptb0-5");
    			add_location(div1, file$1, 48, 3, 1071);
    			attr_dev(div2, "class", "flex column-center-center z-index99");
    			toggle_class(div2, "none", /*idx*/ ctx[0] == /*$index*/ ctx[4]);
    			add_location(div2, file$1, 41, 2, 915);
    			attr_dev(div3, "class", "flex column-center-center grow maxw22em mobile-100 plr1 text-center");
    			set_style(div3, "height", /*height*/ ctx[2] + "px");

    			set_style(div3, "transform", "scale(1," + (/*stretch*/ ctx[3]
    			? /*width*/ ctx[1] / /*height*/ ctx[2]
    			: 1) + ")");

    			toggle_class(div3, "b2-solid", !/*stretch*/ ctx[3]);
    			add_location(div3, file$1, 32, 1, 603);
    			attr_dev(section, "class", "fill flex row-center-center ");
    			add_location(section, file$1, 31, 0, 555);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div3);
    			append_dev(div3, div0);
    			div0.innerHTML = /*body*/ ctx[7];
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, h1);
    			append_dev(h1, t1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, t3);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*body*/ 128) div0.innerHTML = /*body*/ ctx[7];
    			if (dirty & /*idx, $index*/ 17) {
    				toggle_class(div0, "none", /*idx*/ ctx[0] != /*$index*/ ctx[4]);
    			}

    			if (dirty & /*$play_text*/ 32) set_data_dev(t1, /*$play_text*/ ctx[5]);
    			if (dirty & /*LIVE*/ 64) set_data_dev(t3, /*LIVE*/ ctx[6]);

    			if (dirty & /*idx, $index*/ 17) {
    				toggle_class(div2, "none", /*idx*/ ctx[0] == /*$index*/ ctx[4]);
    			}

    			if (dirty & /*height*/ 4) {
    				set_style(div3, "height", /*height*/ ctx[2] + "px");
    			}

    			if (dirty & /*stretch, width, height*/ 14) {
    				set_style(div3, "transform", "scale(1," + (/*stretch*/ ctx[3]
    				? /*width*/ ctx[1] / /*height*/ ctx[2]
    				: 1) + ")");
    			}

    			if (dirty & /*stretch*/ 8) {
    				toggle_class(div3, "b2-solid", !/*stretch*/ ctx[3]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let body;
    	let LIVE;
    	let $index;
    	let $state;
    	let $trigger;
    	let $play_text;
    	let $live;
    	let $data;
    	validate_store(index, 'index');
    	component_subscribe($$self, index, $$value => $$invalidate(4, $index = $$value));
    	validate_store(state, 'state');
    	component_subscribe($$self, state, $$value => $$invalidate(9, $state = $$value));
    	validate_store(trigger, 'trigger');
    	component_subscribe($$self, trigger, $$value => $$invalidate(10, $trigger = $$value));
    	validate_store(play_text, 'play_text');
    	component_subscribe($$self, play_text, $$value => $$invalidate(5, $play_text = $$value));
    	validate_store(live, 'live');
    	component_subscribe($$self, live, $$value => $$invalidate(11, $live = $$value));
    	validate_store(data, 'data');
    	component_subscribe($$self, data, $$value => $$invalidate(12, $data = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Document', slots, []);
    	let { idx } = $$props;
    	let { width } = $$props;
    	let { height } = $$props;
    	let { stretch } = $$props;
    	let lastIndex = -2;
    	const writable_props = ['idx', 'width', 'height', 'stretch'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Document> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('idx' in $$props) $$invalidate(0, idx = $$props.idx);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    		if ('stretch' in $$props) $$invalidate(3, stretch = $$props.stretch);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		data,
    		index,
    		state,
    		trigger,
    		play_text,
    		live,
    		idx,
    		width,
    		height,
    		stretch,
    		lastIndex,
    		LIVE,
    		body,
    		$index,
    		$state,
    		$trigger,
    		$play_text,
    		$live,
    		$data
    	});

    	$$self.$inject_state = $$props => {
    		if ('idx' in $$props) $$invalidate(0, idx = $$props.idx);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    		if ('stretch' in $$props) $$invalidate(3, stretch = $$props.stretch);
    		if ('lastIndex' in $$props) $$invalidate(8, lastIndex = $$props.lastIndex);
    		if ('LIVE' in $$props) $$invalidate(6, LIVE = $$props.LIVE);
    		if ('body' in $$props) $$invalidate(7, body = $$props.body);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$data*/ 4096) {
    			$$invalidate(7, body = $data?.play || '');
    		}

    		if ($$self.$$.dirty & /*$live, $play_text*/ 2080) {
    			$$invalidate(6, LIVE = ($live || []).find(l => l.id == $play_text)?.message || '');
    		}

    		if ($$self.$$.dirty & /*$state, $trigger, idx*/ 1537) {
    			(async _trigger => {
    				if (!$state.data || !$state.inited) return;
    			})();
    		}

    		if ($$self.$$.dirty & /*$state, lastIndex, $index*/ 784) {
    			(async _index => {
    				if (!$state.data || lastIndex == $index) return;
    				$$invalidate(8, lastIndex = $index);
    			})();
    		}
    	};

    	return [
    		idx,
    		width,
    		height,
    		stretch,
    		$index,
    		$play_text,
    		LIVE,
    		body,
    		lastIndex,
    		$state,
    		$trigger,
    		$live,
    		$data
    	];
    }

    class Document extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { idx: 0, width: 1, height: 2, stretch: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Document",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*idx*/ ctx[0] === undefined && !('idx' in props)) {
    			console.warn("<Document> was created without expected prop 'idx'");
    		}

    		if (/*width*/ ctx[1] === undefined && !('width' in props)) {
    			console.warn("<Document> was created without expected prop 'width'");
    		}

    		if (/*height*/ ctx[2] === undefined && !('height' in props)) {
    			console.warn("<Document> was created without expected prop 'height'");
    		}

    		if (/*stretch*/ ctx[3] === undefined && !('stretch' in props)) {
    			console.warn("<Document> was created without expected prop 'stretch'");
    		}
    	}

    	get idx() {
    		throw new Error("<Document>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set idx(value) {
    		throw new Error("<Document>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Document>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Document>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Document>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Document>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stretch() {
    		throw new Error("<Document>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stretch(value) {
    		throw new Error("<Document>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.44.0 */

    const { console: console_1, window: window_1 } = globals;
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	child_ctx[27] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	child_ctx[27] = i;
    	return child_ctx;
    }

    // (118:1) {#if $state.inited && $index <= 5 && $state.data}
    function create_if_block_1(ctx) {
    	let div8;
    	let div7;
    	let header;
    	let h1;
    	let a0;
    	let img;
    	let img_src_value;
    	let t0;
    	let span0;
    	let t2;
    	let nav;
    	let t3;
    	let div0;
    	let t5;
    	let article;
    	let div2;
    	let canvas;
    	let t6;
    	let div1;
    	let cube;
    	let t7;
    	let footer0;
    	let div3;
    	let t8;
    	let span1;
    	let t9;
    	let div4;
    	let t10;
    	let t11;
    	let footer1;
    	let div5;
    	let t12;
    	let a1;
    	let t14;
    	let div6;
    	let t15_value = timezone() + "";
    	let t15;
    	let t16;
    	let t17;
    	let t18;
    	let t19;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*$data*/ ctx[3]?.nav || [];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	cube = new Cube({
    			props: { components: /*components*/ ctx[11] },
    			$$inline: true
    		});

    	let each_value = [
    		.../*$data*/ ctx[3]?.stations || [],
    		{
    			id: /*$play_text*/ ctx[2],
    			title: /*$play_text*/ ctx[2]
    		}
    	];

    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div7 = element("div");
    			header = element("header");
    			h1 = element("h1");
    			a0 = element("a");
    			img = element("img");
    			t0 = space();
    			span0 = element("span");
    			span0.textContent = "VIDICON";
    			t2 = space();
    			nav = element("nav");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t3 = space();
    			div0 = element("div");
    			div0.textContent = `${_CHAT}`;
    			t5 = space();
    			article = element("article");
    			div2 = element("div");
    			canvas = element("canvas");
    			t6 = space();
    			div1 = element("div");
    			create_component(cube.$$.fragment);
    			t7 = space();
    			footer0 = element("footer");
    			div3 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			span1 = element("span");
    			t9 = space();
    			div4 = element("div");
    			t10 = text(/*LIVE*/ ctx[6]);
    			t11 = space();
    			footer1 = element("footer");
    			div5 = element("div");
    			t12 = text("Powered by  \n\t\t\t\t\t\t");
    			a1 = element("a");
    			a1.textContent = "scanlines.xyz";
    			t14 = space();
    			div6 = element("div");
    			t15 = text(t15_value);
    			t16 = space();
    			t17 = text(/*timeLocal*/ ctx[4]);
    			t18 = text(" / PT ");
    			t19 = text(/*timeWest*/ ctx[5]);
    			if (!src_url_equal(img.src, img_src_value = "vidicon.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "w100pc");
    			add_location(img, file, 126, 7, 3238);
    			attr_dev(span0, "class", "abs invisible");
    			add_location(span0, file, 127, 7, 3286);
    			attr_dev(a0, "href", "#");
    			add_location(a0, file, 123, 6, 3168);
    			attr_dev(h1, "class", "flex maxw8em row-flex-start-center overflow-hidden rel");
    			add_location(h1, file, 122, 5, 3094);
    			attr_dev(div0, "class", "pointer clickable b2-solid plr1");
    			attr_dev(div0, "f", "");
    			toggle_class(div0, "filled", /*$chat*/ ctx[7]);
    			add_location(div0, file, 139, 6, 3746);
    			attr_dev(nav, "class", "flex no-basis row-flex-start-center maxwidth f3 monospace ptb1 z-index99 make-row");
    			add_location(nav, file, 131, 5, 3357);
    			attr_dev(header, "class", "flex row-space-between-center monospace maxwidth no-basis grow ptb1 wrap make-column");
    			add_location(header, file, 121, 4, 2987);
    			attr_dev(canvas, "width", 1280);
    			attr_dev(canvas, "height", 720);
    			attr_dev(canvas, "class", "w100pc invisible maxwidth");
    			add_location(canvas, file, 150, 6, 4093);
    			attr_dev(div1, "class", "cube fill flex relative grabbable");
    			add_location(div1, file, 154, 6, 4194);
    			attr_dev(div2, "class", "flex flex row-center-center relative b0-solid");
    			add_location(div2, file, 148, 5, 4019);
    			attr_dev(article, "class", "flex grow row-center-center");
    			add_location(article, file, 146, 4, 3966);
    			attr_dev(div3, "class", "flex ptb0-5 row-flex-start-center wrap make-row");
    			add_location(div3, file, 164, 5, 4567);
    			attr_dev(span1, "class", "w2em h0em block");
    			add_location(span1, file, 181, 5, 5225);
    			attr_dev(div4, "class", "flex ptb0-5 row");
    			add_location(div4, file, 182, 5, 5263);
    			attr_dev(footer0, "class", "flex no-basis grow row-space-between-center maxwidth f3 monospace z-index99 wrap ptb0-5 make-column make-reverse");
    			add_location(footer0, file, 163, 4, 4431);
    			attr_dev(a1, "href", "https://scanlines.xyz");
    			attr_dev(a1, "class", "bb2-solid ml0-5");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file, 189, 6, 5436);
    			add_location(div5, file, 187, 5, 5405);
    			add_location(div6, file, 191, 5, 5543);
    			attr_dev(footer1, "class", "flex row-space-between-center ptb0-5 monospace");
    			add_location(footer1, file, 186, 4, 5336);
    			attr_dev(div7, "class", "maxwidth flex column");
    			add_location(div7, file, 120, 3, 2948);
    			attr_dev(div8, "class", "flex column-center-center p1 grow w100pc make-column");
    			add_location(div8, file, 119, 2, 2878);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div7);
    			append_dev(div7, header);
    			append_dev(header, h1);
    			append_dev(h1, a0);
    			append_dev(a0, img);
    			append_dev(a0, t0);
    			append_dev(a0, span0);
    			append_dev(header, t2);
    			append_dev(header, nav);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(nav, null);
    			}

    			append_dev(nav, t3);
    			append_dev(nav, div0);
    			append_dev(div7, t5);
    			append_dev(div7, article);
    			append_dev(article, div2);
    			append_dev(div2, canvas);
    			append_dev(div2, t6);
    			append_dev(div2, div1);
    			mount_component(cube, div1, null);
    			append_dev(div7, t7);
    			append_dev(div7, footer0);
    			append_dev(footer0, div3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div3, null);
    			}

    			append_dev(footer0, t8);
    			append_dev(footer0, span1);
    			append_dev(footer0, t9);
    			append_dev(footer0, div4);
    			append_dev(div4, t10);
    			append_dev(div7, t11);
    			append_dev(div7, footer1);
    			append_dev(footer1, div5);
    			append_dev(div5, t12);
    			append_dev(div5, a1);
    			append_dev(footer1, t14);
    			append_dev(footer1, div6);
    			append_dev(div6, t15);
    			append_dev(div6, t16);
    			append_dev(div6, t17);
    			append_dev(div6, t18);
    			append_dev(div6, t19);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a0, "click", /*click_handler*/ ctx[18], false, false, false),
    					listen_dev(div0, "click", /*onToggleChat*/ ctx[10], false, false, false),
    					listen_dev(div1, "mousedown", /*mousedown_handler*/ ctx[19], false, false, false),
    					listen_dev(div1, "mouseup", /*mouseup_handler*/ ctx[20], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$data*/ 8) {
    				each_value_1 = /*$data*/ ctx[3]?.nav || [];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(nav, t3);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*$chat*/ 128) {
    				toggle_class(div0, "filled", /*$chat*/ ctx[7]);
    			}

    			if (dirty & /*$data, $play_text, $index, $smoothing*/ 269) {
    				each_value = [
    					.../*$data*/ ctx[3]?.stations || [],
    					{
    						id: /*$play_text*/ ctx[2],
    						title: /*$play_text*/ ctx[2]
    					}
    				];

    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div3, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (!current || dirty & /*LIVE*/ 64) set_data_dev(t10, /*LIVE*/ ctx[6]);
    			if (!current || dirty & /*timeLocal*/ 16) set_data_dev(t17, /*timeLocal*/ ctx[4]);
    			if (!current || dirty & /*timeWest*/ 32) set_data_dev(t19, /*timeWest*/ ctx[5]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cube.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cube.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    			destroy_each(each_blocks_1, detaching);
    			destroy_component(cube);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(118:1) {#if $state.inited && $index <= 5 && $state.data}",
    		ctx
    	});

    	return block;
    }

    // (133:6) {#each ($data?.nav || []) as link, idx}
    function create_each_block_1(ctx) {
    	let a;
    	let t0_value = /*link*/ ctx[25]?.title + "";
    	let t0;
    	let a_target_value;
    	let a_href_value;
    	let t1;
    	let span;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			span = element("span");
    			attr_dev(a, "class", "unclickable block whitespace-nowrap mtb0-5");
    			attr_dev(a, "target", a_target_value = /*link*/ ctx[25]?.url?.[0] == '#' ? '' : '_blank');
    			attr_dev(a, "href", a_href_value = /*link*/ ctx[25]?.url);
    			add_location(a, file, 133, 7, 3506);
    			attr_dev(span, "class", "block p0-2 mlr0-5 filled radius1em");
    			add_location(span, file, 137, 7, 3674);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, span, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$data*/ 8 && t0_value !== (t0_value = /*link*/ ctx[25]?.title + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*$data*/ 8 && a_target_value !== (a_target_value = /*link*/ ctx[25]?.url?.[0] == '#' ? '' : '_blank')) {
    				attr_dev(a, "target", a_target_value);
    			}

    			if (dirty & /*$data*/ 8 && a_href_value !== (a_href_value = /*link*/ ctx[25]?.url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(133:6) {#each ($data?.nav || []) as link, idx}",
    		ctx
    	});

    	return block;
    }

    // (167:7) {#if idx != 0}
    function create_if_block_2(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", "block p0-2 mlr0-5 filled radius1em");
    			add_location(span, file, 167, 8, 4753);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(167:7) {#if idx != 0}",
    		ctx
    	});

    	return block;
    }

    // (166:6) {#each [...($data?.stations || []), { id: $play_text, title: $play_text}] as link, idx}
    function create_each_block(ctx) {
    	let t0;
    	let a;
    	let t1_value = /*link*/ ctx[25]?.title + "";
    	let t1;
    	let a_href_value;
    	let mounted;
    	let dispose;
    	let if_block = /*idx*/ ctx[27] != 0 && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			a = element("a");
    			t1 = text(t1_value);
    			attr_dev(a, "class", "unclickable block whitespace-nowrap");
    			attr_dev(a, "href", a_href_value = '#' + /*link*/ ctx[25]?.id);
    			toggle_class(a, "bb4-solid", /*$index*/ ctx[0] == /*idx*/ ctx[27]);
    			add_location(a, file, 169, 7, 4825);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, a, anchor);
    			append_dev(a, t1);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler_1*/ ctx[21], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$data, $play_text*/ 12 && t1_value !== (t1_value = /*link*/ ctx[25]?.title + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*$data, $play_text*/ 12 && a_href_value !== (a_href_value = '#' + /*link*/ ctx[25]?.id)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*$index*/ 1) {
    				toggle_class(a, "bb4-solid", /*$index*/ ctx[0] == /*idx*/ ctx[27]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(166:6) {#each [...($data?.stations || []), { id: $play_text, title: $play_text}] as link, idx}",
    		ctx
    	});

    	return block;
    }

    // (201:1) {#if $chat || $index == 6}
    function create_if_block(ctx) {
    	let div;
    	let chat_1;
    	let current;

    	chat_1 = new Chat({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(chat_1.$$.fragment);
    			attr_dev(div, "class", "flex grow column");
    			set_style(div, "transform", "skew(0deg, -0deg)");
    			toggle_class(div, "maxw56em", /*$index*/ ctx[0] < 6);
    			toggle_class(div, "bl2-solid", /*$index*/ ctx[0] < 6);
    			add_location(div, file, 201, 2, 5680);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(chat_1, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const chat_1_changes = {};

    			if (dirty & /*$$scope, $index*/ 536870913) {
    				chat_1_changes.$$scope = { dirty, ctx };
    			}

    			chat_1.$set(chat_1_changes);

    			if (dirty & /*$index*/ 1) {
    				toggle_class(div, "maxw56em", /*$index*/ ctx[0] < 6);
    			}

    			if (dirty & /*$index*/ 1) {
    				toggle_class(div, "bl2-solid", /*$index*/ ctx[0] < 6);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chat_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chat_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(chat_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(201:1) {#if $chat || $index == 6}",
    		ctx
    	});

    	return block;
    }

    // (207:3) <Chat>
    function create_default_slot(ctx) {
    	let div1;
    	let div0;
    	let svg;
    	let g;
    	let path;
    	let t;
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			svg = svg_element("svg");
    			g = svg_element("g");
    			path = svg_element("path");
    			t = space();
    			img = element("img");
    			attr_dev(path, "id", "path0");
    			attr_dev(path, "d", "M265.116 20.547 C 265.116 20.763,272.640 28.462,281.835 37.657 L 298.553 54.376 248.501 104.707 C 220.973 132.389,198.450 155.312,198.450 155.646 C 198.450 156.682,224.636 182.171,225.700 182.171 C 226.253 182.171,249.048 159.845,276.357 132.558 C 303.665 105.271,326.259 82.946,326.566 82.946 C 326.872 82.946,334.623 90.446,343.790 99.612 C 352.956 108.779,360.633 116.279,360.848 116.279 C 361.064 116.279,361.240 94.651,361.240 68.217 L 361.240 20.155 313.178 20.155 C 286.744 20.155,265.116 20.331,265.116 20.547 M51.163 194.574 L 51.163 330.233 186.822 330.233 L 322.481 330.233 322.481 252.713 L 322.481 175.194 303.101 175.194 L 283.721 175.194 283.721 233.333 L 283.721 291.473 186.822 291.473 L 89.922 291.473 89.922 194.574 L 89.922 97.674 148.062 97.674 L 206.202 97.674 206.202 78.295 L 206.202 58.915 128.682 58.915 L 51.163 58.915 51.163 194.574 ");
    			attr_dev(path, "stroke", "none");
    			attr_dev(path, "fill", "var(--color)");
    			attr_dev(path, "fill-rule", "evenodd");
    			add_location(path, file, 216, 176, 6216);
    			attr_dev(g, "id", "svgg");
    			add_location(g, file, 216, 163, 6203);
    			attr_dev(svg, "class", "w2em overflow-hidden h3em rel t0-2 ml1");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "width", "400");
    			attr_dev(svg, "height", "356.58914728682174");
    			attr_dev(svg, "viewBox", "0, 0, 400,356.58914728682174");
    			add_location(svg, file, 214, 6, 5981);
    			attr_dev(div0, "class", "pointer");
    			toggle_class(div0, "none", /*$index*/ ctx[0] >= 6);
    			add_location(div0, file, 210, 5, 5886);
    			if (!src_url_equal(img.src, img_src_value = "vidicon.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "maxw6em minw6em ml1 w100pc h100pc");
    			toggle_class(img, "none", /*$index*/ ctx[0] < 6);
    			add_location(img, file, 218, 5, 7188);
    			attr_dev(div1, "class", "flex row-center-center");
    			add_location(div1, file, 208, 4, 5838);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, svg);
    			append_dev(svg, g);
    			append_dev(g, path);
    			append_dev(div1, t);
    			append_dev(div1, img);

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*onOpenChat*/ ctx[12], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$index*/ 1) {
    				toggle_class(div0, "none", /*$index*/ ctx[0] >= 6);
    			}

    			if (dirty & /*$index*/ 1) {
    				toggle_class(img, "none", /*$index*/ ctx[0] < 6);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(207:3) <Chat>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*$state*/ ctx[1].inited && /*$index*/ ctx[0] <= 5 && /*$state*/ ctx[1].data && create_if_block_1(ctx);
    	let if_block1 = (/*$chat*/ ctx[7] || /*$index*/ ctx[0] == 6) && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(main, "class", "sassis flex row-center-stretch w100vw h100vh overflow-auto");
    			add_location(main, file, 114, 0, 2748);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t);
    			if (if_block1) if_block1.m(main, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window_1, "hashchange", /*onHash*/ ctx[9], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$state*/ ctx[1].inited && /*$index*/ ctx[0] <= 5 && /*$state*/ ctx[1].data) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*$state, $index*/ 3) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(main, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*$chat*/ ctx[7] || /*$index*/ ctx[0] == 6) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*$chat, $index*/ 129) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(main, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const _CHAT = 'CHAT';
    const _NOCHAT = 'NOCHAT';

    function timezone() {
    	let t = '';

    	try {
    		t = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1].replace(/[^A-Z]/g, '');
    	} catch(err) {
    		
    	}

    	return t;
    }

    function getChat() {
    	return window.localStorage.getItem(_CHAT) == _CHAT
    	? true
    	: false;
    }

    function instance($$self, $$props, $$invalidate) {
    	let HASHLIST;
    	let LIVE;
    	let $chat;
    	let $live;
    	let $index;
    	let $state;
    	let $play_text;
    	let $data;
    	let $smoothing;
    	validate_store(chat, 'chat');
    	component_subscribe($$self, chat, $$value => $$invalidate(7, $chat = $$value));
    	validate_store(live, 'live');
    	component_subscribe($$self, live, $$value => $$invalidate(17, $live = $$value));
    	validate_store(index, 'index');
    	component_subscribe($$self, index, $$value => $$invalidate(0, $index = $$value));
    	validate_store(state, 'state');
    	component_subscribe($$self, state, $$value => $$invalidate(1, $state = $$value));
    	validate_store(play_text, 'play_text');
    	component_subscribe($$self, play_text, $$value => $$invalidate(2, $play_text = $$value));
    	validate_store(data, 'data');
    	component_subscribe($$self, data, $$value => $$invalidate(3, $data = $$value));
    	validate_store(smoothing, 'smoothing');
    	component_subscribe($$self, smoothing, $$value => $$invalidate(8, $smoothing = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { name } = $$props;
    	let HASH;

    	onMount(async e => {
    		await data.set(await FetchData());
    		console.log('[App] mounted');
    		set_store_value(state, $state.data = true, $state);
    		set_store_value(chat, $chat = getChat(), $chat);
    		onHash();
    		set_store_value(state, $state.hash = true, $state);
    		set_store_value(state, $state.inited = true, $state);
    		getLiveInfo();
    		set_store_value(play_text, $play_text = (await FetchLiveInfo())?.[5]?.id || $play_text, $play_text);
    		getTimes();
    	});

    	let timeLocal, timeWest;

    	async function getTimes() {
    		new Date().toString().split(" ");
    		$$invalidate(4, timeLocal = new Date().toLocaleTimeString().substring(0, 5));
    		$$invalidate(5, timeWest = new Date().toLocaleTimeString('en-GB', { timeZone: 'America/Los_Angeles' }).substring(0, 5));
    		setTimeout(getTimes, 2000);
    	}

    	function onHash(e) {
    		if (!$state.data) return;
    		$$invalidate(14, HASH = window.location.hash.substring(1));
    		let idx = HASHLIST.indexOf(HASH);
    		console.log(`[App] 🔻  setting index from hash ${HASH} ${idx}`);
    		index.set(idx);
    	}

    	function onToggleChat(e) {
    		// https://go.rocket.chat/room?host=<chat.server>
    		let b = $chat ? _NOCHAT : _CHAT;

    		window.localStorage.setItem(_CHAT, b);
    		set_store_value(chat, $chat = getChat(), $chat);
    		console.log(`[App] 💬 toggled chat to ${b} ${$chat}`);
    	}

    	let dontHashUpdate = false;
    	let lastIndex = -2;

    	async function getLiveInfo() {
    		if ($index < 6) {
    			let _live = await FetchLiveInfo();
    			if (_live) set_store_value(live, $live = window.live = _live, $live);
    		}

    		setTimeout(getLiveInfo, 1000 * 5);
    	}

    	let components = [Station, Station, Station, Station, Station, Document];

    	function onOpenChat() {
    		window.localStorage.setItem(_CHAT, _NOCHAT);
    		set_store_value(chat, $chat = false, $chat);
    		window.open('#' + _CHAT, _CHAT, 'directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=no,resizable=no,width=600,height=800');
    	}

    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = e => set_store_value(smoothing, $smoothing = 0.9, $smoothing);
    	const mousedown_handler = e => set_store_value(state, $state.mousedown = true, $state);
    	const mouseup_handler = e => set_store_value(state, $state.mousedown = false, $state);
    	const click_handler_1 = e => set_store_value(smoothing, $smoothing = 0, $smoothing);

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(13, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		FetchData,
    		FetchLiveInfo,
    		Cube,
    		Chat,
    		Station,
    		Document,
    		index,
    		state,
    		data,
    		chat,
    		live,
    		smoothing,
    		play_text,
    		name,
    		_CHAT,
    		_NOCHAT,
    		HASH,
    		timeLocal,
    		timeWest,
    		timezone,
    		getTimes,
    		onHash,
    		getChat,
    		onToggleChat,
    		dontHashUpdate,
    		lastIndex,
    		getLiveInfo,
    		components,
    		onOpenChat,
    		LIVE,
    		HASHLIST,
    		$chat,
    		$live,
    		$index,
    		$state,
    		$play_text,
    		$data,
    		$smoothing
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(13, name = $$props.name);
    		if ('HASH' in $$props) $$invalidate(14, HASH = $$props.HASH);
    		if ('timeLocal' in $$props) $$invalidate(4, timeLocal = $$props.timeLocal);
    		if ('timeWest' in $$props) $$invalidate(5, timeWest = $$props.timeWest);
    		if ('dontHashUpdate' in $$props) dontHashUpdate = $$props.dontHashUpdate;
    		if ('lastIndex' in $$props) $$invalidate(15, lastIndex = $$props.lastIndex);
    		if ('components' in $$props) $$invalidate(11, components = $$props.components);
    		if ('LIVE' in $$props) $$invalidate(6, LIVE = $$props.LIVE);
    		if ('HASHLIST' in $$props) $$invalidate(16, HASHLIST = $$props.HASHLIST);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$data, $play_text*/ 12) {
    			$$invalidate(16, HASHLIST = [...($data?.stations || []).map(s => s.id), $play_text, _CHAT]);
    		}

    		if ($$self.$$.dirty & /*$state, lastIndex, $index, HASHLIST*/ 98307) {
    			(_index => {
    				if (!$state.inited || !$state.data || lastIndex == $index) return;
    				let id = HASHLIST[$index];
    				console.log(`[App] 🔺 setting hash from id ${id} ${$index}`);
    				window.location.hash = id || '';
    				$$invalidate(15, lastIndex = $index);
    				setTimeout(e => set_store_value(state, $state.hash = false, $state), 10);
    			})();
    		}

    		if ($$self.$$.dirty & /*$live, HASH*/ 147456) {
    			$$invalidate(6, LIVE = ($live || []).find(l => l.id == HASH)?.message || '');
    		}
    	};

    	return [
    		$index,
    		$state,
    		$play_text,
    		$data,
    		timeLocal,
    		timeWest,
    		LIVE,
    		$chat,
    		$smoothing,
    		onHash,
    		onToggleChat,
    		components,
    		onOpenChat,
    		name,
    		HASH,
    		lastIndex,
    		HASHLIST,
    		$live,
    		click_handler,
    		mousedown_handler,
    		mouseup_handler,
    		click_handler_1
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 13 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[13] === undefined && !('name' in props)) {
    			console_1.warn("<App> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
