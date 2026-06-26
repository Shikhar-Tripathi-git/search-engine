const cheerio=require("cheerio");

async function crawl(url) {                                         //Crawl Function helps to retrieve information from webPages
    const response = await fetch(url);                              // We use await as we dont want to stop program execution 
    const html = await response.text();                             //response returns an json object containing http response that is converted to text 

    const $ = cheerio.load(html);

    console.log("Title:", $("title").text());
    console.log("Heading:", $("h1").text());
    console.log("First Link:", $("a").attr("href"));
}

crawl("https://example.com");