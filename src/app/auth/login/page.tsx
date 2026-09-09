import { LoginForm } from "@/src/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-visual">
        <div className="login-brand">
        </div>

        <div className="visual-copy">
          <p className="eyebrow">PRUEBA TECNICA</p>

          <h1>Control de Inventario</h1>

          <p>
            Usuarios, productos, compras, ventas y kardex.
          </p>
        </div>

        <div className="visual-footer">
          <span>© 2026 Paul Romero</span>
        </div>
      </div>

      <LoginForm />
    </main>
  );
}
