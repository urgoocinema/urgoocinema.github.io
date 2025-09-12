const API_BASE_URL = 'http://localhost:3000/api';


const fetchData = async (endpoint) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`);
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status} for endpoint: ${endpoint}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Could not fetch data from ${endpoint}:`, error);
        return null;
    }
};

export const getMovies = () => fetchData('movies');
export const getMovieById = (movieId) => fetchData(`movies/${movieId}`);
export const getShowtimesForMovie = (movieId) => fetchData(`showtimes/movie/${movieId}`);
export const getShowtimeById = (showtimeId) => fetchData(`showtimes/${showtimeId}`);
export const getBranches = () => fetchData('branches');
export const getBranchById = (branchId) => fetchData(`branches/${branchId}`);
export const getBookingsByUserId = (userId) => fetchData(`bookings/user/${userId}`);
export const getUpcoming = () => fetchData('upcoming');
export const getUpcomingById = (upcomingId) => fetchData(`upcoming/${upcomingId}`);
export const getNotification = (userId) => fetchData(`upcoming/notif/${userId}`);
export const getUserById = (userId) => fetchData(`users/${userId}`);


const postData = async (endpoint, data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const responseData = await response.json();
        if (!response.ok) {
            console.error(`API error for ${endpoint}: ${responseData.message || response.statusText}`);
            throw new Error(responseData.message || 'Server error');
        }
        return responseData;
    } catch (error) {
        console.error(`Could not post data to ${endpoint}:`, error);
        return null;
    }
};

export const login = (email, password) => postData('login', { email, password });
export const register = (userDetails) => postData('register', userDetails);
export const bookSeat = (bookingDetails) => postData('bookings', bookingDetails);
export const postnotification = (user_id, movie_id) => postData('upcoming', { user_id, movie_id })

const putData = async (endpoint, data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error(`API error for ${endpoint}: ${responseData.message || response.statusText}`);
            throw new Error(responseData.message || 'Server error');
        }

        return responseData;
    } catch (error) {
        console.error(`Could not put data to ${endpoint}:`, error);
        return null;
    }
};
export const updateUser = (userDetails) => putData(`users/update`, userDetails);