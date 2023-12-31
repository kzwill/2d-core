// const obj = {a:{b:[0,1,2]}}
// getter(obj, 'a.b.1')
export function getter(object, path) {
    if (path == undefined) {
        return object;
    }
    var arr = path.split('.');
    while (arr.length && (object = object[arr.shift()]))
        ;
    return object;
}
// setter(obj, 'a.b.1', 111)
export function setter(object, path, value) {
    if (path == undefined) {
        return;
    }
    path
        .split('.')
        .reduce(function (o, p, i) { return (o[p] = path.split('.').length === ++i ? value : o[p] || {}); }, object);
}
//# sourceMappingURL=object.js.map