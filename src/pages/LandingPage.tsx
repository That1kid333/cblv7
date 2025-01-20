import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './LandingPage.css'; 

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, rider, driver, loading } = useAuth();

    useEffect(() => {
        if (!loading && user) {
            if (rider) {
                navigate('/rider/portal');
            } else if (driver) {
                navigate('/driver/portal');
            }
        }
    }, [loading, user, rider, driver, navigate]);

    const handleDriverClick = () => {
        navigate('/driver/login'); 
    };

    const handleRiderClick = () => {
        navigate('/rider/login'); 
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-[#C69249] text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div>
            <header style={{ textAlign: 'center', marginBottom: '20px' }}>
                <a href="https://www.citybucketlist.com" target="_blank" rel="noopener noreferrer">
                    <img src="https://aiautomationsstorage.blob.core.windows.net/cbl/citybucketlist%20logo.png" alt="City Bucket List Logo" className="main-logo" />
                </a>
            </header>
            <div className="landing-page" style={{ backgroundColor: 'black', color: 'white' }}>
                <h1>Welcome to Our Ride Sharing App</h1>
                <h2>Please select your role:</h2>
                <div className="button-container">
                    <button onClick={handleDriverClick}>I am a Driver</button>
                    <button onClick={handleRiderClick}>I am a Rider</button>
                </div>
                <img src="https://aiautomationsstorage.blob.core.windows.net/cbl/CBL%20PRIVATE%20MEMBERHIP%20ASSOCIATION%20SEAL.png" alt="Seal" className="seal-image" style={{ width: '100px' }} />
            </div>
        </div>
    );
};

export default LandingPage;
