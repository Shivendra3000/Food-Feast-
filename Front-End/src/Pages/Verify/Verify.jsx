import React, { useContext, useEffect } from 'react';
import "./Verify.css";
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    if (!url) {
      console.error("API URL is missing or invalid:",url);
      navigate('/');
      return;
    }

    try {
      const response = await axios.post(url + "/api/verify", { success, orderId });

      if (response.data.success) {
        navigate("/myorders");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      navigate("/");
    }
  };

  useEffect(() => {
    if (success !== null && orderId !== null) {
      verifyPayment();
    }
  }, [success, orderId]);

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  
  );
};

export default Verify;
