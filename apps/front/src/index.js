import { render } from '@wordpress/element';
import App from './App';

const rootElement = document.getElementById('waypoint-app');

if (rootElement) {
    render(<App />, rootElement);
}
