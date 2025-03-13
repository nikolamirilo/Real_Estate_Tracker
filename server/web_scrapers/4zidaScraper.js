import axios from "axios";
import * as cheerio from 'cheerio';



export async function scrape4zidaOffers() {
    try {
        const results = [];
        for (let i = 1; i < 50; i++) {
            const url = `https://www.4zida.rs/prodaja-stanova/surcin-surcin-opstina-beograd/dvoiposoban/do-180000-evra?mesto=ledine-surcin-opstina-beograd&mesto=zemun-zemun-opstina-beograd&mesto=banovo-brdo-cukarica-cukarica-opstina-beograd&mesto=vidikovac-rakovica-opstina-beograd&mesto=stari-kosutnjak-rakovica-opstina-beograd&mesto=kosutnjak-cukarica-cukarica-opstina-beograd&mesto=novi-beograd-beograd&mesto=bezanijska-kosa-novi-beograd-beograd&mesto=ledine-novi-beograd-beograd&mesto=nova-galenika-galenika-zemun-zemun-opstina-beograd&struktura=trosoban&struktura=troiposoban&struktura=cetvorosoban&struktura=cetvoroiposoban-i-vise&struktura=dvosoban&vece_od=55m2&odrednica=278&skuplje_od=100000eur&stanje=u_izgradnji&stanje=novo&strana=${i}`;
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);
            $('div[class*="flex h-[180px]"]').each((i, element) => {
                const details = $(element)
                    .find('a[href*="/prodaja-stanova/"]:has(+ div)')
                    .text()
                    .trim();
                const street = $(element)
                    .find('p[class*="truncate"][class*="font-medium"][class*="leading-tight"][class*="desk:text-lg"]')
                    .text()
                    .trim();
                const cityArea = $(element).find('p:contains("Beograd")').text().trim();
                const titleSection = $(element).find('p:contains("m²")').parent();
                const price = titleSection.find('p:first-child').text().trim();
                const link = $(element).find('div.relative.w-1\\/3.min-w-\\[125px\\].flex-shrink-0 a:first-child').attr('href');
                const pricePerM2 = titleSection.find('p:last-child').text().trim();
                const image = $(element).find('img').attr("src") 
                if (details != "")
                    results.push({
                        details: details,
                        street,
                        link: `https://www.4zida.rs${link}`,
                        cityArea,
                        price: parseInt(price.replace(/[^0-9]/g, ''), 10),
                        pricePerM2: parseInt(pricePerM2.replace(/[^0-9]/g, ''), 10),
                        image: image && image.includes(",") ? image.split(',').at(1) : image
                    });
            });
        }
        console.log(results)
        return results;
    } catch (error) {
        console.error('Error scraping data:', error);
    }
}
scrape4zidaOffers()