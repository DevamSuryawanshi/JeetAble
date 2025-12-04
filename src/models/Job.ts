export interface Job {
  _id?: string;
  jobTitle: string;
  companyName: string;
  location: string;
  jobDescription: string;
  salaryRange: string;
  createdAt: Date;
  updatedAt: Date;
}