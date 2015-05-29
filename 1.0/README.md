#  LexisML 1.0  #

LexisML 1.0 is an application of XML used for recording the lexicon of a language. It has namespace `http://leaf.faint.xyz/lexisml`.

##  Elements  ##

The following elements and attributes are supported for LexisML 1.0.
Note that global XML attributes, such as `xml:lang`, are allowed on all elements.

###  `<lexis>`  ###

The root element of any LexisML document.
Non-element contents should be ignored.

###  `<meta>`  ###

Metadata to be associated with the document.
The parent of a `<meta>` element must be a `<lexis>` element.
The only contents of a `<meta>` element should be text nodes.

It supports one attribute, `name`, which determines the type of metadata.
The following values are supported:

- `"title"` : The title of the document
- `"description"` : A description of the document
- `"splash"` : Splash text

###  `<word>` and `<affix>`  ###

Words and affixes.
The parent of these elements must be a `<lexis>` element.
Non-element contents should be ignored.

It supports one attribute, `lemma`, which gives the lemma.
If not specified, `lemma` must take the value of the first `<form>` child, if present.

###  `<form>`  ###

A word-form.
The parent of a `<form>` element must be a `<word>` or `<affix>` element.
The only contents of a `<form>` element should be text nodes.

It supports two attributes: `class`, which gives the word-class(es, seperated by spaces), and `pronunciation`, which gives the pronunciation for the word-form.

A word-class must be one or more of the following keywords, separated by periods:

- `pfv`: perfective
- `prog`: progressive
- `cont`: continuous
- `nom`: nominative
- `obj`: objective
- `gen`: genitive
- `refl`: reflexive
- `poss`: possessive
- `1`: first-person
- `2`: second-person
- `3`: third-person
- `masc`: masculine
- `fem`: feminine
- `neut`: neuter
- `an`: animate
- `inan`: inanimate
- `form`: formal
- `nfrm`: informal
- `pst`: past-tense
- `prs`: present-tense
- `fut`: future-tense
- `sing`: singular
- `pl`: plural
- `cnt`: count
- `mass`: mass
- `ind`: indicative
- `mir`: mirative
- `opt`: optative
- `hort`: hortative
- `perm`: permissive
- `jus`: jussive
- `int`: interrogative
- `mod`: modal
- `prop`: proper
- `def`: definite
- `ndef`: indefinite
- `prox`: proximal
- `med`: medial
- `dist`: distal
- `pers`: personal
- `cop`: copular
- `inf`: infinitive
- `aux`: auxiliary
- `qnt`: quantifier
- `num`: numeral
- `dem`: demonstrative
- `art`: article
- `det`: determiner
- `ints`: intensifier
- `prep`: pre-position
- `post`: post-position
- `conj`: conjunction
- `ptcl`: particle
- `ptcp`: participle
- `ger`: gerund
- `adj`: adjective
- `adv`: adverb
- `pron`: pronoun
- `n`: noun
- `v`: verb
- `inj`: interjection
- `cla`: classifier

###  `<etymology>`  ###

Etymological data.
The parent of an `<etymology>` element must be a `<word>` or `<affix>` element.
`<etymology>` supports both text and element node children.

###  `<meaning>`  ###

The meaning of a word or affix.
The parent of a `<meaning>` element must be a `<word>` or `<affix>` element.
`<meaning>` supports both text and element node children.

It supports one attribute: `class`, which gives the word-class(es).
`class` is used to match `<meaning>` elements to their associated `<form>` elements.
If a `class` is not provided, a `<meaning>` element is assumed to describe all `<form>` siblings.

###  `<aside>`  ###

A side note.
The parent of an `<aside>` element must be a `<word>` or `<affix>` element.
`<aside>` supports both text and element node children.

###  `<wordref>`  ###

A reference to a `<word>` in the same file.
The parent of an `<wordref>` element must be an `<etymology>`, `<meaning>`, or `<aside>` element.
The only contents of an `<wordref>` element should be text nodes.

###  `<etymon>`  ###

An etymon.
The parent of an `<etymon>` element must be an `<etymology>` element.
The only contents of an `<etymon>` element should be text nodes.

###  `<mention>`  ###

A mention of a word.
The parent of an `<mention>` element must be an `<etymology>`, `<meaning>`, or `<aside>` element.
The only contents of an `<mention>` element should be text nodes.

##  Processing  ##

The [dictgen](dictgen) script processes a LexisML 1.0 file and generates a web page to display it.
Simply include it in an HTML page with the `data-src` attribute set on the root element to the location of the LexisML file.

The normalization of LexisML provided by the script in [dictgen](dictgen) does the following:

* If a lemma is not provided for a word or affix, it is set as the first word-form. If the word or affix has no word-forms, it is set to the empty string.
* If a meaning has no associated class, it is set to all classes provided by the word or affix's various word-forms. If no word-forms with classes are provided, no class is associated.
* All child text nodes are removed from `<lexis>` and `<word>` elements.
* The text content of all other elements is trimmed and normalized.
* The `xml:lang` attribute of every element is set.

##  Endmatter  ##

LexisML 1.0 was coded by [@literallybenjam](https://twitter.com/literallybenjam).
It is licensed under [the Unlicense](http://unlicense.org/UNLICENSE).
