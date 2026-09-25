import type { Metadata } from "next";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { Quiz } from "../../components/Quiz";

export const metadata: Metadata = {
  title: "Which used mini PC is right for me?",
  description: "Answer six quick questions about your home server (Proxmox, Plex, router, storage, RAM, networking) and see which used Lenovo Tiny, OptiPlex Micro and EliteDesk Mini models fit, and why.",
  alternates: { canonical: "/which-mini-pc" },
};

export default function QuizPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Which mini PC?", href: "/which-mini-pc" }]} />
      <h1>Which used mini PC is right for me?</h1>
      <p className="lede">Six questions. Every answer becomes a plain yes/no requirement, and each result shows exactly which requirements it meets. No scores, no sponsored picks.</p>
      <Quiz />
    </>
  );
}
