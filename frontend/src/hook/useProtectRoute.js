// const useProtectRoute = ()=>{
//     const token = localStorage.getItem("token");
//     if (token != null) {
//       window.location.replace("/")
//     }
// }
// export default useProtectRoute;


import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const token = localStorage.getItem('token');
  const publicPages = ['/index-two', '/job-categories', '/job-grid-two', '/job-list-one', '/aboutus', '/services', '/pricing', '/helpcenter-overview', '/helpcenter-faqs', '/helpcenter-guides', '/helpcenter-support', '/blogs', '/blog-sidebar', '/blog-detail', '/blog-detail/:id', '/change-password', '/En-change-password'];

  // Nếu đường dẫn hiện tại là một trong các trang công khai và người dùng không có token, thì cho phép truy cập
  if (!token && publicPages.includes(rest.path)) {
    return <Component {...rest} />;
  }

  // Nếu không có token, và đường dẫn không phải là một trong các trang công khai, thì chuyển hướng về trang chính
  if (!token) {
    return <Navigate to="/" />;
  }

  // Nếu có token, người dùng được phép truy cập vào trang
  return <Component {...rest} />;
};

export default ProtectedRoute;

