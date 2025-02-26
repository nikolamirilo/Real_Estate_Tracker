export async function GET(request: Request) {
    try {
      const response = await fetch("https://realestatetrackerbackend-0ngudte9.b4a.run/properties/refresh-data");
      const data = await response.json();
  
      if (data.success) {
        return new Response('Success!', { status: 200 });
      } else {
        return new Response('Fail!', { status: 500 });
      }
    } catch (error) {
      return new Response('Error occurred while refreshing data.', { status: 500 });
    }
  }
  