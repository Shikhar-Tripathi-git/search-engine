const createSearchEngine = require("../searchEngine/searchEngine.js");
const crawl = require("../crawler/crawler.js");

async function main(){

    const engine = createSearchEngine();
    const seedUrl="https://books.toscrape.com";

    await crawl(seedUrl, document => {
        engine.indexDocument(document);
    });

    console.log(engine.search("You Are What You"));
}

main();