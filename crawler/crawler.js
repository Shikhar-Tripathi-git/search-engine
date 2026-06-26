const cheerio=require("cheerio");

async function main() {

    const pages = await crawl("https://books.toscrape.com");

    console.log(pages);

}

main();

async function crawl(seedUrl) {                                         //Crawl Function helps to retrieve information from webPages

    const queue = [];                                               //Queue is used to store all links in line to be crawled
    const visited = new Set();                                      //Keeps track of all crawled websites to prevent infinite loops
    const seedDomain = new URL(seedUrl).hostname;                   //Domain of original url
    const MAX_PAGES = 100;                                          //Size Limit for number of pages crawled

    visited.add(seedUrl);                                               //We initialise BFS , we first add it to visited set
    queue.push(seedUrl);                                                //Add it to queue to be crawled

    while(queue.length>0){
        const currentUrl = queue.shift();                               //queue.shift acts as dequeue and we store it while removing it from queue
        const html = await crawlPage(currentUrl);                       //We download the HTML
        const links = extractLinks(html);                               //We extract all links from said HTML and store it in array
        for(const href of links){                                       //For Each link we follow architecture

            if(visited.size >= MAX_PAGES)
                return visited;

            const normalisedLink = normalizeURL(href, currentUrl);      //Normalise the link
            console.log("Currently Crawling:", currentUrl);
            if(!normalisedLink){                                        //InCase normalisedLink is null, it would have crashed next line, thus we add this as safeguard
                continue;
            }

            const canonicalisedLink = canonicalizeURL(normalisedLink);  //We canonicalise the link just in case

            if(!visited.has(canonicalisedLink) && filterURL(canonicalisedLink, seedDomain)){
                visited.add(canonicalisedLink);
                queue.push(canonicalisedLink);
            }
        }
    }
    return visited;
}

async function crawlPage(url) {                                         //Used to Download HTML from URL

    const response = await fetch(url);
    const html = await response.text();
    return html;

}

function extractLinks(html){                                  //Helper function to extract all links from html 

    const links = [];
    const $ = cheerio.load(html);

    $("a").each((index, element) => {

        const href=$(element).attr("href");

        if (!href)                                                  //To discard obvious garbage href values, such as href="" or missing href
            return;

        links.push(href);
    })

    return links;
}

function normalizeURL(href, baseURL) {
    try {
        return new URL(href, baseURL).href;                         //Built in URL class returns absolute url or null in case of any error
    } catch {
        return null;
    }
}

function canonicalizeURL(url){                                      //We canonicalize the url, i.e remove fragents from url

    const parsed = new URL(url);

    parsed.hash = "";

    return parsed.href;

}

function filterURL(url, seedDomain) {                               //seedDomain is hostname of original seed url, i.e: for www.example.com then example.com is hostname
    if (!url) {                                                     //If url is null because normalisation failed
        return false;
    }

    if (url.startsWith("mailto:")) {                                //If url is someones mailId
        return false;
    }

    if (url.startsWith("javascript:")) {                            //If url is a js
        return false;
    }

    if (url.startsWith("tel:")) {                                   //If url is a telephone number
        return false;
    }

    const domain = new URL(url).hostname;                           //Site Crawler logic: Only crawls same domain links
    if (domain !== seedDomain) {
        return false;
    }

    return true;                                                    //Else we crawl the url
}