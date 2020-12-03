import React from 'react';

const Logo = ({className}) => {
    return (
        <svg className={`logo ${className}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M391.614,512H301.205A120.522,120.522,0,0,1,180.819,391.614v-56.4h59.953v56.4a60.5,60.5,0,0,0,60.433,60.433h90.409a60.5,60.5,0,0,0,60.433-60.433v-45.2a60.5,60.5,0,0,0-60.433-60.433H120.386A120.523,120.523,0,0,1,0,165.59v-45.2A120.522,120.522,0,0,1,120.386,0H210.8A120.522,120.522,0,0,1,331.181,120.386v56.572H271.228V120.386A60.5,60.5,0,0,0,210.8,59.953H120.386a60.5,60.5,0,0,0-60.433,60.433v45.2a60.5,60.5,0,0,0,60.433,60.433H391.614A120.523,120.523,0,0,1,512,346.41v45.2A120.522,120.522,0,0,1,391.614,512Z"/>
        </svg>
    );
};

export default Logo;