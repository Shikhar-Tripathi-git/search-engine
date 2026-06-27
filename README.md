# Search Engine From Scratch

A search engine built completely from scratch in **Node.js** to understand how real search engines work internally. This project focuses on Information Retrieval, Search Engine Architecture, Backend Engineering, and scalable software design rather than relying on existing search libraries.

---

# Objectives

* Build an inverted index from scratch
* Implement Boolean Retrieval
* Support Exact Phrase Search
* Rank documents using TF-IDF
* Crawl websites using a BFS Web Crawler
* Build a modular and reusable search engine architecture
* Stream documents directly from the crawler into the search engine

---

# Tech Stack

* JavaScript (Node.js)
* Cheerio (HTML Parsing)
* BFS Web Crawling
* Inverted Index
* TF-IDF Ranking

---

# Features

### Search Engine

* Document Tokenization
* Positional Inverted Index
* Boolean AND Retrieval
* Phrase Search
* TF-IDF Ranking
* Streaming Document Indexing

### Web Crawler

* Breadth First Search (BFS)
* Relative URL Resolution
* URL Normalization
* URL Canonicalization
* Same-Domain Crawling
* HTML Parsing using Cheerio
* Visible Text Extraction
* Streaming Document Production

---

# High Level Architecture

```
                    User

                     │

                     ▼

            webSearchEngine.js

                     │

        ┌────────────┴────────────┐

        ▼                         ▼

   crawler.js              searchEngine.js

        │                         │

Produces Documents        Consumes Documents
```

The crawler and search engine are completely independent modules.

`webSearchEngine.js` acts as the orchestration layer that connects the producer (crawler) with the consumer (search engine).

---

# Search Engine Architecture

```
                Query

                  │

                  ▼

           processQuery()

                  │

                  ▼

      intersectPostingLists()

                  │

                  ▼

       performPhraseSearch()

                  │

                  ▼

          rankDocuments()

                  │

                  ▼

            Search Results
```

The `search()` function is an orchestrator that delegates work to smaller helper functions following the Single Responsibility Principle.

---

# Indexing Pipeline

```
Document

    │

    ▼

Tokenization

    │

    ▼

Positional Inverted Index

    │

    ▼

Searchable Engine
```

Every document is indexed independently through `indexDocument()`, allowing both batch and streaming indexing.

---

# Crawling Pipeline

```
Seed URL

    │

    ▼

Download HTML

    │

    ▼

Parse DOM

    │

    ▼

Create Document

    │

    ▼

onDocument(document)

    │

    ▼

Search Engine
```

The crawler produces documents as they are discovered. The callback-based architecture keeps the crawler independent of the search engine.

---

# Current Project Structure

```
Search-Engine/

├── crawler/
│   └── crawler.js
│
├── searchEngine/
│   └── searchEngine.js
│
├── webSearchEngine/
│   └── webSearchEngine.js
│
├── documents/
│
├── handbook/
│
├── README.md
├── package.json
└── .gitignore
```

---

# Concepts Implemented

* Tokenization
* Positional Inverted Index
* Boolean Retrieval
* Phrase Search
* TF-IDF Ranking
* Breadth First Search
* HTML Parsing
* URL Normalization
* URL Canonicalization
* Streaming Indexing
* Closures
* Factory Pattern
* Single Responsibility Principle
* Low Coupling
* Producer–Consumer Architecture

---

# Future Improvements

* Stop Word Removal
* Stemming
* BM25 Ranking
* Wildcard Queries
* Fuzzy Search
* PageRank
* Incremental Re-indexing
* Snippet Generation
* Parallel Crawling
* Distributed Indexing

---

# Learning Outcome

This project is intentionally built from first principles to understand how production search engines are architected rather than simply using existing libraries.
