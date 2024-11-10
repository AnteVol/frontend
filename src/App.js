import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

axios.defaults.baseURL = 'https://web2-lab2-4fsj.onrender.com';
axios.defaults.withCredentials = true;

function App() {
    const [userInput, setUserInput] = useState('');
    const [renderedContent, setRenderedContent] = useState('');
    const [xssProtection, setXssProtection] = useState(true);
    const [accessControlEnabled, setAccessControlEnabled] = useState(true);
    const [userData, setUserData] = useState(null);
    const [protectedData, setProtectedData] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showInstructions, setShowInstructions] = useState(true);

    const handleXSSTest = async () => {
        try {
            const response = await axios.post('/api/comments', {
                content: userInput,
                xssProtection
            });
            console.log(response.data)
            setRenderedContent(response.data.content);
        } catch (error) {
            console.error('XSS test error:', error);
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
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const fetchProtectedData = async () => {
        try {
            const response = await axios.get('/api/protected-data', {
                params: { accessControlEnabled }
            });
            setProtectedData(response.data.data);
        } catch (error) {
            console.error('Fetch protected data error:', error);
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
                    <li><code>&lt;svg onload="alert('SVG XSS!')"&gt;&lt;/svg&gt;</code></li>
                    <li><code>&lt;input onfocus="alert('Focus XSS!')" value="Click here"&gt;</code></li>
                    <li><code>&lt;form onsubmit="alert('Form XSS!'); return false;"&gt;&lt;input type="submit" value="Submit"&gt;&lt;/form&gt;</code></li>
                    <li><code>&lt;body onload="alert('Body XSS!')"&gt;&lt;/body&gt;</code></li>
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

            <div>
                <h3>⚠️ Napomena:</h3>
                <p>Ova aplikacija je napravljena u edukativne svrhe za demonstraciju sigurnosnih ranjivosti. 
                   Ne koristite prikazane tehnike na stvarnim web stranicama jer je to protuzakonito!</p>
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
                                onChange={(e) => setXssProtection(e.target.checked)}
                            />
                            XSS Protection
                        </label>
                    </div>
                    <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Unesite HTML/JavaScript kod za testiranje"
                        className="text-area"
                    />
                    <button 
                        onClick={handleXSSTest}
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
                                onChange={(e) => setAccessControlEnabled(e.target.checked)}
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