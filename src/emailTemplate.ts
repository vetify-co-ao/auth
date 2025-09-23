export function emailTemplate(email: string, code: string): string {
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style type="text/css">
          :root {
            font-size: 16px;
          }

          body {
            margin: 0;
            padding: 0;
            word-spacing: normal;
            background-color: #cccccc;
          }

          table {
            border-collapse: collapse;
            border-spacing: 0;
          }

          td {
            padding: 0;
            vertical-align: top;
          }

          img {
            border: 0;
          }

          .wrapper {
            width: 100%;
            table-layout: fixed;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            background-color: #cccccc;
          }

          .main {
            background-color: #ffffff;
            margin: 0 auto;
            width: 100%;
            max-width: 600px;
            border-spacing: 0;

            font-family: "Poppins", sans-serif;
            font-weight: 300;
            font-size: 16px;
            color: #171a1b;
          }

          .bg-black {
            background-color: #171a1b;
          }

          .color-black {
            color: #171a1b;
          }

          .two-columns {
            text-align: center;
            font-size: 0;
          }

          .three-columns {
            text-align: center;
            font-size: 0;
            padding: 1rem 0 1.5rem;
          }

          .column {
            width: 100%;
            display: inline-block;
            vertical-align: top;
            text-align: center;
          }

          .two-columns .column {
            max-width: 300px;
          }

          .three-columns .column {
            max-width: 200px;
          }

          .column .padding {
            padding: 1rem;
          }

          .column .content {
            font-size: 1rem;
            line-height: 1.25rem;
            padding: 0 0.25rem;
          }

          .banner {
            background-image: url("https://vetify.co.ao/images/ixlsx/bg-header.jpg");
            background-size: cover;
            background-position: bottom;
            height: 300px;
            min-height: 300px;
            text-align: center;
          }

          .text-5xl {
            font-size: 3rem;
          }

          .text-sm {
            font-size: 0.875rem !important;
          }

          .text-xl {
            font-size: 1.25rem;
          }

          .text-center {
            text-align: center;
          }

          .text-primary {
            color: rgb(51, 166, 212);
          }

          .text-white {
            color: #fff;
          }

          .text-dark {
            color: rgb(0, 62, 84);
          }

          .font-bold {
            font-weight: 500;
          }

          .font-medium {
            font-weight: 400;
          }

          .font-italic {
            font-style: italic;
          }

          .bg-white {
            background: #fff;
          }

          .bg-primary {
            background-color: rgb(51, 166, 212);
          }

          .bg-gray {
            background: rgb(241, 241, 241);
          }

          .bg-dark {
            background: rgb(0, 62, 84);
          }

          .bg-gray-dark {
            background: #c6c6c6;
          }

          .bg-radius-4 {
            border-radius: 4px;
          }

          .w-full {
            width: 100%;
          }

          .mb-4 {
            margin-bottom: 1rem;
          }

          .mt-4 {
            margin-top: 1rem;
          }

          .mt-8 {
            margin-top: 2rem;
          }

          .p-2 {
            padding: 0.5rem;
          }

          .p-4 {
            padding: 1rem;
          }

          .p-8 {
            padding: 2rem;
          }

          .py-24 {
            padding-top: 6rem;
            padding-bottom: 6rem;
          }

          .py-8 {
            padding-top: 2rem;
            padding-bottom: 2rem;
          }

          .py-4 {
            padding-top: 1rem;
            padding-bottom: 1rem;
          }

          .py-2 {
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
          }

          .pt-8 {
            padding-top: 2rem;
          }

          .pb-8 {
            padding-bottom: 2rem;
          }

          .pb-4 {
            padding-bottom: 1rem;
          }

          .ps-4 {
            padding-left: 1rem;
          }

          .ps-8 {
            padding-left: 2rem;
          }

          .align-top {
            vertical-align: top;
          }

          .rounded {
            border-radius: 100%;
          }
        </style>
      </head>
      <body>
      <!--
      <div class="container mx-auto p-4">
        <table class="w-96"></table>
      </div>
      -->
        <center class="wrapper">
          <table class="main">
            <!-- TOP BORDER -->
            <tr>
              <td class="bg-primary" style="height: 0.5rem"></td>
            </tr>
            <!-- BANNER IMAGE -->
            <tr>
              <td class="banner w-full"></td>
            </tr>
            <!-- BOTTOM BORDER -->
            <tr>
              <td class="bg-primary" style="height: 0.5rem"></td>
            </tr>

            <!-- NOVO -->
            <tr>
              <td class="p-8">
                <p>Caro Parceiro,</p>

                <p>
                  Enviamos-lhe a OTP (One-Time Password) necessária para aceder à
                  sua conta no portal da Vetify:
                </p>

                <div class="p-8">
                  <div
                    class="p-8 bg-dark text-white text-center font-bold text-5xl"
                    style="letter-spacing: 0.35em"
                  >
                    ${code}
                  </div>
                </div>

                <p>
                  Utilize esta OTP para concluir o seu processo de autenticação e
                  desfrutar dos nossos serviços de distribuição de produtos de saúde
                  e nutrição para animais.
                </p>

                <p>
                  Lembre-se de manter a sua OTP em segredo e nunca partilhá-la com
                  terceiros. Estamos ao seu dispor para qualquer assistência
                  adicional.
                </p>

                <p>
                  Esta mensagem foi enviada para ${email} a seu pedido.
                </p>

                <p>
                  Atenciosamente,<br />
                  A equipa Vetify
                </p>
              </td>
            </tr>
            <!-- BOTTOM BORDER -->
            <tr>
              <td class="bg-primary" style="height: 0.5rem"></td>
            </tr>
          </table>
        </center>
      </body>
    </html>

  `;
}
