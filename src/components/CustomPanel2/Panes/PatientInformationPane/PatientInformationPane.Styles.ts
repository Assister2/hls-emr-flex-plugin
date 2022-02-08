import styled from 'react-emotion';

export const PatientInformationPaneBodyStyles = styled('div')
  `
    background-color: white;
    color: black;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    font-size: 24px;
    
    .information {
      padding: 8px;
    }
    
    .divider {
      height: 2px;
      margin-bottom: 4px;
    }
    
    .patient-typography {
      margin-left: 8px;
      margin-bottom: 8px;
      margin-top: 8px;
      text-align: left;
      
    }
    
    .patient-info {
      margin-bottom: 8px;
    }

    .info {
      display: flex;
      flex-direction: column;
    }

    .patient-list-item {
      display: inline-block;
      padding-top: 5px;
      margin-bottom: 5px;
      margin: 0px 8px 8px 8px;
    }

    .patient-info {
      margin-left: 8px;
      font-size: 14px;
    }

    strong {
      font-weight: bold;
    }

    .patient-name {
      color: #F22F46;
    }

    .flex-row-container {
      display: flex;
      flex-direction: row;
      margin-left: 12px;
    }

    .flex-insurance-container {
      display: flex;
      flex-direction: row;
    }

    .scheduler-patient {
      display: flex;
      flex-direction: row;
      gap: 20px;
    }

    .column1 {

    }

    .column2 {
      height: auto;
      border-left: 2px solid gray;
      border-left: 2px solid gray;
      margin-left: 25px;
    }
    
    .column3 {
      display: flex;
      flex-direction: column;
      padding-left: 10px;
    }

    .insurance-info {
      font-weight: bold;
      margin-bottom: 10px;
      margin-top: 10px;
      font-size: 14px;
    }

    .insurance-content {
      margin-left: 14px;
      margin-bottom: 8px;
      font-size: 14px;
    }
  `;