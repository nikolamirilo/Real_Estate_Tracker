import axios from "axios";
import * as cheerio from 'cheerio';



export async function scrape4zidaOffers() {
    try {
        const results = [];
        for(let i = 1; i < 100; i++){
            const url = `https://www.4zida.rs/prodaja-stanova/surcin-opstina-beograd/dvoiposoban/do-200000-evra?mesto=novi-beograd-beograd&mesto=zemun-opstina-beograd&mesto=cukarica-opstina-beograd&struktura=trosoban&struktura=troiposoban&struktura=cetvorosoban&struktura=cetvoroiposoban-i-vise&vece_od=50m2&stanje=u_izgradnji&stanje=novo&strana=${i}`;
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
                const image = $('div.relative.size-full.bg-black\\/50 img').attr('srcset');
                if (details == "") return
                results.push({
                    details: details.split('\n')[0].trim(),
                    street,
                    link: `https://www.4zida.rs${link}`,
                    cityArea,
                    price:parseInt(price.replace(/[^0-9]/g, ''), 10),
                    pricePerM2:parseInt(pricePerM2.replace(/[^0-9]/g, ''), 10),
                    image: image.split(',').at(1)
                });
            });
        }
        return results;
    } catch (error) {
        console.error('Error scraping data:', error);
    }
}