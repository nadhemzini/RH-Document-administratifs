'use client';

import { useState, useEffect } from 'react';
import { InputSwitch } from 'primereact/inputswitch';
import { Tooltip } from 'primereact/tooltip';
import { classNames } from 'primereact/utils';

const _changeTheme = (newTheme: string, colorScheme: string) => {
    const themeLink = document.getElementById('theme-css') as HTMLLinkElement;

    if (themeLink) {
        const href = themeLink.getAttribute('href');
        if (!href) return;

        const newHref = href.replace(/themes\/.*\/theme\.css/, `themes/${newTheme}/theme.css`);
        themeLink.setAttribute('href', newHref);

        document.documentElement.setAttribute('data-theme', colorScheme); // Optional for styling
    }
};

const DarkModeToggle = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            _changeTheme('lara-light-blue', 'light');
            setIsDark(false);
        }
    }, []);

    const toggleTheme = (checked: boolean) => {
        const newTheme = checked ? 'lara-dark-blue' : 'lara-light-blue';
        const colorScheme = checked ? 'dark' : 'light';
        _changeTheme(newTheme, colorScheme);
        setIsDark(checked);
    };

    return (
        <div className="flex align-items-center gap-2">
            <i className={classNames('pi', { 'pi-moon': isDark, 'pi-sun': !isDark })} />
            <InputSwitch checked={isDark} onChange={(e) => toggleTheme(e.value)} />
        </div>
    );
};

export default DarkModeToggle;
