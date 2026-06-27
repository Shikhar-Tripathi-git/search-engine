function findMatchingPositions(previousPositions, currentPositions){        //This function allows us to check if index2==index1+1 exists so to form a phrase, using a two pointer approach

    let i = 0;                                                              //We take 2 position array as input and check for existence of index2==index1+1, if yes, phrase exists, now it can be compared with upcoming tokens
    let j = 0;
    const matched = [];                                                       //Phrase QUery Helper Function

    while(i < previousPositions.length && j < currentPositions.length){

        if(currentPositions[j] === previousPositions[i] + 1){
            matched.push(currentPositions[j]);
            i++;
            j++;
        }
        else if(currentPositions[j] < previousPositions[i] + 1){
            j++;
        }
        else{
            i++;
        }
    }
    return matched;
}

function createSearchEngine(documents = []){                                //Library used to modularise the complete pipeline

    const index = {};                                                       //Creating invertedIndex
    let documentCount = 0;

    for(const document of documents){                                       //Accessing Each object in Documents ( We use of instead of in because in gives indexes, eg: 0, 1, 2)
        indexDocument(document);                                            //If document is empty, loop doesnt run, we are stream Indexing, but if document contains all docs then we are batch indexing using loop
    }

    function search(query){                                                 //Since search requires documents and query, thus it is kept inside the createSearchEngine

        const {isPhraseQuery, queryTokens} = processQuery(query);           //We check if query passed is a phraseQuery and, collect the tokens

        let result = intersectPostingLists(queryTokens);                    //We receive documents array that contan all tokens

        if(result.size===0){                                                //If no such document exists, we return empty array
            return [];
        }

        if(isPhraseQuery){                                                  //We perform phraseSearch if given by user, else booleanSearch is already done and stored in result
            result = performPhraseSearch(result, queryTokens);
        }

        return rankDocuments(result, queryTokens);                          //We rank the documents on basis of highest tf-idf score to return best matching document at the top
    }

    function processQuery(query){

        const isPhraseQuery =                                               //Check if query is a phrase query by ""
            query.startsWith('"') &&
            query.endsWith('"');

        if(isPhraseQuery){                                                  //If yes then we remove the "" to better operate on them while tokenising
            query = query.slice(1,-1);
        }

        const queryTokens = [...new Set(query.toLowerCase().split(" "))];   //Convert query to lowercase and split to tokenise and convert back to an array, we use set to Remove duplicate query terms so repeated words don't affect

        return {
            isPhraseQuery,
            queryTokens
        };
    }

    function intersectPostingLists(queryTokens){                            //We find which all documents contain given token by intersecting

        for(const token of queryTokens){                                    //If token doesnt exist in any document, then we add an empty set to avoid error while sorting
            if(!index[token]){
                return new Set();
            }
        }

        queryTokens.sort(                                                   //We sort the queryTokens array to make sure the first token appears in least number of doc to keep as base for result
            (a,b)=>
                Object.keys(index[a]).length -
                Object.keys(index[b]).length
        );

        let result = new Set(Object.keys(index[queryTokens[0]]));           //We make a new set with first token documents as base

        for(let i=1;i<queryTokens.length;i++){

            const current=index[queryTokens[i]];
            const intersection=new Set();

            for(const doc of result){

                if(current[doc]){
                    intersection.add(doc);
                }
            }
            result=intersection;
        }
        return result;                                                     //We receive documents which contain all tokens
    }

    function performPhraseSearch(result, queryTokens){

        const phraseResults = new Set();

        for(const doc of result){

            let matchedPositions = index[queryTokens[0]][doc];          //We get positional index array of first token in doc as base

            for(let i=1;i<queryTokens.length;i++){

                const currentPositions = index[queryTokens[i]][doc];   //We take next token to check for phrase
                matchedPositions = findMatchingPositions(matchedPositions, currentPositions);

                if(matchedPositions.length===0){                        //We check if any such index2==index1+1 positions exist
                    break;
                }
            }

            if(matchedPositions.length>0){                              //If there are any existing phrases, then we take that doc as result
                phraseResults.add(doc);
            }
        }
        return phraseResults;
    }

    function rankDocuments(result, queryTokens){

        const rankedResults=[];

        for(const doc of result){

            let score=0;

            for(const token of queryTokens){

                const tf=index[token][doc].length;                          //Term Frequency is the number of times a token appears in a specific doc
                const df=Object.keys(index[token]).length;                  //Document Frequency of token is number of documents that contain the token
                const idf=Math.log(documentCount/df);                                   //Inverse Document Frequency

                score += tf*idf;

                console.log({
                    token,
                    tf,
                    df,
                    n: documentCount,
                    idf: Math.log(documentCount / df)
                });
            }

            rankedResults.push({
                name:doc,
                tfIdfScore:score
            });
        }

        rankedResults.sort(                                                 //Sorting rank in descending order
            (a,b)=>b.tfIdfScore-a.tfIdfScore
        );

        return rankedResults;
    }

    function indexDocument(document){

        const optimisedContent=document.content.toLowerCase().replace(/[^\w\s]/g, "");  //Converting content by removing punctuation and to lowercase to stardadise tokens
        const tokens=optimisedContent.split(" ");                                //Creating tokens

        for(let idx=0; idx<tokens.length; idx++){                       //Accessing each word to create an inverted index

            const word = tokens[idx];
            if(!index[word]){                                                   //If word does not exist in index, we create an index
                index[word]={};                                                 //We use a map for docname: position because it allows us to search for a phrase
            }
            if(!index[word][document.id]){                                    //If first time encountering doc name for a keyword, create array with index
                index[word][document.id]=[idx];
            }                                    
            else{
                index[word][document.id].push(idx);                           //Else push index into array
            }
        }
        documentCount++;
    }

    return{                                                                 //Returning engine object
        search,
        indexDocument
    };
}

module.exports = createSearchEngine;