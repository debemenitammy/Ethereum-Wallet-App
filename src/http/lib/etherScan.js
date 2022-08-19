const axios = require('axios').default;
const { etherScan } = require('../../config');

const ETHER_UNIT = Math.pow(10, 18);

class EtherScan {
    defaultOptions = {};
    
    constructor(defaultOptions={}) {
        this.defaultOptions = defaultOptions;
        this.request = axios.create({
            baseURL: etherScan.baseUrl,
        })

    }

    /**
     * @desc Options parameter contains
     * @param {String} module 
     * @param {String} address
     * 
     */
    async makeRequest(options = {}) {
        const query = new URLSearchParams({ ...this.defaultOptions, ...options});
        const response = await this.request.get(`/?${query.toString()}`);
        return response.data;
    }

    async getNormalTrxByAddr(address, startblock = 0, endblock = 2702578, page=1, offset=10, sort='asc') {
      return this.makeRequest({
        address,
        action: 'txlist',
        startblock,
        endblock,
        page,
        offset,
        sort,
      })
    }

    async getInternalTrxByAddr(address, startblock = 0, endblock = 2702578, page=1, offset=10, sort='asc') {
       return this.makeRequest({
        address,
        action: 'txlistinternal',
        startblock,
        endblock,
        page,
        offset,
        sort,
       }) 
    }
    
    async getBalanceFromAddr(address, tag='latest') {
        return this.makeRequest({
            address,
            action: 'balance',
            tag,
        }) 
    }

    async getBalanceHistory(address, startblock = 0, endblock = 9999999, page=1, offset=10, sort='asc') {
        const [internalTrx, normalTrx] = await Promise.all([
            this.getInternalTrxByAddr(address, startblock, endblock, page, offset, sort),
            this.getNormalTrxByAddr(address, startblock, endblock, page, offset, sort)
        ]);

        let result = [...internalTrx.result, ...normalTrx.result];
        console.log(result);
        result = result.sort((a, b) => +a.timeStamp - +b.timeStamp);

        // stores the balance of the transaction block
        let currentBalance = 0;

        result = result.map((e) => {
            // e :is the response from the API
            console.log(e);
            const moneyIn = e.to.toLowerCase() === address.toLowerCase(); // checks if the address in the etherscan matches the address being passed in

            // converts the value to ethereum
            const value = e.value / ETHER_UNIT;

            // This was done because internal transaction do not come with gasPrice
            // so calculations to get price is done directly (converts the value to ethereum)
            const gas = "gasPrice" in e 
                ? e.gasUsed * e.gasPrice / ETHER_UNIT
                : e.gasUsed / ETHER_UNIT;
            
            // this updates the currentbalance for the given transaction data
            currentBalance = moneyIn
            ? currentBalance + value
            : currentBalance - (value + gas)

            return {
                to: e.to,
                from: e.from,
                timeStamp: new Date(+e.timeStamp),
                balance: currentBalance,
            }
        })
    }
}

module.exports = new EtherScan({
    module: 'account',
    apiKey: etherScan.apiKey
});