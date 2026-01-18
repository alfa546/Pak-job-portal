export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  apply_url: string;
  job_id?: string | null;
  employment_type?: string | null;
  description?: string | null;
  category?: string | null;
  created_at?: string;
  updated_at?: string;
}

export const jobs: Job[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "Tech Solutions Pakistan",
    location: "Karachi",
    apply_url: "https://example.com/apply/1",
  },
  {
    id: "2",
    title: "Frontend Developer",
    company: "Digital Innovations",
    location: "Lahore",
    apply_url: "https://example.com/apply/2",
  },
  {
    id: "3",
    title: "Full Stack Developer",
    company: "Cloud Systems",
    location: "Islamabad",
    apply_url: "https://example.com/apply/3",
  },
  {
    id: "4",
    title: "React Developer",
    company: "WebTech Pakistan",
    location: "Karachi",
    apply_url: "https://example.com/apply/4",
  },
  {
    id: "5",
    title: "Node.js Developer",
    company: "Startup Hub",
    location: "Lahore",
    apply_url: "https://example.com/apply/5",
  },
  {
    id: "6",
    title: "UI/UX Designer",
    company: "Creative Studio",
    location: "Islamabad",
    apply_url: "https://example.com/apply/6",
  },
  {
    id: "7",
    title: "DevOps Engineer",
    company: "TechCorp",
    location: "Karachi",
    apply_url: "https://example.com/apply/7",
  },
  {
    id: "8",
    title: "Product Manager",
    company: "Innovation Labs",
    location: "Lahore",
    apply_url: "https://example.com/apply/8",
  },
  {
    id: "9",
    title: "Data Scientist",
    company: "Analytics Pro",
    location: "Islamabad",
    apply_url: "https://example.com/apply/9",
  },
  {
    id: "10",
    title: "Mobile App Developer",
    company: "AppWorks",
    location: "Karachi",
    apply_url: "https://example.com/apply/10",
  },
  {
    id: "11",
    title: "Backend Developer",
    company: "Server Solutions",
    location: "Lahore",
    apply_url: "https://example.com/apply/11",
  },
  {
    id: "12",
    title: "Marketing Manager",
    company: "Growth Marketing",
    location: "Islamabad",
    apply_url: "https://example.com/apply/12",
  },
];
