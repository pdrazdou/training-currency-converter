import { render, screen } from '@testing-library/react';
import PageFooter from './PageFooter';

describe('PageFooter', () => {
  it('should display the hourly update notice', () => {
    render(<PageFooter />);
    expect(screen.getByText('Exchange rates are updated hourly')).toBeInTheDocument();
  });

  it('should display the copyright notice with the current year', () => {
    render(<PageFooter />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} Godel Technologies. All rights reserved.`)
    ).toBeInTheDocument();
  });

  it('should not display last updated when lastUpdated is not provided', () => {
    render(<PageFooter />);
    expect(screen.queryByText(/Last updated:/)).not.toBeInTheDocument();
  });

  it('should display last updated timestamp when lastUpdated is provided', () => {
    const timestamp = new Date('2026-01-01T12:00:00Z').getTime();
    render(<PageFooter lastUpdated={timestamp} />);
    expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
  });
});
