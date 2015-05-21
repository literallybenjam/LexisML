#  LexisML  #

LexisML is an application of XML used for recording the lexicon of a language. It has namespace `http://leaf.faint.xyz/lexisml`.

The normalization of LexisML provided by the script in [dictgen](dictgen) does the following:

* If a lemma is not provided for a word or affix, it is set as the first word-form. If the word or affix has no word-forms, it is set to the empty string.
* If a meaning has no associated class, it is set to all classes provided by the word or affix's various word-forms. If no word-forms with classes are provided, no class is associated.
* All child text nodes are removed from `<lexis>` and `<word>` elements.
* The text content of all other elements is trimmed and normalized.
* The `xml:lang` attribute of every element is set.

## Endmatter:

LexisML was coded by [@literallybenjam](https://twitter.com/literallybenjam).
It is licensed under [the Unlicense](http://unlicense.org/UNLICENSE).
