import { Alert } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getReceipt } from '@/src/models/payments.model';
import { formatDate, formatMonth, formatRupees } from '@/src/lib/format';

function numberToWords(n: number): string {
  // Small, dependency-free "N thousand five hundred rupees" — good enough
  // for receipt amounts in this app's range.
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  function twoDigits(v: number): string {
    if (v < 10) return ones[v];
    if (v < 20) return teens[v - 10];
    return tens[Math.floor(v / 10)] + (v % 10 ? ' ' + ones[v % 10] : '');
  }
  function threeDigits(v: number): string {
    const h = Math.floor(v / 100);
    const rest = v % 100;
    return (h ? ones[h] + ' hundred' + (rest ? ' ' : '') : '') + (rest ? twoDigits(rest) : '');
  }

  if (n === 0) return 'zero rupees only';
  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const hundred = n % 1000;
  const parts: string[] = [];
  if (crore) parts.push(threeDigits(crore) + ' crore');
  if (lakh) parts.push(threeDigits(lakh) + ' lakh');
  if (thousand) parts.push(threeDigits(thousand) + ' thousand');
  if (hundred) parts.push(threeDigits(hundred));
  const words = parts.join(' ');
  return `${words.charAt(0).toUpperCase()}${words.slice(1)} rupees only`;
}

export function useReceiptController() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const paymentId = Number(id);

  const receiptQuery = useQuery({ queryKey: ['receipt', paymentId], queryFn: () => getReceipt(paymentId), enabled: !!paymentId });
  const receipt = receiptQuery.data;

  const html = () => {
    if (!receipt) return '';
    return `
      <html><body style="font-family:Georgia,serif;padding:32px;color:#1F1D1A">
        <h2>Manjunatha Residency</h2>
        <p>${receipt.building_address}</p>
        <hr/>
        <p>Receipt No. ${receipt.id}</p>
        <h1>${formatRupees(receipt.amount)}</h1>
        <p>${numberToWords(Math.round(receipt.amount))}</p>
        <hr/>
        <p>Received from: ${receipt.tenant_name}</p>
        <p>House: ${receipt.building_name} · ${receipt.unit_number}</p>
        <p>For: ${formatMonth(receipt.bill_month)} bill</p>
        <p>Paid on: ${formatDate(receipt.paid_on)}</p>
        <p>Method: ${receipt.method}</p>
        <p>Recorded by: ${receipt.received_by_name ?? '—'}</p>
        <hr/>
        <p>Balance on this bill: ${formatRupees(receipt.balance_after)}</p>
      </body></html>`;
  };

  const share = async () => {
    if (!receipt) return;
    try {
      const { uri } = await Print.printToFileAsync({ html: html() });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: `Receipt ${receipt.id}` });
      }
    } catch (e: any) {
      Alert.alert('Could not share the receipt', e?.message ?? 'Try again.');
    }
  };

  const saveAsPdf = async () => {
    if (!receipt) return;
    try {
      const { uri } = await Print.printToFileAsync({ html: html() });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: `Receipt ${receipt.id}`, UTI: 'com.adobe.pdf' });
      }
    } catch (e: any) {
      Alert.alert('Could not save the receipt', e?.message ?? 'Try again.');
    }
  };

  return {
    loading: receiptQuery.isLoading,
    receipt,
    amountInWords: receipt ? numberToWords(Math.round(receipt.amount)) : '',
    share,
    saveAsPdf,
  };
}
