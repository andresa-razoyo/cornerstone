import Cookies from 'js-cookie';

export default {
    // Social Bug Affiliate ID
    SetAffiliateId: function(afid) {
        Cookies.set('afid', afid);
    },

    GetAffiliateId: function() {
        return Cookies.get('afid');
    },

    // Consultant ID
    SetConsultantId: function(cid) {
        Cookies.set('cid', cid);
    },

    GetConsultantId: function() {
        return Cookies.get('cid');
    },

    // Consultant XID
    SetConsultantXid: function(cxid) {
        Cookies.set('cxid', cxid);
    },

    GetConsultantXid: function() {
        return Cookies.get('cxid');
    },

    // Party Date
    SetConsultantName: function(name) {
        Cookies.set('name', name);
    },

    GetConsultantName: function() {
        return Cookies.get('name');
    },

    // Party Id
    SetPartyId: function(pid) {
        Cookies.set('pid', pid);
    },

    GetPartyId: function() {
        return Cookies.get('pid');
    },

    // Party Host
    SetPartyHost: function(phost) {
        Cookies.set('phost', phost);
    },

    GetPartyHost: function() {
        return Cookies.get('phost');
    },

    // Party Date
    SetPartyDate: function(pdate) {
        Cookies.set('pdate', pdate);
    },

    GetPartyDate: function() {
        return Cookies.get('pdate');
    },

    // Party Time
    SetPartyTime: function(ptime) {
        Cookies.set('ptime', ptime);
    },

    GetPartyTime: function() {
        return Cookies.get('ptime');
    },

    // Party Total
    SetPartyTotal: function(ptotal) {
        Cookies.set('ptotal', ptotal);
    },

    GetPartyTotal: function() {
        return Cookies.get('ptotal');
    },

    // Debugging
    GetTest: function() {
        return Cookies.get('_test');
    },

    SetTest: function(value) {
        Cookies.set('_test', value);
    }
}
