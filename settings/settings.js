'use strict';

const { sync } = chrome.storage;

///////////////////////////////////////////////////////////////////////////////////////////
// FEATURES
///////////////////////////////////////////////////////////////////////////////////////////

const FEATURES = {};

sync.get(['FEATURES'], (result) => {
    Object.assign(FEATURES, result.FEATURES || {});
    if (FEATURES.config === false) {
        configCheckbox.checked = false;
    }
    if (FEATURES.processes === false) {
        processesCheckbox.checked = false;
    }
    if (FEATURES.focusedNodes === false) {
        focusedNodesCheckbox.checked = false;
    }
    if (FEATURES.visibleNodes === false) {
        visibleNodesCheckbox.checked = false;
    }
    if (FEATURES.nodesTree === false) {
        nodesTreeCheckbox.checked = false;
    }
    featuresFieldset.removeAttribute('disabled');
});

function updateFeature(name, value) {
    FEATURES[name] = value;
    sync.set({ FEATURES }, () => console.log('FEATURES ', name, 'set to', value));
}

configCheckbox.addEventListener('click',  () => updateFeature('config', configCheckbox.checked));
processesCheckbox.addEventListener('click',  () => updateFeature('processes', processesCheckbox.checked));
focusedNodesCheckbox.addEventListener('click',  () => updateFeature('focusedNodes', focusedNodesCheckbox.checked));
visibleNodesCheckbox.addEventListener('click',  () => updateFeature('visibleNodes', visibleNodesCheckbox.checked));
nodesTreeCheckbox.addEventListener('click',  () => updateFeature('nodesTree', nodesTreeCheckbox.checked));

///////////////////////////////////////////////////////////////////////////////////////////
// STB IP
///////////////////////////////////////////////////////////////////////////////////////////

const DEV_STB_IP = '172.17.0.100';

sync.get(['STB_IP'], (result) => {
    const ip = result.STB_IP || DEV_STB_IP;
    if (ip === 'auto') {
        stbIpRadioAuto.checked = true;
    } else if (ip === DEV_STB_IP) {
        stbIpRadioDev.checked = true;
    } else {
        stbIpRadioCustom.checked = true;
        stbIpText.value = ip;
        stbIpText.removeAttribute('disabled')
    }
});

stbIpButton.addEventListener('click', () => {
    let ip;
    if (stbIpRadioAuto.checked) {
        ip = 'auto';
    }
    if (stbIpRadioDev.checked) {
        ip = DEV_STB_IP;
    }
    if (stbIpRadioCustom.checked) {
        ip = stbIpText.value;
    }
    sync.set({ STB_IP: ip }, () => console.log('New STB_IP is ', ip));
});

stbIpRadioCustom.addEventListener('click', () => stbIpText.removeAttribute('disabled'));
stbIpRadioDev.addEventListener('click', () => stbIpText.setAttribute('disabled', ''));

///////////////////////////////////////////////////////////////////////////////////////////
// AUTO REFRESH
///////////////////////////////////////////////////////////////////////////////////////////

const REFRESH_DELAYS = {};

sync.get(['REFRESH_DELAYS'], (result) => {
    Object.assign(REFRESH_DELAYS, result.REFRESH_DELAYS || {});
    if (REFRESH_DELAYS.processes) {
        processRefreshIntervalInput.value = REFRESH_DELAYS.processes;
    }
    if (REFRESH_DELAYS.focusedNodes) {
        focusedNodesRefreshIntervalInput.value = REFRESH_DELAYS.focusedNodes;
    }
    if (REFRESH_DELAYS.nodesTree) {
        nodesTreeRefreshIntervalInput.value = REFRESH_DELAYS.nodesTree;
    }
    refreshIntervalFieldset.removeAttribute('disabled');
});

refreshIntervalButton.addEventListener('click', () => {
    REFRESH_DELAYS.processes = processRefreshIntervalInput.value;
    REFRESH_DELAYS.focusedNodes = focusedNodesRefreshIntervalInput.value;
    REFRESH_DELAYS.visibleNodes = visibleNodesRefreshIntervalInput.value;
    REFRESH_DELAYS.nodesTree = nodesTreeRefreshIntervalInput.value;
    sync.set({ REFRESH_DELAYS }, () => console.log('New REFRESH_DELAYS are ', REFRESH_DELAYS));
});
