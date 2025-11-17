import PageMeta from "../../../components/common/PageMeta";
import AuthLayout from "../../../layout/AuthPageLayout";
import SignInForm from "../../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Stahzin SignIn"
        description="SignIn admin page for Stahzin application"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
