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

const index={};

for(const document of documents){                                           //Accessing Each object in Documents ( We use of instead of in because in gives indexes, eg: 0, 1, 2)
    const optimisedContent=document.content.toLowerCase().replace(".","");  //Converting content by removing punctuation and to lowercase to stardadise tokens
    const words=optimisedContent.split(" ");                                //Creating tokens

    document.words=words;                                                   //Adding new property to document object

    for(const word of document.words){                                      //Accessing each word to create an inverted index
        if(!index[word]){                                                   //If word does not exist in index, we create an index
            index[word]=new Set();                                          //We use a set because for each doc name, we want it to appear once irrespective of number of same words
        }
        index[word].add(document.name);                                     //We add doc name onto the set of index
    }
}

const query = "java backend programming";
const queryTokens = [...new Set(query.toLowerCase().split(" "))];          //We tokenise multi word query and insert it into a set to remove duplicate tokens, then convert back to array using [...set]

for(const token of queryTokens){                                           //This ensures that we return appropriate message if token doesnt exist in index
    if(!index[token]){
        console.log("No matching doc");
        return;
    }
}

queryTokens.sort(                                                          //We sort this first to ensure first token has least index size so that we loop the least number of times while finding intersections
    (a,b) => index[a].size - index[b].size
);

let result = new Set(index[queryTokens[0]]);                               //We set result as first query token because an empty set o intersection would give empty set, so useless 

for(let i = 1; i < queryTokens.length; i++) {                              //Traversing all other tokens remaining
    const current = index[queryTokens[i]];                                 //We store next set of docs containing the token into current
    const intersection = new Set();

    for(const doc of result) {                                             //We iterate through docs of result and check if they exist in current as well
        if(current.has(doc)) {                                             //If they exist then both tokens exist in this doc
            intersection.add(doc);
        }
    }

    result = intersection;                                                 //We get result as intersection of 2 docs
}

console.log("Results Found: ",result.size);
let count=1;
for(const res of result){
    console.log("\n",count,".) ",res);
    count+=1;
}