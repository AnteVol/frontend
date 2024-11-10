import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Configure axios defaults
axios.defaults.baseURL = 'https://web2-lab2-4fsj.onrender.com';
axios.defaults.withCredentials = true;

function App() {
    // User input states
    const [userInput, setUserInput] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Security feature states
    const [xssProtection, setXssProtection] = useState(true);
    const [accessControlEnabled, setAccessControlEnabled] = useState(true);
    const [lastFetchedWithControl, setLastFetchedWithControl] = useState(null);

    // Data states
    const [renderedContent, setRenderedContent] = useState('');
    const [userData, setUserData] = useState(null);
    const [protectedData, setProtectedData] = useState([]);
    
    // UI states
    const [showInstructions, setShowInstructions] = useState(true);

    // Log access control changes
    useEffect(() => {
        console.log('Access control setting changed to:', accessControlEnabled);
    }, [accessControlEnabled]);

    const handleXSS = async () => {
        try {
            const response = await axios.post('/api/handle-xss', {
                content: userInput,
                xssProtection
            });
            console.log('XSS Test Response:', response.data);
            setRenderedContent(response.data.content);
        } catch (error) {
            console.error('XSS Test Error:', error);
            setRenderedContent('Error processing content');
        }
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('/api/login', {
                username,
                password
            });
            setUserData(response.data.user);
            setShowInstructions(false);
            console.log('Login successful:', response.data.user);
        } catch (error) {
            console.error('Login error:', error);
            alert('Pogrešni podaci za prijavu!');
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout');
            setUserData(null);
            setProtectedData([]);
            setShowInstructions(true);
            setUsername('');
            setPassword('');
            console.log('Logout successful');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const fetchProtectedData = async () => {
        try {
            // Log the current state before making the request
            console.log('Fetching protected data with access control:', accessControlEnabled);
            setLastFetchedWithControl(accessControlEnabled);

            const response = await axios.get('/api/protected-data', {
                params: { accessControlEnabled }
            });
            console.log('Protected data response:', response.data);
            setProtectedData(response.data.data);
        } catch (error) {
            console.error('Fetch protected data error:', error);
            setProtectedData([]);
        }
    };

    const Instructions = () => (
        <div className="instructions">
            <h2>📚 Upute za korištenje</h2>
            
            <div className="instructions-section">
                <h3>Za korištenje, prvo se prijavite u sustav:</h3>
                <p>Dostupni korisnici:</p>
                <ul>
                    <li>Admin korisnik: username: <strong>admin</strong>, password: <strong>admin123</strong></li>
                    <li>Obični korisnik: username: <strong>user</strong>, password: <strong>user123</strong></li>
                </ul>
            </div>

            <div className="instructions-section">
                <h3>🔒 Testiranje XSS (Cross-Site Scripting) ranjivosti</h3>
                <p>1. Isključite XSS Protection checkbox</p>
                <p>2. Unesite neki od testnih kodova:</p>
                <ul>
                    <li><code>&lt;img src="x" onerror="alert('XSS!');"&gt;</code></li>
                    <li><code>&lt;a href="javascript:alert('Anchor XSS!')"&gt;Click me&lt;/a&gt;</code></li>
                    <li><code>&lt;div onmouseover="alert('Mouseover XSS!')"&gt;Hover over me&lt;/div&gt;</code></li>
                    <li><code>&lt;input onfocus="alert('Focus XSS!')" value="Click here"&gt;</code></li>
                    <li><code>&lt;form onsubmit="alert('Form XSS!'); return false;"&gt;&lt;input type="submit" value="Submit"&gt;&lt;/form&gt;</code></li>
                    <li><code>&lt;iframe srcdoc="&lt;script&gt;alert('iframe XSS!')&lt;/script&gt;"&gt;&lt;/iframe&gt;</code></li>
                    <li><code>&lt;video onerror="alert('Video XSS!');" src="invalid.mp4"&gt;&lt;/video&gt;</code></li>
                </ul>
            </div>

            <div className="instructions-section">
                <h3>🚫 Testiranje kontrole pristupa (Broken Access Control)</h3>
                <p>1. Prijavite se kao običan korisnik</p>
                <p>2. Isključite Access Control checkbox</p>
                <p>3. Kliknite "Fetch Protected Data" da vidite podatke kojima ne biste smjeli imati pristup</p>
                <p>4. Uključite Access Control da vidite razliku</p>
            </div>
        </div>
    );

    return (
        <div className="App">
            <h1 className="app-title">
                2. Laboratorijska vježba - security
            </h1>

            {showInstructions && <Instructions />}

            {!userData ? (
                <div className="login-section">
                    <h2>Login</h2>
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="login-input"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                        />
                        <button 
                            onClick={handleLogin}
                            className="btn btn-primary"
                        >
                            Login
                        </button>
                    </div>
                </div>
            ) : (
                <div className="user-info">
                    <p>Prijavljeni ste kao: <strong>{userData.username}</strong> ({userData.role})</p>
                    <button 
                        onClick={handleLogout}
                        className="btn btn-danger"
                    >
                        Logout
                    </button>
                </div>
            )}

            {userData && (
                <div className="xss-section">
                    <h2>XSS Test</h2>
                    <div>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={xssProtection}
                                onChange={(e) => {
                                    const newValue = e.target.checked;
                                    console.log('XSS Protection changed to:', newValue);
                                    setXssProtection(newValue);
                                }}
                            />
                            XSS Protection
                        </label>
                    </div>
                    <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Unesite HTML/JavaScript"
                        className="text-area"
                    />
                    <button 
                        onClick={handleXSS}
                        className="btn btn-primary"
                    >
                        Test XSS
                    </button>
                    <div>
                        <h3>Rezultat:</h3>
                        <div 
                            className="rendered-content"
                            dangerouslySetInnerHTML={{ __html: renderedContent }} 
                        />
                    </div>
                </div>
            )}

            {userData && (
                <div className="access-control-section">
                    <h2>Access Control Test</h2>
                    <div>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={accessControlEnabled}
                                onChange={(e) => {
                                    const newValue = e.target.checked;
                                    console.log('Access Control changed to:', newValue);
                                    setAccessControlEnabled(newValue);
                                }}
                            />
                            Access Control
                        </label>
                    </div>
                    <button 
                        onClick={fetchProtectedData}
                        className="btn btn-primary"
                    >
                        Dohvati podatke
                    </button>
                    <div>
                        <h3>Svi dostupni podaci za {username}:</h3>
                        {lastFetchedWithControl !== null && (
                            <p className="text-sm text-gray-600">
                                Last fetched with access control: {lastFetchedWithControl ? 'enabled' : 'disabled'}
                            </p>
                        )}
                        <ul className="protected-data-list">
                            {protectedData.map(item => (
                                <li key={item.id} className="protected-data-item">
                                    {item.content}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;