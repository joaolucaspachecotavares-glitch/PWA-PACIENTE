import { PatientShell } from "@/components/patient-shell";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <PatientShell>{children}</PatientShell>;
}
