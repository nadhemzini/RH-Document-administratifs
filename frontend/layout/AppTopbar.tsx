'use client';
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { useRouter } from 'next/navigation';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const menu = useRef<Menu>(null);
    const router = useRouter();

    const items = [
        {
            label: 'Sign Out',
            icon: 'pi pi-sign-out',
            command: () => {
                router.push('/auth/login');
            }
        },
        {
            label: 'Profile',
            icon: 'pi pi-id-card',
            command: () => {
                router.push('/profile');
            }
        }
    ];

    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const _changeTheme = (newTheme: string, colorScheme: string) => {
        const themeLink = document.getElementById('theme-css') as HTMLLinkElement;

        if (themeLink) {
            const href = themeLink.getAttribute('href');
            if (!href) return;

            const newHref = href.replace(/themes\/.*\/theme\.css/, `themes/${newTheme}/theme.css`);
            themeLink.setAttribute('href', newHref);

            document.documentElement.setAttribute('data-theme', colorScheme); // Optional
        }
    };

    const [isDark, setIsDark] = useState(false);

    const toggleTheme = (checked: boolean) => {
        const newTheme = checked ? 'lara-dark-blue' : 'lara-light-blue';
        const colorScheme = checked ? 'dark' : 'light';
        _changeTheme(newTheme, colorScheme);
        setIsDark(checked);
    };

    return (
        <div className="layout-topbar">
            <Link href="/dashboard" className="layout-topbar-logo">
                <img src={`/layout/images/ISIM_LOGO_ar-removebg-preview.png`} width="47.22px" height={'35px'} alt="logo" />
                <span>ISIMM</span>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>
            <div className="flex align-items-center gap-2">
                <i className={`pi ${isDark ? 'pi-moon' : 'pi-sun'}`} />
                <InputSwitch checked={isDark} onChange={(e) => toggleTheme(e.value)} />
            </div>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <div>
                    <div className="relative">
                        <Button
                            type="button"
                            className="p-link layout-topbar-button"
                            onClick={(e) => menu.current?.toggle(e)}
                        >
                            <i className="pi pi-cog"></i>
                            <span>Settings</span>
                        </Button>

                        <Menu model={items} popup ref={menu} />
                    </div>
                </div>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;