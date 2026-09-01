export interface VisaData {
  id: string;
  photo?: string;
  idNumber: string;
  surname: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  
  // Passport Info
  passportNumber: string;
  passportType: string;
  dateOfExpiry: string;
  
  // Electronic Visa Info
  electronicVisaNumber: string;
  inviter: string;
  classificationOfVisa: string;
  entries: string;
  typeOfVisa: string;
  dateOfIssue: string;
  enterBefore: string;
  durationOfStay: string;
  inviterPhone: string;
  
  // Stamp & Overlay customization
  showStamps: boolean;
  notaryNumber?: string;
  notaryDate?: string;
  
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_VISA: Omit<VisaData, 'id'> = {
  photo: '',
  idNumber: '',
  surname: '',
  name: '',
  dateOfBirth: '',
  gender: 'MALE',
  nationality: '',
  passportNumber: '',
  passportType: 'ORDINARY',
  dateOfExpiry: '',
  electronicVisaNumber: '',
  inviter: '',
  classificationOfVisa: 'C7',
  entries: 'SINGLE',
  typeOfVisa: 'ENTRY',
  dateOfIssue: '',
  enterBefore: '',
  durationOfStay: '',
  inviterPhone: '',
  showStamps: false,
  notaryNumber: '',
  notaryDate: '',
};
