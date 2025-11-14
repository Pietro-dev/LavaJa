'use client'

import 'primereact/resources/themes/lara-dark-purple/theme.css'
import 'bulma/css/bulma.css'
import 'components/common/loader/loader.css'
import { AuthProvider } from "../context/AuthContext";


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-br">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
