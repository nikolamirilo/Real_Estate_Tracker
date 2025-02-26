export function GET(request: Request) {
    fetch("https://realestatetrackerbackend-0ngudte9.b4a.run/properties/refresh-data")
    return new Response('Hello from Vercel!');
  }