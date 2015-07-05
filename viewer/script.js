/* jslint asi:true, browser:true */

var require_perfect_match = false;

function Item(lemma, src, tag) {
    this.lemma = lemma;
    this.src = src;
    this.tag = tag;
}

function Tag(name, value) {
    this.name = name;
    this.value = value;
}

function TagGroup(name) {
    if (name === undefined || name === null) name = "";
    this.name = name;
    this.tags = [];
}
TagGroup.prototype = {
    add: function(tag) {
        this.tags.push(tag);
        return this.tags[this.tags.length];
    }
}

function processWord() {
    var i;
    var word = document.importNode(this.response.documentElement, true);
    var wordrefs = word.getElementsByTagNameNS("about:lexisml?word", "wordref");
    for (i = 0; i < wordrefs.length; i++) {
        wordrefs.item(i).addEventListener("click", handleClicks, false);
    }
    document.getElementById("container").textContent = "";
    document.getElementById("container").appendChild(word);
    document.documentElement.removeAttribute("data-loading");
}

function loadWord(src) {
    document.documentElement.setAttribute("data-loading", "");
    var request = new XMLHttpRequest();
    request.open("GET", src, true);
    request.responseType = "document";
    request.addEventListener("load", processWord, false);
    request.send();
}

function handleClicks(e) {
    if (e.type !== "click" || document.documentElement.hasAttribute("data-loading")) return;
    var n = e.target;
    if (n.dataset && n.dataset.src) {
        loadWord(n.dataset.src);
        window.history.pushState(null, "", "?" + n.textContent);
    }
    else if (this.namespaceURI === "about:lexisml?word" && this.tagName === "wordref") {
        require_perfect_match = true;
        if (this.hasAttribute("for")) document.getElementById("search").elements.namedItem("input").value = this.getAttribute("for");
        else document.getElementById("search").elements.namedItem("input").value = this.textContent;
        document.getElementById("search").elements.namedItem("tags").item(0);
        handleInputs();
    }
    else if (this.id === "title") {
        document.getElementById("container").textContent = "";
        document.getElementById("search").elements.namedItem("input").value = "";
        document.getElementById("search").elements.namedItem("tags").item(0);
        window.history.pushState(null, "", "?");
        handleInputs();
    }
}

function handleInputs() {

    var i;
    var tag = document.getElementById("search").elements.namedItem("tags").value;
    var value = document.getElementById("search").elements.namedItem("input").value.toLocaleLowerCase();

    for (i = 0; i < document.getElementById("list").children.length; i++) {


        if (require_perfect_match) {
            if (value == document.getElementById("list").children.item(i).textContent) {
                document.getElementById("list").children.item(i).hidden = false;
                loadWord(document.getElementById("list").children.item(i).dataset.src);
            }
            else document.getElementById("list").children.item(i).hidden = true;
        }

        else {
            if (value == document.getElementById("list").children.item(i).textContent.toLocaleLowerCase().substr(0, value.length) && (!tag || document.getElementById("list").children.item(i).dataset.tag.split(/\s+/).indexOf(tag) !== -1)) document.getElementById("list").children.item(i).hidden = false;
            else document.getElementById("list").children.item(i).hidden = true;
        }

    }

    require_perfect_match = false;

}

function handleQuery() {
    var q = decodeURIComponent(window.location.search);
    if (!q) q = "?";
    document.getElementById("search").elements.namedItem("input").value = q.substr(1);
    document.getElementById("search").elements.namedItem("tags").item(0);
    handleInputs();
}

function processIndex() {

    var i;
    var j;

    var index_document = this.response;
    if (!(index_document instanceof Document) || index_document.documentElement.namespaceURI !== "about:lexisml?lexis") return;

    document.body.textContent = "";

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
                object = new TagGroup(current_element.getAttribute("name"));
                for (j = 0; j < current_element.childNodes.length; j++) {
                    if (current_element.childNodes.item(j).nodeType != Node.ELEMENT_NODE) continue;
                    object.add(new Tag(current_element.childNodes.item(j).textContent.trim(), current_element.childNodes.item(j).getAttribute("value")));
                }
                tags.push(object);
                break;

            case "tag":
                tags.push(new Tag(current_element.textContent.trim(), current_element.getAttribute("value")));
                break;

            case "item":
                items.push(new Item(current_element.textContent.trim(), current_element.getAttribute("src"), current_element.getAttribute("tag")));
                break;

        }
    }

    items.sort(function(a, b) {return a.lemma.localeCompare(b.lemma);});

    var title;
    if (metadata.title) {
        title = document.createElementNS("http://www.w3.org/1999/xhtml", "h1");
        title.id = "title";
        while (metadata.title.childNodes.length) {
            title.appendChild(metadata.title.childNodes.item(0));
        }
        document.title = metadata.title.textContent;
        title.addEventListener("click", handleClicks, false);
    }

    var splash;
    if (metadata.splashes.length) {
        splash = document.createElementNS("http://www.w3.org/1999/xhtml", "span");
        splash.id = "splash";
        i = Math.floor(Math.random() * metadata.splashes.length);
        while (metadata.splashes[i].childNodes.length) {
            splash.appendChild(metadata.splashes[i].childNodes.item(0));
        }
    }

    var description;
    if (metadata.description) {
        description = document.createElementNS("http://www.w3.org/1999/xhtml", "p");
        while (metadata.description.childNodes.length) {
            description.appendChild(metadata.description.childNodes.item(0));
        }
    }

    var header = document.createElementNS("http://www.w3.org/1999/xhtml", "header");
    header.id = "header";
    if (title) header.appendChild(title);
    if (splash) header.appendChild(splash);
    if (description) header.appendChild(description);
    document.body.appendChild(header);

    var search_input = document.createElementNS("http://www.w3.org/1999/xhtml", "input");
    search_input.name = "input";
    search_input.type = "search";
    search_input.setAttribute = ("spellcheck", "false");
    search_input.addEventListener("input", handleInputs, false);

    var search_tags = document.createElementNS("http://www.w3.org/1999/xhtml", "select");
    search_tags.name = "tags";
    search_tags.addEventListener("change", handleInputs, false);
    search_tags.appendChild(document.createElementNS("http://www.w3.org/1999/xhtml", "option"));
    var optgroup;
    var option;
    for (i = 0; i < tags.length; i++) {
        if (tags[i] instanceof TagGroup) {
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
        else if (tags[i] instanceof Tag) {
            option = document.createElementNS("http://www.w3.org/1999/xhtml", "option");
            option.textContent = tags[i].name;
            option.value = tags[i].value;
            search_tags.appendChild(option);
        }
    }

    var search = document.createElementNS("http://www.w3.org/1999/xhtml", "form");
    search.id = "search";
    search.appendChild(search_input);
    search.appendChild(search_tags);

    var list = document.createElementNS("http://www.w3.org/1999/xhtml", "ul");
    list.id = "list";
    var list_item;
    for (i = 0; i < items.length; i++) {
        list_item = document.createElementNS("http://www.w3.org/1999/xhtml", "li");
        list_item.dataset.src = items[i].src;
        list_item.dataset.tag = items[i].tag;
        list_item.textContent = items[i].lemma;
        list_item.hidden = false;
        list.appendChild(list_item);
    }

    var sidebar = document.createElementNS("http://www.w3.org/1999/xhtml", "nav");
    sidebar.id = "sidebar";
    sidebar.appendChild(search);
    sidebar.appendChild(list);
    document.body.appendChild(sidebar);

    var container = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
    container.id = "container";
    document.body.appendChild(container);

    handleQuery();

    window.addEventListener("popstate", handleQuery, false);
    document.documentElement.addEventListener("click", handleClicks, true);

}

function loadIndex() {
    var request = new XMLHttpRequest();
    request.open("GET", "index.xml", true);
    request.responseType = "document";
    request.addEventListener("load", processIndex, false);
    request.send();
}

window.addEventListener("load", loadIndex, false);
