/* jslint asi:true, browser:true */
/* globals Lexis: true */

if (typeof Lexis === "undefined" || !(Lexis instanceof Object)) Lexis = {};

Lexis.Viewer = {

    handleClicks: function(e) {
        if (e.type !== "click" || document.documentElement.hasAttribute("data-lexis-viewer-is_loading")) return;
        var n = e.target;
        var value;
        if (n.dataset && n.dataset.src) {
            Lexis.Viewer.loadWord(n.dataset.src);
            if (document.getElementById("lexis-viewer-search")) {
                window.history.pushState({
                    input: document.getElementById("lexis-viewer-search").elements.namedItem("input").value,
                    tag: document.getElementById("lexis-viewer-search").elements.namedItem("tags").selectedIndex
                }, "", "?" + n.textContent);
            }
        }
        else if (this.namespaceURI === "about:lexisml?word" && this.tagName === "wordref") {
            Lexis.Viewer.require_perfect_match = true;
            if (this.hasAttribute("for")) value = this.getAttribute("for");
            else value = this.textContent;
            if (document.getElementById("lexis-viewer-search")) {
                window.history.pushState({
                    input: document.getElementById("lexis-viewer-search").elements.namedItem("input").value,
                    tag: document.getElementById("lexis-viewer-search").elements.namedItem("tags").selectedIndex
                }, "", "?" + value);
                document.getElementById("lexis-viewer-search").elements.namedItem("input").value = value;
                document.getElementById("lexis-viewer-search").elements.namedItem("tags").item(0);
            }
            Lexis.Viewer.handleInputs();
        }
        else if (this.id === "title") {
            if (document.getElementById("lexis-viewer-word")) document.getElementById("lexis-viewer-word").textContent = "";
            if (document.getElementById("lexis-viewer-search")) {
                document.getElementById("lexis-viewer-search").elements.namedItem("input").value = "";
                document.getElementById("lexis-viewer-search").elements.namedItem("tags").item(0);
                window.history.pushState({
                    input: document.getElementById("lexis-viewer-search").elements.namedItem("input").value,
                    tag: document.getElementById("lexis-viewer-search").elements.namedItem("tags").selectedIndex
                }, "", "?");
            }
            Lexis.Viewer.handleInputs();
        }
    },

    handleInputs: function() {

        if (!document.getElementById("lexis-viewer-search") || !document.getElementById("lexis-viewer-entry_list")) return;

        var i;
        var tag = document.getElementById("lexis-viewer-search").elements.namedItem("tags").value;
        var value = document.getElementById("lexis-viewer-search").elements.namedItem("input").value.toLocaleLowerCase();
        var matched = false;

        for (i = 0; i < document.getElementById("lexis-viewer-entry_list").children.length; i++) {

            if (!value) document.getElementById("lexis-viewer-entry_list").children.item(i).hidden = false;

            else if (!matched && Lexis.Viewer.require_perfect_match) {
                if (value == document.getElementById("lexis-viewer-entry_list").children.item(i).textContent) {
                    document.getElementById("lexis-viewer-entry_list").children.item(i).hidden = false;
                    matched = true;
                    Lexis.Viewer.loadWord(document.getElementById("lexis-viewer-entry_list").children.item(i).dataset.src);
                }
                else document.getElementById("lexis-viewer-entry_list").children.item(i).hidden = true;
            }

            else {
                if (value == document.getElementById("lexis-viewer-entry_list").children.item(i).textContent.toLocaleLowerCase().substr(0, value.length) && (!tag || document.getElementById("lexis-viewer-entry_list").children.item(i).dataset.tag.split(/\s+/).indexOf(tag) !== -1)) document.getElementById("lexis-viewer-entry_list").children.item(i).hidden = false;
                else document.getElementById("lexis-viewer-entry_list").children.item(i).hidden = true;
            }

        }

        Lexis.Viewer.require_perfect_match = false;

    },

    handleQuery: function(e) {
        if (!document.getElementById("lexis-viewer-search")) return;
        var q = decodeURIComponent(window.location.search);
        if (!q) q = "?";
        Lexis.Viewer.require_perfect_match = true;
        document.getElementById("lexis-viewer-search").elements.namedItem("input").value = q.substr(1);
        document.getElementById("lexis-viewer-search").elements.namedItem("tags").item(0);
        Lexis.Viewer.handleInputs();
        if (e && e.state) {
            document.getElementById("lexis-viewer-search").elements.namedItem("input").value = e.state.input;
            document.getElementById("lexis-viewer-search").elements.namedItem("tags").item(e.state.tag);
            Lexis.Viewer.handleInputs();
        }
    },

    Item: function(lemma, src, tag) {
        this.lemma = lemma;
        this.src = src;
        this.tag = tag;
    },

    load: function(src) {

        if (document.documentElement.namespaceURI != "http://www.w3.org/1999/xhtml") return;
        if (src instanceof Event && src.type === "load") {
            if (document.documentElement.dataset && document.documentElement.dataset.lexisSrc) src = document.documentElement.dataset.lexisSrc;
            else return;
        }
        if (typeof src != "string" && !(src instanceof String)) return;

        var base;
        if (document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "base").length) base = document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "base").item(0);
        else base = document.head.appendChild(document.createElementNS("http://www.w3.org/1999/xhtml", "base"));
        base.href = src;

        var request = new XMLHttpRequest();
        request.open("GET", "", true);
        request.responseType = "document";
        request.addEventListener("load", Lexis.Viewer.processIndex, false);
        request.send();

    },

    loadWord: function(src) {
        document.documentElement.setAttribute("data-lexis-viewer-is_loading", "");
        var request = new XMLHttpRequest();
        request.open("GET", src, true);
        request.responseType = "document";
        request.addEventListener("load", Lexis.Viewer.processWord, false);
        request.send();
    },

    processIndex: function() {

        var i;
        var j;

        var temp;

        var index_document = this.response;
        if (!(index_document instanceof Document) || index_document.documentElement.namespaceURI !== "about:lexisml?lexis") return;

        var metadata = {
            title: "",
            description: "",
            splashes: []
        }
        var items = [];
        var tags = [];

        var current_element;
        var object;
        for (i = 0; i < index_document.documentElement.childNodes.length; i++) {
            current_element = index_document.documentElement.childNodes.item(i);
            if (current_element.nodeType != Node.ELEMENT_NODE) continue;
            switch (current_element.tagName) {

                case "meta":
                    switch (current_element.getAttribute("type")) {
                        case "title":
                            metadata.title = document.importNode(current_element, true);
                            break;
                        case "description":
                            metadata.description = document.importNode(current_element, true);
                            break;
                        case "splash":
                            metadata.splashes.push(document.importNode(current_element, true));
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
                    items.push(new Lexis.Viewer.Item(current_element.textContent.trim(), current_element.getAttribute("src"), current_element.getAttribute("tag")));
                    break;

            }
        }

        items.sort(function(a, b) {return a.lemma.localeCompare(b.lemma);});

        if (metadata.title && document.getElementById("lexis-viewer-title")) {
            document.getElementById("lexis-viewer-title").textContent = "";
            while (metadata.title.childNodes.length) {
                document.getElementById("lexis-viewer-title").appendChild(metadata.title.childNodes.item(0));
            }
            document.title = metadata.title.textContent;
            document.getElementById("lexis-viewer-title").addEventListener("click", Lexis.Viewer.handleClicks, false);
        }

        var splash;
        if (metadata.splashes.length && document.getElementById("lexis-viewer-splash")) {
            document.getElementById("lexis-viewer-splash").textContent = "";
            i = Math.floor(Math.random() * metadata.splashes.length);
            while (metadata.splashes[i].childNodes.length) {
                document.getElementById("lexis-viewer-splash").appendChild(metadata.splashes[i].childNodes.item(0));
            }
        }

        var description;
        if (metadata.description && document.getElementById("lexis-viewer-description")) {
            document.getElementById("lexis-viewer-description").textContent = "";
            while (metadata.description.childNodes.length) {
                document.getElementById("lexis-viewer-description").appendChild(metadata.description.childNodes.item(0));
            }
        }

        var search_input = document.createElementNS("http://www.w3.org/1999/xhtml", "input");
        search_input.name = "input";
        search_input.type = "search";
        search_input.setAttribute = ("spellcheck", "false");
        search_input.addEventListener("input", Lexis.Viewer.handleInputs, false);

        var search_tags = document.createElementNS("http://www.w3.org/1999/xhtml", "select");
        search_tags.name = "tags";
        search_tags.addEventListener("change", Lexis.Viewer.handleInputs, false);
        search_tags.appendChild(document.createElementNS("http://www.w3.org/1999/xhtml", "option"));
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
                search_tags.appendChild(optgroup);
            }
            else if (tags[i] instanceof Lexis.Viewer.Tag) {
                option = document.createElementNS("http://www.w3.org/1999/xhtml", "option");
                option.textContent = tags[i].name;
                option.value = tags[i].value;
                search_tags.appendChild(option);
            }
        }

        if (document.getElementById("lexis-viewer-search")) {
            if (document.getElementById("lexis-viewer-search").tagName.toLowerCase() !== "form") {
                temp = document.createElementNS("http://www.w3.org/1999/xhtml", "form");
                document.getElementById("lexis-viewer-search").parentElement.replaceChild(temp, document.getElementById("lexis-viewer-search"));
                temp.id = "lexis-viewer-search";
            }
            document.getElementById("lexis-viewer-search").textContent = "";
            document.getElementById("lexis-viewer-search").appendChild(search_input);
            document.getElementById("lexis-viewer-search").appendChild(search_tags);
        }

        if (document.getElementById("lexis-viewer-entry_list")) {
            if (document.getElementById("lexis-viewer-entry_list").tagName.toLowerCase() !== "ul" && document.getElementById("lexis-viewer-entry_list").tagName.toLowerCase() !== "ol") {
                temp = document.createElementNS("http://www.w3.org/1999/xhtml", "ul");
                document.getElementById("lexis-viewer-entry_list").parentElement.replaceChild(temp, document.getElementById("lexis-viewer-entry_list"));
                temp.id = "lexis-viewer-entry_list";
            }
            document.getElementById("lexis-viewer-entry_list").textContent = "";
            var list_item;
            for (i = 0; i < items.length; i++) {
                list_item = document.createElementNS("http://www.w3.org/1999/xhtml", "li");
                list_item.dataset.src = items[i].src;
                list_item.dataset.tag = items[i].tag;
                list_item.textContent = items[i].lemma;
                list_item.hidden = false;
                document.getElementById("lexis-viewer-entry_list").appendChild(list_item);
            }
        }

        Lexis.Viewer.handleQuery();

        window.addEventListener("popstate", Lexis.Viewer.handleQuery, false);
        document.documentElement.addEventListener("click", Lexis.Viewer.handleClicks, true);

    },

    processWord: function() {
        if (document.documentElement.namespaceURI != "about:lexisml?word") return;
        var i;
        var word = document.importNode(this.response.documentElement, true);
        var wordrefs = word.getElementsByTagNameNS("about:lexisml?word", "wordref");
        for (i = 0; i < wordrefs.length; i++) {
            wordrefs.item(i).addEventListener("click", Lexis.Viewer.handleClicks, false);
        }
        if (document.getElementById("lexis-viewer-word")) {
            document.getElementById("lexis-viewer-word").textContent = "";
            document.getElementById("lexis-viewer-word").appendChild(word);
        }
        document.documentElement.removeAttribute("data-lexis-viewer-is_loading");
    },
    require_perfect_match: false,
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
