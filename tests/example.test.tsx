import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// A simple component to test
const HelloWorld = () => {
  return <div>Hello, Testing World!</div>;
};

describe('Example test', () => {
  it('renders the component correctly', () => {
    render(<HelloWorld />);
    
    // Check if the component rendered with the expected text
    expect(screen.getByText('Hello, Testing World!')).toBeInTheDocument();
  });

  it('verifies Jest is working', () => {
    // A simple Jest assertion
    expect(1 + 1).toBe(2);
  });
});

