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