import SearchContainer from "@/features/search/SearchContainer";

function SearchClient({ initialSearchData }) {
  return (
    <div className="w-full justify-center md:flex">
      <SearchContainer initialSearchData={initialSearchData} />
    </div>
  );
}

export default SearchClient;
