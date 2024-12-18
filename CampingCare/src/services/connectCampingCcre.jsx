import axios from 'axios'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'

query = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
})

const authtoken = query.authtoken
const adminId = query.admin_id

const axiosInstance = axios.create({
  baseURL: 'https://api.camping.care/v21',
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(request => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    request.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return request;
}, error => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  response => response, // Directly return successful responses.
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.
      try {
        const refreshToken = localStorage.getItem('refreshToken'); // Retrieve the stored refresh token.
        // Make a request to your auth server to refresh the token.
        const response = await axios.post('https://your.auth.server/refresh', {
          refreshToken,
        });
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        // Store the new access and refresh tokens.
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        // Update the authorization header with the new access token.
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest); // Retry the original request with the new access token.
      } catch (refreshError) {
        // Handle refresh token errors by clearing stored tokens and redirecting to the login page.
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error); // For all other errors, return the error as is.
  }
);

const fetchData = async () => {
  try {
    const response = await axiosInstance.get('/your/endpoint');
    console.log('Data successfully fetched:', response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const getAll = () => {
  const config = {
    headers: { Authorization: `Token ${token}` },
  }
  const request = axios.get(baseUrl, config)
  return request.then(response => response.data)
}

export default { getAll }
