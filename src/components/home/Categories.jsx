import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { categoryData } from "../../assets/category";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Categories.css";
import Filters from "./Filters";

const Categories = ({ dataCategory, updateSelectedCategory }) => {
  const categories = [
    {
      imageUrl:
        "https://cdn-icons-png.flaticon.com/512/126/126467.png",
      title: "All",
      value: "all",
    },
    ...categoryData.categoryBar.categories, // Keep existing categories
  ];

  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(dataCategory);
  const navigate = useNavigate();

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -200,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 200,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const scrollLeftPosition = scrollRef.current.scrollLeft;
    const maxScrollLeft =
      scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
    setShowLeftArrow(scrollLeftPosition > 0);
    setShowRightArrow(scrollLeftPosition < maxScrollLeft);
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    scrollElement.addEventListener("scroll", handleScroll);
    return () => scrollElement.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle category click to update state and URL
  const handleCategoryClick = (categoryTitle) => {
    const categorySlug =
      categoryTitle === "All" ? "" : categoryTitle.toLowerCase().replace(/\s+/g, "-");
    setSelectedCategory(categorySlug); // Update local state
    navigate(categorySlug ? `/category/${categorySlug}` : "/"); // Navigate to home or category

    // Call the updateSelectedCategory function
    if (typeof updateSelectedCategory === "function") {
      updateSelectedCategory(categorySlug); // Update parent with selected category
    }
  };

  useEffect(() => {
    // Update the parent component when the selected category changes
    if (typeof updateSelectedCategory === "function" && selectedCategory) {
      updateSelectedCategory(selectedCategory);
    }
  }, [selectedCategory, updateSelectedCategory]);

  return (
    <div className="categories-wrapper d-flex align-items-center">
      {showLeftArrow && (
        <button
          className="btn btn-outline-secondary scroll-btn"
          onClick={scrollLeft}
        >
          <i className="bi bi-chevron-left"></i>
        </button>
      )}
      <div className="d-flex overflow-auto py-2 categories-bar" ref={scrollRef}>
        {categories.map((category) => (
          <div
            key={category.title}
            className="text-center category-item"
            onClick={() => handleCategoryClick(category.title)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={category.imageUrl}
              alt={category.title}
              className="img-fluid category-icon"
            />
            <p className="category-title">{category.title}</p>
          </div>
        ))}
      </div>
      {showRightArrow && (
        <button
          className="btn btn-outline-secondary scroll-btn"
          onClick={scrollRight}
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      )}
      <Filters />
    </div>
  );
};

export default Categories;
