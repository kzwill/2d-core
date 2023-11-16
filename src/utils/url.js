export function queryURLParams(value) {
    var url = value || window.location.href.split('?')[1];
    var urlSearchParams = new URLSearchParams(url);
    var params = Object.fromEntries(urlSearchParams.entries());
    return params;
}
export var getRootDomain = function () {
    var domain = '';
    var domainItems = location.hostname.split('.');
    if (domainItems.length < 3 ||
        (domainItems.length === 4 &&
            +domainItems[0] > 0 &&
            +domainItems[1] > 0 &&
            +domainItems[2] > 0 &&
            +domainItems[3] > 0)) {
        domain = location.hostname;
    }
    else if (location.hostname.endsWith('.com.cn') ||
        location.hostname.endsWith('.org.cn')) {
        domain = domainItems.slice(-3).join('.');
    }
    else {
        domain = domainItems.slice(-2).join('.');
    }
    return domain;
};
//# sourceMappingURL=url.js.map