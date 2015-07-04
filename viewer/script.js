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
        return this.item(this.tags.length);
    }
}

function processWord() {
    var i;
    var word = this.response.documentElement.cloneNode(true);
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
    if (e.type !== "click") return;
    var n = e.target;
    if (n.dataset && n.dataset.src && !document.documentElement.hasAttribute("data-loading")) loadWord(n.dataset.src);
    else if (this.namespaceURI === "about:lexisml?word" && this.tagName === "wordref") {
        require_perfect_match = true;
        if (this.hasAttribute("for")) document.getElementById("search").namedItem("input").value = this.getAttribute("for");
        else document.getElementById("search").namedItem("input").value = this.textContent;
        document.getElementById("search").namedItem("tags").item(0);
        handleInputs();
    }
    else if (this.id === "title") {
        document.getElementById("container").textContent = "";
        document.getElementById("search").namedItem("input").value = "";
        document.getElementById("search").namedItem("tags").item(0);
        handleInputs();
    }
}

function handleInputs() {

    var i;
    var tag = document.getElementById("search").namedItem("tags").value;
    var value = document.getElementById("search").namedItem("input").value.toLocaleLowerCase();

    for (i = 0; i < document.getElementById("list").children.length; i++) {


        if (require_perfect_match) {
            if (value == document.getElementById("list").children.item(i).textContent) {
                document.getElementById("list").children.item(i).hidden = false;
                loadWord(document.getElementById("list").children.item(i).dataset.src);
            }
            else document.getElementById("list").children.item(i).hidden = true;
        }

        else {
            if (value == document.getElementById("list").children.item(i).textContent.toLocaleLowerCase().substr(0, value.length) && (!tag || document.getElementById("list").children.item(i).dataset.tag.split("/\s+/").indexOf(tag) !== 1)) document.getElementById("list").children.item(i).hidden = false;
            else document.getElementById("list").children.item(i).hidden = true;
        }

    }

    require_perfect_match = false;

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
    for (i = 0; i < index_document.documentElement.children.length; i++) {
        current_element = index_document.documentElement.children.item(i);
        switch (current_element.tagName) {

            case "meta":
                switch (current_element.getAttribute("type")) {
                    case "title":
                        metadata.title = current_element.textContent.trim();
                        break;
                    case "description":
                        metadata.description = current_element.textContent.trim();
                        break;
                    case "splash":
                        metadata.splashes.push(current_element.textContent.trim());
                }
                break;

            case "taggroup":
                object = new TagGroup(current_element.getAttribute("name"));
                for (j = 0; j < current_element.children.length; j++) {
                    object.add(new Tag(current_element.children.item(j).textContent.trim(), current_element.children.item(j).getAttribute("value")));
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

    var title = document.createElementNS("http://www.w3.org/1999/xhtml", "h1");
    title.id = "title";
    title.textContent = metadata.title;
    title.addEventListener("click", handleClicks, false);

    var splash = document.createElementNS("http://www.w3.org/1999/xhtml", "span");
    splash.id = "splash";
    if (metadata.splashes.length !== 0) splash.textContent = metadata.splashes[Math.floor(Math.random() * metadata.splashes.length)];

    var description = document.createElementNS("http://www.w3.org/1999/xhtml", "p");
    description.textContent = metadata.title;

    var header = document.createElementNS("http://www.w3.org/1999/xhtml", "header");
    header.id = "header";
    if (title.textContent) header.appendChild(title);
    if (splash.textContent) header.appendChild(splash);
    if (description.textContent) header.appendChild(description);
    document.body.appendChild(header);

    var search_input = document.createElementNS("http://www.w3.org/1999/xhtml", "input");
    search_input.name = "input";
    search_input.type = "search";
    search_input.setAttribute = ("spellcheck", "false");
    search_input.addEventListener("input", handleInputs, false);

    var search_tags = document.createElementNS("http://www.w3.org/1999/xhtml", "select");
    search_tags.name = "tags";
    search_tags.addEventListener("input", handleInputs, false);
    search_tags.add(document.createElementNS("http://www.w3.org/1999/xhtml", "option"));
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
            search_tags.add(optgroup);
        }
        else if (tags[i] instanceof Tag) {
            option = document.createElementNS("http://www.w3.org/1999/xhtml", "option");
            option.textContent = tags[i].name;
            option.value = tags[i].value;
            search_tags.add(option);
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

}

function loadIndex() {
    var request = new XMLHttpRequest();
    request.open("GET", "index.xml", true);
    request.responseType = "document";
    request.addEventListener("load", processIndex, false);
    request.send();
}

window.addEventListener("load", loadIndex, false);
document.documentElement.addEventListener("click", handleClicks, true);
