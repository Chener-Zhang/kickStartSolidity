import web3 from "./web3"
import CampaignFactory from './build/CampaignFactory.json'

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0xb3832ae97c8D9bE861392a8E3cE40EAf14c30987'
);


export default instance;