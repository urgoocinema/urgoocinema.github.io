export function day_to_number(day) {
    if (!day || typeof day !== 'string') {
        return -1;
    }

    let lowerday = day.toLowerCase();
    if (lowerday == "өнөөдөр") {
        lowerday = new Date().getDay();
        return lowerday;
    }
    if (lowerday == "маргааш") {
        lowerday = new Date().getDay() + 1;
        return lowerday;
    }


    switch (lowerday) {
        case "monday":
        case "даваа":
            return 1;
        case "tuesday":
        case "мягмар":
            return 2;
        case "wednesday":
        case "лхагва":
            return 3;
        case "thursday":
        case "пүрэв":
            return 4;
        case "friday":
        case "баасан":
            return 5;
        case "saturday":
        case "бямба":
            return 6;
        case "sunday":
        case "ням":
            return 7;
        default:
            return -1;
    }
}