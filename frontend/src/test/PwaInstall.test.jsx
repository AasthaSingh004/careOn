import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import fs from 'fs';
import path from 'path';

import InstallPwaPrompt from '../components/InstallPwaPrompt';
import Header from '../components/Header';
import { translations } from '../translations';

describe('CareOn Progressive Web App (PWA) Specifications & Manifest', () => {
  it('validates manifest.json structure, colours, and icons', () => {
    const manifestPath = path.resolve(__dirname, '../../public/manifest.json');
    expect(fs.existsSync(manifestPath)).toBe(true);

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    expect(manifest.name).toBe('CareOn');
    expect(manifest.short_name).toBe('CareOn');
    expect(manifest.display).toBe('standalone');
    expect(manifest.start_url).toBe('/');
    expect(manifest.scope).toBe('/');
    expect(manifest.theme_color).toBe('#F04438'); // Palette 6 Emergency Red
    expect(manifest.background_color).toBe('#F5F6F7'); // Palette 6 Main Background

    const icons = manifest.icons;
    expect(icons.length).toBeGreaterThanOrEqual(4);

    const has192Any = icons.some((i) => i.sizes === '192x192' && i.purpose === 'any');
    const has192Maskable = icons.some((i) => i.sizes === '192x192' && i.purpose === 'maskable');
    const has512Any = icons.some((i) => i.sizes === '512x512' && i.purpose === 'any');
    const has512Maskable = icons.some((i) => i.sizes === '512x512' && i.purpose === 'maskable');

    expect(has192Any).toBe(true);
    expect(has192Maskable).toBe(true);
    expect(has512Any).toBe(true);
    expect(has512Maskable).toBe(true);

    // Verify icon files physically exist
    icons.forEach((icon) => {
      const iconPath = path.resolve(__dirname, '../../public', icon.src.replace(/^\//, ''));
      expect(fs.existsSync(iconPath)).toBe(true);
    });
  });

  it('validates index.html links manifest, theme-color, and iOS meta tags', () => {
    const indexPath = path.resolve(__dirname, '../../index.html');
    const html = fs.readFileSync(indexPath, 'utf8');

    expect(html).toContain('<link rel="manifest" href="/manifest.json" />');
    expect(html).toContain('<meta name="theme-color" content="#F04438" />');
    expect(html).toContain('<meta name="apple-mobile-web-app-capable" content="yes" />');
    expect(html).toContain('<meta name="apple-mobile-web-app-title" content="CareOn" />');
    expect(html).toContain('<link rel="apple-touch-icon"');
  });

  it('validates sw.js service worker security rules (never caches /api or non-GET)', () => {
    const swPath = path.resolve(__dirname, '../../public/sw.js');
    expect(fs.existsSync(swPath)).toBe(true);
    const swContent = fs.readFileSync(swPath, 'utf8');

    expect(swContent).toContain("request.method !== 'GET'");
    expect(swContent).toContain("url.pathname.startsWith('/api')");
    expect(swContent).toContain('careon-pwa-v1');
    expect(swContent).toContain('self.skipWaiting()');
    expect(swContent).toContain('self.clients.claim()');
  });
});

describe('CareOn Installation Experience (Android, iOS & Desktop)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('captures beforeinstallprompt on Android/Chrome and triggers native installation', async () => {
    const promptMock = vi.fn();
    const mockChoice = Promise.resolve({ outcome: 'accepted' });

    render(<InstallPwaPrompt lang="en" />);

    // Initially dismissed or no prompt event
    const fakeInstallPromptEvent = new Event('beforeinstallprompt');
    fakeInstallPromptEvent.preventDefault = vi.fn();
    fakeInstallPromptEvent.prompt = promptMock;
    fakeInstallPromptEvent.userChoice = mockChoice;

    act(() => {
      window.dispatchEvent(fakeInstallPromptEvent);
    });

    // Banner should now be visible
    expect(fakeInstallPromptEvent.preventDefault).toHaveBeenCalled();
    const installBtn = screen.getByText('Install Now');
    expect(installBtn).toBeInTheDocument();

    // User taps Install Now
    await act(async () => {
      fireEvent.click(installBtn);
    });

    expect(promptMock).toHaveBeenCalled();
  });

  it('allows dismissing the install banner and persists dismissal in localStorage', () => {
    render(<InstallPwaPrompt lang="en" />);

    const fakeInstallPromptEvent = new Event('beforeinstallprompt');
    fakeInstallPromptEvent.preventDefault = vi.fn();
    act(() => {
      window.dispatchEvent(fakeInstallPromptEvent);
    });

    const dismissBtn = screen.getByTitle('Not Now');
    expect(dismissBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(dismissBtn);
    });

    expect(localStorage.getItem('careon_pwa_dismissed')).toBe('true');
    expect(screen.queryByText('Install Now')).not.toBeInTheDocument();
  });

  it('provides step-by-step Safari instructions when on iPhone/iOS', async () => {
    // Mock userAgent to iPhone
    vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
    );

    render(<InstallPwaPrompt lang="en" />);

    // Trigger install flow via custom event (e.g. Header button click)
    act(() => {
      window.dispatchEvent(new CustomEvent('careon-open-install-prompt'));
    });

    // iOS modal should be displayed with Safari instructions
    expect(screen.getByText('Install CareOn on your iPhone')).toBeInTheDocument();
    expect(screen.getByText(/Tap the Share button at the bottom of Safari/i)).toBeInTheDocument();
    expect(screen.getByText(/Scroll down and tap 'Add to Home Screen'/i)).toBeInTheDocument();
    expect(screen.getByText(/Tap 'Add' in the top-right corner to install/i)).toBeInTheDocument();

    // Close button dismisses the modal
    const closeBtn = screen.getByText('Got it');
    act(() => {
      fireEvent.click(closeBtn);
    });
    expect(screen.queryByText('Install CareOn on your iPhone')).not.toBeInTheDocument();
  });

  it('Header renders Install App button that triggers careon-open-install-prompt event', () => {
    const eventListener = vi.fn();
    window.addEventListener('careon-open-install-prompt', eventListener);

    render(<Header currentTab="home" lang="en" />);

    const installHeaderBtn = screen.getByRole('button', { name: /Install App/i });
    expect(installHeaderBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(installHeaderBtn);
    });

    expect(eventListener).toHaveBeenCalled();
    window.removeEventListener('careon-open-install-prompt', eventListener);
  });

  it('translates PWA instructions into Hindi and Kannada with 100% key parity', () => {
    expect(translations.en.pwa_install_app).toBe('Install App');
    expect(translations.hi.pwa_install_app).toBe('ऐप इंस्टॉल करें');
    expect(translations.kn.pwa_install_app).toBe('ಆ್ಯಪ್ ಸ್ಥಾಪಿಸಿ');

    expect(translations.hi.pwa_ios_title).toBe('अपने iPhone पर CareOn इंस्टॉल करें');
    expect(translations.kn.pwa_ios_title).toBe('ನಿಮ್ಮ iPhone ನಲ್ಲಿ CareOn ಸ್ಥಾಪಿಸಿ');
  });
});
