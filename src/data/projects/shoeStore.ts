export const shoeStore = {
    id: "shoestore",
    title: "ShoeStore",
    subtitle: "Full-Stack E-Commerce Shoe Platform",
    description:
        "A full-stack e-commerce web application for browsing, purchasing, and managing shoes with authentication, cart, orders, and admin controls.",
    longDescription: `
ShoeStore is a full-stack e-commerce platform built with React and Node.js, designed to handle real-world shopping workflows including authentication, cart management, order processing, and admin inventory control.

The frontend is built using React with client-side routing, dynamic product rendering, protected routes, and persistent authentication using JWT. Users can browse shoes, search and filter products, manage carts, place orders, upload profile pictures, and track order history.

The backend is powered by Express.js with SQLite as the database. It provides REST APIs for authentication, products, carts, orders, profile management, password reset flows, and image uploads using Multer. JWT-based middleware secures sensitive routes, while bcrypt ensures password safety.

The system supports real-time cart synchronization, availability checks, bulk order placement, and admin-level product management, making it a complete end-to-end e-commerce solution.
`,
    type: "Full-Stack Web App",
    tech: [
        "React",
        "React Router",
        "Node.js",
        "Express.js",
        "SQLite",
        "JWT Authentication",
        "bcrypt",
        "Multer",
        "REST API"
    ],
    links: {
        github: "https://github.com/arnofrxdd/portfolio" // replace if repo is separate
    },
    image:
        "https://raw.githubusercontent.com/arnofrxdd/portfolio/main/Screenshot%202026-01-11%20234842.png",

    imageStyle: {
        maxWidth: "1000px",
        maxHeight: "1000px",
        objectFit: "contain"
    },

    date: "2026",
    role: "Full-Stack Developer",
    highlights: [
        "JWT-based authentication and protected routes",
        "Admin panel for product and contact management",
        "Cart synchronization with real-time availability checks",
        "Order placement with bulk checkout support",
        "Profile picture upload using Multer",
        "Password reset workflow with secure tokens",
        "SQLite-backed persistent storage",
        "RESTful API design"
    ],
    featured: true,
    languages: [
        { name: "JavaScript", percent: 65, color: "#f7df1e" },
        { name: "React", percent: 20, color: "#61dafb" },
        { name: "SQL", percent: 15, color: "#4b5563" }
    ],
    deployHistory: [
        {
            version: "v1.0",
            msg: "Initial full-stack release with auth, cart, and orders",
            time: "Latest",
            status: "success"
        }
    ],
    snippet: `// Example protected cart fetch
app.get('/api/cart', authenticateToken, (req, res) => {
    const userId = req.user.userId;
    db.all('SELECT * FROM cart WHERE user_id = ?', [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        res.json(rows);
    });
});
`,
    architecture: `
[ React Frontend ]
      |
      v
[ REST API Calls ]
      |
      v
+----------------------------------+
|        Express.js Backend         |
|  - Auth & JWT middleware         |
|  - Products & Admin APIs         |
|  - Cart & Orders logic           |
|  - File uploads (Multer)         |
+----------------------------------+
      |
      v
+----------------------------------+
|          SQLite Database         |
|  - users                         |
|  - shoes                         |
|  - cart                          |
|  - orders                        |
|  - reset_password_requests       |
+----------------------------------+
`
};
