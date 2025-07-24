import { ResetPasswordPage } from "./_component";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ResetPasswordPage id={id} />;
}
