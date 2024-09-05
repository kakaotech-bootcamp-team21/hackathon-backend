const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('<h1>Welcome</h1><p>This is a simple page without a template engine.</p>');
});

app.get('/api/user', (req, res) => {
    res.json({ name: 'John Doe', age: 30 });
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});