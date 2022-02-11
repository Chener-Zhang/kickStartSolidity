const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json')

const provider = new HDWalletProvider('ill domain ordinary evidence accident neutral scout nation coyote potato island risk', 'https://rinkeby.infura.io/v3/cef4d0f52f754a47a01bd4d0f932b25d')
const web3 = new Web3(provider)

const deploy = async () => {

    const account = await web3.eth.getAccounts();

    console.log('attemp to deloy', account[0])

    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface)).deploy({ data: compiledFactory.bytecode }).send({ gas: '1000000', from: account[0] })


    console.log("Address", result.options.address);

    provider.engine.stop()
}


deploy();

// attemp to deloy 0x434356D0d6Cfa8b9aE18617546D6dc45362f48A0
// Address 0xD8b375CedC22C8ae454B44fbDa027F5be12484Bd