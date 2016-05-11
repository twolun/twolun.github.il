---
layout: post
title: Python正则表达式入门
category: knowledge
---

####Introduction:
In Python a regular expression search is typically written as:
    
    match = re.search(pat, str)

After search always have a if-statement, following example which searches for the pattern 'word:' followed by a 3 letter word (details below):

	str = 'an example word:cat!!'
	match = re.search(r'word:\w\w\w', str)
	# If-statement after search() tests if it succeeded
	if match:                      
	    print 'found', match.group() ## 'found word:cat'
	else:
	    print 'did not find'

<!--more-->

The code match = re.search(pat, str) stores the search result in a variable named "match". Then the if-statement tests the match -- if true the search succeeded and match.group() is the matching text (e.g. 'word:cat'). 

The 'r' at the start of the pattern string designates a python "raw" string which passes through backslashes without change which is very handy for regular expressions (Java needs this feature badly!). I recommend that you always write pattern strings with the 'r' just as a habit.

####Basic pattern:
**a, X, 9, <** -- ordinary characters just match themselves exactly. The meta-characters which do not match themselves because they have special meanings are: **. ^ $ * + ? { [ ] \ | ( )** (details below)

**.** (a period) -- matches any single character except newline '\n'

**\w** -- (lowercase w) matches a "word" character: a letter or digit or underbar [a-zA-Z0-9_]. Note that although "word" is the mnemonic for this, it only matches a single word char, not a whole word. \W (upper case W) matches any non-word character.

**\b** -- boundary between word and non-word

**\s** -- (lowercase s) matches a single whitespace character -- space, newline, return, tab, form [ \n\r\t\f]. \S (upper case S) matches any non-whitespace character.

**\t, \n, \r** -- tab, newline, return

**\d** -- decimal digit [0-9] (some older regex utilities do not support but \d, but they all support \w and \s)

**^ = start, $ = end** -- match the start or end of the string

**\\** -- inhibit the "specialness" of a character. So, for example, use \. to match a period or \\ to match a slash. If you are unsure if a character has special meaning, such as '@', you can put a slash in front of it, \@, to make sure it is treated just as a character.

####Repetion
Things get more interesting when you use + and * to specify repetition in the pattern
**+** -- 1 or more occurrences of the pattern to its left, e.g. 'i+' = one or more i's
***** -- 0 or more occurrences of the pattern to its left
**?** -- match 0 or 1 occurrences of the pattern to its left

####Moe detail:
You can find more detail in my another blog in CSDN Blog, also you can find it in Google Developers.
- [1]CHN Version: http://blog.csdn.net/tao_sun/article/details/18794057
- [2]EN-US Version: https://developers.google.com/edu/python/regular-expressions