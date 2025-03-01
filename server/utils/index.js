function normalizeString(str) {
    if (!str) return '';
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .toLowerCase()
        .replace(/[^\p{L}\d\s]/gu, '') // Preserve all letters (Latin + Cyrillic)
        .replace(/\s+/g, ' ') // Collapse multiple spaces
        .trim();
}

export function findBestMatch(data, searchString) {
    if (!searchString || !data?.length) return null;

    if (data.length === 1) {
        return {
            lat: Number(data[0].lat),
            lon: Number(data[0].lon),
            isMatch: true,
        };
    }

    const tokens = new Set();

    searchString.split(',')
        .flatMap(part => part.trim().split(/\s+/))
        .forEach(word => {
            // Latin version
            const latinToken = normalizeString(word);
            if (latinToken) tokens.add(latinToken);

            // Cyrillic version
            const cyrillicWord = latinToCyrillic(word);
            const cyrillicToken = normalizeString(cyrillicWord);
            if (cyrillicToken && cyrillicToken !== latinToken) {
                tokens.add(cyrillicToken);
            }
        });

    // If no tokens are generated, return null
    if (tokens.size === 0) return null;

    let bestMatch = null;
    let highestScore = 0;

    // Iterate through data to find the best match
    data.forEach(item => {
        const displayName = normalizeString(item.display_name || '');
        let score = 0;

        // Calculate score based on token matches
        tokens.forEach(token => {
            if (displayName.includes(token)) score++;
        });

        // Update bestMatch if the current item has a higher score
        if (score > highestScore || (score === highestScore && !bestMatch)) {
            highestScore = score;
            bestMatch = {
                lat: Number(item.lat),
                lon: Number(item.lon),
                isMatch: highestScore > 0, // Set isMatch based on score
            };
        }
    });

    // If no match is found, return an object with isMatch: false
    if (!bestMatch) {
        return {
            lat: null,
            lon: null,
            isMatch: false,
        };
    }

    return bestMatch;
}

function latinToCyrillic(text) {
    const mapping = {
        'Đ': 'Ђ', 'Dž': 'Џ', 'dž': 'џ', 'Lj': 'Љ', 'lj': 'љ', 
        'Nj': 'Њ', 'nj': 'њ', 'Č': 'Ч', 'č': 'ч', 'Ć': 'Ћ', 
        'ć': 'ћ', 'Š': 'Ш', 'š': 'ш', 'Ž': 'Ж', 'ž': 'ж',
        'A': 'А', 'a': 'а', 'B': 'Б', 'b': 'б', 'C': 'Ц', 'c': 'ц',
        'D': 'Д', 'd': 'д', 'E': 'Е', 'e': 'е', 'F': 'Ф', 'f': 'ф',
        'G': 'Г', 'g': 'г', 'H': 'Х', 'h': 'х', 'I': 'И', 'i': 'и',
        'J': 'Ј', 'j': 'ј', 'K': 'К', 'k': 'к', 'L': 'Л', 'l': 'л',
        'M': 'М', 'm': 'м', 'N': 'Н', 'n': 'н', 'O': 'О', 'o': 'о',
        'P': 'П', 'p': 'п', 'R': 'Р', 'r': 'р', 'S': 'С', 's': 'с',
        'T': 'Т', 't': 'т', 'U': 'У', 'u': 'у', 'V': 'В', 'v': 'в',
        'Z': 'З', 'z': 'з'
    };

    return text
        .replace(/Dž|dž|Lj|lj|Nj|nj|Đ|Č|č|Ć|ć|Š|š|Ž|ž/g, 
            match => mapping[match])
        .replace(/[A-Za-z]/g, match => mapping[match] || match);
}


const radius = 2000; // 2km in meters
const earthRadius = 6371000; // Earth's radius in meters

export function getRandomOffset() {
  const randomDist = Math.random() * radius; // Random distance within 2km
  const randomAngle = Math.random() * 2 * Math.PI; // Random direction
  const deltaLat = (randomDist * Math.cos(randomAngle)) / earthRadius;
  const deltaLon = (randomDist * Math.sin(randomAngle)) / (earthRadius * Math.cos(44.8133048 * Math.PI / 180));

  return { deltaLat: deltaLat * (180 / Math.PI), deltaLon: deltaLon * (180 / Math.PI) };
}



