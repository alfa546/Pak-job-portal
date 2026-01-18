"use client";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Search..." }: SearchBarProps) {
  return (
    <div className="relative w-full group">
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full px-6 py-4 pl-14 pr-4 text-gray-700 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-lg shadow-sm hover:shadow-md"
      />
      <svg
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-blue-500 transition-colors"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
    </div>
  );
}
