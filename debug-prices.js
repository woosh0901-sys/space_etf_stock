// Node 18+ native fetch used

async function test() {
    try {
        const response = await fetch('http://localhost:3000/api/market-data?symbols=UFO,ARKX');
        const data = await response.json();
        const firstQuote = Object.values(data.quotes)[0];
        console.log('--- META DATA ---');
        // We can't see server logs from here, capturing client response won't show raw yahoo meta unless API returns it.
        // But wait, the API returns formatted quotes. We need to modify route.ts temporarily to log meta or just trust Yahoo Finance docs.
        // Actually, let's modify route.ts to log meta keys.
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}
test();
