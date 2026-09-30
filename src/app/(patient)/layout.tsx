import { PatientShell } from "@/components/patient-shell";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return <PatientShell>{children}</PatientShell>;
}
