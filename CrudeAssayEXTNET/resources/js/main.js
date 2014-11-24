//Ext.ns("X");

var SEARCH_URL = "/search/",
    lockHistoryChange = false;

var makeTab = function (id, url, title) {
    var tab,
        hostName,
        exampleName,
        node,
        tabTip;
    //alert(id);
    if (id === "-") {
        id = Ext.id(undefined, "extnet");
        lookup[url] = id;
    }

    tabTip = url.replace(/^\//g, "");
    tabTip = tabTip.replace(/\/$/g, "");
    tabTip = tabTip.replace(/\//g, " > ");
    tabTip = tabTip.replace(/_/g, " ");

    hostName = window.location.protocol + "//" + window.location.host;
    exampleName = url;

    tab = App.tabPanel1.add(new Ext.Panel({
        id: id,
        tbar: [
        {
            html: "<div style='font-weight:bold; padding-left: 10px; font-size:12px;'>" + title + "</div>"
        },
        "->",
        {
            text: "Refresh",
            handler: function () {
                Ext.getCmp(id).reload(true)
            },
            iconCls: "#ArrowRefresh"
        }],
        title: title,
        tabTip: tabTip,
        hideMode: "offsets",

        loader: {
            scripts: true,
            renderer: "frame",
            url: hostName + "/Pages" + url,
            loadMask: true
        },
        closable: true
    }));

    setTimeout(function () {
        App.tabPanel1.setActiveTab(tab);
    }, 250);

    var node = App.CrudeTreePanel.getStore().getNodeById(id),
        expandAndSelect = function (node) {
            App.CrudeTreePanel.animate = false;
            node.bubble(function (node) {
                node.expand(false);
            });
            App.CrudeTreePanel.getSelectionModel().select(node);
            App.CrudeTreePanel.animate = true;
        };

    if (node) {
        expandAndSelect(node);
    } else {
        App.CrudeTreePanel.on("load", function (node) {
            node = App.CrudeTreePanel.getStore().getNodeById(id);
            if (node) {
                expandAndSelect(node);
            }
        }, this, { delay: 10, single: true });
    }
};

var lookup = {};

var onTreeAfterRender = function (tree) {
    var sm = tree.getSelectionModel();

    Ext.create('Ext.util.KeyNav', tree.view.el, {
        enter: function (e) {
            if (sm.hasSelection()) {
                onTreeItemClick(sm.getSelection()[0], e);
            }
        }
    });
};

var onTreeItemClick = function (record, e) {
    if (record.isLeaf()) {
        e.stopEvent();
        //console.log(record.get('href'));
        //loadExample(record.get('href'), record.getId(), record.get('text'));
        loadExample(record.get('href'), "-", record.get('text'));
    } else {
        record[record.isExpanded() ? 'collapse' : 'expand']();
    }
};

var loadExample = function (href, id, title) {
    var tab = App.tabPanel1.getComponent(id),
        lObj = lookup[href];
    //    alert(href);
     //   alert(id);
    //    alert(title);
    if (id == "-") {
        App.direct.GetHashCode(href, {
            success: function (result) {
                loadExample(href, "e" + result, title);
            }
        });

        return;
    }

    lookup[href] = id;
    //alert(lookup[href]);

    if (tab) {
        App.tabPanel1.setActiveTab(tab);
    } else {
        if (Ext.isEmpty(title)) {
            var m = /(\w+)\/$/g.exec(href);
            title = m == null ? "[No name]" : m[1];
        }

        title = title.replace(/<span>&nbsp;<\/span>/g, "");
        title = title.replace(/_/g, " ");
        makeTab(id, href, title);
    }
};

var viewClick = function (dv, e) {
    var group = e.getTarget("h2", 3, true);

    if (group) {
        group.up("div").toggleClass("collapsed");
    }
};

var beforeSourceShow = function (el) {
    var height = Ext.getBody().getViewSize().height;

    if (el.getSize().height > height) {
        el.setHeight(height - 20);
    }
};

var change = function (token) {
    //alert(lockHistoryChange);
    if (!lockHistoryChange) {
        if (token) {
            if (token.indexOf(SEARCH_URL) === 0) {
                filterByUrl(token);
            } else {
                //alert(token);
                //alert(lookup[token] || "-");
                loadExample(token, lookup[token] || "-");
            }
        } else {
            App.ExampleTabs.setActiveTab(0);
        }
    }
    lockHistoryChange = false;
};

var getToken = function (url) {
    var host = window.location.protocol + "//" + window.location.host + "/Pages";

    return url.substr(host.length);
};

var addToken = function (el, tab) {
    if (tab.loader && tab.loader.url) {
        var token = getToken(tab.loader.url);

        if (!Ext.isEmpty(token)) {
            Ext.History.add(token);
        }
    } else {
        Ext.History.add("");
    }
};

var keyUp = function (field, e) {
    if (e.getKey() === 40) {
        return;
    }

    if (e.getKey() === Ext.EventObject.ESC) {
        clearFilter(field);
    } else {
        changeFilterHash(field.getRawValue());
        filter(field);
    }
};

var filter = function (field) {
    var tree = App.CrudeTreePanel,
        text = field.getRawValue();

    if (Ext.isEmpty(text, false)) {
        clearFilter(field);
    }

    if (text.length < 3) {
        return;
    }

    if (Ext.isEmpty(text, false)) {
        return;
    }

    field.getTrigger(0).show();

    var re = new RegExp(".*" + text + ".*", "i");

    tree.clearFilter(true);

    tree.filterBy(function (node) {
        var match = re.test(node.data.text.replace(/<span>&nbsp;<\/span>/g, "")),
                pn = node.parentNode;

        if (match && node.isLeaf()) {
            pn.hasMatchNode = true;
        }

        if (pn != null && pn.fixed) {
            if (node.isLeaf() === false) {
                node.fixed = true;
            }
            return true;
        }

        if (node.isLeaf() === false) {
            node.fixed = match;
            return match;
        }

        return (pn != null && pn.fixed) || match;
    }, { expandNodes: false });

    tree.getView().animate = false;
    tree.getRootNode().cascadeBy(function (node) {
        if (node.isRoot()) {
            return;
        }

        if ((node.getDepth() === 1) ||
               (node.getDepth() === 2 && node.hasMatchNode)) {
            node.expand(false);
        }

        delete node.fixed;
        delete node.hasMatchNode;
    }, tree);
    tree.getView().animate = true;
};

var filterByUrl = function (url) {
    var field = App.TriggerField1,
        tree = App.CrudeTreePanel;

    if (!lockHistoryChange) {
        var tree = App.CrudeTreePanel,
            store = tree.getStore(),
            fn = function () {
                field.setValue(url.substr(SEARCH_URL.length));
                filter(field);
            };

        if (store.loading) {
            store.on("load", fn, null, { single: true });
        } else {
            fn();
        }
    }
};

var clearFilter = function (field, trigger, index, e) {
    var tree = App.CrudeTreePanel;

    field.setValue("");
    changeFilterHash("");
    field.getTrigger(0).hide();
    tree.clearFilter(true);
    field.focus(false, 100);
};

var changeFilterHash = Ext.Function.createBuffered(
    function (text) {
        lockHistoryChange = true;
        if (text.length > 2) {
            window.location.hash = SEARCH_URL + text;
        } else {
            var tab = App.tabPanel1.getActiveTab(),
                token = "";

            if (tab.loader && tab.loader.url) {
                token = getToken(tab.loader.url);
            }

            Ext.History.add(token);
        }
    },
    500);

var filterSpecialKey = function (field, e) {
    if (e.getKey() == e.DOWN) {
        var n = App.CrudeTreePanel.getRootNode().findChildBy(function (node) {
            return node.isLeaf() && !node.data.hidden;
        }, App.CrudeTreePanel, true);

        if (n) {
            App.CrudeTreePanel.expandPath(n.getPath(), null, null, function () {
                App.CrudeTreePanel.getSelectionModel().select(n);
                App.CrudeTreePanel.getView().focus();
            });
        }
    }
};

var filterNewExamples = function (checkItem, checked) {
    var tree = App.CrudeTreePanel;

    if (checked) {
        tree.clearFilter(true);
        tree.filterBy(function (node) {
            return new RegExp("<span>&nbsp;</span>").test(node.data.text);
        });
    } else {
        tree.clearFilter(true);
    }
};

var loadComments = function (at, url) {
    App.winComments.url = url;

    App.winComments.show(at, function () {
        updateComments(false, url);
        App.TagsView.store.reload();
    });
};

var updateComments = function (updateCount, url) {
    winComments.body.mask("Loading...", "x-mask-loading");
    Ext.net.DirectMethod.request({
        url: "/ExampleLoader.ashx",
        cleanRequest: true,
        params: {
            url: url,
            action: "comments.build"
        },
        success: function (result, response, extraParams, o) {
            if (result && result.length > 0) {
                App.tplComments.overwrite(CommentsBody.body, result);
            }

            if (updateCount) {
                App.tabPanel1.getActiveTab().commentsBtn.setText("Comments (" + result.length + ")");
            }
        },
        complete: function (success, result, response, extraParams, o) {
            App.winComments.body.unmask();
        }
    });
};

if (window.location.href.indexOf("#") > 0) {
    var directLink = window.location.href.substr(window.location.href.indexOf("#") + 1);

    Ext.onReady(function () {
        Ext.Function.defer(function () {
            if (directLink.indexOf(SEARCH_URL) === 0) {
                filterByUrl(directLink);
            } else {
                if (!Ext.isEmpty(directLink, false)) {
                    loadExample(directLink, "-");
                }
            }
        }, 100, window);
    }, window);
}