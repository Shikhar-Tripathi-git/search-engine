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

const query="JaVa";
const search=query.toLowerCase();
if(index[search]){
    console.log(index[search])
}
else{
    console.log("Doc not found");
}