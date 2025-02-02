import { format } from 'date-fns';

const templateEmailBill = (data: any) => {
  return `<!DOCTYPE html>
  <html lang="en, id">
      <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>BIll</title>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
          <link rel="stylesheet" href="style.css" />
  
          <style>
              @import "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap";
              * {
                  margin: 0 auto;
                  padding: 0 auto;
                  user-select: none;
              }
  
              body {
                  padding: 20px;
                  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
                      sans-serif;
                  -webkit-font-smoothing: antialiased;
                  background-color: #dcdcdc;
              }
  
              .wrapper-invoice {
                  display: flex;
                  justify-content: center;
              }
              .wrapper-invoice .invoice {
                  height: auto;
                  background: #fff;
                  padding: 5vh;
                  margin-top: 5vh;
                  max-width: 110vh;
                  width: 100%;
                  box-sizing: border-box;
                  border: 1px solid #dcdcdc;
              }
              .wrapper-invoice .invoice .invoice-information {
                  float: right;
                  text-align: right;
              }
              .wrapper-invoice .invoice .invoice-information b {
                  color: "#0F172A";
              }
              .wrapper-invoice .invoice .invoice-information p {
                  font-size: 2vh;
                  color: gray;
              }
              .wrapper-invoice .invoice .invoice-logo-brand h2 {
                  text-transform: uppercase;
                  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
                      sans-serif;
                  font-size: 2.9vh;
                  color: "#0F172A";
              }
              .wrapper-invoice .invoice .invoice-logo-brand img {
                  max-width: 100px;
                  width: 100%;
                  object-fit: fill;
              }
              .wrapper-invoice .invoice .invoice-head {
                  display: flex;
                  margin-top: 8vh;
              }
              .wrapper-invoice .invoice .invoice-head .head {
                  width: 100%;
                  box-sizing: border-box;
              }
              .wrapper-invoice .invoice .invoice-head .client-info {
                  text-align: left;
              }
              .wrapper-invoice .invoice .invoice-head .client-info h2 {
                  font-weight: 500;
                  letter-spacing: 0.3px;
                  font-size: 2vh;
                  color: "#0F172A";
              }
              .wrapper-invoice .invoice .invoice-head .client-info p {
                  font-size: 2vh;
                  color: gray;
              }
              .wrapper-invoice .invoice .invoice-head .client-data {
                  text-align: right;
              }
              .wrapper-invoice .invoice .invoice-head .client-data h2 {
                  font-weight: 500;
                  letter-spacing: 0.3px;
                  font-size: 2vh;
                  color: "#0F172A";
              }
              .wrapper-invoice .invoice .invoice-head .client-data p {
                  font-size: 2vh;
                  color: gray;
              }
              .wrapper-invoice .invoice .invoice-body {
                  margin-top: 8vh;
              }
              .wrapper-invoice .invoice .invoice-body .table {
                  border-collapse: collapse;
                  width: 100%;
              }
              .wrapper-invoice .invoice .invoice-body .table thead tr th {
                  font-size: 2vh;
                  border: 1px solid #dcdcdc;
                  text-align: left;
                  padding: 1vh;
                  background-color: #eeeeee;
              }
              .wrapper-invoice .invoice .invoice-body .table tbody tr td {
                  font-size: 2vh;
                  border: 1px solid #dcdcdc;
                  text-align: left;
                  padding: 1vh;
                  background-color: #fff;
              }
              .wrapper-invoice .invoice .invoice-body .table tbody tr td:nth-child(2) {
                  text-align: right;
              }
              .wrapper-invoice .invoice .invoice-body .flex-table {
                  display: flex;
              }
              .wrapper-invoice .invoice .invoice-body .flex-table .flex-column {
                  width: 100%;
                  box-sizing: border-box;
              }
              .wrapper-invoice .invoice .invoice-body .flex-table .flex-column .table-subtotal {
                  border-collapse: collapse;
                  box-sizing: border-box;
                  width: 100%;
                  margin-top: 2vh;
              }
              .wrapper-invoice .invoice .invoice-body .flex-table .flex-column .table-subtotal tbody tr td {
                  font-size: 2vh;
                  border-bottom: 1px solid #dcdcdc;
                  text-align: left;
                  padding: 1vh;
                  background-color: #fff;
              }
              .wrapper-invoice .invoice .invoice-body .flex-table .flex-column .table-subtotal tbody tr td:nth-child(2) {
                  text-align: right;
              }
              .wrapper-invoice .invoice .invoice-body .invoice-total-amount {
                  margin-top: 1rem;
              }
              .wrapper-invoice .invoice .invoice-body .invoice-total-amount p {
                  font-weight: bold;
                  color: "#0F172A";
                  text-align: right;
                  font-size: 2vh;
              }
              .wrapper-invoice .invoice .invoice-footer {
                  margin-top: 4vh;
              }
              .wrapper-invoice .invoice .invoice-footer p {
                  font-size: 1.7vh;
                  color: gray;
              }
  
              .copyright {
                  margin-top: 2rem;
                  text-align: center;
              }
              .copyright p {
                  color: gray;
                  font-size: 1.8vh;
              }
  
              @media print {
                  .table thead tr th {
                      -webkit-print-color-adjust: exact;
                      background-color: #eeeeee !important;
                  }
  
                  .copyright {
                      display: none;
                  }
              }
              .rtl {
                  direction: rtl;
                  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
                      sans-serif;
              }
              .rtl .invoice-information {
                  float: left !important;
                  text-align: left !important;
              }
              .rtl .invoice-head .client-info {
                  text-align: right !important;
              }
              .rtl .invoice-head .client-data {
                  text-align: left !important;
              }
              .rtl .invoice-body .table thead tr th {
                  text-align: right !important;
              }
              .rtl .invoice-body .table tbody tr td {
                  text-align: right !important;
              }
              .rtl .invoice-body .table tbody tr td:nth-child(2) {
                  text-align: left !important;
              }
              .rtl .invoice-body .flex-table .flex-column .table-subtotal tbody tr td {
                  text-align: right !important;
              }
              .rtl .invoice-body .flex-table .flex-column .table-subtotal tbody tr td:nth-child(2) {
                  text-align: left !important;
              }
              .rtl .invoice-body .invoice-total-amount p {
                  text-align: left !important;
              }
          </style>
      </head>
      <body>
          <section class="wrapper-invoice">
              <div class="invoice">
                  <div class="invoice-information">
                      <p><b>Mã đơn #</b> : ${data?.payment_id}</p>
                      <p><b>Ngày Đặt </b>: ${format(new Date(), 'dd-MM-yyyy')}</p>
                  </div>
                  <div class="invoice-logo-brand">
                      <img src="./assets/image/tampsh.png" alt="" />
                  </div>
                  <div class="invoice-head">
                      <div class="head client-info">
                          <p>${data?.currentUser?.values?.name}</p>
                          <p>${data?.currentUser?.values?.phone_number}</p>
                      </div>
                    
                  </div>
                  <!-- invoice body-->
                  <div class="invoice-body">
                      <table class="table">
                          <thead>
                              <tr>
                                  <th>Thông tin đơn đặt</th>
                                  <th>#</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr>
                                  <td>${data?.pitch?.name}</td>
                                  <td>${data?.shift?.price?.toLocaleString('vi-VN')} VND</td>
                              </tr>
                              <tr>
                                  <td>Giờ Đá</td>
                                  <td>${data?.shift?.number_shift ? `Ca ${data?.shift?.number_shift}` : 'Cả ngày'} ${data?.shift
                                    ?.shift_day} Sân ${data?.children_pitch?.children_pitch_code}</td>
                              </tr>
                              <tr>
                                  <td>Địa Chỉ</td>
                                  <td>${data?.pitch?.address}</td>
                              </tr>
                              <tr>
                                  <td>Dịch vụ đi kèm</td>
                                  <td class="sv">
                                  ${
                                    data?.services?.length > 0
                                      ? data?.services?.map(
                                          (item: any) => `<p>${item.name}: ${item.price?.toLocaleString('vi-VN')} VND</p>`
                                        )
                                      : ''
                                  }
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                      <div class="flex-table">
                          <div class="flex-column"></div>
                          <div class="flex-column">
                              <table class="table-subtotal">
                                  <tbody>
                                      <tr>
                                          <td>Tổng Tiền</td>
                                          <td>${data?.shift?.totalPrice?.toLocaleString('vi-VN')} VND</td>
                                      </tr>
                                      <tr>
                                          <td>Còn nợ</td>
                                          <td>${(data?.shift?.totalPrice - data?.price_received)?.toLocaleString('vi-VN')} VND</td>
                                      </tr>
                                  </tbody>
                              </table>
                          </div>
                      </div>
                      <div class="invoice-total-amount">
                          <p>Đã Thanh Toán : ${data?.price_received.toLocaleString('vi-VN')} VND</p>
                      </div>
                  </div>
                  <div class="invoice-footer">
                      <p>Cảm ơn, bạn đã sử dụng dịch vụ của chúng tôi!</p>
                  </div>
              </div>
          </section>
      </body>
  </html>
  `;
};

export default templateEmailBill;
