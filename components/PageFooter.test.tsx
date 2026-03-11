import { render, screen } from '@testing-library/react';
import PageFooter from './PageFooter';

describe('PageFooter', () => {
  it('should display the hourly update notice', () => {
    render(<PageFooter />);
    expect(screen.getByText('Exchange rates are updated hourly')).toBeInTheDocument();
  });

  it('should display the copyright notice with the current year', () => {
    jest.useFakeTimers();
    const fixedDate = new Date('2024-01-01T00:00:00Z');
    jest.setSystemTime(fixedDate);

    try {
      render(<PageFooter />);
      const currentYear = fixedDate.getFullYear();
      expect(
        screen.getByText(`© ${currentYear} Godel Technologies. All rights reserved.`)
      ).toBeInTheDocument();
    } finally {
      jest.useRealTimers();
    }
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
