
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;


const homeStartingContent = `
Hello there! I'm thrilled to have you join me on this digital journey through the world of technology, programming, and all things creative. This blog is my corner of the internet where I'll be sharing insights, ideas, and experiences that revolve around the fascinating realm of programming and beyond.

📚 If you're passionate about coding, software development, and exploring the limitless possibilities of the digital landscape, you're in the right place. From writing elegant lines of code to unraveling the intricacies of algorithms, we'll dive deep into the art and science that drives the digital age.
`;
const aboutContent = `
I am Moayyad Saleh, a passionate Full Stack Web Developer with a love for crafting elegant and efficient solutions in the digital realm. With a strong foundation in both front-end and back-end development, I thrive on turning creative ideas into functional, user-friendly applications.

👨‍💻 My journey in the world of programming began with curiosity and a desire to build meaningful things that impact people's lives. I've honed my skills in various programming languages, frameworks, and technologies, allowing me to create robust and dynamic web experiences.

🌐 From designing responsive user interfaces that engage and delight users to architecting server-side logic that powers the core functionality of applications, I relish the full spectrum of development. I believe in continuous learning and staying up-to-date with the latest industry trends to ensure that the solutions I create are modern and effective.

🚀 With a problem-solving mindset and a commitment to writing clean and maintainable code, I enjoy collaborating with teams to bring visions to life. The challenges of debugging, optimizing performance, and refining user experiences drive me to constantly improve my skills.

📚 When I'm not immersed in lines of code, you can find me exploring the outdoors, reading about emerging technologies, or experimenting with new programming concepts. My passion for learning extends beyond code; I'm always eager to explore new perspectives and gain insights that inform my work.

🤝 Whether you're a fellow developer, an enthusiast of technology, or simply curious about the world of web development, I invite you to join me on this journey. Let's connect, share ideas, and create amazing things together!

Thank you for being a part of my journey.

Warm regards,
Moayyad Saleh
`;
const contactContent = `
Feel free to get in touch with me if you have any questions, suggestions, or if you'd like to collaborate on a project. I'm always excited to connect and engage with fellow developers and technology enthusiasts.

📧 Email: moayyadalazzam@gmail.com
📞 Phone: 406-304-8344

Whether you're interested in discussing web development, sharing ideas, or just having a friendly chat, don't hesitate to reach out. Your feedback and interactions are invaluable to me.

Looking forward to hearing from you!

Best regards,
Moayyad Saleh
`;

// Set the view engine to EJS
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
//let posts = [];



//Establish data base connction
const uri = "mongodb+srv://moayyadalazzam:GVtPjkX8hHChmG7j@cluster0.348ct3z.mongodb.net/blogDB?retryWrites=true&w=majority";
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB');
  });
  
// Define the schema 
const blogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    dateAdded: {
        type: Date,
        default: Date.now,
    },
});

// Create the model using the defined schema
const BlogPost = mongoose.model('BlogPost', blogPostSchema);


app.get('/', (req, res) => {
    BlogPost.find()
        .then(posts => {
            res.render('home', { homeStartingContent: homeStartingContent, posts: posts });
        })
        .catch(error => {
            console.error('Error fetching blog posts:', error);
            res.status(500).json({ error: 'Error fetching blog posts' });
        });
});

app.get('/about', (req, res) => {
    res.render('about', {aboutContent: aboutContent});
});

app.get('/contact', (req, res) => {
    res.render('contact', {contactContent: contactContent });
});

app.get('/compose', (req, res) => {
    res.render('compose', {contactContent: contactContent });
});

app.post('/compose', (req, res) => {
    const post = {
        title: req.body.userInput,
        content: req.body.userCompose
    };

    // Create a new blog post instance
    const newBlogPost = new BlogPost({
        title: post.title,
        content: post.content,
        dateAdded: new Date() 
    });
    
    // Save the new blog post to the database
    newBlogPost.save()
        .then(savedPost => {
            console.log('New blog post saved:', savedPost);
            res.redirect("/"); // Redirect to the home page
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ error: 'An error occurred' });
        });
});


app.get('/post/:postId', (req, res) => {
    const postId = req.params.postId;

    // Fetch the specific post from the database using postId
    BlogPost.findById(postId)
        .then(post => {
            if (!post) {
                console.log(`Post with ID ${postId} not found`);
                return res.status(404).send('Post not found');
            }

            res.render('post', { post: post });
        })
        .catch(error => {
            console.error('Error fetching post:', error);
            res.status(500).send('An error occurred while fetching the post');
        });
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port || 3000}`);
});