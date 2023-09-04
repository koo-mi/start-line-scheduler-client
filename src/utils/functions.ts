export function formatTargetTime(time: string) {
    // "hr mm" format to hr:mmaa format
    const splitTime = time.split(' ');
    let [hr, min] = splitTime;

    // If the minute is 1 digit, add 0
    if (min.length === 1) {
        min = `0${min}`;
    }

    const hour = Number(hr);

    if (hour === 0) {
        return `12:${min}am`;
    } else if (hour < 12) {
        return `${hour}:${min}am`;
    } else if (hour === 12) {
        return `12:${min}pm`;
    } else {
        return `${hour - 12}:${min}pm`;
    }
}

export function chooseType():string {
    if (sessionStorage.type === "arrival") {
        return "Arrive by"
    } else if (sessionStorage.type === "departure") {
        return "Depart at"
    }
    return "";
}