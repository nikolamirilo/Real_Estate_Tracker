import axios from "axios";
import * as cheerio from 'cheerio';


const defaultImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRbcrj53mGyk-u4JwrIb6z1RBAeCpxR78gfQ&s"

export async function scrapeHaloOffers() {
    try {
        const results = [];
        for (let i = 1; i < 20; i++) {
            const url = `https://www.halooglasi.com/nekretnine/prodaja-stanova?grad_id_l-lokacija_id_l-mikrolokacija_id_l=525206%2C40574%2C535589%2C40787&cena_d_to=150000&cena_d_unit=4&kvadratura_d_from=60&kvadratura_d_unit=1&broj_soba_order_i_from=5&tip_objekta_id_l=387235&page=${i}`;
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);

            // Loop through each product item
            $('div.product-item').each((i, element) => {
                const street = $(element).find('h3.product-title a').text().trim();
                const cityArea = $(element).find('ul.subtitle-places li').eq(1).text().trim();
                const price = $(element).find('div.central-feature span[data-value]').text().trim();
                const pricePerM2 = $(element).find('div.price-by-surface span').text().trim();
                const link = $(element).find('h3.product-title a').attr('href');
                const image = $(element).find('figure.pi-img-wrapper img').attr('src');
                const size = $(element).find('ul.product-features li:contains("Kvadratura") .value-wrapper').text().trim();
                const rooms = $(element).find('ul.product-features li:contains("Broj soba") .value-wrapper').text().trim();
                const floor = $(element).find('ul.product-features li:contains("Spratnost") .value-wrapper').text().trim();
                if(street && cityArea && price && pricePerM2 && link && image){
                results.push({
                    details: `${size} | ${rooms} | ${floor}`,
                    street,
                    cityArea,
                    price: parseInt(price.replace(/[^0-9]/g, ''), 10),
                    pricePerM2: parseInt(pricePerM2.replace(/[^0-9]/g, ''), 10),
                    link: `https://www.halooglasi.com${link}`,
                    image: image ? image : defaultImage,
                });
            }
            });
        }
        console.log(results)
        return results;
    } catch (error) {
        console.error('Error scraping data:', error);
    }
}
