# Search Engine Learning Notes

## Concepts Learned

### Document Ingestion
Reading files from disk into memory.

### Tokenization
Breaking text into searchable words.

### Inverted Index
Word -> Documents mapping.

Example:

java -> doc1, doc3
python -> doc2

### Single Word Search
HashMap lookup using inverted index.

##Sorting (for ascending)
queryTokens.sort(
    (a,b) => index[a].size - index[b].size
);
If result < 0:
    a before b
If result > 0:
    b before a

##Object.keys

new Set(Object.keys(index["java"]))
Object.keys returns only doc names, and not their freq
eg Set { "doc1", "doc2" }

## Ranking 
Score = Sum of frequencies of all query terms
Find matching docs
↓
Compute score
↓
Sort by score
↓
Display results

## Inverse Document Frequency

rarer words useddin documents i.e word used in only 2 do out of 100 is more informative thus is given higher idf score
DF: Object.keys(index["java"]).length
const N = documents.length;
IDF = log(N / DF)

Combinging TF IDF
TF-IDF = TF × IDF

## Implementation of phrase search and boolean search
By boolean search, if input query is java backend, we find docs that contain both toens irrespective of their index,
but when input is "java backend", we do a phrase search which is more restrictive and only returns docs that contain that exact phrase
thus we implement both in our search engine

We still do boolean search while doing phrase search
Intersection is a cheap filter.
Phrase verification is more expensive.
Search engines almost always do the cheap work first.
This Is Called Candidate Filtering
Think of it like airport security.
Everyone enters:
1,000,000 docs
↓
Security checkpoint:
Contains all words?
↓
Only:
400 docs
↓
Detailed inspection:
Does the exact phrase exist?
↓
Final results.

## Web Crawler
Responsibilities of the crawler

It should:

✅ Visit URLs

✅ Download HTML

✅ Extract useful text

✅ Discover more links

✅ Avoid duplicates

✅ Respect limits

## HTML PARSER
we need only 2 things from a http response, useful text and links
we dont need tags like <title>, etc. so we need to use parser, the text will go to indexer and the link will go to the crawler queue for further crawling
We use cheerio for html parsing
cheerio essentialy helps to convert html to a dom tree, which we can traverse to find exact tags
eg: $("p") gives all p tags in html

## URL Normalisation
We encounter various links on a webpaage that we extract using 

$("a").each((index, element) => {
    const href = $(element).attr("href");
    console.log(href);
});

now we might get diffeent types of local and complete urls
But before adding it to queue, we normalise it so that when accessing queue, ccrawler has an absolute url that it can go to
instead of just extracting a link and adding it to queue

we use

 const absoluteUrl = new URL(href, currentPageUrl).href;

## Canonicalization of URL
What does # really mean?
Everything after # is called the fragment.
The browser uses it only for navigation after the page has already been downloaded.
Instead of rejecting:
https://example.com/products#laptops
convert it to:
https://example.com/products
Now
✅ We don't crawl the page twice.
✅ We don't lose the page entirely.
✅ We have one canonical URL.
This is called URL Canonicalization

## SRP Single Responsibility Principle
Every module has only one responsibility which ensures ease of understanding and debugging.
Low coupling

## Batch Indexing
This is called batch indexing because the entire collection of documents is available before the search engine is created.

## Stream Indexing
Now imagine the crawler.
It doesn't download 10,000 pages instantly.
Instead it discovers pages one by one.