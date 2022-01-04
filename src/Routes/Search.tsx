import { useLocation } from "react-router-dom";

function Search() {
    const location = useLocation();
    console.log(location);
    const keyword = new URLSearchParams(location.search).get("key");
    console.log()
    return null;
}

export default Search;