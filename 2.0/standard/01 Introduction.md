#  LexisML  #

Version 2.0 Specification<br>
Benjamin Shoemake<br>
Working Draft

- - -

##  01 Introduction  ##

LexisML is a markup language for describing the lexicons of languages.
It defines a semantic methodology for representing linguistic information in a machine-readible format, which is then easily searched and rendered through existing common interfaces.
With its foundations in XML, LexisML is compatible with a wide variety of pre-existing technologies and easily integrated into the World Wide Web.

Initially hacked together for use with [the LANGDEV project][LANGDEV], with features added as they were needed, LexisML is in this specification standardized as an extensible tool for use in a wide variety of applications.
The XML implementation of LexisML follows directly from this initial attempt, expanding its capabilities and increasing its flexibility.
In addition, a Markdown-based implementation creates a far more readible methodology for recording lexical data, fully convertible to and from the XML format.

This document is targeted at authors of documents and scripts which make use of the features described in this specification, as well as people working on tools which might need to interface with said features, those attempting to determine the correctness of those features, and other interested parties.
It expects a passing familiarity with technologies such as XML and the processing thereof.
It is limited to providing a semantic markup language for lexicons and algorithms for processing said markup, and may be extended both through the mechanisms built into XML and through those set forth in this specification.
Technologies such as scripting languages, as well as mechanisms for presenting the information contained in these documents, are beyond the scope of this specification.
In addition, this specification does not cover hardware, nor specific applications of the features described herein beyond the broad circumstances of their implementation.

###  about this specification:  ###

This specification defines version 2.0 of LexisML, a lexicon markup language.
It was put together by [Benjamin Russel Shoemake][BENJAM], and is available at <https://github.com/literallybenjam/LexisML/2.0/standard>.

The LexisML specification carries two version numbers: a major version number (for this specification: __2__) and a minor version number (for this specification: __0__).
Major versions may add or remove features and contain other significant revisions which would not be supported by previous versions of the specification.
Minor versions may also add additional features, but must support everything described by the associated major version.

In addition, addendums to this specification may be published to this specification; these can be found [here](addendums).
Addendums will be used to clarify content or correct errors in the specification, and may contain other smaller additions.
These addendums will be integrated into the main specification upon publication of the next major version.

Finally, small errors in this specification may be corrected without increasing the version number or publishing an addendum.
These corrections will be noted, with date, in [08 Errata](08%20Errata.md).

The current status of this specification is **Working Draft**, which means that it is unstable and highly subject to revision.
Once features are finalized, it will progress to **Release Canidate** status, at which point it will be reviewed for errors and completeness.
Finally, it will be approved as a **Final Release**, at which point it will be beyond revision except through the mechanisms of addendum and errata described previously.
At this point, later versions of the specification may be developed and published; these will supercede this and all previous versions.

###  design goals:  ###

LexisML draws inspiration from XML, HTML, Apple's Dictionary Services Markup, the formatting of various online and print dictionaries, and the Sino-Tibetan Etymological Dictionary and Thesaurus.
It is designed to operate within a number of existing frameworks and to play well with the specifications which govern them.
Furthermore, it aims not to reinvent the wheel, and to take advantage of the many technologies already in development and widespread use.

The following principles have guided the design of LexisML:

- <b>Readable:</b> LexisML is designed such that conforming documents can be created and understood with nothing more than a text editor.
The XML implementation of LexisML takes advantage of the design principles of XML to achieve this end while remaining highly machine-readible, and the Markdown implementation privileges simplicity and source-readibility to make the language highly accessible.
- <b>Flexible:</b> Languages are very diverse, and their needs vary widely in terms of recording lexical information.
LexisML aims to be flexible enough to accomodate this diverse set of needs, while providing a single easily-to-understand-and-process structure.

###  typographic conventions:  ###

This specification is written using GitHub-flavored markdown. Definitions, requirements, and explanations are marked up like this.

*This is an aside*

```
    This is a code block
```

**☠ This is an issue**

**⚠ This is a warning**

Links are marked up like [this][EXAMPLE]. The defining instance of a term is marked up like <b id="this">this</b>, and later references to that term are marked up like [<i>this</i>](#this).

Code fragments and attribute names are marked up like `this`. Element names are enclosed in less-than and greater-than signs, like `<this>`.

[BENJAM]: http://benjam.xyz/
[EXAMPLE]: http://example.com/
[LANGDEV]: https://github.com/literallybenjam/langdev
