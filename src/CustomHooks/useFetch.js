// useFetch.js
import { useState, useEffect } from "react";
import axios from "axios";

// custom hook for performing GET request
const useFetch = ({url, method, token}) => {
  const [data, setData] = useState([]);
  // this is if we want to display the loading state
  // const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // setLoading(true);
        const response = await axios({
          method: method,
          url: url,
          headers: { 
            'Authorization': token
          }
        });
        if (response.status === 200) {
          setData(response.data);
        }
      } catch (error) {
        throw error;
      }
      //  finally {
      //   setLoading(false);
      // }
    };
    fetchData();
  }, []);
  // console.log(data, "data")
  // return { loading, data };
  return data
};

export default useFetch;