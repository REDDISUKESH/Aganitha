import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

// Styled components for custom styling
const PostContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4), // Set padding for larger screens
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2), // Adjust padding for smaller screens
  },
}));

const PostTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2rem', // Larger font size for title
  fontWeight: 'bold',
  marginBottom: theme.spacing(2), // Add space below title
  '&:hover': {
    color: theme.palette.primary.main, // Change color on hover
    transition: 'color 0.3s ease-in-out', // Smooth transition effect
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem', // Adjust font size for smaller screens
  },
}));

const PostBody = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem', // Larger font size for body text
  lineHeight: 1.6, // Increase line height for better readability
  animation: 'fadeIn 0.5s ease-in-out', // Add fade-in animation
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    },
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem', // Adjust font size for smaller screens
  },
}));

const PostDetail = () => {
  const { id } = useParams(); // Get the book ID from the URL
  const [book, setBook] = useState(null); // State to store the book data
  const [loading, setLoading] = useState(true); // State to track loading state
  const [error, setError] = useState(null); // State to track error state

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        // Fetch book data from the Open Library API using the book ID
        const response = await axios.get(`https://openlibrary.org/works/${id}.json`);
        
        console.log("hello",response.data);
        setBook(response.data); // Update state with the fetched book data
      } catch (err) {
        setError('Failed to fetch book details'); // Set error message if fetching fails
      } finally {
        setLoading(false); // Update loading state when fetching completes
      }
    };
    fetchBookDetails(); // Call the fetchBookDetails function when the component mounts or book ID changes
  }, [id]); // Depend on book ID for re-fetching data when ID changes

  return (
    <PostContainer>
      {/* Display loading spinner while fetching data */}
      {loading ? (
        <CircularProgress />
      ) : error ? ( // Display error message if fetching fails
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      ) : (
        // Display book details if data is fetched successfully
        book && (
          <>
            {/* Book title */}
            <PostTitle variant="h4">{book.title}</PostTitle>
            {/* Display book description */}
            {book.description && (
              <>
                <Typography variant="h6" style={{ marginTop: '20px', marginBottom: '10px' }}>
                  Description
                </Typography>
                <PostBody variant="body1">{book.description}</PostBody>
              </>
            )}
            {/* Display other details like author(s), published date */}
            <Typography variant="h6" style={{ marginTop: '20px', marginBottom: '10px' }}>
              Author(s)
            </Typography>
            <PostBody variant="body1">
              {book.authors && book.authors.map((author, index) => (
                <span key={index}>{author.name}{index < book.authors.length - 1 && ', '}</span>
              ))}
            </PostBody>

            <Typography variant="h6" style={{ marginTop: '20px', marginBottom: '10px' }}>
              Published
            </Typography>
            <PostBody variant="body1">{book.publish_date || 'Not Available'}</PostBody>

            {/* Display other book details */}
            <Typography variant="h6" style={{ marginTop: '20px', marginBottom: '10px' }}>
              Subjects
            </Typography>
            <PostBody variant="body1">
              {book.subjects && book.subjects.join(', ') || 'Not Available'}
            </PostBody>
          </>
        )
      )}
    </PostContainer>
  );
};

export default PostDetail;
