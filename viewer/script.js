/* jslint asi:true, browser:true */

var splashes = [];
var require_perfect_match = false;

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
            if (value == document.getElementById("list").children.item(i).textContent.toLocaleLowerCase().substr(0, value.length) && (!tag || document.getElementById("list").children.item(i).dataset.tags.split(",").indexOf(tag) !== 1)) document.getElementById("list").children.item(i).hidden = false;
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

    var header = document.createElementNS("http://www.w3.org/1999/xhtml", "header");
    header.id = "header";
    var title = document.createElementNS("http://www.w3.org/1999/xhtml", "h1");
    title.id = "title";
    title.addEventListener("click", handleClicks, false);
    var description = document.createElementNS("http://www.w3.org/1999/xhtml", "p");
    var splash = document.createElementNS("http://www.w3.org/1999/xhtml", "span");
    splash.id = "splash";
    var meta_elements = index_document.getElementsByTagNameNS("about:lexisml?lexis", "meta");
    for (i = 0; i < meta_elements.length; i++) {
        switch (meta_elements.item(i).getAttribute("type")) {

            case "title":
                document.title = meta_elements.item(i).textContent;
                title.textContent = meta_elements.item(i).textContent;
                break;

            case "description":
                description.textContent = meta_elements.item(i).textContent;
                break;

            case "splash":
                splashes.push(meta_elements.item(i).textContent);
                break;

        }
    }
    if (splashes.length !== 0) document.getElementById("meta-splash").textContent = splashes[Math.floor(Math.random() * splashes.length)];
    if (title.textContent) header.appendChild(title);
    if (splash.textContent) header.appendChild(splash);
    if (description.textContent) header.appendChild(description);
    document.body.appendChild(header);

    var list = document.createElementNS("http://www.w3.org/1999/xhtml", "ul");
    var tags = [];
    list.id = "list";
    var list_item;
    var items = [];
    var item_elements = index_document.getElementsByTagNameNS("about:lexisml?lexis", "item");
    for (i = 0; i < item_elements.length; i++) {
        items[i] = {
            lemma: item_elements.item(i).getAttribute("lemma"),
            src: item_elements.item(i).getAttribute("src"),
            taglist: item_elements.item(i).hasAttribute("tags") ? item_elements.item(i).getAttribute("tags").split(",") : []
        }
        for (j = 0; j < items[i].taglist.length; j++) {
            items[i].taglist[j] = items[i].taglist[j].trim();
            if (tags.indexOf(items[i].taglist[j]) === -1) tags.push(items[i].taglist[j]);
        }
    }
    items.sort(function(a, b) {return a.lemma.localeCompare(b.lemma);});
    for (i = 0; i < items.length; i++) {
        list_item = document.createElementNS("http://www.w3.org/1999/xhtml", "li");
        list_item.dataset.src = items[i].src;
        list_item.dataset.tags = items[i].taglist.join(",");
        list_item.textContent = items[i].lemma;
        list_item.hidden = false;
        list.appendChild(list_item);
    }

    var sidebar = document.createElementNS("http://www.w3.org/1999/xhtml", "nav");
    sidebar.id = "sidebar";
    var search = document.createElementNS("http://www.w3.org/1999/xhtml", "form");
    search.id = "search";
    var search_input = document.createElementNS("http://www.w3.org/1999/xhtml", "input");
    search_input.name = "input";
    search_input.type = "search";
    search_input.setAttribute = ("spellcheck", "false");
    search_input.addEventListener("input", handleInputs, false);
    search.appendChild(search_input);
    var search_tags = document.createElementNS("http://www.w3.org/1999/xhtml", "select");
    var option;
    search_tags.name = "tags";
    search_tags.addEventListener("input", handleInputs, false);
    search_tags.add(document.createElementNS("http://www.w3.org/1999/xhtml", "option"));
    for (i = 0; i < tags.length; i++) {
        option = document.createElementNS("http://www.w3.org/1999/xhtml", "option");
        option.textContent = tags[i];
        search_tags.add(option);
    }
    search.appendChild(search_tags);
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
