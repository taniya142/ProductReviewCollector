const puppeteer = require('puppeteer');
const fs = require("fs");

let websiteUrl = "https://www.flipkart.com/";
let loginCrossButton = "._2KpZ6l._2doB4z";
let typeItemInFlipkart = "._3OO5Xc";
let searchButtonInFlipkart = ".L0Z3Pu";
let typeItemInYoutube = "[slot='search-input']"
let starsSelector = "._3LWZlK";

let videoLink = ".yt-simple-endpoint.style-scope.ytd-video-renderer";

let categories = ["Laptops", "Mobile Phones", "Television","Camera"]
// let categories = ["Laptops"]

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
        let allStars = document.querySelectorAll("._3LWZlK");

        let stars = [];

        for (let i = 0; i < 5; i++) {
            stars.push(allStars[i].innerText);
        }

        let allItems = document.querySelectorAll("._4rR01T");

        let items = [];
        for (let i = 0; i < 5; i++) {
            items.push(allItems[i].innerText);
        }

        // console.log(stars);
        return { stars, items };
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

    
    let links = await youtubePage.evaluate(function () {
        let allLinks = document.querySelectorAll(".yt-simple-endpoint.style-scope.ytd-video-renderer");

        let links = [];

        for (let i = 0; i < 10; i++) {
            if(i%2==0){
                links.push("https://www.youtube.com" + allLinks[i].getAttribute('href'));
            }
            
        }

        // console.log(links);
        return links;
    });
    
    return links;
    // console.log(links);
    
}

function openWebsite() {
    (async function () {
        const browser = await puppeteer.launch({
            headless: false,
            slowMo: 50,
            defaultViewport: null,
            args: ["--start-maximized", '--disable-web-security', "--user-data-dir=C:\\Users\\taniy\\Desktop\\test"],
        });
        let page = await browser.newPage();
        await page.setBypassCSP(true)

        await page.goto(websiteUrl);

        // await page.click(loginCrossButton);

        let arr = [];
        for (let i = 0; i < categories.length; i++) {
            arr.push(await doForCategory(page, categories[i]));
        }

        // nextPage---for youtube
        let youtubePage = await browser.newPage();
        await youtubePage.setBypassCSP(true)

        await youtubePage.goto("https://www.youtube.com/");
        
        let final_links = []
        for (let i = 0; i < categories.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            final_links.push(await searchOnYoutube(youtubePage, arr[i][j].items + " review"));
        }
    }

    fs.writeFileSync("star_and_item_data.json", JSON.stringify(arr));
    fs.writeFileSync("youtube_links", JSON.stringify(final_links));

    })();

    
}

openWebsite();
