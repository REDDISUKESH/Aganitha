import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Grid, CircularProgress, Pagination } from '@mui/material';
import Searchbar from './Searchbar';
import { fetchItems } from '../api';
import { Highlight } from './Highlight';
import { Link } from 'react-router-dom';
import './Home.css'; // Import CSS file for additional styling

const Home = ({ searchQuery, setSearchQuery }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    const getPosts = async () => {
      try {
        setLoading(true);
        const data = await fetchItems(searchQuery); // Pass searchQuery to fetchItems
        console.log('Fetched books:', data);
        setPosts(data); // Update posts with the fetched books
      } catch (err) {
        setError('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if searchQuery is not empty or the page is being loaded initially
    if (searchQuery) {
      getPosts();
    } else {
      setPosts([]); // Empty the posts if no search query is present
    }
  }, [searchQuery]); // Re-fetch books whenever searchQuery changes

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const displayedPosts = posts.slice((page - 1) * postsPerPage, page * postsPerPage);

  return (
    <Container>
      {/* Title */}
      <Typography variant="h4" align="center" gutterBottom>
        Book Search Results
      </Typography>
      
      {/* Searchbar */}
      <Searchbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      {/* Loading indicator */}
      {loading ? (
        <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
          <CircularProgress />
        </Grid>
      ) : error ? (
        // Error message
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
      ) : (
        // Display books
        <>
          <Grid container spacing={3}>
            {displayedPosts.map((book, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper className="post-paper"> {/* Apply hover effect */}
                  {/* Book title */}
                  <Typography variant="h6" className="post-title" style={{ color: 'red' }}>
                    {/* Book link */}
                    <Link to={`/book${book.key.replace('/works', '')}`} style={{ textDecoration: 'none', color: 'inherit' }}>
  {Highlight(book.title, searchQuery)} {/* Highlight matching text */}
</Link>

                  </Typography>
                  {/* Book author */}
                  <Typography variant="body1" className="post-body" style={{ color: 'blue' }}>
                    {book.author_name ? book.author_name.join(', ') : 'Unknown author'}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          {/* Pagination */}
          <Pagination
            count={Math.ceil(posts.length / postsPerPage)}
            page={page}
            onChange={handlePageChange}
            style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}
          />
        </>
      )}
    </Container>
  );
};

export default Home;
