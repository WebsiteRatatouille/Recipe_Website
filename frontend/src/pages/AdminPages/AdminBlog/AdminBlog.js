import React from "react";
import "./AdminBlog.css";

import BlogTable from "../../../components/BlogTable/BlogTable";

function AdminBlog() {
    return (
        <div className="admin-blog-wrapper">
            <div className="content">
                <BlogTable />
            </div>
        </div>
    );
}

export default AdminBlog;
