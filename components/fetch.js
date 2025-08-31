import { API_BASE_URL } from './config.js';

export async function fetchMovies() {
    try {
        const response = await fetch(`${API_BASE_URL}/movies`);
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
        const response = await fetch(`${API_BASE_URL}/branches`);
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
        const response = await fetch(`${API_BASE_URL}/seats/availability`);
        if (!response.ok) {
            throw new Error("Сүлжээний хүсэлт амжилтгүй." + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Суудлын мэдээлэл татаж чадсангүй. Алдааны мессеж:", error);
    }
}

export async function fetchUpcomingMovies() {
    try {
        const response = await fetch(`${API_BASE_URL}/movies/upcoming`);
        if (!response.ok) {
            throw new Error("Сүлжээний хүсэлт амжилтгүй." + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Удахгүй гарах киноны мэдээлэл татаж чадсангүй. Алдааны мессеж:", error);
    }
}

export async function fetchUserInfo() {
    try {
        const response = await fetch(`${API_BASE_URL}/user/info`);
        if (!response.ok) {
            throw new Error("Сүлжээний хүсэлт амжилтгүй." + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Хэрэглэгчийн мэдээлэл татаж чадсангүй. Алдааны мессеж:", error);
    }
}