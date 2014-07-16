/*!
 * ====================================================
 * Flex UI - v1.0.0 - 2014-07-16
 * https://github.com/fex-team/fui
 * GitHub: https://github.com/fex-team/fui.git 
 * Copyright (c) 2014 Baidu Kity Group; Licensed MIT
 * ====================================================
 */

(function () {
var _p = {
    r: function(index) {
        if (_p[index].inited) {
            return _p[index].value;
        }
        if (typeof _p[index].value === "function") {
            var module = {
                exports: {}
            }, returnValue = _p[index].value(null, module.exports, module);
            _p[index].inited = true;
            _p[index].value = returnValue;
            if (returnValue !== undefined) {
                return returnValue;
            } else {
                for (var key in module.exports) {
                    if (module.exports.hasOwnProperty(key)) {
                        _p[index].inited = true;
                        _p[index].value = module.exports;
                        return module.exports;
                    }
                }
            }
        } else {
            _p[index].inited = true;
            return _p[index].value;
        }
    }
};

/**
 * UI构造工厂, 提供可通过参数配置项创建多个构件的机制.
 */
_p[0] = {
    value: function(require) {
        var Creator = {}, $ = _p.r(2), FUI_NS = _p.r(9);
        $.extend(Creator, {
            parse: function(options) {
                var pool = {}, instance = null, optionList = null;
                for (var widgetClazz in options) {
                    if (!options.hasOwnProperty(widgetClazz)) {
                        continue;
                    }
                    optionList = options[widgetClazz];
                    widgetClazz = FUI_NS[widgetClazz];
                    if (!widgetClazz) {
                        continue;
                    }
                    if (!$.isArray(optionList)) {
                        optionList = [ optionList ];
                    }
                    $.each(optionList, function(i, opt) {
                        instance = new widgetClazz(opt);
                        pool[instance.getId()] = instance;
                    });
                }
                return pool;
            }
        });
        return Creator;
    }
};

/**
 * 模块暴露
 */
_p[1] = {
    value: function(require) {
        var FUI_NS = _p.r(9);
        FUI_NS.___register({
            Widget: _p.r(50),
            Icon: _p.r(36),
            Label: _p.r(42),
            Button: _p.r(31),
            ToggleButton: _p.r(49),
            Buttonset: _p.r(30),
            Separator: _p.r(47),
            Item: _p.r(40),
            Input: _p.r(39),
            InputButton: _p.r(37),
            Mask: _p.r(43),
            ColorPicker: _p.r(32),
            Tabs: _p.r(48),
            Container: _p.r(33),
            Panel: _p.r(45),
            PPanel: _p.r(46),
            LabelPanel: _p.r(41),
            Menu: _p.r(44),
            InputMenu: _p.r(38),
            ButtonMenu: _p.r(28),
            DropPanel: _p.r(35),
            Dialog: _p.r(34),
            Utils: _p.r(11),
            Creator: _p.r(0)
        });
        FUI_NS.__export();
    }
};

/**
 * jquery模块封装
 */
_p[2] = {
    value: function(require) {
        return window.jQuery;
    }
};

/**
 * @description 创建一个类
 * @param {String}    fullClassName  类全名，包括命名空间。
 * @param {Plain}     defines        要创建的类的特性
 *     defines.constructor  {Function}       类的构造函数，实例化的时候会被调用。
 *     defines.base         {String}         基类的名称。名称要使用全名。（因为base是javascript未来保留字，所以不用base）
 *     defines.mixin        {Array<String>}  要混合到新类的类集合
 *     defines.<method>     {Function}       其他类方法
 *
 * TODO:
 *     Mixin 构造函数调用支持
 */
_p[3] = {
    value: function(require, exports) {
        // just to bind context
        Function.prototype.bind = Function.prototype.bind || function(thisObj) {
            var args = Array.prototype.slice.call(arguments, 1);
            return this.apply(thisObj, args);
        };
        // 所有类的基类
        function Class() {}
        Class.__KityClassName = "Class";
        // 提供 base 调用支持
        Class.prototype.base = function(name) {
            var caller = arguments.callee.caller;
            var method = caller.__KityMethodClass.__KityBaseClass.prototype[name];
            return method.apply(this, Array.prototype.slice.call(arguments, 1));
        };
        // 直接调用 base 类的同名方法
        Class.prototype.callBase = function() {
            var caller = arguments.callee.caller;
            var method = caller.__KityMethodClass.__KityBaseClass.prototype[caller.__KityMethodName];
            return method.apply(this, arguments);
        };
        Class.prototype.mixin = function(name) {
            var caller = arguments.callee.caller;
            var mixins = caller.__KityMethodClass.__KityMixins;
            if (!mixins) {
                return this;
            }
            var method = mixins[name];
            return method.apply(this, Array.prototype.slice.call(arguments, 1));
        };
        Class.prototype.callMixin = function() {
            var caller = arguments.callee.caller;
            var methodName = caller.__KityMethodName;
            var mixins = caller.__KityMethodClass.__KityMixins;
            if (!mixins) {
                return this;
            }
            var method = mixins[methodName];
            if (methodName == "constructor") {
                for (var i = 0, l = method.length; i < l; i++) {
                    method[i].call(this);
                }
                return this;
            } else {
                return method.apply(this, arguments);
            }
        };
        Class.prototype.pipe = function(fn) {
            if (typeof fn == "function") {
                fn.call(this, this);
            }
            return this;
        };
        Class.prototype.getType = function() {
            return this.__KityClassName;
        };
        Class.prototype.getClass = function() {
            return this.constructor;
        };
        // 检查基类是否调用了父类的构造函数
        // 该检查是弱检查，假如调用的代码被注释了，同样能检查成功（这个特性可用于知道建议调用，但是出于某些原因不想调用的情况）
        function checkBaseConstructorCall(targetClass, classname) {
            var code = targetClass.toString();
            if (!/this\.callBase/.test(code)) {
                throw new Error(classname + " : 类构造函数没有调用父类的构造函数！为了安全，请调用父类的构造函数");
            }
        }
        var KITY_INHERIT_FLAG = "__KITY_INHERIT_FLAG_" + +new Date();
        function inherit(constructor, BaseClass, classname) {
            var KityClass = eval("(function " + classname + "( __inherit__flag ) {" + "if( __inherit__flag != KITY_INHERIT_FLAG ) {" + "KityClass.__KityConstructor.apply(this, arguments);" + "}" + "this.__KityClassName = KityClass.__KityClassName;" + "})");
            KityClass.__KityConstructor = constructor;
            KityClass.prototype = new BaseClass(KITY_INHERIT_FLAG);
            for (var methodName in BaseClass.prototype) {
                if (BaseClass.prototype.hasOwnProperty(methodName) && methodName.indexOf("__Kity") !== 0) {
                    KityClass.prototype[methodName] = BaseClass.prototype[methodName];
                }
            }
            KityClass.prototype.constructor = KityClass;
            return KityClass;
        }
        function mixin(NewClass, mixins) {
            if (false === mixins instanceof Array) {
                return NewClass;
            }
            var i, length = mixins.length, proto, method;
            NewClass.__KityMixins = {
                constructor: []
            };
            for (i = 0; i < length; i++) {
                proto = mixins[i].prototype;
                for (method in proto) {
                    if (false === proto.hasOwnProperty(method) || method.indexOf("__Kity") === 0) {
                        continue;
                    }
                    if (method === "constructor") {
                        // constructor 特殊处理
                        NewClass.__KityMixins.constructor.push(proto[method]);
                    } else {
                        NewClass.prototype[method] = NewClass.__KityMixins[method] = proto[method];
                    }
                }
            }
            return NewClass;
        }
        function extend(BaseClass, extension) {
            if (extension.__KityClassName) {
                extension = extension.prototype;
            }
            for (var methodName in extension) {
                if (extension.hasOwnProperty(methodName) && methodName.indexOf("__Kity") && methodName != "constructor") {
                    var method = BaseClass.prototype[methodName] = extension[methodName];
                    method.__KityMethodClass = BaseClass;
                    method.__KityMethodName = methodName;
                }
            }
            return BaseClass;
        }
        Class.prototype._accessProperty = function() {
            return this._propertyRawData || (this._propertyRawData = {});
        };
        exports.createClass = function(classname, defines) {
            var constructor, NewClass, BaseClass;
            if (arguments.length === 1) {
                defines = arguments[0];
                classname = "AnonymousClass";
            }
            BaseClass = defines.base || Class;
            if (defines.hasOwnProperty("constructor")) {
                constructor = defines.constructor;
                if (BaseClass != Class) {
                    checkBaseConstructorCall(constructor, classname);
                }
            } else {
                constructor = function() {
                    this.callBase.apply(this, arguments);
                    this.callMixin.apply(this, arguments);
                };
            }
            NewClass = inherit(constructor, BaseClass, classname);
            NewClass = mixin(NewClass, defines.mixins);
            NewClass.__KityClassName = constructor.__KityClassName = classname;
            NewClass.__KityBaseClass = constructor.__KityBaseClass = BaseClass;
            NewClass.__KityMethodName = constructor.__KityMethodName = "constructor";
            NewClass.__KityMethodClass = constructor.__KityMethodClass = NewClass;
            // 下面这些不需要拷贝到原型链上
            delete defines.mixins;
            delete defines.constructor;
            delete defines.base;
            NewClass = extend(NewClass, defines);
            return NewClass;
        };
        exports.extendClass = extend;
    }
};

/**
 * 通用工具包
 */
_p[4] = {
    value: function(require) {
        var $ = _p.r(2), __marker = "__fui__marker__" + +new Date();
        return {
            isElement: function(target) {
                return target.nodeType === 1;
            },
            /**
         * 根据传递进来的key列表， 从source中获取对应的key， 并进行处理，最终生成一个css声明映射表
         * 该方法处理过的结果可以交由模板调用Helper.toCssText方法生成inline style样式规则
         * @param keys 可以是数组， 也可以是object。 如果是数组， 则最终生成的css声明映射中将以该数组中的元素作为其属性名；
         *              如果是object, 则取值时以object的key作为source中的key， 在生成css声明映射时，则以keys参数中的key所对应的值作为css声明的属性名.
         * @returns {{}}
         */
            getCssRules: function(keys, source) {
                var mapping = {}, tmp = {}, value = null;
                if ($.isArray(keys)) {
                    for (var i = 0, len = keys.length; i < len; i++) {
                        value = keys[i];
                        if (typeof value === "string") {
                            tmp[value] = value;
                        } else {
                            for (var key in value) {
                                if (value.hasOwnProperty(key)) {
                                    tmp[key] = value[key];
                                    // 只取一个
                                    break;
                                }
                            }
                        }
                    }
                    keys = tmp;
                }
                for (var key in keys) {
                    if (keys.hasOwnProperty(key)) {
                        value = source[key];
                        if (value !== null && value !== undefined) {
                            mapping[keys[key]] = value;
                        }
                    }
                }
                return mapping;
            },
            getMarker: function() {
                return __marker;
            },
            getRect: function(node) {
                return node.getBoundingClientRect();
            },
            getBound: function(node) {
                var w = 0, h = 0;
                if (node.tagName.toLowerCase() === "body") {
                    h = $(node.ownerDocument.defaultView);
                    w = h.width();
                    h = h.height();
                    return {
                        top: 0,
                        left: 0,
                        bottom: h,
                        right: w,
                        width: w,
                        height: h
                    };
                } else {
                    return node.getBoundingClientRect();
                }
            },
            getCssValue: function(props, node) {
                var styleList = node.ownerDocument.defaultView.getComputedStyle(node, null);
            }
        };
    }
};

/**
 * 模板编译器
 */
_p[5] = {
    value: function(require) {
        var vash = _p.r(12), $ = _p.r(2), defaultOptions = {
            htmlEscape: false,
            helpersName: "h",
            modelName: "m"
        };
        $.extend(vash.helpers, {
            toSpaceStyle: function(space) {
                var styleText = [];
                if ($.isNumeric(space.width)) {
                    styleText.push("width:" + space.width + "px");
                }
                if ($.isNumeric(space.height)) {
                    styleText.push("height:" + space.height + "px");
                }
                return styleText.join(";");
            },
            // css序列化
            toCssText: function(cssMapping) {
                var rules = [], value = null;
                if (!cssMapping) {
                    return "";
                }
                for (var key in cssMapping) {
                    if (!cssMapping.hasOwnProperty(key)) {
                        continue;
                    }
                    value = cssMapping[key];
                    rules.push(key + ": " + value + ($.isNumeric(value) ? "px" : ""));
                }
                if (rules.length === 0) {
                    return "";
                }
                return 'style="' + rules.join(";") + '"';
            }
        });
        return {
            compile: function(tpl, data, compileOptions) {
                tpl = $.trim(tpl);
                if (tpl.length === 0) {
                    return "";
                }
                compileOptions = $.extend(true, {}, defaultOptions, compileOptions);
                var tpl = vash.compile(tpl, compileOptions);
                return tpl(data);
            }
        };
    }
};

/**
 * Draggable Lib
 */
_p[6] = {
    value: function(require, exports) {
        var $ = _p.r(2), common = _p.r(4), DEFAULT_OPTIONS = {
            handler: null,
            target: null,
            axis: "all",
            range: null
        };
        function Draggable(options) {
            this.__options = $.extend({}, DEFAULT_OPTIONS, options);
            this.__started = false;
            this.__point = {
                x: 0,
                y: 0
            };
            this.__location = {
                x: 0,
                y: 0
            };
            this.__range = {
                top: 0,
                left: 0,
                bottom: 0,
                right: 0
            };
        }
        $.extend(Draggable.prototype, {
            bind: function(target) {
                if (target) {
                    this.__options.target = target;
                }
                if (!this.__options.target) {
                    throw new Error("target unset");
                }
                this.__target = this.__options.target;
                this.__handler = this.__options.handler;
                this.__rangeNode = this.__options.range;
                this.__initOptions();
                this.__initEnv();
                this.__initEvent();
            },
            __initEvent: function() {
                var target = this.__target, handler = this.__handler, _self = this;
                $(handler).on("mousedown", function(e) {
                    if (e.which !== 1) {
                        return;
                    }
                    var location = common.getRect(handler);
                    e.preventDefault();
                    _self.__started = true;
                    _self.__point = {
                        x: e.clientX,
                        y: e.clientY
                    };
                    _self.__location = {
                        x: location.left,
                        y: location.top
                    };
                    _self.__range = _self.__getRange();
                });
                $(handler.ownerDocument).on("mousemove", function(e) {
                    if (!_self.__started) {
                        return;
                    }
                    var x = e.clientX, y = e.clientY;
                    if (_self.__allowAxisX) {
                        _self.__xMove(x);
                    }
                    if (_self.__allowAxisY) {
                        _self.__yMove(y);
                    }
                }).on("mouseup", function(e) {
                    _self.__started = false;
                });
            },
            __xMove: function(x) {
                var diff = x - this.__point.x;
                diff = this.__location.x + diff;
                if (diff < this.__range.left) {
                    diff = this.__range.left;
                } else if (diff > this.__range.right) {
                    diff = this.__range.right;
                }
                this.__target.style.left = diff + "px";
            },
            __yMove: function(y) {
                var diff = y - this.__point.y;
                diff = this.__location.y + diff;
                if (diff < this.__range.top) {
                    diff = this.__range.top;
                } else if (diff > this.__range.bottom) {
                    diff = this.__range.bottom;
                }
                this.__target.style.top = diff + "px";
            },
            __initEnv: function() {
                var $handler = $(this.__handler);
                $handler.css("cursor", "move");
            },
            __initOptions: function() {
                var axis = this.__options.axis.toLowerCase();
                if (!this.__handler) {
                    this.__handler = this.__target;
                }
                if (!this.__rangeNode) {
                    this.__rangeNode = this.__options.target.ownerDocument.body;
                }
                this.__allowAxisX = this.__options.axis !== "y";
                this.__allowAxisY = this.__options.axis !== "x";
            },
            __getRange: function() {
                var range = this.__rangeNode, targetRect = common.getRect(this.__target);
                if (range.tagName.toLowerCase() === "body") {
                    range = $(this.__rangeNode.ownerDocument);
                    range = {
                        top: 0,
                        left: 0,
                        bottom: range.height(),
                        right: range.width()
                    };
                } else {
                    range = common.getRect(range);
                }
                return {
                    top: range.top,
                    left: range.left,
                    bottom: range.bottom - targetRect.height,
                    right: range.right - targetRect.width
                };
            }
        });
        return function(options) {
            return new Draggable(options);
        };
    }
};

/**
 * 弥补jQuery的extend在克隆对象和数组时存在的问题
 */
_p[7] = {
    value: function(require) {
        var $ = _p.r(2);
        function extend(target) {
            var type = null, isPlainObject = false, isArray = false, sourceObj = null;
            if (arguments.length === 1) {
                return copy(target);
            }
            $.each([].slice.call(arguments, 1), function(i, source) {
                for (var key in source) {
                    sourceObj = source[key];
                    if (!source.hasOwnProperty(key)) {
                        continue;
                    }
                    isPlainObject = $.isPlainObject(sourceObj);
                    isArray = $.isArray(sourceObj);
                    if (!isPlainObject && !isArray) {
                        target[key] = source[key];
                    } else if (isPlainObject) {
                        if (!$.isPlainObject(target[key])) {
                            target[key] = {};
                        }
                        target[key] = extend(target[key], sourceObj);
                    } else if (isArray) {
                        target[key] = extend(sourceObj);
                    }
                }
            });
            return target;
        }
        function copy(target) {
            var tmp = null;
            if ($.isPlainObject(target)) {
                return extend({}, target);
            } else if ($.isArray(target)) {
                tmp = [];
                $.each(target, function(index, item) {
                    if ($.isPlainObject(item) || $.isArray(item)) {
                        tmp.push(copy(item));
                    } else {
                        tmp.push(item);
                    }
                });
                return tmp;
            } else {
                return target;
            }
        }
        return extend;
    }
};

/**
 * 构件相关工具方法
 */
_p[8] = {
    value: function(require) {
        return {
            isContainer: function(widget) {
                return widget.__widgetType === "container";
            }
        };
    }
};

/**
 * FUI名称空间
 */
_p[9] = {
    value: function() {
        // 容纳所有构件的实例池
        var WIDGET_POOL = {};
        return {
            widgets: WIDGET_POOL,
            /**
         * 暴露命名空间本身
         * @private
         */
            __export: function() {
                window.FUI = this;
            },
            ___register: function(widgetName, widget) {
                if (typeof widgetName === "string") {
                    this[widgetName] = widget;
                } else {
                    widget = widgetName;
                    for (var key in widget) {
                        if (!widget.hasOwnProperty(key)) {
                            continue;
                        }
                        this[key] = widget[key];
                    }
                }
            },
            __registerInstance: function(widget) {
                WIDGET_POOL[widget.getId()] = widget;
            }
        };
    }
};

/**
 * UI系统配置
 */
_p[10] = {
    value: function() {
        return {
            classPrefix: "fui-",
            layout: {
                TOP: "top",
                LEFT: "left",
                BOTTOM: "bottom",
                RIGHT: "right",
                CENTER: "center",
                MIDDLE: "middle"
            }
        };
    }
};

/**
 * utils类包， 提供常用操作的封装，补充jQuery的不足
 */
_p[11] = {
    value: function(require) {
        var $ = _p.r(2), Utils = {
            Tpl: _p.r(5),
            Widget: _p.r(8),
            createDraggable: _p.r(6)
        };
        return $.extend(Utils, _p.r(4), _p.r(3));
    }
};

/**
 * vash模板引擎
 */
_p[12] = {
    value: function() {
        return window.vash;
    }
};

_p[13] = {
    value: function() {
        return '<div unselectable="on" class="fui-button-menu" @h.toCssText( m.__css )></div>';
    }
};

_p[14] = {
    value: function() {
        return '<div unselectable="on" class="fui-button" @h.toCssText( m.__css )></div>';
    }
};

_p[15] = {
    value: function() {
        return '<div unselectable="on" class="fui-colorpicker-container" @h.toCssText( m.__css )>' + '<div unselectable="on" class="fui-colorpicker-toolbar">' + '<div unselectable="on" class="fui-colorpicker-preview"></div>' + '<div unselectable="on" class="fui-colorpicker-clear">@m.clearText</div>' + "</div>" + '<div unselectable="on" class="fui-colorpicker-title">@m.commonText</div>' + '<div unselectable="on" class="fui-colorpicker-commoncolor">' + "@m.commonColor.forEach(function(colors, i){" + '<div unselectable="on" class="fui-colorpicker-colors fui-colorpicker-colors-line@i">' + "@colors.forEach(function(color){" + '<span unselectable="on" class="fui-colorpicker-item" style="background-color: @color; border-color: @(color.toLowerCase() == \'#ffffff\' ? \'#eeeeee\':color);" data-color="@color"></span>' + "})" + "</div>" + "})" + "</div>" + '<div unselectable="on" class="fui-colorpicker-title">@m.standardText</div>' + '<div unselectable="on" class="fui-colorpicker-standardcolor fui-colorpicker-colors">' + "@m.standardColor.forEach(function(color){" + '<span unselectable="on" class="fui-colorpicker-item" style="background-color: @color; border-color: @color;" data-color="@color"></span>' + "})" + "</div>" + "</div>";
    }
};

_p[16] = {
    value: function() {
        return '<div unselectable="on" class="fui-dialog-wrap">' + '<div unselectable="on" class="fui-dialog-head">' + '<h1 unselectable="on" class="fui-dialog-caption">@(m.caption)</h1>' + "</div>" + '<div unselectable="on" class="fui-dialog-body"></div>' + '<div unselectable="on" class="fui-dialog-foot"></div>' + "</div>";
    }
};

_p[17] = {
    value: function() {
        return "<div unselectable=\"on\" class=\"fui-drop-panel\" @h.toCssText( m.__css ) @( m.text ? 'title=\"' + m.text + '\"' : '' )></div>";
    }
};

_p[18] = {
    value: function() {
        return '<div unselectable="on" class="fui-icon" @h.toCssText( m.__css )>' + "@if ( m.img ) {" + '<img unselectable="on" src="@m.img" @h.toCssText( m.__css )>' + "}" + "</div>";
    }
};

_p[19] = {
    value: function() {
        return '<div unselectable="on" class="fui-input-button" @h.toCssText( m.__css )></div>';
    }
};

_p[20] = {
    value: function() {
        return '<div unselectable="on" class="fui-input-menu"></div>';
    }
};

_p[21] = {
    value: function() {
        return '<input unselectable="on" class="fui-input" @h.toCssText( m.__css ) autocomplete="off" @( m.value ? \'value="\' + m.value + \'"\' : \'\')>';
    }
};

_p[22] = {
    value: function() {
        return "<div unselectable=\"on\" class=\"fui-item@( m.selected ? ' fui-item-selected': '' )\" @h.toCssText( m.__css )></div>";
    }
};

_p[23] = {
    value: function() {
        return '<div unselectable="on" class="fui-label" @h.toCssText( m.__css )>@(m.text)</div>';
    }
};

_p[24] = {
    value: function() {
        return '<div unselectable="on" class="fui-mask" style="background-color: @m.bgcolor; opacity: @m.opacity;"></div>';
    }
};

_p[25] = {
    value: function() {
        return '<div unselectable="on" class="fui-panel" @h.toCssText( m.__css )></div>';
    }
};

_p[26] = {
    value: function() {
        return '<div unselectable="on" class="fui-separator" @h.toCssText( m.__css )></div>';
    }
};

_p[27] = {
    value: function() {
        return '<div unselectable="on" class="fui-tabs">' + '<div unselectable="on" class="fui-tabs-button-wrap"></div>' + '<div unselectable="on" class="fui-tabs-panel-wrap"></div>' + "</div>";
    }
};

/**
 * Button对象
 * 通用按钮构件
 */
_p[28] = {
    value: function(require) {
        var $ = _p.r(2), CONF = _p.r(10), tpl = _p.r(13), Button = _p.r(31), Menu = _p.r(44), Mask = _p.r(43), Utils = _p.r(11), LAYOUT = CONF.layout;
        return _p.r(11).createClass("ButtonMenu", {
            base: _p.r(50),
            constructor: function(options) {
                var marker = Utils.getMarker();
                this.callBase(marker);
                var defaultOptions = {
                    // item选项
                    menu: null,
                    mask: null,
                    buttons: [],
                    selected: -1,
                    layout: LAYOUT.RIGHT
                };
                this.__extendOptions(defaultOptions, options);
                this.widgetName = "ButtonMenu";
                this.__tpl = tpl;
                this.__buttonWidgets = null;
                this.__menuWidget = null;
                this.__maskWidget = null;
                this.__openState = false;
                if (options !== marker) {
                    this.__render();
                }
            },
            open: function() {
                this.__openState = true;
                this.__maskWidget.show();
                this.__menuWidget.show();
                this.addClass(CONF.classPrefix + "button-active");
            },
            close: function() {
                this.__openState = false;
                this.__maskWidget.hide();
                this.__menuWidget.hide();
                this.removeClass(CONF.classPrefix + "button-active");
            },
            isOpen: function() {
                return !!this.__openState;
            },
            getSelected: function() {
                return this.__menuWidget.getSelected();
            },
            getSelectedItem: function() {
                return this.__menuWidget.getSelectedItem();
            },
            getValue: function() {
                return this.getSelectedItem().getValue();
            },
            __render: function() {
                var _self = this;
                if (this.__rendered) {
                    return this;
                }
                this.__initOptions();
                this.callBase();
                this.__initButtons();
                this.__menuWidget = new Menu(this.__options.menu);
                this.__maskWidget = new Mask(this.__options.mask);
                this.__menuWidget.positionTo(this.__element);
                this.__menuWidget.appendTo(this.__element.ownerDocument.body);
                this.__initButtonMenuEvent();
            },
            __initOptions: function() {
                if (this.__options.selected !== -1) {
                    this.__options.menu.selected = this.__options.selected;
                }
            },
            __initButtons: function() {
                var buttons = [], ele = this.__element, btn = null, lastIndex = this.__options.buttons.length - 1;
                if (this.__options.layout === LAYOUT.TOP || this.__options.layout === LAYOUT.LEFT) {
                    btn = new Button(this.__options.buttons[lastIndex]);
                    btn.appendTo(ele);
                } else {
                    lastIndex = -1;
                }
                $.each(this.__options.buttons, function(index, options) {
                    if (lastIndex !== index) {
                        var button = new Button(options);
                        button.appendTo(ele);
                        buttons.push(button);
                    } else {
                        buttons.push(btn);
                    }
                });
                this.addClass(CONF.classPrefix + "layout-" + this.__options.layout);
                buttons[buttons.length - 1].addClass(CONF.classPrefix + "open-btn");
                this.__buttonWidgets = buttons;
            },
            __initButtonMenuEvent: function() {
                var lastBtn = this.__buttonWidgets[this.__buttonWidgets.length - 1], _self = this;
                lastBtn.on("click", function(e) {
                    _self.open();
                });
                this.__maskWidget.on("maskclick", function() {
                    _self.close();
                });
                this.__menuWidget.on("select", function(e, info) {
                    e.stopPropagation();
                    _self.close();
                    _self.trigger("select", info);
                }).on("change", function(e, info) {
                    _self.trigger("change", info);
                });
                this.on("btnclick", function(e) {
                    e.stopPropagation();
                    var btnIndex = $.inArray(e.widget, this.__buttonWidgets);
                    if (btnIndex > -1 && btnIndex < this.__buttonWidgets.length - 1) {
                        this.trigger("buttonclick", {
                            button: this.__buttonWidgets[btnIndex]
                        });
                    }
                });
            }
        });
    }
};

/**
 * InputMenu构件
 * 可接受输入的下拉菜单构件
 */
_p[29] = {
    value: function(require) {
        var $ = _p.r(2), CONF = _p.r(10), tpl = _p.r(20), InputButton = _p.r(37), Menu = _p.r(44), Mask = _p.r(43), Utils = _p.r(11);
        return _p.r(11).createClass("InputMenu", {
            base: _p.r(50),
            constructor: function(options) {
                var marker = Utils.getMarker();
                this.callBase(marker);
                var defaultOptions = {
                    input: null,
                    menu: null,
                    mask: null
                };
                this.__extendOptions(defaultOptions, options);
                this.widgetName = "InputMenu";
                this.__tpl = tpl;
                // 最后输入时间
                this.__lastTime = 0;
                // 最后选中的记录
                this.__lastSelect = null;
                this.__inputWidget = null;
                this.__menuWidget = null;
                this.__maskWidget = null;
                // menu状态， 记录是否已经append到dom树上
                this.__menuState = false;
                if (options !== marker) {
                    this.__render();
                }
            },
            select: function(index) {
                this.__menuWidget.select(index);
            },
            setValue: function(value) {
                this.__inputWidget.setValue(value);
                return this;
            },
            getValue: function() {
                return this.__inputWidget.getValue();
            },
            __render: function() {
                if (this.__rendered) {
                    return this;
                }
                this.__inputWidget = new InputButton(this.__options.input);
                this.__menuWidget = new Menu(this.__options.menu);
                this.__maskWidget = new Mask(this.__options.mask);
                this.callBase();
                this.__inputWidget.appendTo(this.__element);
                this.__menuWidget.positionTo(this.__inputWidget);
                this.__initInputMenuEvent();
            },
            open: function() {
                this.__maskWidget.show();
                this.__menuWidget.show();
            },
            close: function() {
                this.__maskWidget.hide();
                this.__menuWidget.hide();
            },
            __initInputMenuEvent: function() {
                var _self = this;
                this.on("buttonclick", function() {
                    if (!this.__menuState) {
                        this.__appendMenu();
                        this.__menuState = true;
                    }
                    this.__inputWidget.unfocus();
                    this.open();
                });
                this.on("keypress", function(e) {
                    this.__lastTime = new Date();
                });
                this.on("keyup", function(e) {
                    if (e.keyCode !== 8 && e.keyCode !== 13 && new Date() - this.__lastTime < 500) {
                        this.__update();
                    }
                });
                this.on("inputcomplete", function() {
                    this.__inputWidget.selectRange(99999999);
                    this.__inputComplete();
                });
                this.__menuWidget.on("select", function(e, info) {
                    e.stopPropagation();
                    _self.setValue(info.value);
                    _self.trigger("select", info);
                    _self.close();
                });
                this.__menuWidget.on("change", function(e, info) {
                    e.stopPropagation();
                    _self.trigger("change", info);
                });
                // 阻止input自身的select和change事件
                this.__inputWidget.on("select change", function(e) {
                    e.stopPropagation();
                });
                // mask 点击关闭
                this.__maskWidget.on("maskclick", function() {
                    _self.close();
                });
                // 记录最后选中的数据
                this.on("select", function(e, info) {
                    this.__lastSelect = info;
                });
            },
            // 更新输入框内容
            __update: function() {
                var inputValue = this.getValue(), lowerCaseValue = inputValue.toLowerCase(), values = this.__getItemValues(), targetValue = null;
                if (!inputValue) {
                    return;
                }
                $.each(values, function(i, val) {
                    if (val.toLowerCase().indexOf(lowerCaseValue) === 0) {
                        targetValue = val;
                        return false;
                    }
                });
                if (targetValue) {
                    this.__inputWidget.setValue(targetValue);
                    this.__inputWidget.selectRange(inputValue.length);
                }
            },
            // 获取所有item的值列表
            __getItemValues: function() {
                var vals = [];
                $.each(this.__menuWidget.getWidgets(), function(index, item) {
                    vals.push(item.getValue());
                });
                return vals;
            },
            // 用户输入完成
            __inputComplete: function() {
                var values = this.__getItemValues(), targetIndex = -1, inputValue = this.getValue(), lastSelect = this.__lastSelect;
                $.each(values, function(i, val) {
                    if (val === inputValue) {
                        targetIndex = i;
                        return false;
                    }
                });
                this.trigger("select", {
                    index: targetIndex,
                    value: inputValue
                });
                if (!lastSelect || lastSelect.value !== inputValue) {
                    this.trigger("change", {
                        from: lastSelect || {
                            index: -1,
                            value: null
                        },
                        to: {
                            index: targetIndex,
                            value: inputValue
                        }
                    });
                }
            },
            __appendMenu: function() {
                this.__menuWidget.appendTo(this.__inputWidget.getElement().ownerDocument.body);
            }
        });
    }
};

/**
 * Button对象
 * 通用按钮构件
 */
_p[30] = {
    value: function(require) {
        var $ = _p.r(2), CONF = _p.r(10), Utils = _p.r(11), ToggleButton = _p.r(49);
        return _p.r(11).createClass("Buttonset", {
            base: _p.r(45),
            constructor: function(options) {
                var marker = Utils.getMarker();
                this.callBase(marker);
                var defaultOptions = {
                    // 初始选中项, -1表示不选中任何项
                    selected: -1
                };
                this.__extendOptions(defaultOptions, options);
                this.widgetName = "Buttonset";
                // 当前选中项
                this.__currentIndex = -1;
                // 前一次选中项
                this.__prevIndex = -1;
                if (options !== marker) {
                    this.__render();
                }
            },
            getButtons: function() {
                return this.getWidgets();
            },
            getButton: function(index) {
                return this.getWidgets()[index] || null;
            },
            appendButton: function() {
                return this.appendWidget.apply(this, arguments);
            },
            insertButton: function() {
                return this.insertWidget.apply(this, arguments);
            },
            select: function(indexOrWidget) {
                if (this.__options.disabled) {
                    return this;
                }
                if (indexOrWidget instanceof ToggleButton) {
                    indexOrWidget = $.inArray(indexOrWidget, this.__widgets);
                }
                if (indexOrWidget < 0) {
                    return this;
                }
                indexOrWidget = this.__widgets[indexOrWidget];
                this.__pressButton(indexOrWidget);
                return this;
            },
            removeButton: function() {
                return this.removeWidget.apply(this, arguments);
            },
            insertWidget: function(index, widget) {
                var returnValue = this.callBase(index, widget);
                if (returnValue === null) {
                    return returnValue;
                }
                if (index <= this.__currentIndex) {
                    this.__currentIndex++;
                }
                if (index <= this.__prevIndex) {
                    this.__prevIndex++;
                }
                return returnValue;
            },
            removeWidget: function(widget) {
                var index = widget;
                if (typeof index !== "number") {
                    index = this.indexOf(widget);
                }
                widget = this.callBase(widget);
                if (index === this.__currentIndex) {
                    this.__currentIndex = -1;
                } else if (index < this.__currentIndex) {
                    this.__currentIndex--;
                }
                if (index === this.__prevIndex) {
                    this.__prevIndex = -1;
                } else if (index < this.__prevIndex) {
                    this.__prevIndex--;
                }
                return widget;
            },
            __render: function() {
                if (this.__rendered) {
                    return this;
                }
                this.callBase();
                $(this.__element).addClass(CONF.classPrefix + "buttonset");
                this.__initButtons();
                return this;
            },
            __initButtons: function() {
                var _self = this, buttonWidget = null;
                $.each(this.__options.buttons, function(index, buttonOption) {
                    buttonWidget = new ToggleButton($.extend({}, buttonOption, {
                        pressed: index === _self.__options.selected,
                        preventDefault: true
                    }));
                    // 切换
                    buttonWidget.__on("click", function(e) {
                        if (!_self.isDisabled()) {
                            _self.__pressButton(this);
                        }
                    });
                    buttonWidget.__on("change", function(e) {
                        // 阻止buton本身的事件向上冒泡
                        e.stopPropagation();
                    });
                    _self.appendButton(buttonWidget);
                });
            },
            /**
         * 按下指定按钮, 该方法会更新其他按钮的状态和整个button-set的状态
         * @param button
         * @private
         */
            __pressButton: function(button) {
                this.__prevIndex = this.__currentIndex;
                this.__currentIndex = this.indexOf(button);
                if (this.__currentIndex === this.__prevIndex) {
                    return;
                }
                button.press();
                // 弹起其他按钮
                $.each(this.__widgets, function(i, otherButton) {
                    if (otherButton !== button) {
                        otherButton.bounce();
                    }
                });
                this.trigger("change", {
                    currentIndex: this.__currentIndex,
                    prevIndex: this.__prevIndex
                });
            },
            __valid: function(ele) {
                return ele instanceof ToggleButton;
            }
        });
    }
};

/**
 * Button对象
 * 通用按钮构件
 */
_p[31] = {
    value: function(require) {
        var $ = _p.r(2), CONF = _p.r(10), buttonTpl = _p.r(14), Icon = _p.r(36), Label = _p.r(42), Utils = _p.r(11);
        return _p.r(11).createClass("Button", {
            base: _p.r(50),
            constructor: function(options) {
                var marker = Utils.getMarker();
                this.callBase(marker);
                var defaultOptions = {
                    label: null,
                    text: null,
                    icon: null,
                    width: null,
                    height: null,
                    padding: 2,
                    // label相对icon的位置
                    layout: "right"
                };
                this.__extendOptions(defaultOptions, options);
                this.widgetName = "Button";
                this.__tpl = buttonTpl;
                this.__iconWidget = null;
                this.__labelWidget = null;
                if (options !== marker) {
                    this.__render();
                }
            },
            getLabel: function() {
                return this.__labelWidget.getText();
            },
            setLabel: function(text) {
                return this.__labelWidget.setText(text);
            },
            __render: function() {
                var _self = this;
                if (this.__rendered) {
                    return this;
                }
                this.__initOptions();
                this.callBase();
                this.__iconWidget = new Icon(this.__options.icon);
                this.__labelWidget = new Label(this.__options.label);
                // layout
                switch (this.__options.layout) {
                  case "left":
                  case "top":
                    this.__element.appendChild(this.__labelWidget.getElement());
                    this.__element.appendChild(this.__iconWidget.getElement());
                    break;

                  case "right":
                  case "bottom":
                  default:
                    this.__element.appendChild(this.__iconWidget.getElement());
                    this.__element.appendChild(this.__labelWidget.getElement());
                    break;
                }
                $(this.__element).addClass(CONF.classPrefix + "button-layout-" + this.__options.layout);
                this.__initButtonEvent();
            },
            __initOptions: function() {
                this.__options.__css = Utils.getCssRules([ "width", "height", "padding" ], this.__options);
                if (typeof this.__options.label === "string") {
                    this.__options.label = {
                        text: this.__options.label
                    };
                }
                if (typeof this.__options.icon === "string") {
                    this.__options.icon = {
                        img: this.__options.icon
                    };
                }
            },
            __initButtonEvent: function() {
                this.on("click", function() {
                    this.trigger("btnclick");
                });
            }
        });
    }
};

/**
 * 容器类： PPanel = Positioning Panel
 */
_p[32] = {
    value: function(require) {
        var Utils = _p.r(11), CONF = _p.r(10), Mask = _p.r(43), tpl = _p.r(15), $ = _p.r(2);
        return Utils.createClass("ColorPicker", {
            base: _p.r(46),
            constructor: function(options) {
                var marker = Utils.getMarker();
                this.callBase(marker);
                var defaultOptions = {
                    width: null,
                    height: null,
                    padding: null,
                    margin: 0,
                    clearText: "",
                    commonText: "",
                    commonColor: [ [ "#ffffff", "#000000", "#eeece1", "#1f497d", "#4f81bd", "#c0504d", "#9bbb59", "#8064a2", "#4bacc6", "#f79646" ], [ "#f2f2f2", "#808080", "#ddd8c2", "#c6d9f1", "#dbe5f1", "#f2dbdb", "#eaf1dd", "#e5dfec", "#daeef3", "#fde9d9" ], [ "#d9d9d9", "#595959", "#c4bc96", "#8db3e2", "#b8cce4", "#e5b8b7", "#d6e3bc", "#ccc0d9", "#b6dde8", "#fbd4b4" ], [ "#bfbfbf", "#404040", "#938953", "#548dd4", "#95b3d7", "#d99594", "#c2d69b", "#b2a1c7", "#92cddc", "#fabf8f" ], [ "#a6a6a6", "#262626", "#4a442a", "#17365d", "#365f91", "#943634", "#76923c", "#5f497a", "#31849b", "#e36c0a" ], [ "#7f7f7f", "#0d0d0d", "#1c1a10", "#0f243e", "#243f60", "#622423", "#4e6128", "#3f3151", "#205867", "#974706" ] ],
                    standardText: "",
                    standardColor: [ "#c00000", "#ff0000", "#ffc000", "#ffff00", "#92d050", "#00b050", "#00b0f0", "#0070c0", "#002060", "#7030a0" ]
                };
                this.__extendOptions(defaultOptions, options);
                this.widgetName = "ColorPicker";
                this.__contentElement = null;
                this.__maskWidget = null;
                this.__inDoc = false;
                if (options !== marker) {
                    this.__render();
                }
            },
            show: function() {
                if (!this.__inDoc) {
                    this.__inDoc = true;
                    this.appendTo(this.__element.ownerDocument.body);
                }
                this.__maskWidget.show();
                this.callBase();
                return this;
            },
            hide: function() {
                this.callBase();
                this.__maskWidget.hide();
                return this;
            },
            attachTo: function($obj) {
                var _self = this;
                $obj.on("click", function() {
                    _self.appendTo($obj.getElement().ownerDocument.body);
                    _self.positionTo($obj);
                    _self.show();
                });
            },
            __render: function() {
                if (this.__rendered) {
                    return this;
                }
                this.callBase();
                $(this.__element).addClass(CONF.classPrefix + "colorpicker");
                var contentHtml = Utils.Tpl.compile(tpl, this.__options);
                this.__contentElement.appendChild($(contentHtml)[0]);
                this.__previewElement = $(this.__contentElement).find("." + CONF.classPrefix + "colorpicker-preview");
                this.__clearElement = $(this.__contentElement).find("." + CONF.classPrefix + "colorpicker-clear");
                this.__maskWidget = new Mask(this.__options.mask);
                this.__initColorPickerEvents();
            },
            // 初始化点击事件
            __initColorPickerEvents: function() {
                var _self = this;
                this.on("click", function(e) {
                    var color, $target = $(e.target);
                    if ($target.hasClass(CONF.classPrefix + "colorpicker-item")) {
                        color = $target.attr("data-color");
                        _self.trigger("selectcolor", color);
                        _self.hide();
                    } else if ($target.hasClass(CONF.classPrefix + "colorpicker-clear")) {
                        _self.trigger("selectcolor", "");
                        _self.hide();
                    }
                });
                this.on("mouseover", function(e) {
                    var color, $target = $(e.target);
                    if ($target.hasClass(CONF.classPrefix + "colorpicker-item")) {
                        color = $target.attr("data-color");
                        $(_self.__element).find("." + CONF.classPrefix + "colorpicker-preview").css({
                            "background-color": color,
                            "border-color": color
                        });
                    }
                });
                this.__maskWidget.on("click", function() {
                    _self.hide();
                });
            }
        });
    }
};

/**
 * Container类， 所有容器类的父类`
 * @abstract
 */
_p[33] = {
    value: function(require) {
        var Utils = _p.r(11), CONF = _p.r(10), Widget = _p.r(50), $ = _p.r(2);
        return Utils.createClass("Container", {
            base: Widget,
            constructor: function(options) {
                var marker = Utils.getMarker();
                this.callBase(marker);
                var defaultOptions = {
                    "break": false
                };
                this.widgetName = "Icon";
                this.__widgets = [];
                this.__contentElement = null;
                this.__extendOptions(defaultOptions, options);
                if (options !== marker) {
                    this.__render();
                }
            },
            indexOf: function(widget) {
                return $.inArray(widget, this.__widgets);
            },
            __render: function() {
                if (this.__rendered) {
                    return this;
                }
                this.callBase();
                this.__contentElement = this.__element;
                $(this.__element).addClass(CONF.classPrefix + "container");
                if (this.__options.break) {
                    $(this.__element).addClass(CONF.classPrefix + "container-break");
                }
                return this;
            },
            disable: function() {
                this.callBase();
                $.each(this.__widgets, function(index, widget) {
                    widget.disable();
                });
            },
            enable: function() {
                this.callBase();
                $.each(this.__widgets, function(index, widget) {
                    widget.enable();
                });
            },
            getWidgets: function() {
                return this.__widgets;
            },
            getWidget: function(index) {
                return this.__widgets[index] || null;
            },
            appendWidget: function(widget) {
                if (!this.__valid(widget)) {
                    return null;
                }
                if (this.__options.disabled) {
                    widget.disable();
                }
                this.__widgets.push(widget);
                widget.appendTo(this.__contentElement);
                if (this.__options.break) {
                    this.__contentElement.appendChild($('<span class="fui-break">')[0]);
                    $(widget.getElement()).addClass(CONF.classPrefix + "panel-break-widget");
                }
                return widget;
            },
            insertWidget: function(index, widget) {
                var oldElement = null;
                if (this.__widgets.length === 0) {
                    return this.appendWidget(widget);
                }
                if (!this.__valid(widget)) {
                    return null;
                }
                if (this.__options.disabled) {
                    widget.disable();
                }
                oldElement = this.__widgets[index];
                this.__widgets.splice(index, 0, widget);
                this.__contentElement.insertBefore(widget.getElement(), oldElement.getElement());
                if (this.__options.break) {
                    this.__contentElement.insertBefore($('<span class="fui-break">')[0], oldElement.getElement());
                    $(widget.getElement()).addClass(CONF.classPrefix + "panel-break-widget");
                }
                return widget;
            },
            getContentElement: function() {
                return this.__contentElement;
            },
            removeWidget: function(widget) {
                if (typeof widget === "number") {
                    widget = this.__widgets.splice(widget, 1);
                } else {
                    this.__widgets.splice(this.indexOf(widget), 1);
                }
                this.__contentElement.removeChild(widget.getElement());
                $(widget.getElement()).removeClass(CONF.classPrefix + "panel-break-widget");
                return widget;
            },
            /**
         * 验证元素给定元素是否可以插入当前容器中
         * @param ele 需要验证的元素
         * @returns {boolean} 允许插入返回true, 否则返回false
         * @private
         */
            __valid: function(ele) {
                return ele instanceof Widget;
            }
        });
    }
};

/**
 * 容器类： PPanel = Positioning Panel
 */
_p[34] = {
    value: function(require) {
        var Utils = _p.r(11), CONF = _p.r(10), Widget = _p.r(50), Mask = _p.r(43), tpl = _p.r(16), Button = _p.r(31), LAYOUT = CONF.layout, $ = _p.r(2);
        return Utils.createClass("Dialog", {
            base: _p.r(46),
            constructor: function(options) {
                var marker = Utils.getMarker();
                this.callBase(marker);
                var defaultOptions = {
                    layout: LAYOUT.CENTER,
                    caption: null,
                    resize: "height",
                    draggable: true,
                    // 是否包含close button
                    closeButton: true,
                    mask: {
                        color: "#000",
                        opacity: .2
                    }
                };
                this.__extendOptions(defaultOptions, options);
                this.widgetName = "Dialog";
                this.__target = this.__options.target;
                this.__layout = this.__options.layout;
                this.__inDoc = false;
                this.__hinting = false;
                this.__openState = false;
                this.__headElement = null;
                this.__bodyElement = null;
                this.__footElement = null;
                this.__maskWidget = null;
                if (this.__target instanceof Widget) {
                    this.__target = this.__target.getElement();
                }
                if (options !== marker) {
                    this.__render();
                }
            },
            open: function() {
                return this.show();
            },
            close: function() {
                return this.hide();
            },
            show: function() {
                if (!this.__target) {
                    this.__target = this.__element.ownerDocument.body;
                }
                if (!this.__inDoc) {
                    this.__inDoc = true;
                    this.appendTo(this.__element.ownerDocument.body);
                }
                this.__maskWidget.show();
                this.callBase();
                this.__openState = true;
                return this;
            },
            hide: function() {
                this.callBase();
                this.__maskWidget.hide();
                this.__openState = false;
                return this;
            },
            toggle: function() {
                this.isOpen() ? this.close() : this.open();
                return this;
            },
            isOpen: function() {
                return this.__openState;
            },
            getHeadElement: function() {
                return this.__headElement;
            },
            getBodyElement: function() {
                return this.getContentElement();
            },
            getFootElement: function() {
                return this.__footElement;
            },
            __render: function() {
                if (this.__rendered) {
                    return this;
                }
                this.callBase();
                this.__innerTpl = Utils.Tpl.compile(tpl, this.__options);
                this.__contentElement.appendChild($(this.__innerTpl)[0]);
                $(this.__element).addClass(CONF.classPrefix + "dialog");
                this.__headElement = $(".fui-dialog-head", this.__contentElement)[0];
                this.__bodyElement = $(".fui-dialog-body", this.__contentElement)[0];
                this.__footElement = $(".fui-dialog-foot", this.__contentElement)[0];
                this.__maskWidget = new Mask(this.__options.mask);
                this.__contentElement = this.__bodyElement;
                if (this.__options.draggable) {
                    this.__initDraggable();
                }
                if (this.__options.closeButton) {
                    this.__initCloseButton();
                }
                this.__initMaskLint();
            },
            __initDraggable: function() {
                Utils.createDraggable({
                    handler: this.__headElement,
                    target: this.__element
                }).bind();
            },
            __initCloseButton: function() {
                var _self = this, closeButton = new Button({
                    className: "fui-close-button",
                    icon: {
                        className: "fui-close-button-icon"
                    }
                });
                closeButton.on("mousedown", function(e) {
                    e.stopPropagation();
                });
                closeButton.on("click", function(e) {
                    e.stopPropagation();
                    _self.close();
                });
                closeButton.appendTo(this.__headElement);
            },
            __initMaskLint: function() {
                var _self = this;
                this.__maskWidget.on("click", function() {
                    _self.__hint();
                });
            },
            __hint: function() {
                if (this.__hinting) {
                    return;
                }
                this.__hinting = true;
                var $ele = $(this.__element), _self = this, classNmae = [ CONF.classPrefix + "mask-hint", CONF.classPrefix + "mask-animate" ];
                $ele.addClass(classNmae.join(" "));
                window.setTimeout(function() {
                    $ele.removeClass(classNmae[0]);
                    window.setTimeout(function() {
                        $ele.removeClass(classNmae[1]);
                        _self.__hinting = false;
                    }, 200);
                }, 200);
            }
        });
    }
};

/**
 * DropPanel对象
 * 可接受输入的按钮构件
 */
_p[35] = {
    value: function(require) {
        var $ = _p.r(2), CONF = _p.r(10), tpl = _p.r(17), Button = _p.r(31), Panel = _p.r(45), PPanel = _p.r(46), Mask = _p.r(43), Utils = _p.r(11);
        return _p.r(11).createClass("DropPanel", {
            base: _p.r(50),
            constructor: function(options) {
                var marker = Utils.getMarker();
                this.callBase(marker);
                var defaultOptions = {
                    button: null,
                    panel: null,
                    width: null,
                    height: null
                };
                this.__extendOptions(defaultOptions, options);
                this.widgetName = "DropPanel";
                this.__tpl = tpl;
                this.__buttonWidget = null;
                this.__popupWidget = null;
                this.__panelWidget = null;
                this.__contentElement = null;
                this.__maskWidget = null;
                this.__popupState = false;
                if (options !== marker) {
                    this.__render();
                }
            },
            disable: function() {
                this.callBase();
                this.__labelWidget.disable();
            },
            enable: function() {
                this.callBase();
                this.__labelWidget.enable();
            },
            open: function() {
                this.__popupWidget.appendWidget(this.__panelWidget);
                this.__maskWidget.show();
                this.__popupWidget.show();
                var $popup = $(this.__popupWidget.getElement());
                $popup.css("top", parseInt($popup.css("top")) - $(this.__element).height() - 1);
            },
            close: function() {
                this.__maskWidget.hide();
                this.__popupWidget.hide();
                this.__panelWidget.appendTo(this.__contentElement);
            },
            appendWidget: function(widget) {
                this.__panelWidget.appendWidget(widget);
            },
            __render: function() {
                if (this.__rendered) {
                    return this;
                }
                this.__initOptions();
                this.__buttonWidget = new Button(this.__options.button);
                this.__panelWidget = new Panel(this.__options.content);
                this.__popupWidget = new PPanel();
                this.__maskWidget = new Mask(this.__options.mask);
                this.callBase();
                this.__popupWidget.positionTo(this.__element);
                $(this.__popupWidget.getElement()).addClass(CONF.classPrefix + "drop-panel-popup");
                // 初始化content
                $content = $('<div class="' + CONF.classPrefix + 'drop-panel-content"></div>').append(this.__panelWidget.getElement());
                this.__contentElement = $content[0];
                // 设置样式
                $content.css(Utils.getCssRules([ "width", "height", "padding" ], this.__options));
                if (this.__options.margin) {
                    $(this.elements).css("margin", this.__options.margin);
                }
                // 插入按钮到element
                $(this.__element).append($content).append(this.__buttonWidget.getElement());
                this.__initDropPanelEvent();
            },
            __initOptions: function() {
                this.__options.__css = Utils.getCssRules([ "height" ], this.__options);
                if (typeof this.__options.button === "string") {
                    this.__options.input = {
                        icon: this.__options.button
                    };
                }
            },
            __initDropPanelEvent: function() {
                var _self = this;
                this.__buttonWidget.on("click", function() {
                    if (!_self.__popupState) {
                        _self.__appendPopup();
                        _self.__popupState = true;
                    }
                    _self.trigger("buttonclick");
                    _self.open();
                });
                this.__panelWidget.on("click", function() {
                    _self.trigger("panelclick");
                });
                // mask 点击关闭
                this.__maskWidget.on("maskclick", function() {
                    _self.close();
                });
            },
            __appendPopup: function() {
                this.__popupWidget.appendTo(this.__element.ownerDocument.body);
            }
        });
    }
};

/**
 * icon widget
 * 封装多种icon方式
 */
_p[36] = {
    value: function(require) {
        var prefix = "_fui_", $ = _p.r(2), iconTpl = _p.r(18), Utils = _p.r(11);
        return _p.r(11).createClass("Icon", {
            base: _p.r(50),
            constructor: function(options) {
                var marker = Utils.getMarker();
                this.callBase(marker);
                var defaultOptions = {
                    width: null,
                    height: null,
                    img: null
                };
                this.__extendOptions(defaultOptions, options);
                this.widgetName = "Icon";
                this.__tpl = iconTpl;
                this.__prevIcon = null;
                this.__currentIcon = this.__options.img;
                if (options !== marker) {
                    this.__render();
                }
            },
            getValue: function() {
                return this.__options.value || this.__options.img;
            },
            setImage: function(imageSrc) {
                var tpl = null, node = null;
                if (this.__options.img === imageSrc) {
                    return this;
                }
                this.__prevIcon = this.__currentIcon;
                this.__currentIcon = imageSrc;
                tpl = Utils.Tpl.compile(this.__tpl, $.extend({}, this.__options, {
                    img: this.__currentIcon
                }));
                node = $(tpl)[0];
                this.__element.innerHTML = node.innerHTML;
                node = null;
                this.trigger("iconchange", {
                    prevImage: this.__prevIcon,
                    currentImage: this.__currentIcon
                });
            },
            getImage: function() {
                return this.__currentIcon;
            },
            __render: function() {
                if (this.__rendered) {
                    return this;
                }
                this.__initOptions();
                this.callBase();
            },
            __initOptions: function() {
                this.__options.__css = Utils.getCssRules([ "width", "height" ], this.__options);
            }
        });
    }
};

/**
 * InputButton对象
 * 可接受输入的按钮构件
 */
_p[37] = {
    value: function(require) {
        var $ = _p.r(2), CONF = _p.r(10), tpl = _p.r(19), Button = _p.r(31), Input = _p.r(39), Utils = _p.r(11);
        return _p.r(11).createClass("InputButton", {
            base: _p.r(50),
            constructor: function(options) {
                var marker = Utils.getMarker();
                this.callBase(marker);
                var defaultOptions = {
                    button: null,
                    input: null,
                    width: null,
                    height: null,
                    padding: null,
                    // label相对icon的位置
                    layout: "right"
                };
                this.__extendOptions(defaultOptions, options);
                this.widgetName = "InputButton";
                this.__tpl = tpl;
                this.__inputWidget = null;
                this.__buttonWidget = null;
                if (options !== marker) {
                    this.__render();
                }
            },
            getValue: function() {
                return this.__inputWidget.getValue();
            },
            setValue: function(value) {
                this.__inputWidget.setValue(value);
                return this;
            },
            selectAll: function() {
                this.__inputWidget.selectAll();
                return this;
            },
            selectRange: function(start, end) {
                this.__inputWidget.selectRange(start, end);
                return this;
            },
            focus: function() {
                this.__inputWidget.focus();
                return this;
            },
            unfocus: function() {
                this.__inputWidget.unfocus();
                return this;
            },
            __render: function() {
                var _self = this;
                if (this.__rendered) {
                    return this;
                }
                this.__initOptions();
                this.callBase();
                this.__buttonWidget = new Button(this.__options.button);
                this.__inputWidget = new Input(this.__options.input);
                // layout
                switch (this.__options.layout) {
                  case "left":
                  case "top":
                    this.__buttonWidget.appendTo(this.__element);
                    this.__inputWidget.appendTo(this.__element);
                    break;

                  case "right":
                  case "bottom":
                  default:
                    this.__inputWidget.appendTo(this.__element);
                    this.__buttonWidget.appendTo(this.__element);
                    break;
                }
                $(this.__element).addClass(CONF.classPrefix + "layout-" + this.__options.layout);
                this.__buttonWidget.on("click", function() {
                    _self.trigger("buttonclick");
                });
            },
            __initOptions: function() {
                this.__options.__css = Utils.getCssRules([ "width", "height", "padding" ], this.__options);
                if (typeof this.__options.button !== "object") {
                    this.__options.button = {
                        icon: this.__options.button
                    };
                }
            }
        });
    }
};

/**
 * InputMenu构件
 * 可接受输入的下拉菜单构件
 */
_p[38] = {
    value: function(require) {
        var $ = _p.r(2), CONF = _p.r(10), tpl = _p.r(20), InputButton = _p.r(37), Menu = _p.r(44), Mask = _p.r(43), Utils = _p.r(11);
        return _p.r(11).createClass("InputMenu", {
            base: _p.r(50),
            constructor: function(options) {
                var marker = Utils.getMarker();
                this.callBase(marker);
                var defaultOptions = {
                    input: null,
                    menu: null,
                    mask: null,
                    selected: -1
                };
                this.__extendOptions(defaultOptions, options);
                this.widgetName = "InputMenu";
                this.__tpl = tpl;
                // 最后输入时间
                this.__lastTime = 0;
                // 最后选中的记录
                this.__lastSelect = null;
                this.__inputWidget = null;
                this.__menuWidget = null;
                this.__maskWidget = null;
                // menu状态， 记录是否已经append到dom树上
                this.__menuState = false;
                if (options !== marker) {
                    this.__render();
                }
            },
            select: function(index) {
                this.__menuWidget.select(index);
            },
            setValue: function(value) {
                this.__inputWidget.setValue(value);
                return this;
            },
            getValue: function() {
                return this.__inputWidget.getValue();
            },
            open: function() {
                this.__maskWidget.show();
                this.__menuWidget.show();
            },
            close: function() {
                this.__maskWidget.hide();
                this.__menuWidget.hide();
            },
            __render: function() {
                if (this.__rendered) {
                    return this;
                }
                this.__initOptions();
                this.__inputWidget = new InputButton(this.__options.input);
                this.__menuWidget = new Menu(this.__options.menu);
                this.__maskWidget = new Mask(this.__options.mask);
                this.callBase();
                this.__inputWidget.appendTo(this.__element);
                this.__menuWidget.positionTo(this.__inputWidget);
                this.__initInputValue();
                this.__initInputMenuEvent();
            },
            __initInputValue: function() {
                var selectedItem = this.__menuWidget.getItem(this.__options.selected);
                if (!selectedItem) {
                    return;
                }
                this.__inputWidget.setValue(selectedItem.getValue());
            },
            __initInputMenuEvent: function() {
                var _self = this;
                this.on("buttonclick", function() {
                    if (!this.__menuState) {
                        this.__appendMenu();
                        this.__menuState = true;
                    }
                    this.__inputWidget.unfocus();
                    this.open();
                });
                this.on("keypress", function(e) {
                    this.__lastTime = new Date();
                });
                this.on("keyup", function(e) {
                    if (e.keyCode !== 8 && e.keyCode !== 13 && new Date() - this.__lastTime < 500) {
                        this.__update();
                    }
                });
                this.on("inputcomplete", function() {
                    this.__inputWidget.selectRange(99999999);
                    this.__inputComplete();
                });
                this.__menuWidget.on("select", function(e, info) {
                    e.stopPropagation();
                    _self.setValue(info.value);
                    _self.trigger("select", info);
                    _self.close();
                });
                this.__menuWidget.on("change", function(e, info) {
                    e.stopPropagation();
                    _self.trigger("change", info);
                });
                // 阻止input自身的select和change事件
                this.__inputWidget.on("select change", function(e) {
                    e.stopPropagation();
                });
                // mask 点击关闭
                this.__maskWidget.on("maskclick", function() {
                    _self.close();
                });
                // 记录最后选中的数据
                this.on("select", function(e, info) {
                    this.__lastSelect = info;
                });
            },
            // 更新输入框内容
            __update: function() {
                var inputValue = this.getValue(), lowerCaseValue = inputValue.toLowerCase(), values = this.__getItemValues(), targetValue = null;
                if (!inputValue) {
                    return;
                }
                $.each(values, function(i, val) {
                    if (val.toLowerCase().indexOf(lowerCaseValue) === 0) {
                        targetValue = val;
                        return false;
                    }
                });
                if (targetValue) {
                    this.__inputWidget.setValue(targetValue);
                    this.__inputWidget.selectRange(inputValue.length);
                }
            },
            // 获取所有item的值列表
            __getItemValues: function() {
                var vals = [];
                $.each(this.__menuWidget.getWidgets(), function(index, item) {
                    vals.push(item.getValue());
                });
                return vals;
            },
            // 用户输入完成
            __inputComplete: function() {
                var values = this.__getItemValues(), targetIndex = -1, inputValue = this.getValue(), lastSelect = this.__lastSelect;
                $.each(values, function(i, val) {
                    if (val === inputValue) {
                        targetIndex = i;
                        return false;
                    }
                });
                this.trigger("select", {
                    index: targetIndex,
                    value: inputValue
                });
                if (!lastSelect || lastSelect.value !== inputValue) {
                    this.trigger("change", {
                        from: lastSelect || {
                            index: -1,
                            value: null
                        },
                        to: {
                            index: targetIndex,
                            value: inputValue
                        }
                    });
                }
            },
            __appendMenu: function() {
                this.__menuWidget.appendTo(this.__inputWidget.getElement().ownerDocument.body);
            },
            __initOptions: function() {
                if (this.__options.selected !== -1) {
                    this.__options.menu.selected = this.__options.selected;
                }
            }
        });
    }
};

/**
 * Input widget
 */
_p[39] = {
    value: function(require) {
        var prefix = "_fui_", $ = _p.r(2), tpl = _p.r(21), Utils = _p.r(11);
        return _p.r(11).createClass("Input", {
            base: _p.r(50),
            constructor: function(options) {
                var marker = Utils.getMarker();
                this.callBase(marker);
                var defaultOptions = {
                    width: null,
                    height: null,
                    border: null,
                    padding: null,
                    color: null
                };
                this.__extendOptions(defaultOptions, options);
                this.widgetName = "Input";
                this.__tpl = tpl;
                // input构件允许获取获得
                this.__allow_focus = true;
                if (options !== marker) {
                    this.__render();
                }
            },
            getValue: function() {
                return this.__element.value;
            },
            setValue: function(value) {
                this.__element.value = value;
                return this;
            },
            selectAll: function() {
                this.__element.select();
            },
            selectRange: function(startIndex, endIndex) {
                if (!startIndex) {
                    startIndex = 0;
                }
                if (!endIndex) {
                    endIndex = 1e9;
                }
                this.__element.setSelectionRange(startIndex, endIndex);
            },
            focus: function() {
                this.__element.focus();
                return this;
            },
            unfocus: function() {
                this.__element.blur();
                return this;
            },
            __render: function() {
                if (this.__rendered) {
                    return this;
                }
                this.__initOptions();
                this.callBase();
                this.__initInputEvent();
            },
            __initInputEvent: function() {
                this.on("keydown", function(e) {
                    if (e.keyCode === 13) {
                        this.trigger("inputcomplete", {
                            value: this.getValue()
                        });
                    }
                });
            },
            __initOptions: function() {
                this.__options.__css = Utils.getCssRules([ "width", "height", "border", "padding", "color" ], this.__options);
            }
        });
    }
};

/**
 * Label Widget
 */
_p[40] = {
    value: function(require) {
        var Utils = _p.r(11), itemTpl = _p.r(22), Icon = _p.r(36), Label = _p.r(42), CONF = _p.r(10), $ = _p.r(2);
        return Utils.createClass("Item", {
            base: _p.r(50),
            constructor: function(options) {
                var marker = Utils.getMarker();
                this.callBase(marker);
                var defaultOptions = {
                    label: "",
                    icon: null,
                    width: null,
                    height: null,
                    padding: null,
                    selected: false,
                    textAlign: "left"
                };
                this.__extendOptions(defaultOptions, options);
                this.widgetName = "Item";
                this.__tpl = itemTpl;
                this.__iconWidget = null;
                this.__labelWidget = null;
                this.__selectState = this.__options.selected;
                if (options !== marker) {
                    this.__render();
                }
            },
            getValue: function() {
                return this.__labelWidget.getValue() || this.__iconWidget.getValue() || null;
            },
            select: function() {
                this.__update(true);
                return this;
            },
            unselect: function() {
                this.__update(false);
                return this;
            },
            isSelect: function() {
                return this.__selectState;
            },
            setLabel: function(text) {
                this.__labelWidget.setText(text);
                return this;
            },
            getLabel: function() {
                return this.__labelWidget.getText();
            },
            setIcon: function(imageSrc) {
                this.__iconWidget.setImage(imageSrc);
                return this;
            },
            getIcon: function() {
                return this.__iconWidget.getImage();
            },
            __render: function() {
                if (this.__rendered) {
                    return this;
                }
                this.__initOptions();
                this.callBase();
                this.__iconWidget = new Icon(this.__options.icon);
                this.__labelWidget = new Label(this.__options.label);
                this.__iconWidget.appendTo(this.__element);
                this.__labelWidget.appendTo(this.__element);
                this.__initItemEvent();
            },
            __update: function(state) {
                state = !!state;
                $(this.__element)[state ? "addClass" : "removeClass"](CONF.classPrefix + "item-selected");
                this.__selectState = state;
                this.trigger(state ? "itemselect" : "itemunselect");
                return this;
            },
            __initItemEvent: function() {
                this.on("click", function() {
                    this.trigger("itemclick");
                });
            },
            /**
         * 初始化模板所用的css值
         * @private
         */
            __initOptions: function() {
                this.__options.__css = Utils.getCssRules([ "width", "height", "padding" ], this.__options);
                if (typeof this.__options.label !== "object") {
                    this.__options.label = {
                        text: this.__options.label
                    };
                }
                if (!this.__options.label.textAlign) {
                    this.__options.label.textAlign = this.__options.textAlign;
                }
                if (typeof this.__options.icon !== "object") {
                    this.__options.icon = {
                        img: this.__options.icon
                    };
                }
            }
        });
    }
};

/**
 * LabelPanel Widget
 * 带标签的面板
 */
_p[41] = {
    value: function(require) {
        var Utils = _p.r(11), CONF = _p.r(10), Label = _p.r(42), $ = _p.r(2);
        return Utils.createClass("LabelPanel", {
            base: _p.r(45),
            constructor: function(options) {
                var marker = Utils.getMarker();
                this.callBase(marker);
                var defaultOptions = {
                    layout: "bottom"
                };
                this.__extendOptions(defaultOptions, options);
                this.widgetName = "LabelPanel";
                this.__labelWidget = null;
                if (options !== marker) {
                    this.__render();
                }
            },
            disable: function() {
                this.callBase();
                this.__labelWidget.disable();
            },
            enable: function() {
                this.callBase();
                this.__labelWidget.enable();
            },
            __render: function() {
                var $contentElement = null;
                if (this.__rendered) {
                    return this;
                }
                this.__initOptions();
                this.__labelWidget = new Label(this.__options.label);
                this.callBase();
                $(this.__element).addClass(CONF.classPrefix + "label-panel");
                $(this.__element).addClass(CONF.classPrefix + "layout-" + this.__options.layout);
                $contentElement = $('<div class="fui-label-panel-content"></div>');
                this.__contentElement.appendChild(this.__labelWidget.getElement());
                this.__contentElement.appendChild($contentElement[0]);
                // 容器高度未设置， 则禁用定位属性， 避免自适应布局下的因流布局被破坏造成的重叠问题
                if (this.__options.height === null) {
                    $(this.__element).addClass(CONF.classPrefix + "no-position");
                    this.__contentElement.appendChild(this.__labelWidget.getElement());
                }
                // 更新contentElement
                this.__contentElement = $contentElement[0];
                return this;
            },
            __initOptions: function() {
                var label = this.__options.label;
                this.callBase();
                if (typeof label === "string") {
                    this.__options.label = {
                        text: label
                    };
                }
                if (!this.__options.label.className) {
                    this.__options.label.className = "";
                }
                this.__options.label.className += " fui-label-panel-label";
            }
        });
    }
};

/**
 * Label Widget
 */
_p[42] = {
    value: function(require) {
        var Utils = _p.r(11), labelTpl = _p.r(23), $ = _p.r(2);
        return Utils.createClass("Label", {
            base: _p.r(50),
            constructor: function(options) {
                var marker = Utils.getMarker();
                this.callBase(marker);
                var defaultOptions = {
                    text: "",
                    width: null,
                    height: null,
                    padding: null,
                    textAlign: "center"
                };
                this.__extendOptions(defaultOptions, options);
                this.widgetName = "Label";
                this.__tpl = labelTpl;
                if (options !== marker) {
                    this.__render();
                }
            },
            getValue: function() {
                return this.__options.text;
            },
            setText: function(text) {
                var oldtext = this.__options.text;
                this.__options.text = text;
                $(this.__element).text(text);
                this.trigger("labelchange", {
                    currentText: text,
                    prevText: oldtext
                });
                return this;
            },
            getText: function() {
                return this.__options.text;
            },
            // label 禁用title显示
            __allowShowTitle: function() {
                return false;
            },
            __render: function() {
                if (this.__rendered) {
                    return this;
                }
                this.__initOptions();
                this.callBase();
            },
            /**
         * 初始化模板所用的css值
         * @private
         */
            __initOptions: function() {
                this.__options.text = this.__options.text.toString();
                this.__options.__css = Utils.getCssRules([ "width", "height", "padding", {
                    textAlign: "text-align"
                } ], this.__options);
            }
        });
    }
};

/**
 * Mask Widget
 */
_p[43] = {
    value: function(require) {
        var Utils = _p.r(11), tpl = _p.r(24), Widget = _p.r(50), $ = _p.r(2), __cache_inited = false, __MASK_CACHE = [];
        return Utils.createClass("Mask", {
            base: _p.r(50),
            constructor: function(options) {
                var marker = Utils.getMarker();
                this.callBase(marker);
                var defaultOptions = {
                    bgcolor: "#000",
                    opacity: 0,
                    inner: true,
                    target: null,
                    // 禁止mouse scroll事件
                    scroll: false,
                    hide: true
                };
                this.__extendOptions(defaultOptions, options);
                this.widgetName = "Mask";
                this.__tpl = tpl;
                this.__cacheId = __MASK_CACHE.length;
                this.__hideState = true;
                __MASK_CACHE.push(this);
                this.__target = this.__options.target;
                if (this.__target instanceof Widget) {
                    this.__target = this.__target.getElement();
                }
                if (options !== marker) {
                    this.__render();
                }
            },
            __render: function() {
                if (this.__rendered) {
                    return this;
                }
                this.callBase();
                this.__initMaskEvent();
                if (!__cache_inited) {
                    __cache_inited = true;
                    __initCacheEvent();
                }
            },
            maskTo: function(target) {
                if (target) {
                    this.__target = target;
                }
                return this;
            },
            show: function() {
                var docNode = null;
                if (!this.__target) {
                    this.__target = this.__element.ownerDocument.body;
                }
                docNode = this.__target.ownerDocument.documentElement;
                // 如果节点未添加到dom树， 则自动添加到文档的body节点上
                if (!$.contains(docNode, this.__element)) {
                    this.appendTo(this.__target.ownerDocument.body);
                }
                this.callBase();
                this.__position();
                this.__resize();
                this.__hideState = false;
            },
            hide: function() {
                this.callBase();
                this.__hideState = true;
            },
            isHide: function() {
                return this.__hideState;
            },
            __initMaskEvent: function() {
                this.on("mousewheel", function(e) {
                    var evt = e.originalEvent;
                    e.preventDefault();
                    e.stopPropagation();
                    this.trigger("scroll", {
                        delta: evt.wheelDelta || evt.deltaY || evt.detail
                    });
                });
                this.on("click", function(e) {
                    e.stopPropagation();
                    if (e.target === this.__element) {
                        this.trigger("maskclick");
                    }
                });
            },
            // 定位
            __resize: function() {
                var targetRect = null;
                // body特殊处理
                if (this.__targetIsBody()) {
                    targetRect = $(this.__target.ownerDocument.defaultView);
                    targetRect = {
                        width: targetRect.width(),
                        height: targetRect.height()
                    };
                } else {
                    targetRect = Utils.getRect(this.__target);
                }
                this.__element.style.width = targetRect.width + "px";
                this.__element.style.height = targetRect.height + "px";
            },
            __position: function() {
                var location = null, targetRect = null;
                if (this.__targetIsBody()) {
                    location = {
                        top: 0,
                        left: 0
                    };
                } else {
                    targetRect = Utils.getRect(this.__target);
                    location = {
                        top: targetRect.top,
                        left: targetRect.left
                    };
                }
                $(this.__element).css("top", location.top + "px").css("left", location.left + "px");
            },
            __targetIsBody: function() {
                return this.__target.tagName.toLowerCase() === "body";
            }
        });
        // 全局监听
        function __initCacheEvent() {
            $(window).on("resize", function() {
                $.each(__MASK_CACHE, function(i, mask) {
                    if (mask && !mask.isHide()) {
                        mask.__resize();
                    }
                });
            });
        }
    }
};

/**
 * Menu Widget
 */
_p[44] = {
    value: function(require) {
        var Utils = _p.r(11), Item = _p.r(40), CONF = _p.r(10), $ = _p.r(2);
        return Utils.createClass("Menu", {
            base: _p.r(46),
            constructor: function(options) {
                var marker = Utils.getMarker();
                this.callBase(marker);
                var defaultOptions = {
                    "break": true,
                    selected: -1,
                    textAlign: "left",
                    items: []
                };
                this.__extendOptions(defaultOptions, options);
                this.__prevSelect = -1;
                this.__currentSelect = this.__options.selected;
                this.widgetName = "Menu";
                if (options !== marker) {
                    this.__render();
                }
            },
            select: function(index) {
                var item = this.__widgets[index];
                if (!item) {
                    return this;
                }
                this.__selectItem(item);
                return this;
            },
            getItems: function() {
                return this.getWidgets.apply(this, arguments);
            },
            getItem: function() {
                return this.getWidget.apply(this, arguments);
            },
            appendItem: function(item) {
                return this.appendWidget.apply(this, arguments);
            },
            insertItem: function(item) {
                return this.insertWidget.apply(this, arguments);
            },
            removeItem: function(item) {
                return this.removeWidget.apply(this, arguments);
            },
            getSelected: function() {
                return this.__currentSelect;
            },
            getSelectedItem: function() {
                return this.getItem(this.__currentSelect);
            },
            insertWidget: function(index, widget) {
                var returnValue = this.callBase(index, widget);
                if (returnValue === null) {
                    return returnValue;
                }
                if (index <= this.__currentSelect) {
                    this.__currentSelect++;
                }
                if (index <= this.__prevSelect) {
                    this.__prevSelect++;
                }
                return returnValue;
            },
            removeWidget: function(widget) {
                var index = widget;
                if (typeof index !== "number") {
                    index = this.indexOf(widget);
                }
                widget = this.callBase(widget);
                if (index === this.__currentSelect) {
                    this.__currentSelect = -1;
                } else if (index < this.__currentSelect) {
                    this.__currentSelect--;
                }
                if (index === this.__prevSelect) {
                    this.__prevSelect = -1;
                } else if (index < this.__prevSelect) {
                    this.__prevSelect--;
                }
                return widget;
            },
            __render: function() {
                var _self = this, textAlign = this.__options.textAlign, selected = this.__options.selected;
                if (this.__rendered) {
                    return this;
                }
                this.callBase();
                $(this.__element).addClass(CONF.classPrefix + "menu");
                $.each(this.__options.items, function(index, itemOption) {
                    if (typeof itemOption !== "object") {
                        itemOption = {
                            label: itemOption
                        };
                    }
                    itemOption.selected = index === selected;
                    itemOption.textAlign = textAlign;
                    _self.appendItem(new Item(itemOption));
                });
                this.__initMenuEvent();
            },
            // 初始化点击事件
            __initMenuEvent: function() {
                this.on("itemclick", function(e) {
                    this.__selectItem(e.widget);
                });
            },
            __selectItem: function(item) {
                if (this.__currentSelect > -1) {
                    this.__widgets[this.__currentSelect].unselect();
                }
                this.__prevSelect = this.__currentSelect;
                this.__currentSelect = this.indexOf(item);
                item.select();
                this.trigger("select", {
                    index: this.__currentSelect,
                    value: this.__widgets[this.__currentSelect].getValue()
                });
                if (this.__prevSelect !== this.__currentSelect) {
                    var fromItem = this.__widgets[this.__prevSelect] || null;
                    this.trigger("change", {
                        from: {
                            index: this.__prevSelect,
                            value: fromItem && fromItem.getValue()
                        },
                        to: {
                            index: this.__currentSelect,
                            value: this.__widgets[this.__currentSelect].getValue()
                        }
                    });
                }
            },
            __valid: function(target) {
                return target instanceof Item;
            }
        });
    }
};

/**
 * 容器类： Panel
 */
_p[45] = {
    value: function(require) {
        var Utils = _p.r(11), panelTpl = _p.r(25), $ = _p.r(2);
        return Utils.createClass("Panel", {
            base: _p.r(33),
            constructor: function(options) {
                var marker = Utils.getMarker();
                this.callBase(marker);
                var defaultOptions = {
                    width: null,
                    height: null,
                    padding: null,
                    margin: 0
                };
                this.__extendOptions(defaultOptions, options);
                this.widgetName = "Panel";
                this.__tpl = panelTpl;
                if (options !== marker) {
                    this.__render();
                }
            },
            appendWidget: function(widget) {
                var returnValue = this.callBase(widget);
                if (this.__options.margin) {
                    widget.getElement().style.margin = this.__options.margin;
                }
                return returnValue;
            },
            insertWidget: function(index, widget) {
                var returnValue = this.callBase(index, widget);
                if (this.__options.margin) {
                    widget.getElement().style.margin = this.__options.margin;
                }
                return returnValue;
            },
            __render: function() {
                var $content = null;
                if (this.__rendered) {
                    return this;
                }
                this.__initOptions();
                this.callBase();
                $content = $('<div class="fui-panel-content"></div>');
                this.__contentElement.appendChild($content[0]);
                this.__contentElement = $content[0];
            },
            __initOptions: function() {
                var cssMapping = {}, options = this.__options, value = null;
                $.each([ "width", "height", "padding" ], function(i, item) {
                    value = options[item];
                    if (value !== null && value !== undefined) {
                        cssMapping[item] = value;
                    }
                });
                options.__css = cssMapping;
                // margin
                if (typeof this.__options.margin === "number") {
                    this.__options.margin += "px";
                }
            }
        });
    }
};

/**
 * 容器类： PPanel = Positioning Panel
 */
_p[46] = {
    value: function(require) {
        var Utils = _p.r(11), CONF = _p.r(10), Widget = _p.r(50), $ = _p.r(2);
        var LAYOUT = {
            TOP: "top",
            LEFT: "left",
            BOTTOM: "bottom",
            RIGHT: "right"
        };
        return Utils.createClass("PPanel", {
            base: _p.r(45),
            constructor: function(options) {
                var marker = Utils.getMarker();
                this.callBase(marker);
                var defaultOptions = {
                    layout: LAYOUT.BOTTOM,
                    target: null,
                    // 布局属性layout是否以target内部为参照
                    inner: false,
                    // 边界容器
                    bound: null,
                    // 和边界之间的最小距离
                    diff: 10,
                    hide: true,
                    resize: "all"
                };
                this.__extendOptions(defaultOptions, options);
                this.widgetName = "PPanel";
                this.__target = this.__options.target;
                this.__layout = this.__options.layout;
                if (this.__target instanceof Widget) {
                    this.__target = this.__target.getElement();
                }
                if (options !== marker) {
                    this.__render();
                }
            },
            positionTo: function(target, layout) {
                if (target instanceof Widget) {
                    target = target.getElement();
                }
                this.__target = target;
                if (layout) {
                    this.__layout = layout;
                }
                return this;
            },
            show: function() {
                var docNode = null;
                if (!this.__target) {
                    return this.callBase();
                }
                if (!this.__options.bound) {
                    this.__options.bound = this.__target.ownerDocument.body;
                }
                docNode = this.__target.ownerDocument.documentElement;
                if ($.contains(docNode, this.__target) && $.contains(docNode, this.__element)) {
                    this.callBase(Utils.getMarker());
                    this.__position();
                }
                return this;
            },
            __render: function() {
                if (this.__rendered) {
                    return this;
                }
                this.callBase();
                $(this.__element).addClass(CONF.classPrefix + "ppanel");
            },
            // 执行定位
            __position: function() {
                var location = null, targetRect = null;
                $(this.__element).addClass(CONF.classPrefix + "ppanel-position");
                targetRect = Utils.getBound(this.__target);
                if (this.__layout === "center" || this.__layout === "middle") {
                    location = this.__getCenterLayout(targetRect);
                } else if (!this.__options.inner) {
                    location = this.__getOuterLayout(targetRect);
                } else {
                    location = this.__getInnerLayout(targetRect);
                }
                $(this.__element).css("top", location.top + "px").css("left", location.left + "px");
                if (this.__options.resize !== "height") {
                    this.__resizeWidth(targetRect);
                }
                if (this.__options.resize !== "width") {
                    this.__resizeHeight();
                }
            },
            /**
         * 在未指定宽度的情况下，执行自动宽度适配。
         * 如果构件未被指定宽度， 则添加一个最小宽度， 该最小宽度等于给定目标的宽度
         * @param targetRect 传递该参数，是出于整体性能上的考虑。
         * @private
         */
            __resizeWidth: function(targetRect) {
                if (!this.__target || this.__options.width !== null) {
                    return;
                }
                var $ele = $(this.__element), vals = {
                    bl: parseInt($ele.css("border-left-width"), 10) || 0,
                    br: parseInt($ele.css("border-right-width"), 10) || 0,
                    pl: parseInt($ele.css("padding-left"), 10) || 0,
                    pr: parseInt($ele.css("padding-right"), 10) || 0
                }, minWidth = targetRect.width - vals.bl - vals.br - vals.pl - vals.pr;
                this.__element.style.minWidth = minWidth + "px";
            },
            /**
         * 调整panel高度，使其不超过边界范围，如果已设置高度， 则不进行调整
         * @private
         */
            __resizeHeight: function() {
                var boundRect = null, panelRect = null, diff = 0;
                if (this.__options.height !== null) {
                    return;
                }
                panelRect = Utils.getRect(this.__element);
                if (this.__options.bound.tagName.toLowerCase() === "body") {
                    boundRect = {
                        top: 0,
                        bottom: $(this.__options.bound.ownerDocument.defaultView).height()
                    };
                } else {
                    boundRect = Utils.getRect(this.__options.bound);
                }
                diff = panelRect.bottom - boundRect.bottom;
                if (diff > 0) {
                    $(this.__element).css("height", panelRect.height - diff - this.__options.diff + "px");
                }
            },
            /**
         * 居中定位的位置属性
         * @private
         */
            __getCenterLayout: function(targetRect) {
                var location = {
                    top: 0,
                    left: 0
                }, panelRect = Utils.getRect(this.__element), diff = 0;
                diff = targetRect.height - panelRect.height;
                if (diff > 0) {
                    location.top = targetRect.top + diff / 2;
                }
                diff = targetRect.width - panelRect.width;
                if (diff > 0) {
                    location.left = targetRect.left + diff / 2;
                }
                return location;
            },
            /**
         * 获取外部布局定位属性
         * @returns {{top: number, left: number}}
         * @private
         */
            __getOuterLayout: function(targetRect) {
                var location = {
                    top: 0,
                    left: 0
                }, panelRect = Utils.getRect(this.__element);
                switch (this.__layout) {
                  case LAYOUT.TOP:
                    location.left = targetRect.left;
                    location.top = targetRect.top - panelRect.height;
                    break;

                  case LAYOUT.LEFT:
                    location.top = targetRect.top;
                    location.left = targetRect.left - panelRect.width;
                    break;

                  case LAYOUT.RIGHT:
                    location.top = targetRect.top;
                    location.left = targetRect.right;
                    break;

                  case LAYOUT.BOTTOM:
                  default:
                    location.left = targetRect.left;
                    location.top = targetRect.bottom;
                    break;
                }
                return location;
            },
            /**
         * 获取内部布局定位属性
         * @private
         */
            __getInnerLayout: function(targetRect) {
                var location = {
                    top: 0,
                    left: 0
                }, panelRect = Utils.getRect(this.__element);
                switch (this.__layout) {
                  case LAYOUT.TOP:
                  case LAYOUT.LEFT:
                    location.left = targetRect.left;
                    location.top = targetRect.top;
                    break;

                  case LAYOUT.RIGHT:
                  case LAYOUT.BOTTOM:
                    location.top = targetRect.bottom - panelRect.height;
                    location.left = targetRect.right - panelRect.width;
                    break;
                }
                return location;
            }
        });
    }
};

/**
 * Separator(分隔符) Widget
 */
_p[47] = {
    value: function(require) {
        var Utils = _p.r(11), separatorTpl = _p.r(26), $ = _p.r(2);
        return Utils.createClass("Separator", {
            base: _p.r(50),
            constructor: function(options) {
                var marker = Utils.getMarker();
                this.callBase(marker);
                var defaultOptions = {
                    padding: null,
                    width: 1,
                    height: "100%",
                    bgcolor: "#e1e1e1"
                };
                this.__extendOptions(defaultOptions, options);
                this.widgetName = "Separator";
                this.__tpl = separatorTpl;
                if (options !== marker) {
                    this.__render();
                }
            },
            __render: function() {
                if (this.__rendered) {
                    return this;
                }
                this.__initOptions();
                this.callBase();
            },
            /**
         * 初始化模板所用的css值
         * @private
         */
            __initOptions: function() {
                this.__options.__css = Utils.getCssRules([ "width", "height", "padding", "margin", {
                    bgcolor: "background-color"
                } ], this.__options);
            }
        });
    }
};

/**
 * Tabs Widget
 */
_p[48] = {
    value: function(require) {
        var $ = _p.r(2), CONF = _p.r(10), tpl = _p.r(27), Button = _p.r(31), Panel = _p.r(45), Utils = _p.r(11);
        return _p.r(11).createClass("Tabs", {
            base: _p.r(50),
            constructor: function(options) {
                var marker = Utils.getMarker();
                this.callBase(marker);
                var defaultOptions = {
                    selected: 0,
                    buttons: [],
                    panels: null
                };
                this.__extendOptions(defaultOptions, options);
                this.widgetName = "Tabs";
                this.__tpl = tpl;
                this.__btns = [];
                this.__panels = [];
                this.__prevSelected = -1;
                this.__selected = -1;
                if (options !== marker) {
                    this.__render();
                }
            },
            getButtons: function() {
                return this.__btns;
            },
            getButton: function(index) {
                return this.getButtons()[index] || null;
            },
            getPanels: function() {
                return this.__panels;
            },
            getPanel: function(index) {
                return this.getPanels()[index] || null;
            },
            getSelectedIndex: function() {
                return this.__selected;
            },
            getSelected: function() {
                var index = this.getSelectedIndex();
                return {
                    button: this.getButton(index),
                    panel: this.getPanel(index)
                };
            },
            /**
         * 选择接口
         * @param index 需要选中的tab页索引
         */
            select: function(index) {
                var toInfo = null;
                if (!this.__selectItem(index)) {
                    return this;
                }
                toInfo = this.__getInfo(index);
                this.trigger("tabselect", toInfo);
                if (this.__prevSelected !== this.__selected) {
                    this.trigger("tabchange", {
                        from: this.__getInfo(this.__prevSelected),
                        toInfo: toInfo
                    });
                }
                return this;
            },
            getIndexByButton: function(btn) {
                return $.inArray(btn, this.__btns);
            },
            /**
         * 把所有button追加到其他容器中
         */
            appendButtonTo: function(container) {
                $.each(this.__btns, function(index, btn) {
                    btn.appendTo(container);
                });
            },
            appendPanelTo: function(container) {
                $.each(this.__panels, function(index, panel) {
                    panel.appendTo(container);
                });
            },
            __render: function() {
                var _self = this, btnWrap = null, panelWrap = null;
                if (this.__rendered) {
                    return this;
                }
                this.__initOptions();
                this.callBase();
                btnWrap = $(".fui-tabs-button-wrap", this.__element)[0];
                panelWrap = $(".fui-tabs-panel-wrap", this.__element)[0];
                $.each(this.__options.buttons, function(index, opt) {
                    var btn = null;
                    if (typeof opt !== "object") {
                        opt = {
                            label: opt
                        };
                    }
                    btn = new Button(opt);
                    btn.on("click", function() {
                        _self.select(_self.getIndexByButton(this));
                    });
                    _self.__btns.push(btn);
                    btn.appendTo(btnWrap);
                });
                $.each(this.__options.panels, function(index, opt) {
                    var panel = null;
                    opt = opt || {
                        hide: true
                    };
                    panel = new Panel(opt);
                    _self.__panels.push(panel);
                    panel.appendTo(panelWrap);
                });
                this.__selectItem(this.__options.selected);
            },
            __initOptions: function() {
                // panels不设置的情况下， 将根据button创建
                if (this.__options.panels === null) {
                    this.__options.panels = [];
                    this.__options.panels.length = this.__options.buttons.length;
                }
            },
            __selectItem: function(index) {
                var btn = this.getButton(index), prevBtn = this.getButton(this.__selected), className = CONF.classPrefix + "selected";
                if (!btn) {
                    return false;
                }
                if (prevBtn) {
                    prevBtn.removeClass(className);
                    this.getPanel(this.__selected).hide();
                }
                btn.addClass(className);
                this.getPanel(index).show();
                this.__prevSelected = this.__selected;
                this.__selected = index;
                return true;
            },
            // 根据给定的tab索引获取先关的信息， 这些信息将用于事件携带的参数
            __getInfo: function(index) {
                return {
                    index: index,
                    button: this.getButton(index),
                    panel: this.getPanel(index)
                };
            }
        });
    }
};

/**
 * ToggleButton对象
 * 可切换按钮构件
 */
_p[49] = {
    value: function(require) {
        var $ = _p.r(2), CONF = _p.r(10), Utils = _p.r(11);
        return _p.r(11).createClass("ToggleButton", {
            base: _p.r(31),
            constructor: function(options) {
                var marker = Utils.getMarker();
                this.callBase(marker);
                var defaultOptions = {
                    // 按钮初始时是否按下
                    pressed: false
                };
                this.__extendOptions(defaultOptions, options);
                this.widgetName = "ToggleButton";
                // 按钮当前状态
                this.__state = false;
                if (options !== marker) {
                    this.__render();
                }
            },
            __render: function() {
                if (this.__rendered) {
                    return this;
                }
                this.callBase();
                $(this.__element).addClass(CONF.classPrefix + "toggle-button");
                this.__initButtonState();
                this.__initToggleButtonEvent();
                return this;
            },
            __initButtonState: function() {
                if (!this.__options.pressed) {
                    return;
                }
                // 不直接调用press方法， 防止初始化时事件的触发
                $(this.__element).addClass(CONF.classPrefix + "button-pressed");
                this.__state = true;
            },
            /**
         * 初始化事件监听, 控制状态的切换
         * @private
         */
            __initToggleButtonEvent: function() {
                this.on("click", function() {
                    this.toggle();
                });
            },
            /**
         * 当前按钮是否已按下
         */
            isPressed: function() {
                return this.__state;
            },
            /**
         * 按下按钮
         */
            press: function() {
                $(this.__element).addClass(CONF.classPrefix + "button-pressed");
                this.__updateState(true);
            },
            /**
         * 弹起按钮
         */
            bounce: function() {
                $(this.__element).removeClass(CONF.classPrefix + "button-pressed");
                this.__updateState(false);
            },
            toggle: function() {
                if (this.__state) {
                    this.bounce();
                } else {
                    this.press();
                }
            },
            __updateState: function(state) {
                state = !!state;
                this.__state = state;
                this.trigger("change", state, !state);
            }
        });
    }
};

/**
 * widget对象
 * 所有的UI组件都是widget对象
 */
_p[50] = {
    value: function(require) {
        var prefix = "_fui_", uid = 0, CONF = _p.r(10), FUI_NS = _p.r(9), $ = _p.r(2), Utils = _p.r(11);
        var Widget = _p.r(11).createClass("Widget", {
            constructor: function(options) {
                var marker = Utils.getMarker();
                this.callBase(marker);
                var defaultOptions = {
                    id: null,
                    className: "",
                    disabled: false,
                    preventDefault: false,
                    text: "",
                    value: null,
                    hide: false
                };
                this.__widgetType = "widget";
                this.__tpl = "";
                this.__compiledTpl = "";
                this.__rendered = false;
                this.__options = {};
                this.__element = null;
                // 禁止获取焦点
                this.__allow_focus = false;
                this.widgetName = "Widget";
                this.__extendOptions(defaultOptions, options);
                if (options !== marker) {
                    this.__render();
                }
            },
            getId: function() {
                return this.id;
            },
            getValue: function() {
                return this.__options.value;
            },
            setValue: function(value) {
                this.__options.value = value;
                return this;
            },
            show: function() {
                this.__show();
                return this;
            },
            hide: function() {
                this.__hide();
                return this;
            },
            addClass: function(className) {
                $(this.__element).addClass(className);
            },
            removeClass: function(className) {
                $(this.__element).removeClass(className);
            },
            /**
         * 当前构件是否是处于禁用状态
         * @returns {boolean|disabled|jsl.$.disabled|id.disabled}
         */
            isDisabled: function() {
                return this.__options.disabled;
            },
            /**
         * 启用当前构件
         * @returns {Widget}
         */
            enable: function() {
                this.__options.disabled = false;
                $(this.__element).removeClass(CONF.classPrefix + "disabled");
                return this;
            },
            /**
         * 禁用当前构件
         * @returns {Widget}
         */
            disable: function() {
                this.__options.disabled = true;
                $(this.__element).addClass(CONF.classPrefix + "disabled");
                return this;
            },
            /**
         * 获取
         * @returns {null}
         */
            getElement: function() {
                return this.__element;
            },
            appendTo: function(container) {
                if (Utils.isElement(container)) {
                    container.appendChild(this.__element);
                } else {
                    throw new Error("TypeError: Widget.appendTo()");
                }
            },
            off: function(type, cb) {
                $(this.__element).off(cb && cb.__fui_listener);
                return this;
            },
            on: function(type, cb) {
                if (!this.__options.preventDefault) {
                    this.__on(type, cb);
                }
                return this;
            },
            /**
         * 根据模板渲染构件, 如果该构件已经渲染过, 则不会进行二次渲染
         * @returns {Widget}
         */
            __render: function() {
                var $ele = null, className = null;
                if (this.__rendered) {
                    return this;
                }
                this.__rendered = true;
                this.id = this.__id();
                // 向NS注册自己
                FUI_NS.__registerInstance(this);
                this.__compiledTpl = Utils.Tpl.compile(this.__tpl, this.__options);
                this.__element = $(this.__compiledTpl)[0];
                this.__element.setAttribute("id", this.id);
                $ele = $(this.__element);
                if (this.__options.disabled) {
                    $ele.addClass(CONF.classPrefix + "disabled");
                }
                $ele.addClass(CONF.classPrefix + "widget");
                // add custom class-name
                className = this.__options.className;
                if (className.length > 0) {
                    if ($.isArray(className)) {
                        $ele.addClass(className.join(" "));
                    } else {
                        $ele.addClass(className);
                    }
                }
                if (this.__options.text && this.__allowShowTitle()) {
                    this.__element.setAttribute("title", this.__options.text);
                }
                if (this.__options.hide) {
                    this.__hide();
                }
                this.__initWidgetEvent();
                return this;
            },
            __initWidgetEvent: function() {
                this.on("mousedown", function(e) {
                    if (!this.__allowFocus()) {
                        e.preventDefault();
                    } else {
                        e.stopPropagation();
                    }
                });
            },
            __on: function(type, cb) {
                var _self = this;
                cb.__fui_listener = function(e, widget) {
                    var params = [];
                    for (var i = 0, len = arguments.length; i < len; i++) {
                        if (i !== 1) {
                            params.push(arguments[i]);
                        }
                    }
                    e.widget = widget;
                    if (!_self.isDisabled()) {
                        cb.apply(_self, params);
                    }
                };
                $(this.__element).on(type, cb.__fui_listener);
                return this;
            },
            trigger: function(type, params) {
                if (!this.__options.preventDefault) {
                    this.__trigger.apply(this, arguments);
                }
                return this;
            },
            __allowShowTitle: function() {
                return true;
            },
            __allowFocus: function() {
                return !!this.__allow_focus;
            },
            __trigger: function(type, params) {
                $(this.__element).trigger(type, [ this ].concat([].slice.call(arguments, 1)));
                return this;
            },
            __extendOptions: function() {
                var args = [ {}, this.__options ].concat([].slice.call(arguments, 0)), params = [ true ];
                for (var i = 0, len = args.length; i < len; i++) {
                    if (typeof args[i] !== "string") {
                        params.push(args[i]);
                    }
                }
                this.__options = $.extend.apply($, params);
            },
            __hide: function() {
                $(this.__element).addClass(CONF.classPrefix + "hide");
            },
            __show: function() {
                $(this.__element).removeClass(CONF.classPrefix + "hide");
            },
            __id: function() {
                return this.__options.id || generatorId();
            }
        });
        // 为widget生成唯一id
        function generatorId() {
            return prefix + ++uid;
        }
        return Widget;
    }
};

/**
 * 模块暴露
 */
_p[51] = {
    value: function(require) {
        _p.r(1);
    }
};

var moduleMapping = {
    "fui.export": 51
};

function use(name) {
    _p.r([ moduleMapping[name] ]);
}
// 编译打包后的启动脚本
use( 'fui.export' );})();