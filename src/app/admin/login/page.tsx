
import { getSettings } from "@/lib/db";
import { LoginForm } from "./_components/login-form";

export default async function AdminLoginPage() {
    const settings = await getSettings();

    return <LoginForm settings={settings} />;
}
