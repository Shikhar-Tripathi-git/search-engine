const fs=require("fs");                                 //Importing files module
const { SocketAddress } = require("net");
const path=require("path");                             //Importing Path module

const documentPath=path.join(__dirname,"documents");    //path.join joines current directory name with documents folder to give path of documents folder
const fileNames=fs.readdirSync(documentPath);           //We use readdirSync to read all the content inside a folder i.e documentPath

const documents = [];                                   //We need to load files from disk to memory to access its fileName and Content, thus we need array of objects
for(const fileName of fileNames){                       //FileNames contains list of all files in documents, accessing them one by one

    const filePath=path.join(documentPath,fileName);    //To read content of file, we need filepath, filename contains (doc1.txt) thus we need documentPath as well
    const content=fs.readFileSync(filePath, "utf-8");   //We read Content of each file, we use utf-8 to convert data from binary to alphabets

    const document = {                                  //Creating object for each file
        name: fileName,
        content: content
    };

    documents.push(document);                           //Creating array of objects for all files
}                                                       //DOCUMENT INGESTION COMPLETED

const index={};                                                             //Creating INVERTED INDEX

for(const document of documents){                                           //Accessing Each object in Documents ( We use of instead of in because in gives indexes, eg: 0, 1, 2)
    const optimisedContent=document.content.toLowerCase().replace(/[^\w\s]/g, "");  //Converting content by removing punctuation and to lowercase to stardadise tokens
    const words=optimisedContent.split(" ");                                //Creating tokens

    document.words=words;                                                   //Adding new property to document object

    for(let idx=0; idx<document.words.length; idx++){                       //Accessing each word to create an inverted index
        const word=document.words[idx];
        if(!index[word]){                                                   //If word does not exist in index, we create an index
            index[word]={};                                                 //We use a map for docname: position because it allows us to search for a phrase
        }
        if(!index[word][document.name]){                                    //If first time encountering doc name for a keyword, create array with index
            index[word][document.name]=[idx];
        }                                    
        else{
            index[word][document.name].push(idx);                           //Else push index into array
        }
    }
}

let query = "java backend programming";

const isPhraseQuery =                                                       //We check if Query is phrase query or not by hard checking presence of ""
    query.startsWith('"') &&                                                //If yes, we check for presence of phrases instead of just presence in doc
    query.endsWith('"');

if(isPhraseQuery){
    query = query.slice(1, -1);
}

const queryTokens = [...new Set(query.toLowerCase().split(" "))];          //We tokenise multi word query and insert it into a set to remove duplicate tokens, then convert back to array using [...set]

for(const token of queryTokens){                                           //This ensures that we return appropriate message if token doesnt exist in index
    if(!index[token]){
        console.log("No matching doc");
        return;
    }
}

queryTokens.sort(                                                           //We sort this first to ensure first token has least index size so that we loop the least number of times while finding intersections
    (a,b)=>
        Object.keys(index[a]).length -
        Object.keys(index[b]).length
);

let result = new Set(Object.keys(index[queryTokens[0]]));                  //We set result as first query token because an empty set o intersection would give empty set, so useless 

for(let i = 1; i < queryTokens.length; i++) {                              //Traversing all other tokens remaining
    const current = index[queryTokens[i]];                                 //We store next set of docs containing the token into current
    const intersection = new Set();

    for(const doc of result) {                                             //We iterate through docs of result and check if they exist in current as well
        if(current[doc]) {                                                 //If they exist then both tokens exist in this doc
            intersection.add(doc);
        }
    }

    result = intersection;                                                 //We get result as intersection of 2 docs
}

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

if(isPhraseQuery){

    const phraseResults = new Set();                                            //We make a new Set to store all docs that contain the phrase

    for(const doc of result){                                                   // For each Document that contains all query words such that eg: doc1: [1, 5, 6]

        let matchedPositions = index[queryTokens[0]][doc];                      // We take first query token document positional array as base for matchingPositions

        for(let i = 1; i < queryTokens.length; i++){

            const currentPositions = index[queryTokens[i]][doc];                // Retreive next query token positional array in the same doc to check index1, index2
            matchedPositions = findMatchingPositions( matchedPositions, currentPositions);          // We get new matchedPosition using helper function that returns last index of phrase

            if(matchedPositions.length === 0){                                  // If it is empty then phrase does not exist
                break;                                                          // Phrase can no longer be extended.
            }
        }

        if(matchedPositions.length > 0){                                        // If not empty then add it to another set where phrase exists
            phraseResults.add(doc);
        }
    }

    result = phraseResults;                                                     // To make sure result stores final 
}

const rankedResults = [];                                                  //Term frequency x Inverse Document Frequency Ranking
const n = documents.length;

for(const doc of result){                                                  //Now from the documents in result set, we use tf x idf that is, we score each document on basis of repetition of tokens and rarity of token
    let score=0;
    for(const token of queryTokens){
        const tf = index[token][doc].length;
        const df = Object.keys(index[token]).length;
        const idf=Math.log(n/df);
        score += tf*idf;
    }

    rankedResults.push({                                                    //We use array of objects to store docName and its score corresponding to the query
        name: doc,
        tfIdfScore: score 
    });
}

rankedResults.sort(                                                         //We sort the results to get the ideal doc on the top
    (a,b)=> b.tfIdfScore - a.tfIdfScore
);

console.log("Results Found: ",result.size);
let count=1;
for(const res of result){
    console.log("\n",count,".) ",res);
    count+=1;
}