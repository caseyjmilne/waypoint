import { useState } from '@wordpress/element';

function App() {
    const [message] = useState('Welcome to Waypoint');

    return (
        <div className="waypoint-container">
            <h1>{message}</h1>
            <p>Multi-set documentation management for WordPress</p>
        </div>
    );
}

export default App;
