const axios = require('axios')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const getProductURL = (product_id) => `https://www.amazon.com/gp/product/ajax/ref=dp_aod_NEW_mbc?asin=${product_id}&m=&smid=&sourcecustomerorglistid=&sourcecustomerorglistitemid=&sr=&pc=dp&experienceId=aodAjaxMain`

async function getPrices(product_id) {
    const productUrl = getProductURL(product_id);
    const { data } = await axios.get(productUrl, {
        headers: {
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            Host: 'www.amazon.com',
            Pragma: 'no-cache',
            TE: 'Trailers',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
            'upgrade-insecure-requests': 1,
        },
    });
    const dom = new JSDOM(data);

    const $ = (selector) => dom.window.document.querySelector(selector);
    const title = $('#aod-asin-title-text').textContent.trim();
    const pinnedElement = $('#pinned-de-id');
    const pinnedPrice = pinnedElement.querySelector('.a-price .a-offscreen').textContent;
    const pinnedShippedFrom = pinnedElement.querySelector('#aod-offer-shipsFrom .a-col-right .a-size-small').textContent;
    const pinnedSoldBy = pinnedElement.querySelector('#aod-offer-soldBy .a-col-right .a-size-small').textContent;
    //const pinnedDelivery_message = pinnedElement.querySelector('#delivery-message').textContent.trim();
    const offerListElement = $('#aod-offer-list');
    const offerElements = offerListElement.querySelectorAll('.aod-information-block');
    const offers = [];
    offerElements.forEach((offerElement) => {
        const Price = offerElement.querySelector('.a-price .a-offscreen').textContent;
        const ShippedFrom = offerElement.querySelector('#aod-offer-shipsFrom .a-col-right .a-size-small').textContent;
        const SoldBy = offerElement.querySelector('#aod-offer-soldBy .a-col-right .a-size-small').textContent;
        //const delivery_message = offerElement.querySelector('#delivery-message').textContent.trim();
        offers.push({
            Price,
            ShippedFrom,
            SoldBy,
            //delivery_message,
        })
    })
    const pinned = {
        price: pinnedPrice,
        ships_from: pinnedShippedFrom,
        soldBy: pinnedSoldBy,
        //deliveryMessage: pinnedDelivery_message.replace(/\s+/g, ' ').replace('Details', '').trim(),
    }
    const result = {
        title,
        pinned,
        offers,
    };
    console.log(result)

}

getPrices('B00TFYYWQA');