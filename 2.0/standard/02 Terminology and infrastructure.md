#  LexisML  #

Version 2.0 Specification<br>
Benjamin Shoemake<br>
Working Draft

- - -

##  02 Terminology and infrastructure  ##

This section defines much of the common terminology used by this specification, requirements for conformance, and other information which will be referenced often later on.

###  terminology:  ###

> __This section is [**normative**][TERMS].__

This specification inherits much of its terminology from the specifications on which it is founded, but some words contain special meanings when they are used here.

A **_name_** identifies its referrent as belonging to a particular class of similar entities.

An **_element_** is a container for information.
This information is referred to as its **_contents_**.
The type of information contained within an [**element**][TERMS] is determined by its [**name**][TERMS], and more information about its [**contents**][TERMS] can be provided with [**attributes**][TERMS].
Sometimes, the information contained within an [**element**][TERMS] includes other [**elements**][TERMS]; in this case, the [**element**][TERMS] which contains the others is referred to as the **_parent element_**, while the contained [**elements**][TERMS] are referred to as **_child elements_**.
When [**child elements**][TERMS] contain [**elements**][TERMS] themselves, these are referred to as **_descendants_** of the [**parent element**][TERMS], and the [**parent element**][TERMS] is referred to as an **_ancestor_**.

**_Attributes_** provide additional information about an [**element**][TERMS] or its [**contents**][TERMS].
[**Attributes**][TERMS] **_belong to_** the [**elements**][TERMS] they describe.
The information provided by an [**attribute**][TERMS] is referred to as its **value**; this will always be a [**string**][DEPENDENCY].
The type of information provided is determined by the [**name**][TERMS] of the [**attribute**][TERMS] and that of the [**element**][TERMS] to which it belongs.

[**Elements**][TERMS] which have no [**contents**][TERMS], [**attributes**][TERMS] with no [**value**][TERMS], and [**strings**][DEPENDENCY] of zero [**code units**][DEPENDENCY] are considered **_empty_**.
Any [**string**][DEPENDENCY] which is [**empty**][TERMS] may be referred to as **_the empty string_**
For the purposes of this specification, [**attributes**][TERMS] with no [**value**][TERMS] and [**attributes**][TERMS] with a [**value**][TERMS] of [**the empty string**][TERMS] are considered equivalent.

[**Attributes**][TERMS] whose [**values**][TERMS] are defined are **_present_**; [**attributes**][TERMS] which [**belong to**][TERMS] an [**element**][TERMS] but whose [**values**][TERMS] are not defined are **_absent_**.
An [**attribute**][TERMS] which is defined as [**empty**][TERMS] is still considered [**present**][TERMS].

This specification uses the term **_document_** to refer to any use of LexisML markup which conforms to the normative requirements for documents set forth in this text.
Other applications of LexisML markup are referred to as **_LexisML fragments_**.
These may be either [**conforming**][CONFORMANCE] or [**non-conforming**][CONFORMANCE].
[**Documents**][TERMS] may be considered [**conforming**][CONFORMANCE] [**LexisML fragments**][TERMS].

The terms above are defined abstractly, outside of any external specification or syntax.
When referring to documents, elements, or attributes as defined in XML, this specification will use the words **_XML document_**, **_XML element_** and **_XML attribute_**.
Unless otherwise stated, all [**XML elements**][TERMS] defined in this specification are in the [**LexisML namespace**][NAMESPACES], and all [**XML attributes**][TERMS] have no namespace.

This specification uses the term **_file_** to refer to information stored within both filesystems and bitstreams.
[**Files**][TERMS] may be classified according to their **_MIME types_**, as defined in [RFC 2046][MIME].
The [**characters**][DEPENDENCY] used in [**files**][TERMS] as a means of recording [**LexisML fragments**][TERMS] **_represent_** the associated LexisML markup.
This specification defines two means of [**representing**][TERMS] LexisML: [**The LexisML Syntax**][LEXISML] and [**The LexisMD Syntax**][LEXISMD].

A **_root element_** is an [**element**][TERMS] which is not contained by a [**parent element**][TERMS].
The **_root_** of an [**element**][TERMS] is the [**root element**][TERMS] which is an [**ancestor**][TERMS] of the [**element**][TERMS].
A [**LexisML fragment**][TERMS] is said to have **_multiplicity_** if it has more than one [**root element**][TERMS].
The **_fragment root_** of an [**LexisML fragment**][TERMS] without [**multiplicity**][TERMS] is the sole [**root element**][TERMS] of the [**LexisML fragment**][TERMS].
[**LexisML fragments**][TERMS] with [**multiplicity**][TERMS] do not have [**fragment roots**][TERMS].

###  conformance:  ###

> __This section is [**normative**][TERMS].__

A statement is considered **_normative_** if it comprises part of the specification's core prescriptions.
[**Normative**][TERMS] statements are formatted as follows:

> __This is a [**normative**][TERMS] statement.__

In addition, entire sections may be marked as [**normative**][TERMS]; this will be done via a normative statement at their beginning.

Statements which are formatted as notes according to [01 Introduction § typographic conventions][TYPOGRAPHY] are never normative.

When used in normative statements, the key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED",  "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119][KEYWORDS].
For readability, these words are not written in majuscule.

This specification defines conformance requirements for a variety of implementations.
An implementation which meets these requirements is considered **_conforming_**; an implementation which fails to meet these requirements is considered **_non-conforming_**.

A [**LexisML fragment**][TERMS] is [**conforming**][CONFORMANCE] only if it meets all normative requirements for [**LexisML fragments**][TERMS].
A [**LexisML fragment**][TERMS] with [**elements**][TERMS], [**attributes**][TERMS], or [**values**][TERMS] which do not match the normative requirements specifed in this document is [**non-conforming**][CONFORMANCE].

A [**conforming**][CONFORMANCE] [**LexisML fragment**][TERMS] may be considered a [**document**][TERMS] only if it meets all normative requirements for documents.
All [**documents**][TERMS] must be [**conforming**][CONFORMANCE].

An algorithm is [**conforming**][CONFORMANCE] if it produces an equivalent result as the algorithms provided by this specification for all [**conforming**][CONFORMANCE] inputs.
An algorithm need not provide an equivalent result for [**non-conforming**][CONFORMANCE] inputs in order to be considered [**conforming**][CONFORMANCE].

###  dependencies:  ###

> __This section is [**normative**][TERMS].__

This specification is built upon several others:

[**Unicode**][UNICODE]: The following terms are defined in The Unicode Standard:

- **_character_**
- **_code point_**
- **_code unit_**
- **_Unicode string_** (referred to in this specification as simply **_string_**)

[**XML**][XML]: [**LexisML fragments**][TERMS] represented using [**The LexisML Syntax**][LEXISML] must conform to some version of XML, ideally the fifth edition of XML 1.0.
Support for [**XML Namespaces**][XMLNS] may also be desired.

[**URL**][URL]: This specification uses the term **_URL_** as it is defined in the URL specification.

###  microsyntaxes and idioms:  ###

> __This section is [**normative**][TERMS].__

This section defines several idioms and microsyntaxes which will be employed by various parts of this specification.

####  strings  ####

[**Characters**][DEPENDENCY] with [**code points**][DEPENDENCY] in the following ranges or lists of values have special names by which they may be referred in this specification:

- `U+0009 ␉ [HORIZONTAL TAB]`, `U+000A ␊ [LINE FEED]`, `U+000D ␍ [CARRIAGE RETURN]`, `U+0020 ␠ SPACE` : **_space character_**

- `U+0021..U+007E`: **_ASCII character_**

- `U+0030..U+0039`: **_ASCII digit_**

- `U+002B + PLUS SIGN`, `U+002D - HYPHEN-MINUS`, `U+2212 − MINUS SIGN`: **_signum_**

- `U+0041..U+005A`, `U+005F _ LOW LINE`, `U+0061..U+007A`, `U+00C0..U+00D6`, `U+00D8..U+00F6`, `U+00F8..U+02FF`, `U+0370..U+037D`, `U+037F..U+1FFF`, `U+200C..U+200D`, `U+2070..U+218F`, `U+2C00..U+2FEF`, `U+3001..U+D7FF`, `U+F900..U+FDCF`, `U+FDF0..U+FFFD`, `U+10000..U+EFFFF`: **_word initial_**

- `U+002D - HYPHEN-MINUS`, `U+002E . FULL STOP`, `U+0030..U+0039`, `U+0041..U+005A`, `U+005F _ LOW LINE`, `U+0061..U+007A`, `U+00B7 · MIDDLE DOT`, `U+00C0..U+00D6`, `U+00D8..U+00F6`, `U+00F8..U+02FF`, `U+0300..U+037D`, `U+037F..U+1FFF`, `U+200C..U+200D`, `U+203F..U+2040`, `U+2070..U+218F`, `U+2C00..U+2FEF`, `U+3001..U+D7FF`, `U+F900..U+FDCF`, `U+FDF0..U+FFFD`, `U+10000..U+EFFFF`: **_word character_**

*((  Note that [**word initials**][STRINGS] and [**word characters**][STRINGS] match those characters allowed for _NameStartChar_ and _NameChar_, respectively, in [XML][XML], minus the colon (for compatibility with [XML Namespaces][XMLNS])  ))*

An algorithm or syntax is said to **_collapse whitespace_** if every sequence of [**space characters**][STRINGS] is treated as though it were a single `U+0020 ␠ SPACE`.

[**Strings**][DEPENDENCY] are sometimes used to signify other forms of content; the content signified by a [**string**][DEPENDENCY] is its **_interpretation_**.
When a [**string**][DEPENDENCY] is treated as though it were its [**interpretation**][STRINGS], it is said to be **_intepreted as_** its [**interpretation**][STRINGS].
Except where required by this specification, the [**interpretation**][STRINGS] of a non-[**empty**][TERMS] [**string**][DEPENDENCY] is the [**string**][DEPENDENCY] itself.

[**The empty string**][TERMS] must be [**interpreted as**][STRINGS] a lack of [**interpretation**][STRINGS].
Other [**interpretations**][STRINGS] of [**strings**][DEPENDENCY] require that the [**strings**][DEPENDENCY] follow particular microsyntaxes:

- A [**string**][DEPENDENCY] may be [**interpreted as**][STRINGS] a **_word_** if its first [**code point**][DEPENDENCY] is a [**word initial**][STRINGS], and the remaining [**code points**][DEPENDENCY] are [**word characters**][STRINGS]. The [**interpretation**][STRINGS] of a [**word**][TERMS] is the [**string**][DEPENDENCY] itself, but often with additional associated meaning.

- A [**string**][DEPENDENCY] may be [**interpreted as**][STRINGS] a **_word list_** if it is comprised of one or more strings [**interpretable as**][STRINGS] [**words**][TERMS], separated by [**space characters**][STRINGS]. The [**interpretation**][STRINGS] of a [**word list**][STRINGS] is an unordered list of [**words**][STRINGS], forming a complete partition of the [**word list**][STRINGS] along the spaces.

- A [**string**][DEPENDENCY] may be [**interpreted as**][STRINGS] an **_unsigned integer_** if it contains only [**code points**][DEPENDENCY] which are [**ASCII digits**][STRINGS]. The [**interpretation**][STRINGS] of an [**unsigned integer**][STRINGS] is the number in base ten which is signified by the [**string**][DEPENDENCY].

- A [**string**][DEPENDENCY] may be [**interpreted as**][STRINGS] a **_signed integer_** if its first [**code point**][DEPENDENCY] is a [**signum**][STRINGS] or an [**ASCII digit**][STRINGS], and the remaining [**code points**][DEPENDENCY] are all [**ASCII digits**][STRINGS]. The [**interpretation**][STRINGS] of a [**signed integer**][STRINGS] which begins with `U+002B + PLUS SIGN` or an [**ASCII digit**][STRINGS] is the number in base ten which is signified by the [**ASCII digits**][DEPENDENCY] in the [**string**][DEPENDENCY]; the [**interpretation**][STRINGS] of a [**signed integer**][STRINGS] which begins with `U+002D - HYPHEN-MINUS` or `U+2212 − MINUS SIGN` is the number in base ten which is signified by the [**ASCII digits**][DEPENDENCY] in the [**string**][DEPENDENCY], subtracted from the number zero.

[**Strings**][DEPENDENCY] which are required to be [**interpreted as**][STRINGS] one of the above and follow the associated microsyntax are considered **_valid_**. Non-[**valid**][STRINGS] [**strings**][DEPENDENCY] are [**non-conforming**][CONFORMANCE].

####  attributes  ####

For some [**attributes**][TERMS], meaning is associated with the [**elements**][TERMS] they [**belong to**][TERMS] based on their [**presence**][TERMS] or [**absense**][TERMS].
These are referred to by this specification as **_boolean attributes_**.
[**Boolean attributes**][ATTRIBUTES] must be [**empty**][TERMS].

[**Attributes**][TERMS] which are not [**boolean attributes**][ATTRIBUTES] have an **_initial value_**, which is a [**value**][TERMS] associated with them when they are [**absent**][TERMS].
[**Attributes**][TERMS] whose [**initial values**][ATTRIBUTES] are not otherwise defined by this specification have the [**initial value**][TERMS] of [**the empty string**][TERMS]; this may be referred to as **_having no initial value_**.

Some [**attributes**][TERMS] are defined by this specification as only being able to have one of a finite set of [**values**][TERMS]; these are referred to as **_enumerated attributes_**.
The [**values**][TERMS] for which an [**enumerated attribute**][ATTRIBUTES] is [**conforming**][CONFORMANCE] are its **_possible values_**.
Any [**enumerated attribute**][ATTRIBUTES] with a [**value**][TERMS] other than one of its [**possible values**][ATTRIBUTES] is [**non-conforming**][CONFORMANCE].

This specification may define **_default values_** for [**enumerated attributes**][ATTRIBUTES]. A [**value**][TERMS] which is [**the empty string**][TERMS] of an [**enumerated attribute**][ATTRIBUTES] must be [**interpreted as**][STRINGS] the [**default value**][ATTRIBUTES].
[**Non-conforming**][CONFORMANCE] [**values**][TERMS] should also be [**interpreted as**][STRINGS] [**default values**][ATTRIBUTES] when given.
If a [**default value**][ATTRIBUTES] is not given and the [**initial value**][TERMS] for an [**enumerated attribute**][ATTRIBUTES] is not one of its [**possible values**][ATTRIBUTES], the [**enumerated attribute**][ATTRIBUTES] must be [**present**][TERMS].

###  namespaces  ###

This document reserves the [**URL**][DEPENDENCY] `about:lexisml` as **_the LexisML namespace_**.
It is recommended that web browsers and other LexisML processors display a page with information about supported features upon accessing this [**URL**][DEPENDENCY].

[ATTRIBUTES]: 02%20Terminology%20and%20infrastructure.md#attributes "02 Terminology and infrastructure § microsyntaxes and idioms § attributes"
[CONFORMANCE]: 02%20Terminology%20and%20infrastructure.md#conformance "02 Terminology and infrastructure § conformance"
[DEPENDENCY]: 02%20Terminology%20and%20infrastructure.md#dependency "02 Terminology and infrastructure § dependency"
[KEYWORDS]: http://tools.ietf.org/html/rfc2119 "Key words for use in RFCs to Indicate Requirement Levels"
[IDIOMS]: 02%20Terminology%20and%20infrastructure.md#mircosyntaxes-and-idioms "02 Terminology and infrastructure § microsyntaxes and idioms"
[LEXISML]: 06%20The%20LexisML%20Syntax.md "06 The LexisML Syntax"
[LEXISMD]: 07%20The%20LexisMD%20Syntax.md "07 The LexisMD Syntax"
[MIME]: http://tools.ietf.org/html/rfc2046 "Multipurpose Internet Mail Extensions (MIME) Part Two: Media Types"
[NAMESPACES]: 02%20Terminology%20and%20infrastructure.md#namespaces "02 Terminology and infrastructure § namespaces"
[STRINGS]: 02%20Terminology%20and%20infrastructure.md#strings "02 Terminology and infrastructure § microsyntaxes and idioms § strings"
[TERMS]: 02%20Terminology%20and%20infrastructure.md#terminology "02 Terminology and infrastructure § terminology"
[UNICODE]: http://www.unicode.org/versions/latest/ "The Unicode Standard"
[URL]: http://www.w3.org/TR/url/ "URL"
[TYPOGRAPHY]: 01%20Introduction.md#typographic-conventions
[XML]: http://www.w3.org/TR/REC-xml/ "Extensible Markup Language (XML) 1.0 (Fifth Edition)"
[XMLNS]: http://www.w3.org/TR/xml-names/ "Namespaces in XML 1.0 (Third Edition)"
