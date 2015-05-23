/* jslint asi:true, browser:true */

if (typeof Lexis == "undefined") var Lexis = {};

Lexis.normalize = function(lexis_document) {
    var words = lexis_document.getElementsByTagNameNS("http://leaf.faint.xyz/lexisml", "word");
    var metas = lexis_document.getElementsByTagNameNS("http://leaf.faint.xyz/lexisml", "meta");
    var forms;
    var iterator = lexis_document.createNodeIterator(lexis_document.documentElement, NodeFilter.SHOW_ELEMENT, null);
    var i;
    if (words.length) {
        for (i = 0; i < metas.length; i++) {
            lexis_document.documentElement.insertBefore(metas.item(i), words.item(0));
        }
    }
    var current_node;
    var text_content;
    while (current_node = iterator.nextNode()) {  // jshint ignore:line
        switch (current_node.tagName) {
            case "word":
            case "affix":
                if (!current_node.hasAttribute("lemma")) {
                    forms = current_node.getElementsByTagNameNS("http://leaf.faint.xyz/lexisml", "form");
                    if (forms.length) current_node.setAttribute("lemma", forms.item(0).textContent);
                    else current_node.setAttribute("lemma", "");
                }
                /* falls through */
            case "lexis":
                for (i = current_node.childNodes.length - 1; i >= 0; i--) {
                    if (current_node.childNodes.item(i).nodeType !== 1) current_node.removeChild(current_node.childNodes.item(i));
                }
                break;
            case "meaning":
                if (!current_node.hasAttribute("class")) {
                    var class_value = "";
                    forms = current_node.parentNode.getElementsByTagNameNS("http://leaf.faint.xyz/lexisml", "form");
                    for (i = 0; i < forms.length; i++) {
                        if (forms.item(i).hasAttribute("class")) class_value += forms.item(i).getAttribute("class") + " ";
                    }
                    class_value = class_value.trim();
                    if (class_value !== "") current_node.setAttribute("class", class_value);
                }
                /* falls through */
            case "meta":
            case "form":
            case "etymology":
            case "etymon":
            case "wordref":
            case "mention":
            case "aside":
                for (i = 0; i < current_node.childNodes.length; i++) {
                    if (current_node.childNodes.item(i).nodeType === 3) {
                        text_content = current_node.childNodes.item(i).textContent;
                        if (String.prototype.normalize) text_content = text_content.normalize();
                        if (i === 0) text_content = text_content.replace(/^\s+/, "");
                        else if (i === current_node.childNodes.length - 1) text_content = text_content.replace(/\s+$/, "");
                        text_content = text_content.replace(/\s+/, " ");
                        current_node.childNodes.item(i).textContent = text_content;
                    }
                }
                current_node.normalize();

        }
        for (i = current_node.parentElement; !current_node.hasAttributeNS("http://www.w3.org/XML/1998/namespace", "lang"); i = i.parentElement) {
            if (i.hasAttributeNS("http://www.w3.org/XML/1998/namespace", "lang")) current_node.setAttributeNS("http://www.w3.org/XML/1998/namespace", "lang", i.getAttributeNS("http://www.w3.org/XML/1998/namespace", "lang"));
            else if (i == lexis_document.documentElement) current_node.setAttributeNS("http://www.w3.org/XML/1998/namespace", "lang", "");
        }
    }
}

var Dictionary = {
    description: null,
    element: null,
    filter: function() {
        var i = 0;
        var current_element = null;
        for (i = 0; i < Dictionary.element.childElementCount; i++) {
            current_element = Dictionary.element.children.item(i);
            if (current_element.tagName !== "SECTION") continue;
            if (window.location.hash && ((window.location.hash === "#:" && !Dictionary.getLemmaFromId(current_element.id).isHidden) || (window.location.hash.indexOf(":") === -1 && Dictionary.lemmaContainsForm(Dictionary.getLemmaFromId(current_element.id), window.location.hash.substr(1))) || current_element.id === window.location.hash.substr(1))) current_element.removeAttribute("hidden");
            else current_element.setAttribute("hidden", "");
        }
    },
    getHTML: function(e) {
        var i = 0;
        var s = "";
        var current_node = null;
        if (e.hasAttribute("usage")) s += "<small>(" + e.getAttribute("usage") + ")</small> ";
        for (i = 0; i < e.childNodes.length; i++) {
            current_node = e.childNodes.item(i);
            if (current_node.nodeType === 3) {
                s += current_node.textContent;
            }
            else if (current_node.nodeType === 1) {
                switch (current_node.tagName) {
                    case "wordref":
                        s += "<i><a href='#" + Dictionary.getLemmaName(current_node.textContent) + "'>" + current_node.textContent + "</a></i>";
                        break;
                    case "etymon":
                    case "mention":
                        if (current_node.getAttributeNS("http://www.w3.org/XML/1998/namespace", "lang") != e.getAttributeNS("http://www.w3.org/XML/1998/namespace", "lang")) s += "<i lang='" + current_node.getAttributeNS("http://www.w3.org/XML/1998/namespace", "lang") + "'>" + current_node.textContent + "</i>";
                        else s += "<i>" + current_node.textContent + "</i>";
                        break;
                }
            }
        }
        return s.trim();
    },
    getHumanReadableWordClass: function(word_class) {
        word_class = Dictionary.string(word_class);
        var class_list = word_class.split(" ");
        var class_item_list = null;
        var i = 0;
        var j = 0;
        var s = "";
        var q = null;
        for (i = 0; i < class_list.length; i++) {
            if (i) s += ", ";
            class_item_list = class_list[i].split(".");
            q = {};
            for (j = 0; j < class_item_list.length; j++) {
                q[class_item_list[j]] = true;
            }

            if (q.pfv) s += "perfective ";
            if (q.prog) s += "progressive ";
            if (q.cont) s += "continuous ";
            if (q.nom) s += "nominative ";
            if (q.obj) s += "objective ";
            if (q.gen) s += "genitive ";
            if (q.refl) s += "reflexive ";
            if (q.poss) s += "possessive ";
            if (q["1"]) s += "first-person ";
            if (q["2"]) s += "second-person ";
            if (q["3"]) s += "third-person ";
            if (q.masc) s += "masculine ";
            if (q.fem) s += "feminine ";
            if (q.neut) s += "neuter ";
            if (q.an) s += "animate ";
            if (q.inan) s += "inanimate ";
            if (q.form) s += "formal ";
            if (q.nfrm) s += "informal ";
            if (q.pst) s += "past-tense ";
            if (q.prs) s += "present-tense ";
            if (q.fut) s += "future-tense ";
            if (q.sing) s += "singular ";
            if (q.pl) s += "plural ";
            if (q.cnt && !q.sing && !q.pl) s += "count ";
            if (q.mass) s += "mass ";
            if (q.ind) s += "indicative ";
            if (q.mir) s += "mirative ";
            if (q.opt) s += "optative ";
            if (q.hort) s += "hortative ";
            if (q.perm) s += "permissive ";
            if (q.jus) s += "jussive ";
            if (q.int) s += "interrogative ";
            if (q.mod && !q.ind && !q.mir && !q.opt && !q.hort && !q.perm && !q.jus && !q.int) s += "modal ";
            if (q.prop) s += "proper ";
            if (q.def) s += "definite ";
            if (q.ndef) s += "indefinite ";
            if (q.prox) s += "proximal ";
            if (q.med) s += "medial ";
            if (q.dist) s += "distal ";
            if (q.pers) s += "personal ";
            if (q.cop) s += "copular ";
            if (q.inf) s += "infinitive ";
            if (q.aux) s += "auxiliary ";
            if (q.qnt) s += "quantifier ";
            if (q.num) s += "numeral ";
            if (q.dem) s += "demonstrative ";
            if (q.art) s += "article ";
            if (q.det && !q.qnt && !q.num && !q.dem && !q.art) s += "determiner ";
            if (q.ints) s += "intensifier ";
            if (q.prep) s += "pre-position ";
            if (q.post) s += "post-position ";
            if (q.conj) s += "conjunction ";
            if (q.ptcl) s += "particle ";
            if (q.ptcp) s += "participle ";
            if (q.ger) s += "gerund ";
            if (q.adj) s += "adjective ";
            if (q.adv) s += "adverb ";
            if (q.pron) s += "pronoun ";
            if (q.n) s += "noun ";
            if (q.v) s += "verb ";
            if (q.inj) s += "interjection ";
            if (q.cla) s += "classifier ";
            s = s.trim();
        }
        return s;
    },
    getLemmaFromId: function(id) {
        return Dictionary.lemmas[id.split(":")[0]][Number(id.split(":")[1])]
    },
    getLemmaName: function(lemma) {
        return Dictionary.string(lemma).replace(/[:'"#\?]/g, "-");
    },
    ids: [],
    init: function() {
        Dictionary.Requester.addEventListener("load", Dictionary.setup, false);
        Dictionary.Requester.open("get", document.documentElement.dataset.src + "?" + new Date().getTime(), true);
        Dictionary.Requester.overrideMimeType("text/xml");
        Dictionary.Requester.send();
    },
    lang: "",
    lemmaContainsForm: function(lemma, form) {
        var i;
        for (i = 0; i < lemma.forms.length; i++) {
            if (Dictionary.getLemmaName(lemma.forms.item(i).textContent) == form) return true;
        }
        return false;
    },
    lemmas: {},
    lexis: undefined,
    Requester: new XMLHttpRequest(),
    setup: function() {
        Dictionary.lang = document.documentElement.lang;
        Dictionary.lexis = Dictionary.Requester.responseXML;
        Lexis.normalize(Dictionary.lexis);
        var i = 0;
        var j = 0;
        var elements = Dictionary.lexis.documentElement.childNodes;
        var current_element;
        var current_lemma;
        var lemma_name;
        var lemma_id;
        var class_value;
        var article_html;
        var section_html;
        for (i = 0; i < elements.length; i++) {
            if (elements.item(i).nodeType !== 1) continue;
            current_element = elements.item(i);
            switch (current_element.tagName) {
                case "meta":
                    switch (current_element.getAttribute("name")) {
                        case "title":
                            Dictionary.title = [current_element.getAttributeNS("http://www.w3.org/XML/1998/namespace", "lang"), current_element.textContent];
                            break;
                        case "description":
                            Dictionary.description = [current_element.getAttributeNS("http://www.w3.org/XML/1998/namespace", "lang"), Dictionary.getHTML(current_element)];
                            break;
                        case "splash":
                            Dictionary.splashes[Dictionary.splashes.length] = [current_element.getAttributeNS("http://www.w3.org/XML/1998/namespace", "lang"), Dictionary.getHTML(current_element)];
                            break;
                    }
                    break;
                case "affix":
                case "word":
                    lemma_name = Dictionary.getLemmaName(current_element.getAttribute("lemma"));
                    if (Dictionary.lemmas[lemma_name] === undefined) Dictionary.lemmas[lemma_name] = [];
                    lemma_id = lemma_name + ":" + Dictionary.lemmas[lemma_name].length;
                    current_lemma = Dictionary.lemmas[lemma_name][Dictionary.lemmas[lemma_name].length] = {
                        type: current_element.tagName,
                        name: current_element.getAttribute("lemma"),
                        id: lemma_id,
                        isHidden: current_element.hasAttribute("hidden") && current_element.getAttribute("hidden") !== "false",
                        word_class: null,
                        lang: current_element.getAttributeNS("http://www.w3.org/XML/1998/namespace", "lang"),
                        form: null,
                        forms: current_element.getElementsByTagNameNS("http://leaf.faint.xyz/lexisml", "form"),
                        etymology: current_element.getElementsByTagNameNS("http://leaf.faint.xyz/lexisml", "etymology").item(0),
                        meanings: current_element.getElementsByTagNameNS("http://leaf.faint.xyz/lexisml", "meaning"),
                        asides: current_element.getElementsByTagNameNS("http://leaf.faint.xyz/lexisml", "aside")
                    }
                    class_value = "";
                    for (j = 0; j < current_lemma.forms.length; j++) {
                        if (current_lemma.forms.item(j).hasAttribute("class")) class_value += current_lemma.forms.item(j).getAttribute("class") + " ";
                        if (current_lemma.forms.item(j).textContent == current_lemma.name) current_lemma.form = current_lemma.forms.item(j);
                    }
                    if (class_value.trim() !== "") current_lemma.word_class = class_value.trim();
                    Dictionary.ids[Dictionary.ids.length] = lemma_id;
                    break;
            }
        }
        Dictionary.ids.sort(function (a, b) {return String(a).substr(String(a).search(/[^-' \.#:]/)).localeCompare(String(b).substr(String(b).search(/[^-' \.#]/)));});
        Dictionary.element = document.createElement("article");
        document.title = Dictionary.title[1];
        document.getElementsByTagName("title").item(0).lang = Dictionary.title[0];
        article_html = "<header id='main-header'><div>";
        article_html += "<h1 lang='" + Dictionary.title[0] + "'><a href='.'>" + Dictionary.title[1] + "</a></h1>";
        if (Dictionary.splashes.length) {
            i = Math.floor(Math.random()*Dictionary.splashes.length);
            article_html += "<p id='splash' lang='" + Dictionary.splashes[i][0] + "'>" + Dictionary.splashes[i][1] + "</p>";
        }
        if (Dictionary.description !== null) article_html += "</div><p lang='" + Dictionary.description[0] + "'>" + Dictionary.description[1] + "</p>";
        article_html += "<p><label for='filter-input'>search:</label> <input id='filter-input' type='text' autocomplete='off' autofocus inputmode='latin' placeholder='enter search term…' spellcheck='false'> <button id='filter-button'>ok</button> <button id='unfilter-button'>show everything</button></p>";
        article_html += "</header>";
        Dictionary.element.innerHTML = article_html;
        for (i = 0; i < Dictionary.ids.length; i++) {
            current_element = document.createElement("section");
            current_lemma = Dictionary.getLemmaFromId(Dictionary.ids[i]);
            current_element.lang = current_lemma.lang;
            current_element.id = Dictionary.ids[i];
            current_element.setAttribute("hidden", "");
            section_html = "<header>";
            section_html += "<h2>";
            section_html += "<dfn><a href='#" + Dictionary.ids[i] + "'>" + current_lemma.name + "</a></dfn>"
            class_value = "";
            for (j = 0; j < current_lemma.forms.length; j++) {
                if (current_lemma.forms.item(j) == current_lemma.form) {
                    if (current_lemma.forms.item(j).hasAttribute("pronunciation")) section_html += " <small>" + current_lemma.forms.item(j).getAttribute("pronunciation") + "</small>";
                }
                else {
                    if (class_value === "") class_value += " (";
                    else class_value += "; ";
                    class_value += (Dictionary.getHumanReadableWordClass(current_lemma.forms.item(j).getAttribute("class")) + " <dfn>" + current_lemma.forms.item(j).textContent + "</dfn>").trim();
                    if (current_lemma.forms.item(j).hasAttribute("pronunciation")) class_value += " <small>" + Dictionary.string(current_lemma.forms.item(j).getAttribute("pronunciation")) + "</small>";
                }
            }
            if (class_value !== "") class_value += ")";
            section_html += "</h2>";
            if (current_lemma.type == "word") {
                section_html += "<p>" + Dictionary.getHumanReadableWordClass(current_lemma.form.getAttribute("class")) + class_value + "</p>";
            }
            else if (current_lemma.type == "affix") {
                section_html += "<p>" + (Dictionary.getHumanReadableWordClass(current_lemma.form.getAttribute("class")) + " affix").trim() + class_value + "</p>";
            }
            section_html += "</header>";
            if (current_lemma.meanings.length > 1) {
                section_html += "<ul>";
                for (j = 0; j < current_lemma.meanings.length; j++) {
                    section_html += "<li>";
                    if (current_lemma.meanings.item(j).getAttribute("class") != current_lemma.word_class) section_html += "<small>(" + Dictionary.getHumanReadableWordClass(current_lemma.meanings.item(j).getAttribute("class")) + ")</small> ";
                    section_html += Dictionary.getHTML(current_lemma.meanings.item(j));
                    section_html += "</li>";
                }
                section_html += "</ul>";
            }
            else if (current_lemma.meanings.length == 1) {
                section_html += "<p>";
                if (current_lemma.meanings.item(0).getAttribute("class") != current_lemma.word_class) section_html += "<small>(" + Dictionary.getHumanReadableWordClass(current_lemma.meanings.item(0).getAttribute("class")) + ")</small> ";
                section_html += Dictionary.getHTML(current_lemma.meanings.item(0));
                section_html += "</p>";
            }
            if (current_lemma.etymology) section_html += "<h3>etymology</h3><p>" + Dictionary.getHTML(current_lemma.etymology) + "</p>";
            for (j = 0; j < current_lemma.asides.length; j++) {
                section_html += "<aside><p>" + Dictionary.getHTML(current_lemma.asides.item(j)) + "</p></aside>";
            }
            current_element.innerHTML = section_html;
            Dictionary.element.appendChild(current_element);
        }
        document.body.textContent = null;
        document.body.appendChild(document.createElement("main").appendChild(Dictionary.element).parentElement);
        document.getElementById("filter-button").addEventListener("click", function(){window.location.hash = Dictionary.getLemmaName(document.getElementById("filter-input").value);} ,false);
        document.getElementById("filter-input").addEventListener("keypress", function(e){if (e.key === "Enter" || e.keyCode === 13) window.location.hash = Dictionary.getLemmaName(document.getElementById("filter-input").value);} ,false);
        document.getElementById("unfilter-button").addEventListener("click", function(){window.location.hash = ":";}, false);
        Dictionary.filter();
    },
    splashes: [],
    string: function(n) {
        if (typeof n == "string") {
            return n;
        }
        else if (typeof n == "number") {
            return String(n);
        }
        return "";
    },
    title: "",
    title_lang: ""
}

window.addEventListener("load", Dictionary.init, false);
window.addEventListener("hashchange", Dictionary.filter, false);
