import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const Ecommerce = () => (
  <Routes>
    <Route path="*" element={<Navigate to="watch-list" replace />} />
  </Routes>
);

export default Ecommerce;
