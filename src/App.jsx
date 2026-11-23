import React, { useState, useEffect } from 'react';

function PostsList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('https://typicode.com')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setPosts(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []); // Empty array ensures this runs only once on mount

    if (loading) return <p>Loading posts...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <ul>
            {posts.map((post) => (
                <li key={post.id}>
                    <strong>{post.title}</strong>
                </li>
            ))}
        </ul>
    );
}

export default PostsList;
