import type { Metadata } from "next";
import 'primereact/resources/primereact.min.css'
import 'primereact/resources/themes/lara-dark-purple/theme.css'
import 'bulma/css/bulma.css'
import 'components/common/loader/loader.css'

export const metadata: Metadata = {
  title: "LavaJá",
  description: "",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-br">
      <body>
        {children}
      </body>
    </html>
  );
}
