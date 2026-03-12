import { render, screen } from '@testing-library/react';
import PageFooter from './PageFooter';

describe('PageFooter', () => {
  it('should render exchange rates update notice', () => {
    render(<PageFooter />);
    expect(screen.getByText('Exchange rates are updated hourly')).toBeInTheDocument();
  });

  it('should not render last updated when not provided', () => {
    render(<PageFooter />);
    expect(screen.queryByText(/Last updated:/)).not.toBeInTheDocument();
  });

  it('should render last updated when provided', () => {
    const timestamp = new Date('2026-01-15T10:00:00Z').getTime();
    render(<PageFooter lastUpdated={timestamp} />);
    expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
  });

  it('should display copyright notice with current year', () => {
    const fixedYear = 2026;
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-01T00:00:00Z'));

    try {
      render(<PageFooter />);
      expect(
        screen.getByText(`© ${fixedYear} Godel Technologies. All rights reserved.`)
      ).toBeInTheDocument();
    } finally {
      jest.useRealTimers();
    }
  });

  it('should have accessible copyright notice', () => {
    render(<PageFooter />);
    expect(screen.getByLabelText('Copyright notice')).toBeInTheDocument();
  });
});
