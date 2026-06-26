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