export function emailTemplate(email: string, code: string): string {
  return `
    <html>
      <head>
        <title>Verificação de Email</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
      </head>
      <body>
        <div class="container mx-auto p-4">
          <table class="w-96">
            <tbody>
              <tr>
                <td>
                  <p>
                    Por favor, use o código de verificação abaixo para confirmar que o endereço de
                    e-mail pertence à sua Empresa.
                  </p>
                  <p>Código de verificação: ${code}</p>
                  <p>
                    Esta mensagem foi enviada para ${email} a seu pedido.
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  `;
}
