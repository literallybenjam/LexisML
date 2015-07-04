/* jslint asi:true, browser:true */

var splashes = [];

function processWord() {

    var word = this.response.documentElement.cloneNode(true);

    document.getElementById("list").hidden = true;
    if (!document.getElementsByTagNameNS("about:lexisml?word", "word").length) document.getElementById("container").appendChild(word);
    else document.getElementsByTagNameNS("about:lexisml?word", "word").item(0).parentElement.replaceChild(word, document.getElementsByTagNameNS("about:lexisml?word", "word").item(0));

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

    if (n === document.getElementById("search")) {
        while (document.getElementsByTagNameNS("about:lexisml?word", "word").length) document.getElementsByTagNameNS("about:lexisml?word", "word").item(0).parentElement.removeChild(document.getElementsByTagNameNS("about:lexisml?word", "word").item(0));
        document.getElementById("list").hidden = false;
    }

    else if (n.dataset.src && !document.documentElement.hasAttribute("data-loading")) loadWord(n.dataset.src);

}

function handleInputs(e) {

    if (e.type !== "input" || e.target !== document.getElementById("search")) return;
    var i;
    var found = false;
    var value = document.getElementById("search").value.toLocaleLowerCase();

    for (i = 0; i < document.getElementById("list").children.length; i++) {
        if (value == document.getElementById("list").children.item(i).toLocaleLowerCase().substr(0, value.length)) {
            document.getElementById("list").children.item(i).hidden = false;
            found = true;
        }
        else document.getElementById("list").children.item(i).hidden = true;
    }

}

function processIndex() {

    var i;

    var index_document = this.response;
    if (!(index_document instanceof Document) || index_document.documentElement.namespaceURI !== "about:lexisml?lexis") return;

    document.body.textContent = "";

    var header = document.createElementNS("http://www.w3.org/1999/xhtml", "header");
    header.id = "header";
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
    document.body.appendChild(header);

    var sidebar = document.createElementNS("http://www.w3.org/1999/xhtml", "nav");
    sidebar.id = "sidebar";
    var search = document.createElementNS("http://www.w3.org/1999/xhtml", "input");
    search.id = "search";
    search.type = "search";
    search.setAttribute = ("spellcheck", "false");
    search.addEventListener("input", handleInputs, false);
    sidebar.appendChild(search);

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
        list_item.hidden = false;
        list.appendChild(list_item);
    }
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
