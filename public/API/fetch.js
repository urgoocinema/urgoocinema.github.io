export async function fetchMovies() {
    try {
        const response = await fetch("./data/ongoing/movies-list.json");
        if (!response.ok) {
        throw new Error("Сүлжээний хүсэлт амжилтгүй." + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Киноны мэдээлэл татаж чадсангүй. Алдааны мессеж:", error);
    }
}

export async function fetchBranches() {
    try {
        const response = await fetch("./data/branches/branch-list.json");
        if (!response.ok) {
        throw new Error("Сүлжээний хүсэлт амжилтгүй." + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Салбарын мэдээлэл татаж чадсангүй. Алдааны мессеж:", error);
    }
}

export async function fetchOccupiedSeats() {
    try {
        const response = await fetch("./data/realtime-data/seat-availability.json");
        if (!response.ok) {
            throw new Error("Сүлжээний хүсэлт амжилтгүй." + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Суудлын мэдээлэл татаж чадсангүй. Алдааны мессеж:", error);
    }
}