import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/pages/Home";
import Signup from "./components/pages/Signup";
import Login from "./components/pages/Login";
import CreateBlog from "./components/pages/CreateBlog";
import BlogDetail from "./components/pages/BlogDetail";
import EditBlog from "./components/pages/EditBlog";
import MyBlogs from "./components/pages/MyBlogs"

function App() {
    return (
        <Router>
            <Navbar />
       
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/create" element={<CreateBlog />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
               <Route path="/edit-blog/:id" element={<EditBlog />} />
               <Route path="/myblogs" element={<MyBlogs/>} />

            </Routes>
        </Router>
    );
}

export default App;
