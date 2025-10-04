import { render } from '@wordpress/element';
import App from './App';
import './index.css';

const rootElement = document.getElementById('waypoint-app');

if (rootElement) {
    render(<App />, rootElement);
}
