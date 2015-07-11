/* jslint asi:true, browser:true */
/* globals Lexis: true */

if (typeof Lexis === "undefined" || !(Lexis instanceof Object)) Lexis = {};

Lexis.Viewer = {

    getQuery: function(name) {
        var i;
        var j;
        var q = decodeURIComponent(window.location.search);
        if (!q) q = "?";
        i = q.indexOf("?" + name + "=");
        if (i === -1) i = q.indexOf("&" + name + "=");
        if (i === -1) return undefined;
        i += name.length + 2;
        j = q.indexOf("&", i);
        if (j === -1) return q.substring(i);
        else return q.substring(i, j);
    },

    handleClicks: function(e) {
        if (e.type !== "click" || document.documentElement.hasAttribute("data-lexis-viewer-is_loading")) return;
        var n = e.target;
        var value;
        if (n.dataset && n.dataset.lexisViewerWordref) {
            Lexis.Viewer.loadWord(n.dataset.lexisViewerWordref);
            if (document.getElementById("lexis-viewer-input") && document.getElementById("lexis-viewer-tags")) Lexis.Viewer.pushQuery("word", n.textContent, {
                input: document.getElementById("lexis-viewer-input").value,
                tag: document.getElementById("lexis-viewer-tags").selectedIndex
            });
            e.preventDefault();
        }
        else if (this.namespaceURI === "about:lexisml?word" && this.tagName === "wordref") {
            Lexis.Viewer.require_perfect_match = true;
            if (this.hasAttribute("for")) value = this.getAttribute("for");
            else value = this.textContent;
            if (document.getElementById("lexis-viewer-input") && document.getElementById("lexis-viewer-tags")) {
                Lexis.Viewer.pushQuery("word", value, {
                    input: document.getElementById("lexis-viewer-input").value,
                    tag: document.getElementById("lexis-viewer-tags").selectedIndex
                });
                document.getElementById("lexis-viewer-input").value = value;
                document.getElementById("lexis-viewer-tags").item(0);
            }
            Lexis.Viewer.handleInputs();
        }
        else if (this.id === "lexis-viewer-title") {
            if (document.getElementById("lexis-viewer-word")) document.getElementById("lexis-viewer-word").textContent = "";
            if (document.getElementById("lexis-viewer-input") && document.getElementById("lexis-viewer-tags")) {
                document.getElementById("lexis-viewer-input").value = "";
                document.getElementById("lexis-viewer-tags").item(0);
                Lexis.Viewer.pushQuery("word", "", {
                    input: document.getElementById("lexis-viewer-input").value,
                    tag: document.getElementById("lexis-viewer-tags").selectedIndex
                });
            }
            Lexis.Viewer.handleInputs();
            Lexis.Viewer.processSplash();
        }
    },

    handleInputs: function() {

        if (!document.getElementById("lexis-viewer-input") || !document.getElementById("lexis-viewer-tags") || !document.getElementById("lexis-viewer-entry_list")) return;

        var i;
        var j;
        var tag = document.getElementById("lexis-viewer-tags").value;
        var value = document.getElementById("lexis-viewer-input").value.toLocaleLowerCase();
        var matched = false;
        var alts;

        for (i = 0; i < document.getElementById("lexis-viewer-entry_list").children.length; i++) {

            alts = [];
            j = 0;

            if (Lexis.Viewer.require_perfect_match) {
                if (matched) document.getElementById("lexis-viewer-entry_list").children.item(i).hidden = true;
                else {
                    if (value == document.getElementById("lexis-viewer-entry_list").children.item(i).textContent) matched = true;
                    else if (document.getElementById("lexis-viewer-entry_list").children.item(i).dataset.lexisViewerAlts) {
                        alts = JSON.parse(document.getElementById("lexis-viewer-entry_list").children.item(i).dataset.lexisViewerAlts);
                        while (!matched && alts[j]) {
                            if (value == alts[j]) matched = true;
                            j++;
                        }
                    }
                    if (matched) {
                        document.getElementById("lexis-viewer-entry_list").children.item(i).hidden = false;
                        Lexis.Viewer.loadWord(document.getElementById("lexis-viewer-entry_list").children.item(i).dataset.lexisViewerWordref);
                    }
                    else document.getElementById("lexis-viewer-entry_list").children.item(i).hidden = true;
                }
            }

            else {
                matched = false;
                if (value == document.getElementById("lexis-viewer-entry_list").children.item(i).textContent.toLocaleLowerCase().substr(0, value.length)) matched = true;
                else if (document.getElementById("lexis-viewer-entry_list").children.item(i).dataset.lexisViewerAlts) {
                    alts = JSON.parse(document.getElementById("lexis-viewer-entry_list").children.item(i).dataset.lexisViewerAlts);
                    while (!matched && alts[j]) {
                        if (value == alts[j].toLocaleLowerCase().substr(0, value.length)) matched = true;
                        j++;
                    }
                }
                if (matched && (!tag || document.getElementById("lexis-viewer-entry_list").children.item(i).dataset.lexisViewerTag.split(/\s+/).indexOf(tag) !== -1)) document.getElementById("lexis-viewer-entry_list").children.item(i).hidden = false;
                else document.getElementById("lexis-viewer-entry_list").children.item(i).hidden = true;
            }

        }

        Lexis.Viewer.require_perfect_match = false;

    },

    handleQuery: function(e) {
        if (!document.getElementById("lexis-viewer-input") || !document.getElementById("lexis-viewer-tags") || !Lexis.Viewer.getQuery("word")) return;
        Lexis.Viewer.require_perfect_match = true;
        document.getElementById("lexis-viewer-input").value = Lexis.Viewer.getQuery("word");
        document.getElementById("lexis-viewer-tags").item(0);
        Lexis.Viewer.handleInputs();
        if (e && e.state) {
            document.getElementById("lexis-viewer-input").value = e.state.input;
            document.getElementById("lexis-viewer-tags").item(e.state.tag);
            Lexis.Viewer.handleInputs();
        }
    },

    Item: function(lemma, src, tag, alts) {
        this.lemma = lemma;
        this.src = src;
        this.tag = tag;
        this.alts = alts;
    },

    load: function(src) {

        if (document.documentElement.namespaceURI != "http://www.w3.org/1999/xhtml") return;
        if (src instanceof Event && src.type === "load") {
            if (document.documentElement.dataset && document.documentElement.dataset.lexisSrc) src = document.documentElement.dataset.lexisSrc;
            else return;
        }
        if (typeof src != "string" && !(src instanceof String)) return;

        Lexis.Viewer.src = src;

        var request = new XMLHttpRequest();
        request.open("GET", Lexis.Viewer.src, true);
        request.responseType = "document";
        request.addEventListener("load", Lexis.Viewer.processIndex, false);
        request.send();

    },

    loadWord: function(src) {
        document.documentElement.setAttribute("data-lexis-viewer-is_loading", "");
        var request = new XMLHttpRequest();
        request.open("GET", Lexis.Viewer.src + "/../" + src, true);
        request.responseType = "document";
        request.addEventListener("load", Lexis.Viewer.processWord, false);
        request.send();
    },

    metadata: {
        title: undefined,
        description: undefined,
        splashes: []
    },

    processIndex: function() {

        var i;
        var j;

        var temp;

        var index_document = this.response;
        if (!(index_document instanceof Document) || index_document.documentElement.namespaceURI !== "about:lexisml?lexis") return;

        var items = [];
        var tags = [];
        var alts = [];

        var current_element;
        var object;
        for (i = 0; i < index_document.documentElement.childNodes.length; i++) {
            current_element = index_document.documentElement.childNodes.item(i);
            if (current_element.nodeType != Node.ELEMENT_NODE) continue;
            switch (current_element.tagName) {

                case "meta":
                    switch (current_element.getAttribute("type")) {
                        case "title":
                            Lexis.Viewer.metadata.title = document.importNode(current_element, true);
                            break;
                        case "description":
                            Lexis.Viewer.metadata.description = document.importNode(current_element, true);
                            break;
                        case "splash":
                            Lexis.Viewer.metadata.splashes.push(document.importNode(current_element, true));
                            break;
                    }
                    break;

                case "taggroup":
                    object = new Lexis.Viewer.TagGroup(current_element.getAttribute("name"));
                    for (j = 0; j < current_element.childNodes.length; j++) {
                        if (current_element.childNodes.item(j).nodeType != Node.ELEMENT_NODE) continue;
                        object.add(new Lexis.Viewer.Tag(current_element.childNodes.item(j).textContent.trim(), current_element.childNodes.item(j).getAttribute("value")));
                    }
                    tags.push(object);
                    break;

                case "tag":
                    tags.push(new Lexis.Viewer.Tag(current_element.textContent.trim(), current_element.getAttribute("value")));
                    break;

                case "item":
                    if (!current_element.getElementsByTagNameNS("about:lexisml?lexis", "lemma").length) items.push(new Lexis.Viewer.Item(current_element.textContent.trim(), current_element.getAttribute("src"), current_element.getAttribute("tag")));  // Allows for depreciated old-style item declarations, delete this line eventually
                    else if (current_element.getElementsByTagNameNS("about:lexisml?lexis", "lemma").length) {
                        alts = [];
                        for (j = 0; j < current_element.getElementsByTagNameNS("about:lexisml?lexis", "alt").length; j++) {
                            alts.push(current_element.getElementsByTagNameNS("about:lexisml?lexis", "alt").item(j).textContent.trim());
                        }
                        items.push(new Lexis.Viewer.Item(current_element.getElementsByTagNameNS("about:lexisml?lexis", "lemma").item(0).textContent.trim(), current_element.getAttribute("src"), current_element.getAttribute("tag"), JSON.stringify(alts)));
                    }
                    break;

            }
        }

        items.sort(function(a, b) {return a.lemma.localeCompare(b.lemma);});

        if (document.getElementById("lexis-viewer-title")) {
            document.getElementById("lexis-viewer-title").textContent = "";
            if (Lexis.Viewer.metadata.title) {
                for (j = 0; j < Lexis.Viewer.metadata.title.childNodes.length; j++) {
                    document.getElementById("lexis-viewer-title").appendChild(Lexis.Viewer.metadata.title.childNodes.item(j).cloneNode(true));
                }
                document.title = Lexis.Viewer.metadata.title.textContent;
            }
            document.getElementById("lexis-viewer-title").addEventListener("click", Lexis.Viewer.handleClicks, false);
        }

        Lexis.Viewer.processSplash();

        if (document.getElementById("lexis-viewer-description")) {
            document.getElementById("lexis-viewer-description").textContent = "";
            if (Lexis.Viewer.metadata.description) {
                for (j = 0; j < Lexis.Viewer.metadata.description.childNodes.length; j++) {
                    document.getElementById("lexis-viewer-description").appendChild(Lexis.Viewer.metadata.description.childNodes.item(j).cloneNode(true));
                }
            }
        }

        if (document.getElementById("lexis-viewer-input")) {
            if (document.getElementById("lexis-viewer-input").tagName.toLowerCase() !== "input" || document.getElementById("lexis-viewer-input").type !== "search") {
                temp = document.createElementNS("http://www.w3.org/1999/xhtml", "input");
                document.getElementById("lexis-viewer-input").parentElement.replaceChild(temp, document.getElementById("lexis-viewer-input"));
                temp.id = "lexis-viewer-input";
            }
            document.getElementById("lexis-viewer-input").value = "";
            document.getElementById("lexis-viewer-input").setAttribute = ("spellcheck", "false");
            document.getElementById("lexis-viewer-input").addEventListener("input", Lexis.Viewer.handleInputs, false);
        }

        if (document.getElementById("lexis-viewer-tags")) {
            if (document.getElementById("lexis-viewer-tags").tagName.toLowerCase() !== "select") {
                temp = document.createElementNS("http://www.w3.org/1999/xhtml", "select");
                document.getElementById("lexis-viewer-tags").parentElement.replaceChild(temp, document.getElementById("lexis-viewer-tags"));
                temp.id = "lexis-viewer-tags";
            }
            document.getElementById("lexis-viewer-tags").textContent = "";
            document.getElementById("lexis-viewer-tags").addEventListener("change", Lexis.Viewer.handleInputs, false);
            document.getElementById("lexis-viewer-tags").appendChild(document.createElementNS("http://www.w3.org/1999/xhtml", "option"));
            var optgroup;
            var option;
            for (i = 0; i < tags.length; i++) {
                if (tags[i] instanceof Lexis.Viewer.TagGroup) {
                    optgroup = document.createElementNS("http://www.w3.org/1999/xhtml", "optgroup");
                    optgroup.label = tags[i].name;
                    for (j = 0; j < tags[i].tags.length; j++) {
                        option = document.createElementNS("http://www.w3.org/1999/xhtml", "option");
                        option.textContent = tags[i].tags[j].name;
                        option.value = tags[i].tags[j].value;
                        optgroup.appendChild(option);
                    }
                    document.getElementById("lexis-viewer-tags").appendChild(optgroup);
                }
                else if (tags[i] instanceof Lexis.Viewer.Tag) {
                    option = document.createElementNS("http://www.w3.org/1999/xhtml", "option");
                    option.textContent = tags[i].name;
                    option.value = tags[i].value;
                    document.getElementById("lexis-viewer-tags").appendChild(option);
                }
            }
        }

        if (document.getElementById("lexis-viewer-entry_list")) {
            document.getElementById("lexis-viewer-entry_list").textContent = "";
            var nav_item;
            for (i = 0; i < items.length; i++) {
                nav_item = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
                if (items[i].src) nav_item.dataset.lexisViewerWordref = items[i].src;
                if (items[i].tag) nav_item.dataset.lexisViewerTag = items[i].tag;
                if (items[i].alts) nav_item.dataset.lexisViewerAlts = items[i].alts;
                nav_item.textContent = items[i].lemma;
                nav_item.hidden = false;
                document.getElementById("lexis-viewer-entry_list").appendChild(nav_item);
            }
        }

        Lexis.Viewer.handleQuery();

        window.addEventListener("popstate", Lexis.Viewer.handleQuery, false);
        document.documentElement.addEventListener("click", Lexis.Viewer.handleClicks, true);

    },

    processSplash: function() {
        var i;
        var j;
        if (document.getElementById("lexis-viewer-splash")) {
            document.getElementById("lexis-viewer-splash").textContent = "";
            if (Lexis.Viewer.metadata.splashes.length) {
                i = Math.floor(Math.random() * Lexis.Viewer.metadata.splashes.length);
                for (j = 0; j < Lexis.Viewer.metadata.splashes[i].childNodes.length; j++) {
                    document.getElementById("lexis-viewer-splash").appendChild(Lexis.Viewer.metadata.splashes[i].childNodes.item(j).cloneNode(true));
                }
            }
        }
    },

    processWord: function() {
        document.documentElement.removeAttribute("data-lexis-viewer-is_loading");
        var i;
        var word = document.importNode(this.response.documentElement, true);
        if (word.namespaceURI != "about:lexisml?word") return;
        var wordrefs = word.getElementsByTagNameNS("about:lexisml?word", "wordref");
        for (i = 0; i < wordrefs.length; i++) {
            wordrefs.item(i).addEventListener("click", Lexis.Viewer.handleClicks, false);
        }
        if (document.getElementById("lexis-viewer-word")) {
            document.getElementById("lexis-viewer-word").textContent = "";
            document.getElementById("lexis-viewer-word").appendChild(word);
        }
    },

    pushQuery: function(name, value, push_object) {
        var i;
        var j;
        var q = decodeURIComponent(window.location.search);
        var r = "";
        if ((!q || q == "?") && value) r = "?" + name + "=" + value;
        else {
            i = q.indexOf("?" + name + "=");
            if (i === -1) i = q.indexOf("&" + name + "=");
            if (i != -1) {
                if (value) i += name.length + 2;
                j = q.indexOf("&", i + 1);
                if (j != -1) r = q.substring(0, i) + value + q.substring(j);
                else r = q.substring(0, i) + value;
            }
            else if (value) r = q + "&" + name + "=" + value;
        }
        window.history.pushState(push_object, "", r);
    },

    require_perfect_match: false,

    src: "",

    Tag: function(name, value) {
        this.name = name;
        this.value = value;
    },

    TagGroup: function(name, value) {
        if (name === undefined || name === null) name = "";
        this.name = name;
        this.tags = [];
    }

}

Lexis.Viewer.TagGroup.prototype = {
    add: function(tag) {
        this.tags.push(tag);
        return this.tags[this.tags.length];
    }
}

window.addEventListener("load", Lexis.Viewer.load, false);
