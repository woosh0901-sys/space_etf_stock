// Node 18+ native fetch used

async function test() {
    try {
        const response = await fetch('http://localhost:3000/api/market-data?symbols=AAPL,TSLA,NVDA');
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}
test();
