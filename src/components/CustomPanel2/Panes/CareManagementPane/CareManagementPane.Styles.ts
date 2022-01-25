import styled from 'react-emotion';

export const CareManagementPaneStyles = styled('div')
  `
    background-color: white;
    border-radius: 5px 5px 5px 5px;
    box-shadow:
      0 2.8px 2.2px rgba(0, 0, 0, 0.034),
      0 6.7px 5.3px rgba(0, 0, 0, 0.048),
      0 12.5px 10px rgba(0, 0, 0, 0.06),
      0 22.3px 17.9px rgba(0, 0, 0, 0.072),
      0 41.8px 33.4px rgba(0, 0, 0, 0.086),
      0 100px 80px rgba(0, 0, 0, 0.12);
  `;

export const CareManagementPaneContentStyles = styled('div')
  `
    padding: 7px;
    color: black;

    .enroll-btn {
      background-color: #001489;
      color: white;
    }

    .checkboxes {
      
    }
    .check-item {
      margin-top: 10px;
      margin-bottom: 10px;
    }
  `;