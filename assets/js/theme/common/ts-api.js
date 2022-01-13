export default class TSApi {
    constructor() {
        this.baseUrl = window.theme_settings.ts_api_environment
            ? `https:\/\/${window.theme_settings.ts_api_environment}-${window.theme_settings.ts_tsapi_base_url}`
            : `https:\/\/${window.theme_settings.ts_tsapi_base_url}`;

        this.hostPartyBaseUrl = window.theme_settings.ts_api_environment
            ? `https:\/\/${window.theme_settings.ts_api_environment}-${window.theme_settings.ts_tsapi_host_party_base_url}`
            : `https:\/\/${window.theme_settings.ts_tsapi_host_party_base_url}`;

        this.consultantBaseUrl = window.theme_settings.ts_api_environment
            ? `https:\/\/${window.theme_settings.ts_api_environment}-${window.theme_settings.ts_tsapi_consultant_base_url}`
            : `https:\/\/${window.theme_settings.ts_tsapi_consultant_base_url}`;
    }

    fullUrl(uri) {
        return this.baseUrl + uri;
    }

    fullPartyUrl(uri) {
        return this.hostPartyBaseUrl + uri;
    }

    consultantUrl(uri) {
        return this.consultantBaseUrl + uri;
    }

    welcomeCheck(email) {
        return fetch(this.fullUrl('/users/welcome/check'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
    }

    /*
     * Check Customer last login
     */
    lastLoginCheck(email) {
        return fetch(this.fullUrl('/users/welcome/lastLogin'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
    }

    /*
     * Cart - Affiliation check
     * var affiliations {}
     * - CartID
     * - Email
     * - ConsultantID
     * - PartyID
     */
    affiliationCheck(affiliations) {
        return fetch(this.fullUrl('/cart/affiliationcheck'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(affiliations),
        });
    }

    /*
     * Find a Consultant
     */
    searchConsultantsByZip(zip, radius, page, size) {
        const uri = `/search/shop/zip/${zip}/${radius}/${page}/${size}`;

        return fetch(this.fullUrl(uri), {
            method: 'GET',
            headers: { Accept: 'application/json' },
        });
    }

    searchConsultantsByName(name, state, page, size) {
        const uri = `/search/shop/name/${name}/${state}/${page}/${size}`;

        return fetch(this.fullUrl(uri), {
            method: 'GET',
            headers: { Accept: 'application/json' },
        });
    }

    getConsultant(id) {
        const uri = `/search/shop/cid/${id}`;

        return $.ajax({
            type: 'GET',
            accepts: 'json',
            url: this.fullUrl(uri),
        });
    }

    getPartiesByConsultant(cid, page, size) {
        const uri = `/search/party-list/${cid}/${page}/${size}`;

        return fetch(this.fullUrl(uri), {
            method: 'GET',
            headers: { Accept: 'application/json' },
        });
    }


    /*
     * Find a Party
     */
    searchPartyByState(state, name, page, size, sid) {
        const uri = `/search/party/${state}/${page}/${size}?name=${name}&sid=${sid}`;

        return fetch(this.fullUrl(uri), {
            method: 'GET',
            headers: { Accept: 'application/json' },
        });
    }

    /*
     * Consultant Detail Page
     */

    getConsultantInfo(cid) {
        const uri = `/consultant/info?cid=${cid}`;

        return $.ajax({
            type: 'GET',
            accepts: 'json',
            url: this.fullUrl(uri),
        });
    }

    getConsultantStory(cid) {
        const uri = `/consultant/mystory?cid=${cid}`;

        return $.ajax({
            type: 'GET',
            accepts: 'json',
            url: this.fullUrl(uri),
        });
    }

    getConsultantParties(cid) {
        const uri = `/consultant/parties?cid=${cid}`;

        return $.ajax({
            type: 'GET',
            accepts: 'json',
            url: this.fullUrl(uri),
        });
    }

    // Get Consultant by username
    getConsultantByUsername(username) {
        const uri = `/sb/web/${username}`;

        return fetch(this.fullUrl(uri), {
            method: 'GET',
            headers: { Accept: 'application/json' },
        });
    }

    /*
     * Party Details
     */
    getPartyDetails(pid) {
        const uri = `/party/detail?pid=${pid}`;

        return fetch(this.fullUrl(uri), {
            method: 'GET',
            headers: { Accept: 'application/json' },
        });
    }

    /*
     * Account Profile Page
     */

    // Communication Preferences
    getCommunicationPreferences(email, cid) {
        const uri = `/users/preferencecenter?email=${email}&customerId=${cid}`;

        return fetch(this.fullUrl(uri))
            .then(response => response.json());
    }

    /*
     * Join Process
     */

    checkJoinSignup(cartId, email) {
        const uri = `/join/check/?cartid=${cartId}&email=${email}`;

        return fetch(this.fullUrl(uri), {
            method: 'GET',
            headers: { Accept: 'application/json' },
        });
    }

    joinLogin(payload) {
        return $.ajax({
            type: 'POST',
            accepts: 'json',
            url: this.fullUrl('/join/login'),
            data: payload,
        });
    }

    createJoinSession(payload) {
        return $.ajax({
            type: 'POST',
            accepts: 'json',
            url: this.fullUrl('/join/join-session'),
            data: payload,
        });
    }

    updateJoinSession(payload, email) {
        const uri = `/join/join-session?email=${email}`;

        return $.ajax({
            type: 'PATCH',
            accepts: 'json',
            url: this.fullUrl(uri),
            data: payload,
        });
    }

    // Get Sponsor
    getSponsor(params) {
        const uri = `/search/join/${params}`;

        return $.ajax({
            type: 'GET',
            accepts: 'json',
            url: this.fullUrl(uri),
        });
    }

    // Get TS Join Terms and Conditions
    getJoinTermsAndConditions() {
        return $.ajax({
            type: 'GET',
            accepts: 'json',
            url: this.fullUrl('/join/tc'),
        });
    }

    getPartyGuests(pid) {
        const uri = `/planner/guests/${pid}`;

        return $.ajax({
            type: 'GET',
            accepts: 'json',
            url: this.fullPartyUrl(uri),
        });
    }

    getPartyRewards(pid) {
        const uri = `/planner/rewards/${pid}`;

        return $.ajax({
            type: 'GET',
            accepts: 'json',
            url: this.fullPartyUrl(uri),
        });
    }

    getPartyInfo(pid) {
        const uri = `/party/planner?pid=${pid}`;

        return $.ajax({
            type: 'GET',
            accepts: 'json',
            url: this.fullUrl(uri),
        });
    }

    getPartySummary(pid) {
        const uri = `/planner/summary/${pid}`;

        return $.ajax({
            type: 'GET',
            accepts: 'json',
            url: this.fullPartyUrl(uri),
        });
    }

    getYumConsultants(customerId) {
        const uri = `/cart/affiliations?customerId=${customerId}`;

        return $.ajax({
            type: 'GET',
            accepts: 'json',
            url: this.fullUrl(uri),
        });
    }

    setActiveYumConsultant(consultantId, customerid) {
        const uri = `/cart/setpendingaffiliation?consultantId=${consultantId}&customerId=${customerid}&overridePending=1`;

        return $.ajax({
            type: 'GET',
            accepts: 'json',
            url: this.fullUrl(uri),
        });
    }

    setPendingYumConsultant(consultantId, customerid) {
        const uri = `/cart/setpendingaffiliation?consultantId=${consultantId}&customerId=${customerid}&overridePending=0`;

        return $.ajax({
            type: 'GET',
            accepts: 'json',
            url: this.fullUrl(uri),
        });
    }

    getIsCustomerConsultant(customerEmail) {
        const uri = `/Info/isconsultant?emailAddress=${customerEmail}`;

        return $.ajax({
            type: 'GET',
            accepts: 'json',
            url: this.consultantUrl(uri),
        });
    }

    login(data) {
        const url = `/login.php?action=check_login`;

        return $.ajax({
            type: 'POST',
            referrer: '/login.php',
            referrerPolicy: "strict-origin-when-cross-origin",
            mode: "cors",
            credentials: "include",
            url: (url),
            data: data 
        });
    }

    register(data) {
        const url = `/login.php?action=save_new_account`;

        return $.ajax({
            redirect: "follow",
            type: 'POST',
            referrer: '/login.php?action=create_account',
            referrerPolicy: "strict-origin-when-cross-origin",
            mode: "cors",
            credentials: "include",
            url: (url),
            data: data 
        });
    }
}
