// Spinner.js
import React from 'react';
import { Spinner as BootstrapSpinner } from 'react-bootstrap';

const SpinnerComponent = () => {
  return (
    <div className="spinner-overlay">
      <BootstrapSpinner animation="border" role="status">
      </BootstrapSpinner>
        <span className="sr-only">Loading...</span>
    </div>
  );
};

export default SpinnerComponent;
