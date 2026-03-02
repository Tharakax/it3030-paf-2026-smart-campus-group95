import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: '#34495e',
            color: '#bdc3c7',
            padding: '1.5rem',
            textAlign: 'center',
            marginTop: 'auto'
        }}>
            <p style={{ margin: 0 }}>© {new Date().getFullYear()} UniSync - Smart Campus Operations Hub. All rights reserved.</p>
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                <span>IT3030 PAF Assignment</span>
            </div>
        </footer>
    );
};

export default Footer;
