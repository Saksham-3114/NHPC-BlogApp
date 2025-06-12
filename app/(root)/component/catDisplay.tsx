type Props = {
  categories: string[];
};

const CategoryDisplay = ({ categories }: Props) => {
  return (
    <div className="p-4 border rounded shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Added Categories</h2>
      {categories.length === 0 ? (
        <p className="text-gray-500">No categories added yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {category}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDisplay;
