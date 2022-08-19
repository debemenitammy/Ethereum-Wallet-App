const app = require('../../src/app');
const { assert } = require('chai');
const supertest = require('supertest');
const createMongodbConnection = require('../../src/database');

const server = supertest(app);
const address = 'fghbjn'

before(async () => {
    await createMongodbConnection();
})

describe('ETH wallet test', () => {
    it('should get the wallet balance based on addresses', async () => {
        const res = await server.get(`/wallets?address=${address}`);

        console.log(res.body, res.error);
        assert.equal(res.status, 200);
        assert.exists(res.body.data);
    })
})