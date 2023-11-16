export function formatTime(format) {
    var weeks = ['天', '一', '二', '三', '四', '五', '六'];
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var week = now.getDay();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var fn = new Function('year', 'month', 'day', 'week', 'hours', 'minutes', 'seconds', format
        ? "return " + format
        : 'return `${year}:${month}:${day} ${hours}:${minutes}:${seconds} 星期${week}`');
    var time = fn(year, month, day, weeks[week], hours, minutes, seconds);
    return time;
}
//# sourceMappingURL=time.js.map