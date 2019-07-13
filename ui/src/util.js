
import Axios from 'axios';

import token from './token.txt';


Axios.interceptors.request.use((config) => {
    config.headers.Authorization = 'Bearer ' + token

    return config;
})

const toDateTime = (i) => {
    if(i == 0) return null;
    try {
        return new Date((i - 116444736000000000) / 1e4).toISOString()
    } catch (error) {
        console.log(i + ' : ' + error)
        return null;
    }
}

const fromCampaignStatus = (status) => {
    switch (status) {
        case 1: return 'Active';
        case 2: return 'Paused';
        case 3: return 'BudgetExhausted';
        default: return 'Unknown';
    }
}


const toFiletime = (str) => {
    if(str == null) return null;

    try {
        return new Date(str).getTime() * 1e4 + 116444736000000000;
    } catch (error) {
        return null;
    }
}

const toScheduleType = (str) => {
    switch (str) {
        case 'Metered': return 1;
        case 'Agressive': return 2;
        default: return 0;
    }
}

const toCampaignStatus = (str) => {
    switch (str) {
        case 'Active': return 1;
        case 'Paused': return 2;
        case 'BudgetExhausted': return 3;
        default: return 0;
    }
}

const fromScheduleType = (i) => {
    switch (i) {
        case 1: return 'Metered';
        case 2: return 'Agressive';
        default: return 'Unknown';
    }
}

export const fromUICampaign = (campaign) => {
    if (campaign == null) return null;

    if (campaign.status != null)
        campaign.status = toCampaignStatus(campaign.status);

    if (campaign.schedule != null) {
        campaign.schedule.start = toFiletime(campaign.schedule.start);
        campaign.schedule.end = toFiletime(campaign.schedule.end);
        if(campaign.schedule.end == null)
            delete campaign.schedule.end;
    }

    if (campaign.budgetSchedule != null)
        campaign.budgetSchedule.type = toScheduleType(campaign.budgetSchedule.type);

    return campaign;
}

export const toUICampaign = (campaign) => {
    if (campaign == null) return null;

    if (campaign.status != null)
        campaign.status = fromCampaignStatus(campaign.status);

    if (campaign.schedule != null) {
        campaign.schedule.start = toDateTime(campaign.schedule.start);
        campaign.schedule.end = toDateTime(campaign.schedule.end);
        if(campaign.schedule.end == null)
            delete campaign.schedule.end;
    }

    if (campaign.budgetSchedule != null)
        campaign.budgetSchedule.type = fromScheduleType(campaign.budgetSchedule.type);

    return campaign;
}

export const getAllCampaigns = () => {
    return Axios.get('https://orchestration.lucentbid.com/api/campaigns').then((resp) => {
        if (resp.status === 200) {
            return resp.data
        }

        return []
    });
}

export const createCampaign = (campaign) => {
    return Axios.post('https://orchestration.lucentbid.com/api/campaigns/' + campaign.id, campaign).then((resp) => {
        if (resp.status === 201) {
            let campaign = resp.data

            campaign['etag'] = resp.headers['x-lucent-etag']
            return campaign;
        }

        return null
    });
}

export const updateCampaign = (campaign) => {
    return Axios.put('https://orchestration.lucentbid.com/api/campaigns/' + campaign.id, campaign, { headers: { 'x-lucent-etag': campaign.etag } }).then((resp) => {
        if (resp.status === 202) {
            let campaign = resp.data

            campaign['etag'] = resp.headers['x-lucent-etag']
            return campaign;
        }

        return null
    });
}

export const getCampaign = (id) => {
    return Axios.get('https://orchestration.lucentbid.com/api/campaigns/' + id).then((resp) => {
        if (resp.status === 200) {
            let campaign = resp.data

            campaign['etag'] = resp.headers['x-lucent-etag']
            return campaign;
        }

        return null
    });
}

export default getAllCampaigns;