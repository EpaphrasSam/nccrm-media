export interface Reporter {
  id: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
}

const mockReporters: Reporter[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    organization: "Organization A",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    organization: "Organization B",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    phone: "+0987654321",
  },
];

export async function fetchReporters(): Promise<Reporter[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockReporters;
}
