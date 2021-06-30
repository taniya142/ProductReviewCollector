const puppeteer = require('puppeteer');
const fs = require("fs");

let websiteUrl = "https://www.flipkart.com/";
let loginCrossButton = "._2KpZ6l._2doB4z";
let typeItemInFlipkart = "._3OO5Xc";
let searchButtonInFlipkart = ".L0Z3Pu";
let typeItemInYoutube = "[slot='search-input']"
let starsSelector = "._3LWZlK";

let videoLink = ".yt-simple-endpoint.style-scope.ytd-video-renderer";

let categories = ["Laptops", "Mobile Phones", "Television","Camera","Microwave"]
// let categories = ["Mobile Phones"];

async function doForCategory(page, category) {
    let searchInput = await page.$(typeItemInFlipkart);
    await searchInput.click({ clickCount: 3 });
    await searchInput.press('Backspace');

    await page.waitForSelector(typeItemInFlipkart);
    await page.click(typeItemInFlipkart);

    await page.waitForSelector(typeItemInFlipkart);
    await page.type(typeItemInFlipkart, category);

    await Promise.all([page.click(searchButtonInFlipkart), page.waitForNavigation()]);

    await page.waitForSelector("._3LWZlK");


    let result = await page.evaluate(function () {

        
        let finalResultForCategory = [];

        for(let i = 0; i < 5; i++) {
            finalResultForCategory.push({});
        }

        let allStars = document.querySelectorAll("._3LWZlK");


        for (let i = 0; i < 5; i++) {
            finalResultForCategory[i].stars = allStars[i].innerText + " stars";
        }

        let allTitles = document.querySelectorAll("._4rR01T");

    
        for (let i = 0; i < 5; i++) {
            finalResultForCategory[i].title = allTitles[i].innerText;
        }

        let allImages = document.querySelectorAll("._2QcLo- img");

        for (let i = 0; i < 5; i++) {
            finalResultForCategory[i].images = allImages[i].getAttribute("src");
        }

        // console.log(stars);
        return finalResultForCategory;
    });

    // console.log(result);
    return result;

}

async function searchOnYoutube(youtubePage, categoryItem) {
    let searchInput = await youtubePage.$(typeItemInYoutube);
    await searchInput.click({ clickCount: 3 });
    await searchInput.press('Backspace');

    await youtubePage.waitForSelector(typeItemInYoutube);
    await youtubePage.click(typeItemInYoutube);

    await youtubePage.waitForSelector(typeItemInYoutube);
    await youtubePage.type(typeItemInYoutube, categoryItem);

    await Promise.all([youtubePage.click("#search-icon-legacy"), youtubePage.waitForNavigation()]);

    await youtubePage.waitForSelector(typeItemInYoutube);
    await youtubePage.click(typeItemInYoutube);

    await youtubePage.waitForSelector(videoLink);

    
    let youtube_links = await youtubePage.evaluate(function () {
        let allLinks = document.querySelectorAll(".yt-simple-endpoint.style-scope.ytd-video-renderer");

        let links = [];

        for (let i = 0; i < 5; i++) {
            if(i%2==0){
                links.push("https://www.youtube.com" + allLinks[i].getAttribute('href'));
            }
            
        }

        // console.log(links);
        return links;
    });
    
    return youtube_links;
    // console.log(links);
    
}

function openWebsite() {
    (async function () {
        const browser = await puppeteer.launch({
            headless: false,
            slowMo: 60,
            defaultViewport: null,
            args: ["--start-maximized", '--disable-web-security', "--user-data-dir=C:\\Users\\taniy\\Desktop\\test"],
        });
        let page = await browser.newPage();
        await page.setBypassCSP(true)

        await page.goto(websiteUrl);

        // await page.click(loginCrossButton);

        let arr = [];

        // for(let i=0;i<categories.length;i++){
        //     arr.push(categories[i]);
        // }
        for (let i = 0; i < categories.length; i++) {
            arr.push({
                category:categories[i],
                items:await doForCategory(page, categories[i])
            });
        }

        // nextPage---for youtube
        let youtubePage = await browser.newPage();
        await youtubePage.setBypassCSP(true)

        await youtubePage.goto("https://www.youtube.com/");
        
        for (let i = 0; i < categories.length; i++) {
        for (let j = 0; j < arr[i].items.length; j++) {
            arr[i].items[j].links = await searchOnYoutube(youtubePage, arr[i].items[j].title + " review");
        }
    }
    
    fs.writeFileSync("data.json", JSON.stringify(arr));

    })();

    
}

openWebsite();
