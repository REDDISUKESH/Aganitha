import axios from 'axios';

const BASE_URL = 'https://openlibrary.org/search.json';

// Function to fetch books based on a given title
export const fetchItems = async (bookTitle) => {
  try {
    // Pass the book title as a query parameter
    const response = await axios.get(`${BASE_URL}`, {
      params: { title: bookTitle },
    });
    console.log(response.data);
    return response.data.docs; // Return the books (list of docs)
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
};
