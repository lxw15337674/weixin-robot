import { ScanStatus, log } from 'wechaty'
import QRCode from "qrcode";

export async function onScan(qrcode: string, status: ScanStatus) {
  const url = `https://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`;
  console.log(`Scan QR Code to login: ${status}\n${url}`);
  console.log(
    await QRCode.toString(qrcode, { type: "terminal", small: true })
  );
}
