const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compileCampaign = require('../ethereum/build/Campaign.json');


let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' });

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(
        JSON.parse(compileCampaign.interface),
        campaignAddress
    );

})

describe('Campaigns', () => {
    it('deploys a factory and campaigns', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    })

    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        // console.log(manager)
        assert.equal(manager, accounts[0]);
    })

    it('donate success', async () => {
        await campaign.methods.contribute().send({
            value: '101',
            from: accounts[1]
        });

        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    })

    it('require minimun contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '50',
                from: accounts[2]
            });
            assert(false)
        } catch (error) {
            assert(error)
        }
    })

    // createRequest(
    //     string description,
    //     uint256 value,
    //     address recipient
    // ) 

    it('allow manager to make a request', async () => {
        await campaign.methods.createRequest("This is a test request", "100", accounts[2]).send({
            from: accounts[0],
            gas: '1000000'
        })
        const request = await campaign.methods.requests(0).call();
        assert.equal('This is a test request', request.description);
    })

    it('processes requests', async () => {

        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        })

        //This request to the vendor from the manager account 
        await campaign.methods.createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
            .send({ from: accounts[0], gas: '1000000' })

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        })

        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);

        assert(balance > 104)

    })
})