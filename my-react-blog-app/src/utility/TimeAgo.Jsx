export function timeAgo(postDateStr) {
    const currentDate = new Date() //new date
    const postDate = new Date(postDateStr) //post date
    const diff = currentDate - postDate
    // console.log(diff);
    const sec = Math.floor(diff / (1000))
    console.log(sec);

    const min = Math.floor(diff / (1000 * 60))
    console.log(min);

    const hrs = Math.floor(diff / (1000 * 60 * 60))
    console.log(hrs);

    const day = Math.floor(diff / (1000 * 60 * 60 * 24))
    console.log(day);

    const week = Math.floor(day / 7)
    console.log(week);

    const month = Math.floor(day / 30)
    console.log(month);

    const year = Math.floor(day / 365)
    console.log(year);

    if (year > 0) return `• Posted ${year} year ${year > 1 ? "s" : ""}ago`;
    if (month > 0) return `• Posted ${month} mon ${month > 1 ? "s" : ""}ago`;
    if (week > 0) return `• Posted ${week} week ${week > 1 ? "s" : ""}ago`;
    if (day > 0) return `• Posted ${day} day ${day > 1 ? "s" : ""}ago`;
    if (hrs > 0) return `• Posted ${hrs} hr ${hrs > 1 ? "s" : ""}ago`;
    if (min > 0) return `• Posted ${min} min ${min > 1 ? "s" : ""}ago`;
    return `• Posted ${sec}sec ${sec > 1 ? "s" : ""}ago`;

}