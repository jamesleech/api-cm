export interface Site {
  date: string;
  lgas: string;
  advice: string;
  location: string;
  address: string;
  suburb: string;
  dateText: string;
  timeText: string;
  added: string;
  data?: {
    postcode: string; suburb: string; state: string; latitude: number; longitude: number;
  };
}
