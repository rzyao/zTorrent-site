
import { fetch } from 'undici';

async function checkRoutes() {
    console.log('Fetching API definition from http://localhost:48230/api-docs-json ...');
    try {
        const response = await fetch('http://localhost:48230/api-docs-json');
        const spec = await response.json() as any;
        console.log('Global Prefix / Servers:', spec.servers); // Check base url definition
        
        // ... (rest is same)
        const paths = Object.keys(spec.paths || {});
        
        console.log('\n--- Found Navigation Routes ---');
        const navRoutes = paths.filter(p => p.includes('navigation'));
        
        if (navRoutes.length === 0) {
            console.log('No routes found containing "navigation".');
        } else {
            navRoutes.forEach(route => {
                const methods = Object.keys(spec.paths[route]).map(m => m.toUpperCase()).join(', ');
                console.log(`${methods.padEnd(7)} ${route}`);
            });
        }
    } catch (err) { console.error(err); }
}

checkRoutes();
