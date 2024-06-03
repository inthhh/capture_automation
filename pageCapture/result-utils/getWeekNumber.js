function getWeekNumber(date) {
    const today = new Date(date);

    // 해당 연도의 첫 번째 날 (1월 1일)
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // 1월 1일의 요일 (월요일이 1, 화요일이 2, ..., 일요일이 7)
    const startDayOfWeek = startOfYear.getDay() === 0 ? 7 : startOfYear.getDay();

    // 현재 날짜가 해당 연도의 첫 번째 날로부터 몇일 차이나는지 계산
    const dayOfYear = ((today - startOfYear + 86400000) / 86400000);

    const weekNumber = Math.ceil((dayOfYear + (startDayOfWeek - 1)) / 7);
    return weekNumber < 10 ? '0' + weekNumber : weekNumber.toString();

}

module.exports = {
    getWeekNumber
};