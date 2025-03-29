import { useEffect, useState } from 'react';

function CategoryFilter({
  selectedCategories,
  setSelectedCategories,
}: {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          'https://localhost:4000/api/book/GetBookCategories',
        );
        const data = await response.json();
        console.log('Fetched categories:', data);

        const uniqueCategories: string[] = Array.from(new Set(data));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };
    fetchCategories();
  }, []);

  function handleCheckboxChange({ target }: { target: HTMLInputElement }) {
    const updatedCategories = selectedCategories.includes(target.value)
      ? selectedCategories.filter((x) => x !== target.value)
      : [...selectedCategories, target.value];

    setSelectedCategories(updatedCategories);
  }
  return (
    <div className="category-filter">
      <h5>Book Categories</h5>
      <div className="category-list">
        {categories.map((c, index) => (
          <div key={`category-${index}-${c}`} className="category-item">
            <input
              type="checkbox"
              id={`category-${index}`} // Make ID unique with index
              value={c}
              className="category-checkbox"
              onChange={handleCheckboxChange}
              checked={selectedCategories.includes(c)} // Added checked state
            />
            <label htmlFor={`category-${index}-${c}`}>{c}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;
