! function(b) {
    function d() {
        return "Markdown.mk_block( " + uneval(this.toString()) + ", " + uneval(this.trailing) + ", " + uneval(this.lineNumber) + " )"
    }

    function e() {
        var a = require("util");
        return "Markdown.mk_block( " + a.inspect(this.toString()) + ", " + a.inspect(this.trailing) + ", " + a.inspect(this.lineNumber) + " )"
    }

    function g(a) {
        for (var b = 0, c = -1; - 1 !== (c = a.indexOf("\n", c + 1));) b++;
        return b
    }

    function h(a, b) {
        function e(a) {
            this.len_after = a, this.name = "close_" + b
        }
        var c = a + "_state",
            d = "strong" == a ? "em_state" : "strong_state";
        return function(f) {
            if (this[c][0] == b) return this[c].shift(), [f.length, new e(f.length - b.length)];
            var h = this[d].slice(),
                i = this[c].slice();
            this[c].unshift(b);
            var j = this.processInline(f.substr(b.length)),
                k = j[j.length - 1];
            if (this[c].shift(), k instanceof e) {
                j.pop();
                var m = f.length - k.len_after;
                return [m, [a].concat(j)]
            }
            return this[d] = h, this[c] = i, [b.length, b]
        }
    }

    function i(a) {
        for (var b = a.split(""), c = [""], d = !1; b.length;) {
            var e = b.shift();
            switch (e) {
                case " ":
                    d ? c[c.length - 1] += e : c.push("");
                    break;
                case "'":
                case '"':
                    d = !d;
                    break;
                case "\\":
                    e = b.shift();
                default:
                    c[c.length - 1] += e
            }
        }
        return c
    }

    function m(a) {
        return j(a) && a.length > 1 && "object" == typeof a[1] && !j(a[1]) ? a[1] : void 0
    }

    function n(a) {
        return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
    }

    function o(a) {
        if ("string" == typeof a) return n(a);
        var b = a.shift(),
            c = {}, d = [];
        for (!a.length || "object" != typeof a[0] || a[0] instanceof Array || (c = a.shift()); a.length;) d.push(o(a.shift()));
        var e = "";
        for (var f in c) e += " " + f + '="' + n(c[f]) + '"';
        return "img" == b || "br" == b || "hr" == b ? "<" + b + e + "/>" : "<" + b + e + ">" + d.join("") + "</" + b + ">"
    }

    function q(a, b, c) {
        var d;
        c = c || {};
        var e = a.slice(0);
        "function" == typeof c.preprocessTreeNode && (e = c.preprocessTreeNode(e, b));
        var f = m(e);
        if (f) {
            e[1] = {};
            for (d in f) e[1][d] = f[d];
            f = e[1]
        }
        if ("string" == typeof e) return e;
        switch (e[0]) {
            case "header":
                e[0] = "h" + e[1].level, delete e[1].level;
                break;
            case "bulletlist":
                e[0] = "ul";
                break;
            case "numberlist":
                e[0] = "ol";
                break;
            case "listitem":
                e[0] = "li";
                break;
            case "para":
                e[0] = "p";
                break;
            case "markdown":
                e[0] = "html", f && delete f.references;
                break;
            case "code_block":
                e[0] = "pre", d = f ? 2 : 1;
                var g = ["code"];
                g.push.apply(g, e.splice(d, e.length - d)), e[d] = g;
                break;
            case "inlinecode":
                e[0] = "code";
                break;
            case "img":
                e[1].src = e[1].href, delete e[1].href;
                break;
            case "linebreak":
                e[0] = "br";
                break;
            case "link":
                e[0] = "a";
                break;
            case "link_ref":
                e[0] = "a";
                var h = b[f.ref];
                if (!h) return f.original;
                delete f.ref, f.href = h.href, h.title && (f.title = h.title), delete f.original;
                break;
            case "img_ref":
                e[0] = "img";
                var h = b[f.ref];
                if (!h) return f.original;
                delete f.ref, f.src = h.href, h.title && (f.title = h.title), delete f.original
        }
        if (d = 1, f) {
            for (var i in e[1]) {
                d = 2;
                break
            }
            1 === d && e.splice(d, 1)
        }
        for (; d < e.length; ++d) e[d] = q(e[d], b, c);
        return e
    }

    function r(a) {
        for (var b = m(a) ? 2 : 1; b < a.length;) "string" == typeof a[b] ? b + 1 < a.length && "string" == typeof a[b + 1] ? a[b] += a.splice(b + 1, 1)[0] : ++b : (r(a[b]), ++b)
    }
    var c = b.Markdown = function(a) {
        switch (typeof a) {
            case "undefined":
                this.dialect = c.dialects.Gruber;
                break;
            case "object":
                this.dialect = a;
                break;
            default:
                if (!(a in c.dialects)) throw new Error("Unknown Markdown dialect '" + String(a) + "'");
                this.dialect = c.dialects[a]
        }
        this.em_state = [], this.strong_state = [], this.debug_indent = ""
    };
    b.parse = function(a, b) {
        var d = new c(b);
        return d.toTree(a)
    }, b.toHTML = function(a, c, d) {
        var e = b.toHTMLTree(a, c, d);
        return b.renderJsonML(e)
    }, b.toHTMLTree = function(a, b, c) {
        "string" == typeof a && (a = this.parse(a, b));
        var d = m(a),
            e = {};
        d && d.references && (e = d.references);
        var f = q(a, e, c);
        return r(f), f
    };
    var f = c.mk_block = function(a, b, c) {
        1 == arguments.length && (b = "\n\n");
        var f = new String(a);
        return f.trailing = b, f.inspect = e, f.toSource = d, void 0 != c && (f.lineNumber = c), f
    };
    c.prototype.split_blocks = function(a) {
        a = a.replace(/(\r\n|\n|\r)/g, "\n");
        var e, c = /([\s\S]+?)($|\n#|\n(?:\s*\n|$)+)/g,
            d = [],
            h = 1;
        for (null != (e = /^(\s*\n)/.exec(a)) && (h += g(e[0]), c.lastIndex = e[0].length); null !== (e = c.exec(a));) "\n#" == e[2] && (e[2] = "\n", c.lastIndex--), d.push(f(e[1], e[2], h)), h += g(e[0]);
        return d
    }, c.prototype.processBlock = function(a, b) {
        var c = this.dialect.block,
            d = c.__order__;
        if ("__call__" in c) return c.__call__.call(this, a, b);
        for (var e = 0; e < d.length; e++) {
            var f = c[d[e]].call(this, a, b);
            if (f) return (!j(f) || f.length > 0 && !j(f[0])) && this.debug(d[e], "didn't return a proper array"), f
        }
        return []
    }, c.prototype.processInline = function(a) {
        return this.dialect.inline.__call__.call(this, String(a))
    }, c.prototype.toTree = function(a, b) {
        var c = a instanceof Array ? a : this.split_blocks(a),
            d = this.tree;
        try {
            for (this.tree = b || this.tree || ["markdown"]; c.length;) {
                var e = this.processBlock(c.shift(), c);
                e.length && this.tree.push.apply(this.tree, e)
            }
            return this.tree
        } finally {
            b && (this.tree = d)
        }
    }, c.prototype.debug = function() {
        var a = Array.prototype.slice.call(arguments);
        a.unshift(this.debug_indent), "undefined" != typeof print && print.apply(print, a), "undefined" != typeof console && "undefined" != typeof console.log && console.log.apply(null, a)
    }, c.prototype.loop_re_over_block = function(a, b, c) {
        for (var d, e = b.valueOf(); e.length && null != (d = a.exec(e));) e = e.substr(d[0].length), c.call(this, d);
        return e
    }, c.dialects = {}, c.dialects.Gruber = {
        block: {
            atxHeader: function(a, b) {
                var c = a.match(/^(#{1,6})\s*(.*?)\s*#*\s*(?:\n|$)/);
                if (!c) return void 0;
                var d = ["header", {
                    level: c[1].length
                }];
                return Array.prototype.push.apply(d, this.processInline(c[2])), c[0].length < a.length && b.unshift(f(a.substr(c[0].length), a.trailing, a.lineNumber + 2)), [d]
            },
            setextHeader: function(a, b) {
                var c = a.match(/^(.*)\n([-=])\2\2+(?:\n|$)/);
                if (!c) return void 0;
                var d = "=" === c[2] ? 1 : 2,
                    e = ["header", {
                            level: d
                        },
                        c[1]
                    ];
                return c[0].length < a.length && b.unshift(f(a.substr(c[0].length), a.trailing, a.lineNumber + 2)), [e]
            },
            code: function(a, b) {
                var c = [],
                    d = /^(?: {0,3}\t| {4})(.*)\n?/;
                if (!a.match(d)) return void 0;
                a: for (;;) {
                    var g = this.loop_re_over_block(d, a.valueOf(), function(a) {
                        c.push(a[1])
                    });
                    if (g.length) {
                        b.unshift(f(g, a.trailing));
                        break a
                    }
                    if (!b.length) break a;
                    if (!b[0].match(d)) break a;
                    c.push(a.trailing.replace(/[^\n]/g, "").substring(2)), a = b.shift()
                }
                return [["code_block", c.join("\n")]]
            },
            horizRule: function(a, b) {
                var c = a.match(/^(?:([\s\S]*?)\n)?[ \t]*([-_*])(?:[ \t]*\2){2,}[ \t]*(?:\n([\s\S]*))?$/);
                if (!c) return void 0;
                var d = [
                    ["hr"]
                ];
                return c[1] && d.unshift.apply(d, this.processBlock(c[1], [])), c[3] && b.unshift(f(c[3])), d
            },
            lists: function() {
                function g(b) {
                    return new RegExp("(?:^(" + e + "{0," + b + "} {0,3})(" + a + ")\\s+)|" + "(^" + e + "{0," + (b - 1) + "}[ ]{0,4})")
                }

                function h(a) {
                    return a.replace(/ {0,3}\t/g, "    ")
                }

                function i(a, b, c, d) {
                    if (b) return a.push(["para"].concat(c)), void 0;
                    var e = a[a.length - 1] instanceof Array && "para" == a[a.length - 1][0] ? a[a.length - 1] : a;
                    d && a.length > 1 && c.unshift(d);
                    for (var f = 0; f < c.length; f++) {
                        var g = c[f],
                            h = "string" == typeof g;
                        h && e.length > 1 && "string" == typeof e[e.length - 1] ? e[e.length - 1] += g : e.push(g)
                    }
                }

                function j(a, b) {
                    for (var c = new RegExp("^(" + e + "{" + a + "}.*?\\n?)*$"), d = new RegExp("^" + e + "{" + a + "}", "gm"), g = []; b.length > 0 && c.exec(b[0]);) {
                        var h = b.shift(),
                            i = h.replace(d, "");
                        g.push(f(i, h.trailing, h.lineNumber))
                    }
                    return g
                }

                function l(a, b, c) {
                    var d = a.list,
                        e = d[d.length - 1];
                    if (!(e[1] instanceof Array && "para" == e[1][0]))
                        if (b + 1 == c.length) e.push(["para"].concat(e.splice(1, e.length - 1)));
                        else {
                            var f = e.pop();
                            e.push(["para"].concat(e.splice(1, e.length - 1)), f)
                        }
                }
                var a = "[*+-]|\\d+\\.",
                    b = /[*+-]/,
                    d = new RegExp("^( {0,3})(" + a + ")[  ]+"),
                    e = "(?: {0,3}\\t| {4})";
                return function(a, c) {
                    function f(a) {
                        var c = b.exec(a[2]) ? ["bulletlist"] : ["numberlist"];
                        return m.push({
                            list: c,
                            indent: a[1]
                        }), c
                    }
                    var e = a.match(d);
                    if (!e) return void 0;
                    for (var o, r, m = [], n = f(e), p = !1, q = [m[0].list];;) {
                        for (var s = a.split(/(?=\n)/), t = "", u = 0; u < s.length; u++) {
                            var v = "",
                                w = s[u].replace(/^\n/, function(a) {
                                    return v = a, ""
                                }),
                                x = g(m.length);
                            if (e = w.match(x), void 0 !== e[1]) {
                                t.length && (i(o, p, this.processInline(t), v), p = !1, t = ""), e[1] = h(e[1]);
                                var y = Math.floor(e[1].length / 4) + 1;
                                if (y > m.length) n = f(e), o.push(n), o = n[1] = ["listitem"];
                                else {
                                    var z = !1;
                                    for (r = 0; r < m.length; r++)
                                        if (m[r].indent == e[1]) {
                                            n = m[r].list, m.splice(r + 1, m.length - (r + 1)), z = !0;
                                            break
                                        }
                                    z || (y++, y <= m.length ? (m.splice(y, m.length - y), n = m[y - 1].list) : (n = f(e), o.push(n))), o = ["listitem"], n.push(o)
                                }
                                v = ""
                            }
                            w.length > e[0].length && (t += v + w.substr(e[0].length))
                        }
                        t.length && (i(o, p, this.processInline(t), v), p = !1, t = "");
                        var A = j(m.length, c);
                        A.length > 0 && (k(m, l, this), o.push.apply(o, this.toTree(A, [])));
                        var B = c[0] && c[0].valueOf() || "";
                        if (!B.match(d) && !B.match(/^ /)) break;
                        a = c.shift();
                        var C = this.dialect.block.horizRule(a, c);
                        if (C) {
                            q.push.apply(q, C);
                            break
                        }
                        k(m, l, this), p = !0
                    }
                    return q
                }
            }(),
            blockquote: function(a, b) {
                if (!a.match(/^>/m)) return void 0;
                var c = [];
                if (">" != a[0]) {
                    for (var d = a.split(/\n/), e = [], g = a.lineNumber; d.length && ">" != d[0][0];) e.push(d.shift()), g++;
                    var h = f(e.join("\n"), "\n", a.lineNumber);
                    c.push.apply(c, this.processBlock(h, [])), a = f(d.join("\n"), a.trailing, g)
                }
                for (; b.length && ">" == b[0][0];) {
                    var i = b.shift();
                    a = f(a + a.trailing + i, i.trailing, a.lineNumber)
                }
                var j = a.replace(/^> ?/gm, ""),
                    n = (this.tree, this.toTree(j, ["blockquote"])),
                    o = m(n);
                return o && o.references && (delete o.references, l(o) && n.splice(1, 1)), c.push(n), c
            },
            referenceDefn: function(a, b) {
                var c = /^\s*\[(.*?)\]:\s*(\S+)(?:\s+(?:(['"])(.*?)\3|\((.*?)\)))?\n?/;
                if (!a.match(c)) return void 0;
                m(this.tree) || this.tree.splice(1, 0, {});
                var d = m(this.tree);
                void 0 === d.references && (d.references = {});
                var e = this.loop_re_over_block(c, a, function(a) {
                    a[2] && "<" == a[2][0] && ">" == a[2][a[2].length - 1] && (a[2] = a[2].substring(1, a[2].length - 1));
                    var b = d.references[a[1].toLowerCase()] = {
                        href: a[2]
                    };
                    void 0 !== a[4] ? b.title = a[4] : void 0 !== a[5] && (b.title = a[5])
                });
                return e.length && b.unshift(f(e, a.trailing)), []
            },
            para: function(a) {
                return [["para"].concat(this.processInline(a))]
            }
        }
    }, c.dialects.Gruber.inline = {
        __oneElement__: function(a, b, c) {
            var d, e;
            b = b || this.dialect.inline.__patterns__;
            var g = new RegExp("([\\s\\S]*?)(" + (b.source || b) + ")");
            if (d = g.exec(a), !d) return [a.length, a];
            if (d[1]) return [d[1].length, d[1]];
            var e;
            return d[2] in this.dialect.inline && (e = this.dialect.inline[d[2]].call(this, a.substr(d.index), d, c || [])), e = e || [d[2].length, d[2]]
        },
        __call__: function(a, b) {
            function e(a) {
                "string" == typeof a && "string" == typeof c[c.length - 1] ? c[c.length - 1] += a : c.push(a)
            }
            for (var d, c = []; a.length > 0;) d = this.dialect.inline.__oneElement__.call(this, a, b, c), a = a.substr(d.shift()), k(d, e);
            return c
        },
        "]": function() {},
        "}": function() {},
        __escape__: /^\\[\\`\*_{}\[\]()#\+.!\-]/,
        "\\": function(a) {
            return this.dialect.inline.__escape__.exec(a) ? [2, a.charAt(1)] : [1, "\\"]
        },
        "![": function(a) {
            var b = a.match(/^!\[(.*?)\][ \t]*\([ \t]*([^")]*?)(?:[ \t]+(["'])(.*?)\3)?[ \t]*\)/);
            if (b) {
                b[2] && "<" == b[2][0] && ">" == b[2][b[2].length - 1] && (b[2] = b[2].substring(1, b[2].length - 1)), b[2] = this.dialect.inline.__call__.call(this, b[2], /\\/)[0];
                var c = {
                    alt: b[1],
                    href: b[2] || ""
                };
                return void 0 !== b[4] && (c.title = b[4]), [b[0].length, ["img", c]]
            }
            return b = a.match(/^!\[(.*?)\][ \t]*\[(.*?)\]/), b ? [b[0].length, ["img_ref", {
                alt: b[1],
                ref: b[2].toLowerCase(),
                original: b[0]
            }]] : [2, "!["]
        },
        "[": function J(a) {
            var b = String(a),
                d = c.DialectHelpers.inline_until_char.call(this, a.substr(1), "]");
            if (!d) return [1, "["];
            var J, g, e = 1 + d[0],
                f = d[1];
            a = a.substr(e);
            var h = a.match(/^\s*\([ \t]*([^"']*)(?:[ \t]+(["'])(.*?)\2)?[ \t]*\)/);
            if (h) {
                var i = h[1];
                if (e += h[0].length, i && "<" == i[0] && ">" == i[i.length - 1] && (i = i.substring(1, i.length - 1)), !h[3])
                    for (var j = 1, k = 0; k < i.length; k++) switch (i[k]) {
                        case "(":
                            j++;
                            break;
                        case ")":
                            0 == --j && (e -= i.length - k, i = i.substring(0, k))
                    }
                return i = this.dialect.inline.__call__.call(this, i, /\\/)[0], g = {
                    href: i || ""
                }, void 0 !== h[3] && (g.title = h[3]), J = ["link", g].concat(f), [e, J]
            }
            return h = a.match(/^\s*\[(.*?)\]/), h ? (e += h[0].length, g = {
                ref: (h[1] || String(f)).toLowerCase(),
                original: b.substr(0, e)
            }, J = ["link_ref", g].concat(f), [e, J]) : 1 == f.length && "string" == typeof f[0] ? (g = {
                ref: f[0].toLowerCase(),
                original: b.substr(0, e)
            }, J = ["link_ref", g, f[0]], [e, J]) : [1, "["]
        },
        "<": function(a) {
            var b;
            return null != (b = a.match(/^<(?:((https?|ftp|mailto):[^>]+)|(.*?@.*?\.[a-zA-Z]+))>/)) ? b[3] ? [b[0].length, ["link", {
                    href: "mailto:" + b[3]
                },
                b[3]
            ]] : "mailto" == b[2] ? [b[0].length, ["link", {
                    href: b[1]
                },
                b[1].substr("mailto:".length)
            ]] : [b[0].length, ["link", {
                    href: b[1]
                },
                b[1]
            ]] : [1, "<"]
        },
        "`": function(a) {
            var b = a.match(/(`+)(([\s\S]*?)\1)/);
            return b && b[2] ? [b[1].length + b[2].length, ["inlinecode", b[3]]] : [1, "`"]
        },
        "  \n": function() {
            return [3, ["linebreak"]]
        }
    }, c.dialects.Gruber.inline["**"] = h("strong", "**"), c.dialects.Gruber.inline.__ = h("strong", "__"), c.dialects.Gruber.inline["*"] = h("em", "*"), c.dialects.Gruber.inline._ = h("em", "_"), c.buildBlockOrder = function(a) {
        var b = [];
        for (var c in a) "__order__" != c && "__call__" != c && b.push(c);
        a.__order__ = b
    }, c.buildInlinePatterns = function(a) {
        var b = [];
        for (var c in a)
            if (!c.match(/^__.*__$/)) {
                var d = c.replace(/([\\.*+?|()\[\]{}])/g, "\\$1").replace(/\n/, "\\n");
                b.push(1 == c.length ? d : "(?:" + d + ")")
            }
        b = b.join("|"), a.__patterns__ = b;
        var e = a.__call__;
        a.__call__ = function(a, c) {
            return void 0 != c ? e.call(this, a, c) : e.call(this, a, b)
        }
    }, c.DialectHelpers = {}, c.DialectHelpers.inline_until_char = function(a, b) {
        for (var c = 0, d = [];;) {
            if (a.charAt(c) == b) return c++, [c, d];
            if (c >= a.length) return null;
            var e = this.dialect.inline.__oneElement__.call(this, a.substr(c));
            c += e[0], d.push.apply(d, e.slice(1))
        }
    }, c.subclassDialect = function(a) {
        function b() {}

        function c() {}
        return b.prototype = a.block, c.prototype = a.inline, {
            block: new b,
            inline: new c
        }
    }, c.buildBlockOrder(c.dialects.Gruber.block), c.buildInlinePatterns(c.dialects.Gruber.inline), c.dialects.Maruku = c.subclassDialect(c.dialects.Gruber), c.dialects.Maruku.processMetaHash = function(a) {
        for (var b = i(a), c = {}, d = 0; d < b.length; ++d)
            if (/^#/.test(b[d])) c.id = b[d].substring(1);
            else if (/^\./.test(b[d])) c["class"] = c["class"] ? c["class"] + b[d].replace(/./, " ") : b[d].substring(1);
        else if (/\=/.test(b[d])) {
            var e = b[d].split(/\=/);
            c[e[0]] = e[1]
        }
        return c
    }, c.dialects.Maruku.block.document_meta = function(a) {
        if (a.lineNumber > 1) return void 0;
        if (!a.match(/^(?:\w+:.*\n)*\w+:.*$/)) return void 0;
        m(this.tree) || this.tree.splice(1, 0, {});
        var c = a.split(/\n/);
        for (p in c) {
            var d = c[p].match(/(\w+):\s*(.*)$/),
                e = d[1].toLowerCase(),
                f = d[2];
            this.tree[1][e] = f
        }
        return []
    }, c.dialects.Maruku.block.block_meta = function(b) {
        var d = b.match(/(^|\n) {0,3}\{:\s*((?:\\\}|[^\}])*)\s*\}$/);
        if (!d) return void 0;
        var f, e = this.dialect.processMetaHash(d[2]);
        if ("" === d[1]) {
            var g = this.tree[this.tree.length - 1];
            if (f = m(g), "string" == typeof g) return void 0;
            f || (f = {}, g.splice(1, 0, f));
            for (a in e) f[a] = e[a];
            return []
        }
        var h = b.replace(/\n.*$/, ""),
            i = this.processBlock(h, []);
        f = m(i[0]), f || (f = {}, i[0].splice(1, 0, f));
        for (a in e) f[a] = e[a];
        return i
    }, c.dialects.Maruku.block.definition_list = function(a, b) {
        var e, f, c = /^((?:[^\s:].*\n)+):\s+([\s\S]+)$/,
            d = ["dl"];
        if (!(f = a.match(c))) return void 0;
        for (var g = [a]; b.length && c.exec(b[0]);) g.push(b.shift());
        for (var h = 0; h < g.length; ++h) {
            var f = g[h].match(c),
                i = f[1].replace(/\n$/, "").split(/\n/),
                j = f[2].split(/\n:\s+/);
            for (e = 0; e < i.length; ++e) d.push(["dt", i[e]]);
            for (e = 0; e < j.length; ++e) d.push(["dd"].concat(this.processInline(j[e].replace(/(\n)\s+/, "$1"))))
        }
        return [d]
    }, c.dialects.Maruku.block.table = function R(a) {
        var f, g, c = function(a, b) {
                b = b || "\\s", b.match(/^[\\|\[\]{}?*.+^$]$/) && (b = "\\" + b);
                for (var e, c = [], d = new RegExp("^((?:\\\\.|[^\\\\" + b + "])*)" + b + "(.*)"); e = a.match(d);) c.push(e[1]), a = e[2];
                return c.push(a), c
            }, d = /^ {0,3}\|(.+)\n {0,3}\|\s*([\-:]+[\-| :]*)\n((?:\s*\|.*(?:\n|$))*)(?=\n|$)/,
            e = /^ {0,3}(\S(?:\\.|[^\\|])*\|.*)\n {0,3}([\-:]+\s*\|[\-| :]*)\n((?:(?:\\.|[^\\|])*\|.*(?:\n|$))*)(?=\n|$)/;
        if (g = a.match(d)) g[3] = g[3].replace(/^\s*\|/gm, "");
        else if (!(g = a.match(e))) return void 0;
        var R = ["table", ["thead", ["tr"]],
            ["tbody"]
        ];
        g[2] = g[2].replace(/\|\s*$/, "").split("|");
        var h = [];
        for (k(g[2], function(a) {
            a.match(/^\s*-+:\s*$/) ? h.push({
                align: "right"
            }) : a.match(/^\s*:-+\s*$/) ? h.push({
                align: "left"
            }) : a.match(/^\s*:-+:\s*$/) ? h.push({
                align: "center"
            }) : h.push({})
        }), g[1] = c(g[1].replace(/\|\s*$/, ""), "|"), f = 0; f < g[1].length; f++) R[1][1].push(["th", h[f] || {}].concat(this.processInline(g[1][f].trim())));
        return k(g[3].replace(/\|\s*$/gm, "").split("\n"), function(a) {
            var b = ["tr"];
            for (a = c(a, "|"), f = 0; f < a.length; f++) b.push(["td", h[f] || {}].concat(this.processInline(a[f].trim())));
            R[2].push(b)
        }, this), [R]
    }, c.dialects.Maruku.inline["{:"] = function(a, b, c) {
        if (!c.length) return [2, "{:"];
        var d = c[c.length - 1];
        if ("string" == typeof d) return [2, "{:"];
        var e = a.match(/^\{:\s*((?:\\\}|[^\}])*)\s*\}/);
        if (!e) return [2, "{:"];
        var f = this.dialect.processMetaHash(e[1]),
            g = m(d);
        g || (g = {}, d.splice(1, 0, g));
        for (var h in f) g[h] = f[h];
        return [e[0].length, ""]
    }, c.dialects.Maruku.inline.__escape__ = /^\\[\\`\*_{}\[\]()#\+.!\-|:]/, c.buildBlockOrder(c.dialects.Maruku.block), c.buildInlinePatterns(c.dialects.Maruku.inline);
    var k, j = Array.isArray || function(a) {
            return "[object Array]" == Object.prototype.toString.call(a)
        };
    k = Array.prototype.forEach ? function(a, b, c) {
        return a.forEach(b, c)
    } : function(a, b, c) {
        for (var d = 0; d < a.length; d++) b.call(c || a, a[d], d, a)
    };
    var l = function(a) {
        for (var b in a)
            if (hasOwnProperty.call(a, b)) return !1;
        return !0
    };
    b.renderJsonML = function(a, b) {
        b = b || {}, b.root = b.root || !1;
        var c = [];
        if (b.root) c.push(o(a));
        else
            for (a.shift(), !a.length || "object" != typeof a[0] || a[0] instanceof Array || a.shift(); a.length;) c.push(o(a.shift()));
        return c.join("\n\n")
    }
}(function() {
    return "undefined" == typeof exports ? (window.markdown = {}, window.markdown) : exports
}());