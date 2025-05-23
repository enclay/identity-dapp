import React, { useState } from 'react';
import { ethers } from 'ethers';

import IdentityJson from '../artifacts/contracts/Identity.sol/Identity.json';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const SEPOLIA_RPC_URL = import.meta.env.VITE_SEPOLIA_RPC_URL;

export default function App() {
    const [inputAddress, setInputAddress] = useState('');
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [error, setError] = useState('');

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
        } catch (e) {
            setError('Failed to fetch identity: ' + e.message);
        }
    }

    return (
        <div style={{ padding: 20 }}>
            <h2>Identity Lookup</h2>
            <input
                type="text"
                placeholder="Enter Ethereum address"
                value={inputAddress}
                onChange={(e) => setInputAddress(e.target.value)}
                style={{ width: 400, marginRight: 8 }}
            />
            <button onClick={fetchIdentity}>Lookup</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {username && (
                <div style={{ marginTop: 20 }}>
                    <p>
                        <strong>Username:</strong> {username}
                    </p>
                    <p>
                        <strong>Profile Picture URL:</strong> {profilePicture}
                    </p>
                    {profilePicture && (
                        <img src={profilePicture} alt="Profile" width={100} />
                    )}
                </div>
            )}
        </div>
    );
}
