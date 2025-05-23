import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import IdentityJson from '../artifacts/contracts/Identity.sol/Identity.json';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const SEPOLIA_RPC_URL = import.meta.env.VITE_SEPOLIA_RPC_URL;

const RECENT_KEY = 'recent_eth_addresses';

export default function App() {
    const [inputAddress, setInputAddress] = useState('');
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [error, setError] = useState('');
    const [recentAddresses, setRecentAddresses] = useState([]);

    useEffect(() => {
        const cached = JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
        setRecentAddresses(cached);
    }, []);

    function saveToRecent(address) {
        const updated = [
            address,
            ...recentAddresses.filter((a) => a !== address),
        ].slice(0, 5);
        setRecentAddresses(updated);
        localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    }

    async function fetchIdentity() {
        setError('');
        setUsername('');
        setProfilePicture('');

        if (!ethers.isAddress(inputAddress)) {
            setError('Invalid Ethereum address');
            return;
        }

        try {
            const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
            const contract = new ethers.Contract(
                CONTRACT_ADDRESS,
                IdentityJson.abi,
                provider
            );
            const [name, picture] = await contract.getIdentity(inputAddress);
            setUsername(name);
            setProfilePicture(picture);
            saveToRecent(inputAddress);
        } catch (e) {
            setError('Failed to fetch identity: ' + e.message);
        }
    }

    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f4f4f5',
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
        },
        card: {
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: '500px',
        },
        input: {
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontSize: '16px',
            marginBottom: '12px',
        },
        button: {
            width: '100%',
            padding: '10px',
            backgroundColor: '#4f46e5',
            color: '#fff',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
        buttonHover: {
            backgroundColor: '#4338ca',
        },
        error: {
            color: 'red',
            marginTop: '10px',
            fontSize: '14px',
            textAlign: 'center',
        },
        result: {
            marginTop: '20px',
            textAlign: 'center',
        },
        profileImg: {
            marginTop: '10px',
            borderRadius: '50%',
            width: '100px',
            height: '100px',
            objectFit: 'cover',
            border: '1px solid #ccc',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
                    🔍 Identity Lookup
                </h2>
                <input
                    type="text"
                    list="recent-addresses"
                    placeholder="Enter Ethereum address"
                    value={inputAddress}
                    onChange={(e) => setInputAddress(e.target.value)}
                    style={styles.input}
                />
                <datalist id="recent-addresses">
                    {recentAddresses.map((addr) => (
                        <option key={addr} value={addr} />
                    ))}
                </datalist>
                <button
                    style={styles.button}
                    onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor =
                            styles.buttonHover.backgroundColor)
                    }
                    onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor =
                            styles.button.backgroundColor)
                    }
                    onClick={fetchIdentity}
                >
                    Lookup
                </button>
                {error && <p style={styles.error}>{error}</p>}
                {username && (
                    <div style={styles.result}>
                        <p>
                            <strong>Username:</strong> {username}
                        </p>
                        <p>
                            <strong>Profile Picture URL:</strong>{' '}
                            {profilePicture}
                        </p>
                        {profilePicture && (
                            <img
                                src={profilePicture}
                                alt="Profile"
                                style={styles.profileImg}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
