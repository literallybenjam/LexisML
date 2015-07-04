/* jslint asi:true, browser:true */

var splashes = [];

function handleClicks(e) {
    if (e.type !== "click") return;
    var n = e.target;
    if (!n.dataset.src) return;
}

function handleInputs(e) {
    if (e.type !== "input" || e.target !== document.getElementById("search")) return;
    var i;
    var found = false;
    for (i = 0; i < document.getElementById("list").children.length; i++) {
        if (document.getElementById("search").value) {
            document.getElementById("list").children.item(i).hidden = false;
            found = true;
        }
        else document.getElementById("list").children.item(i).hidden = true;
    }
    if (!found && document.getElementById("search").value) document.getElementById("nothing_found").hidden = false;
    else document.getElementById("nothing_found").hidden = true;
}

function processIndex() {

    var i;

    var index_document = this.response;
    if (!(index_document instanceof Document) || index_document.documentElement.namespaceURI !== "about:lexisml?lexis") return;

    var header = document.createElementNS("http://www.w3.org/1999/xhtml", "header");
    var title = document.createElementNS("http://www.w3.org/1999/xhtml", "h1");
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
    var search_label = document.createElementNS("http://www.w3.org/1999/xhtml", "label");
    search_label.htmlFor = "search";
    search_label.textContent = "Search: ";
    var search_input = document.createElementNS("http://www.w3.org/1999/xhtml", "input");
    search_input.id = "search";
    search_input.type = "search";
    search_input.setAttribute = ("spellcheck", "false");
    search_input.addEventListener("input", handleInputs, false);
    document.body.appendChild(header).appendChild(search_label).appendChild(search_input);

    var list = document.createElementNS("http://www.w3.org/1999/xhtml", "ul");
    list.id = "list";
    var list_item;
    var items = [];
    var item_elements = index_document.getElementsByTagNameNS("about:lexisml?lexis", "item");
    for (i = 0; i < item_elements.length; i++) {
        items[i] = {
            lemma: item_elements.item(i).getAttribute("lemma"),
            src: item_elements.item(i).getAttribute("src")
        }
    }
    items.sort(function(a, b) {return a.lemma.localeCompare(b.lemma);});
    for (i = 0; i < items.length; i++) {
        list_item = document.createElementNS("http://www.w3.org/1999/xhtml", "li");
        list_item.dataset.src = items[i].src;
        list_item.textContent = items[i].lemma;
        list_item.hidden = true;
        list.appendChild(list_item);
    }
    document.body.appendChild(list);

    var nothing_found = document.createElementNS("http://www.w3.org/1999/xhtml", "p");
    nothing_found.id = "nothing_found";
    nothing_found.textContent = "No results.";
    nothing_found.hidden = true;
    document.body.appendChild(nothing_found);

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
