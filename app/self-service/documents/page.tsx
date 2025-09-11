"use client"

import { MainLayout } from "@/components/main-layout";
import { MyDocumentsPage } from "@/components/self-service/my-documents-page";

export default function MyDocumentsPageRoute() {
  return (
    <MainLayout>
        <MyDocumentsPage />
    </MainLayout>
  );
}