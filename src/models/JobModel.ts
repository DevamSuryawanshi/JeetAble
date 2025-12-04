export interface JobModel {
  _id?: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salaryRange: string;
  createdAt?: Date;
}