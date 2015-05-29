#  LexisML  #

Version 2.0 Specification<br>
Benjamin Shoemake<br>
Working Draft

- - -

##  04 Elements  ##

> __This section is [**normative**][TERMS].__

###  the `<lexis>` element:  ###

The `<lexis>` element must be the [**fragment root**][TERMS] of a [**document**][TERMS].
Its [**contents**][TERMS] must be [`<meta>`][#the-meta-element] or [`<entry>`][#the-entry-element] elements.

###  the `<meta>` element:  ###

The `<meta>` element provides information about the [**document**][TERMS] to which it belongs.
Its [**contents**][TERMS] must be a [**string**][DEPENDENCY].

The `type` [**enumerated attribute**][ATTRIBUTES] identifies the type of metadata included in its [**contents**][TERMS].
The following [**values**][TERMS] are supported:

- `title`: Document title [only one of these]
- `description`: Document description [only one of these]
- `splash`: Splash text

###  the `<entry>` element:  ###

The `<entry>` element identifies a lexicon entry.
Its [**contents**][TERMS] must include:

- One or more `<form>` elements, followed by
- Zero or more `<data>` elements.

The `type` [**enumerated attribute**][ATTRIBUTES] identifies the type of entry.
The following [**values**][TERMS] are supported:

- `""`: A generic entry
- `"word"`: A word
- `"affix"`: An affix
- `"symbol"`: A symbol or other punctuation

###  the `<form>` element:  ###

The `<form>` element provides a form for the entry.
Its [**contents**][TERMS] must be a [**string**][DEPENDENCY].

The `lemma` [**boolean attribute**][ATTRIBUTES] identifies the `<form>` as being primary.
For each [`<entry>`][#the-entry-element], only one [`<form>`][#the-form-element] element may have the [`lemma`][#the-form-element] [**present**][TERMS].

###  the `<data>` element:  ###

The `<data>` element provides information about an entry.
Its [**contents**][TERMS] must be some combination of [**strings**][DEPENDENCY] and [`<span>`][#the-span-element], [`<mention>`][#the-mention-element], [`<wordref>`][#the-wordref-element], or [`<image>`][#the-image-element] elements.
[**Elements**][TERMS] from other specifications, for example [HTML][HTML], may also be included as children of the [`<data`][#the-data-element] element.

The `type` [**enumerated attribute**][ATTRIBUTES] identifies the type of entry.
The following [**values**][TERMS] are supported:

- `"meaning"`: A definition
- `"etymology"`: Etymological data
- `"aside"`: Side notes or clarifications

###  the `<span>` element:  ###

The `<span>` element contains a span of text.
Its [**contents**][TERMS] must be a [**string**][DEPENDENCY].

###  the `<mention>` element:  ###

The `<mention>` element mentions a word.
Its [**contents**][TERMS] must be a [**string**][DEPENDENCY].

The [**value**][TERMS] of the `href` [**attribute**][TERMS], if [**present**][TERMS], identifies the [**URL**][DEPENDENCY] of a [**file**][TERMS] in which an entry for the word may be found.

###  the `<reference>` element:  ###

The `<reference>` element references an [`<entry>`][#the-entry-element] element.
Its [**contents**][TERMS] must be a [**string**][DEPENDENCY], which must match the contents of a [`<form>`][#the-form-element] [**child element**][TERMS] of some [`<entry>`][#the-entry-element].

[ATTRIBUTES]: 02%20Terminology%20and%20infrastructure.md#attributes "02 Terminology and infrastructure § microsyntaxes and idioms § attributes"
[DEPENDENCY]: 02%20Terminology%20and%20infrastructure.md#dependency "02 Terminology and infrastructure § dependency"
[TERMS]: 02%20Terminology%20and%20infrastructure.md#terminology "02 Terminology and infrastructure § terminology"
