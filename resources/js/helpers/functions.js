export function setParam(key, value) {
    if (!window.history.pushState) {
        return;
    }

    if (!key) {
        return;
    }

    var url = new URL(window.location.href);
    var params = new window.URLSearchParams(window.location.search);
    if (value === undefined || value === null) {
        params.delete(key);
    } else {
        params.set(key, value);
    }

    url.search = params;
    url = url.toString();
    window.history.replaceState({url: url}, null, url);
}

export function setParams(params){
    for(let param in params){
        setParam(param[0], param[1]);
    }
}

export function getQueryString(){
    return new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
}