// useFetch.js
import { useState, useEffect } from "react";
import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL;
// custom hook for performing GET request
const useFetchSchoolData = (token) => {
  const [campusData, setCampusData] = useState([]);
  const [levelData, setLevelData] = useState([]);
  const [gradeData, setGradeData] = useState([]);
  const [groupData, setGroupData] = useState([]);

  // const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // setLoading(true);
        const campusPromise = axios({
          method:'get',
          url: `${baseUrl}/campuses`,
          headers: {
            'Authorization': token
          }
        });

        const levelPromise = axios({
          method:'get',
          url: `${baseUrl}/levels`,
          headers: {
            'Authorization': token
          }
        });

        const gradePromise = axios({
          method:'get',
          url: `${baseUrl}/grades`,
          headers: {
            'Authorization': token
          }
        });

        const groupPromise = axios({
          method:'get',
          url: `${baseUrl}/groups`,
          headers: {
            'Authorization': token
          }
        });

        const [
          campusResponse,
          levelResponse,
          gradeResponse,
          groupResponse
          /* Promise.all is not supported in IE at all */
        ] = await Promise.all([
          campusPromise,
          levelPromise,
          gradePromise,
          groupPromise
        ])

        const isStatus200 = (
          campusResponse.status &&
          levelResponse.status &&
          gradeResponse.status &&
          groupResponse.status
        ) === 200

        if (isStatus200) {
          setCampusData(campusResponse.data)
          setLevelData(levelResponse.data)
          setGradeData(gradeResponse.data)
          setGroupData(groupResponse.data)
        } else {
          throw new Error("An error has ocurred");
        }

      } catch (error) {
        throw error;
      }
      //  finally {
      //   setLoading(false);
      // }
    };
    fetchData()
  }, []);

  return { campusData, levelData, gradeData, groupData };
};

export default useFetchSchoolData;
