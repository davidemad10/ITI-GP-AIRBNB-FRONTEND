import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axios";
import ContactButton from "../../components/ContactButton";
import PropertyList from "../../components/property/propertyList";
import EditProperty from "../../components/property/EditProperty";

const LandlordDetailPage = () => {
  const { id } = useParams();
  const [landlord, setLandlord] = useState(null);
  const [userId, setUserId] = useState(null);
  const [landlordId, setLandlordId] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const landlordData = await axiosInstance.get(`/api/auth/${id}/`);
        setLandlord(landlordData.data);
        setLandlordId(landlordData.data.id);
        const currentUserId = localStorage.getItem("userId");
        if (currentUserId) {
          setUserId(currentUserId);
        } else {
          console.error("No userId found in localStorage");
        }
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <aside className="col-md-3 mb-4">
          <div className="card text-center p-4 border-0 shadow-sm">
            <img
              src={
                landlord.avatar ||
                "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"
              }
              alt={landlord.username}
              width="200"
              height="200"
              className="img-fluid rounded mx-auto d-block"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg";
              }}
            />
            <h1 className="mt-3 h4">{landlord.username}</h1>
            <p className="mt-3">{landlord.email}</p>
            <p><i className="bi bi-shield-check me-2"></i> Identity verified</p>
            <p><i className="bi bi-award me-2"></i> Superhost</p>
            <p>Response rate: 100%</p>
            <p>Response time: within an hour</p>
            {userId !== landlordId && (
              <ContactButton userId={userId} landlordId={landlordId} />
            )}
          </div>
        </aside>

        <div className="col-md-9">
          <h2 className="mb-4">Properties by {landlord.username}</h2>
          <p className="mb-4">
            Hi, I'm {landlord.username}! I love hosting and meeting people from all over the world.
            I'm passionate about travel, food, and creating memorable experiences for my guests.
          </p>
          <PropertyList landlord_id={id} isLandlordPage={true} />
        </div>

        {/* Include the EditProperty modal */}
        <EditProperty />
      </div>
    </div>
  );
};

export default LandlordDetailPage;
