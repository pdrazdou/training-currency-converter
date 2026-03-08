import { render, screen } from '@testing-library/react';
import PageFooter from './PageFooter';

describe('PageFooter', () => {
  it('should render exchange rates notice', () => {
    render(<PageFooter />);
    expect(screen.getByText(/exchange rates are updated hourly/i)).toBeInTheDocument();
  });

  it('should render copyright notice', () => {
    render(<PageFooter />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} Godel Technologies. All rights reserved.`)
    ).toBeInTheDocument();
  });

  it('should not render last updated when not provided', () => {
    render(<PageFooter />);
    expect(screen.queryByText(/last updated/i)).not.toBeInTheDocument();
  });

  it('should render last updated when provided', () => {
    const timestamp = new Date('2026-01-15T10:00:00Z').getTime();
    render(<PageFooter lastUpdated={timestamp} />);
    expect(screen.getByText(/last updated/i)).toBeInTheDocument();
  });
});
