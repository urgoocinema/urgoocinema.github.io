export function normalizeShowtimes(showtimes) {
    const grouped = {};

    for (const st of showtimes) {
        const branchKey = `branch${st.branch_id}`;
        const hallId = st.hall_id;
        const date = new Date(st.start_datetime);
        const day = date.toLocaleString("en-US", { weekday: "long" }).toLowerCase();
        const timeStr = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });

        if (!grouped[branchKey]) {
            grouped[branchKey] = { hallId, schedule: {} };
        }
        if (!grouped[branchKey].schedule[day]) {
            grouped[branchKey].schedule[day] = [];
        }
        if (!grouped[branchKey].schedule[day].includes(timeStr)) {
            grouped[branchKey].schedule[day].push(timeStr);
        }

    }

    return grouped;
}