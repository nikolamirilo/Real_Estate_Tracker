export async function GET(request: Request) {
    try {
        await fetch("https://realestatetrackerbackend-0ngudte9.b4a.run/properties/refresh-data");
        return new Response('Ping sent!', { status: 200 });
    } catch (error) {
        return new Response('Error occurred while pinging.', { status: 500 });
    }
}