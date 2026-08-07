export const formatTime = (timestamp: number) => {

    const date = new Date(timestamp);

    return date.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
}

export const formatDataUnit = (unit: number) => {
    if (!unit) return "";
    const units = ["byte", "KB", "MB", "GB", "TB"];
    let i = 0;

    while (unit >= 1024) {
        i++;
        unit /= 1024;
    }

    return `${unit.toFixed(2)}${units[i]}`
}

export const formatSecond = (second: number) => {
    const units = ["초", "분", "시간", "일"];
    const arr = [];
    
    second = Math.floor(second);
    for (const t of [60, 60, 24]) {
        if (second >= t) {
            arr.push(second % t);
            second = Math.floor(second / t);
        }
        else
            break;
    }
    arr.push(second);

    if (arr.length == 1)
        return `${second}초`;

    const c1 = arr.length-1;
    const c2 = arr.length-2;

    return `${arr[c1]}${units[c1]} ${arr[c2]}${units[c2]}`;    
}