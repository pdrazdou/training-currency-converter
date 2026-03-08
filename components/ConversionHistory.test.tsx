import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConversionHistory from './ConversionHistory';
import { ConversionResult } from '@/types';

describe('ConversionHistory', () => {
  const baseTimestamp = Date.now();
  const history: ConversionResult[] = [
    {
      from: 'USD',
      to: 'EUR',
      amount: 100,
      result: 85,
      rate: 0.85,
      timestamp: baseTimestamp,
    },
    {
      from: 'GBP',
      to: 'JPY',
      amount: 50,
      result: 7500,
      rate: 150,
      timestamp: baseTimestamp - 100000,
    },
  ];

  it('renders header, toggle button, and clear button when history exists', () => {
    render(
      <ConversionHistory
        history={history}
        showHistory={false}
        onToggle={jest.fn()}
        onClear={jest.fn()}
        onLoadConversion={jest.fn()}
      />
    );
    expect(screen.getByText('Conversion History')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Show \(2\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Clear History/i })).toBeInTheDocument();
  });

  it('shows clear button when history exists', () => {
    render(
      <ConversionHistory
        history={history}
        showHistory={true}
        onToggle={jest.fn()}
        onClear={jest.fn()}
        onLoadConversion={jest.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /Clear History/i })).toBeInTheDocument();
  });

  it('does not show clear button when history is empty', () => {
    render(
      <ConversionHistory
        history={[]}
        showHistory={true}
        onToggle={jest.fn()}
        onClear={jest.fn()}
        onLoadConversion={jest.fn()}
      />
    );
    expect(screen.queryByRole('button', { name: /Clear History/i })).not.toBeInTheDocument();
  });

  it('shows empty state when history is empty and showHistory is true', () => {
    render(
      <ConversionHistory
        history={[]}
        showHistory={true}
        onToggle={jest.fn()}
        onClear={jest.fn()}
        onLoadConversion={jest.fn()}
      />
    );
    expect(screen.getByText('No conversion history yet')).toBeInTheDocument();
  });

  it('does not show history list when showHistory is false', () => {
    render(
      <ConversionHistory
        history={history}
        showHistory={false}
        onToggle={jest.fn()}
        onClear={jest.fn()}
        onLoadConversion={jest.fn()}
      />
    );
    expect(screen.queryByText(/USD →/)).not.toBeInTheDocument();
    expect(screen.queryByText(/GBP →/)).not.toBeInTheDocument();
  });

  it('renders all conversion items with correct data', () => {
    render(
      <ConversionHistory
        history={history}
        showHistory={true}
        onToggle={jest.fn()}
        onClear={jest.fn()}
        onLoadConversion={jest.fn()}
      />
    );
    expect(screen.getByText(/100.00 USD → 85.00 EUR/)).toBeInTheDocument();
    expect(screen.getByText(/Rate: 1 USD = 0.8500 EUR/)).toBeInTheDocument();
    expect(screen.getByText(/50.00 GBP → 7500.00 JPY/)).toBeInTheDocument();
    expect(screen.getByText(/Rate: 1 GBP = 150.0000 JPY/)).toBeInTheDocument();
  });

  it('formats timestamp correctly for each item', () => {
    render(
      <ConversionHistory
        history={history}
        showHistory={true}
        onToggle={jest.fn()}
        onClear={jest.fn()}
        onLoadConversion={jest.fn()}
      />
    );
    history.forEach((item) => {
      expect(
        screen.getByText(new Date(item.timestamp).toLocaleString())
      ).toBeInTheDocument();
    });
  });

  it('calls onToggle when toggle button is clicked', async () => {
    const user = userEvent.setup();
    const onToggle = jest.fn();
    render(
      <ConversionHistory
        history={history}
        showHistory={false}
        onToggle={onToggle}
        onClear={jest.fn()}
        onLoadConversion={jest.fn()}
      />
    );
    await user.click(screen.getByRole('button', { name: /Show \(2\)/i }));
    expect(onToggle).toHaveBeenCalled();
  });

  it('calls onClear when clear button is clicked', async () => {
    const user = userEvent.setup();
    const onClear = jest.fn();
    render(
      <ConversionHistory
        history={history}
        showHistory={true}
        onToggle={jest.fn()}
        onClear={onClear}
        onLoadConversion={jest.fn()}
      />
    );
    await user.click(screen.getByRole('button', { name: /Clear History/i }));
    expect(onClear).toHaveBeenCalled();
  });

  it('calls onLoadConversion with correct data when item is clicked', async () => {
    const user = userEvent.setup();
    const onLoadConversion = jest.fn();
    render(
      <ConversionHistory
        history={history}
        showHistory={true}
        onToggle={jest.fn()}
        onClear={jest.fn()}
        onLoadConversion={onLoadConversion}
      />
    );
    const firstItem = screen.getByText(/100.00 USD → 85.00 EUR/);
    await user.click(firstItem.closest('div[role="button"], .cursor-pointer'));
    expect(onLoadConversion).toHaveBeenCalledWith(history[0]);
  });

  it('toggle button text changes based on showHistory', () => {
    const { rerender } = render(
      <ConversionHistory
        history={history}
        showHistory={false}
        onToggle={jest.fn()}
        onClear={jest.fn()}
        onLoadConversion={jest.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /Show \(2\)/i })).toBeInTheDocument();
    rerender(
      <ConversionHistory
        history={history}
        showHistory={true}
        onToggle={jest.fn()}
        onClear={jest.fn()}
        onLoadConversion={jest.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /Hide \(2\)/i })).toBeInTheDocument();
  });

  it('handles different timestamp formats', () => {
    const unixTimestamp = Math.floor(Date.now() / 1000) * 1000; // ms
    const isoTimestamp = new Date().toISOString();
    const customHistory: ConversionResult[] = [
      {
        from: 'USD',
        to: 'EUR',
        amount: 10,
        result: 8.5,
        rate: 0.85,
        timestamp: Number(unixTimestamp),
      },
      {
        from: 'USD',
        to: 'EUR',
        amount: 20,
        result: 17,
        rate: 0.85,
        timestamp: Date.parse(isoTimestamp),
      },
    ];
    render(
      <ConversionHistory
        history={customHistory}
        showHistory={true}
        onToggle={jest.fn()}
        onClear={jest.fn()}
        onLoadConversion={jest.fn()}
      />
    );
    customHistory.forEach((item) => {
      const formatted = new Date(item.timestamp).toLocaleString();
      const matches = screen.getAllByText(formatted);
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });
  });
});
