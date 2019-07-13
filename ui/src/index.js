import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'
import './index.css';
import * as serviceWorker from './serviceWorker';
import Campaigns from "./Campaigns"

axios.interceptors.request.use((config) => {
    config.headers.Authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjQzOTIzMzksImlzcyI6Imh0dHBzOi8vbHVjZW50YmlkLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVjZW50YmlkLmNvbSJ9.U_0UHn-TG_xLN3st8kklFsmEptBuEcy0kCoU_hIdNFg'

    return config;
})

ReactDOM.render(<Campaigns />, document.getElementById('campaigns'));
//ReactDOM.render(<SingleCampaign />, document.getElementById('campaignContainer'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
