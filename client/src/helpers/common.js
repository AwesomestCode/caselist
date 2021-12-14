import { useState, useEffect } from 'react';

const now = new Date();
export { now as today };

export const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
export const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
export const currentMonth = now.getMonth();
export const currentYear = now.getFullYear();
export const previousYear = (now.getFullYear() - 1);
export const nextYear = (now.getFullYear() + 1);
export const startOfYear = currentMonth < 6 ? previousYear : currentYear;
export const endOfYear = currentMonth < 6 ? currentYear : nextYear;

export const academicYear = (year) => {
    // If passed a valid year, assume it's the start of the academic year
    if (parseInt(year)) {
        return `${year}-${year + 1}`;
    }

    // Otherwise, assume the current year
    if (currentMonth < 6) {
        return `${previousYear}-${currentYear}`;
    }
    return `${currentYear}-${nextYear}`;
};

export const useDeviceDetect = () => {
    const [width, setWidth] = useState(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

    return { isMobile: width <= 768 };
};

export const affName = (eventName) => {
    if (eventName === 'pf') { return 'Pro'; }
    return 'Aff';
};
export const negName = (eventName) => {
    if (eventName === 'pf') { return 'Con'; }
    return 'Neg';
};
export const normalizeSide = (side) => {
    switch (side) {
        case 'Aff': return 'Aff';
        case 'A': return 'Aff';
        case 'Pro': return 'Aff';
        case 'Neg': return 'Neg';
        case 'N': return 'Neg';
        case 'Con': return 'Neg';
        default: return side;
    }
};

export default null;
