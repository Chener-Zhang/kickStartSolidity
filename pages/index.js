import React, { useEffect, useState } from 'react';
import factory from '../ethereum/factory'
import { Cards } from './Cards';

export default () => {
    const [campaign, setCampaign] = useState('');

    useEffect(async () => {

        const campaigns = await factory.methods.getDeployedCampaigns().call();
        setCampaign(campaigns[0]);

    }, [campaign])


    return <div>Campaigns address : {campaign && <h1>{campaign}</h1>}
    </div>
}


