import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
const REACT_APP_BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

interface HomeProps {
  setFirstName: (val: string) => void;
  setAuthorized: (val: boolean) => void;
}

const Home: React.FunctionComponent<HomeProps> = ({
  setFirstName,
  setAuthorized,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("message_token");
      if (!token) {
        setAuthorized(false);
        navigate("/login");
        return;
      }
      const res = await axios.get(REACT_APP_BACKEND_BASE_URL + "/api/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res && res.data && res.data.statusCode === 200) {
        setFirstName(res.data.data.first_name);
        setAuthorized(true);
        navigate("/message");
      } else {
        setAuthorized(false);
        navigate("/login");
      }
    };
    load();
  }, []);

  return <div></div>;
};

export default Home;
