/**
 * Messaging Service - SMS & WhatsApp Integration
 * Handles tenant communication for VGK Property Command
 */

// TODO: Replace with your actual SMS/WhatsApp API key
// For production, use environment variables
const MESSAGING_API_KEY = 'YOUR_API_KEY_HERE';
const SMS_API_ENDPOINT = '/api/send-sms'; // Replace with actual endpoint
const WHATSAPP_API_ENDPOINT = '/api/send-whatsapp'; // Replace with actual endpoint

export interface SMSPayload {
  to: string | string[];
  message: string;
}

export interface WhatsAppPayload {
  to: string | string[];
  message: string;
}

/**
 * Sends SMS message to single or multiple recipients
 * @param to - Phone number(s) in format +256 7XX XXX XXX
 * @param message - Message content
 * @returns Promise resolving to success status
 */
export async function sendSms(to: string | string[], message: string): Promise<boolean> {
  try {
    // Validate inputs
    if (!message || message.trim().length === 0) {
      throw new Error('Message content cannot be empty');
    }

    const recipients = Array.isArray(to) ? to : [to];

    if (recipients.length === 0) {
      throw new Error('At least one recipient is required');
    }

    // TODO: Replace with actual API call
    // For demonstration purposes, we'll simulate an API call
    console.log('📱 Sending SMS:', {
      recipients,
      message,
      timestamp: new Date().toISOString(),
    });

    // Simulated API call
    const response = await fetch(SMS_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MESSAGING_API_KEY}`,
      },
      body: JSON.stringify({
        to: recipients,
        message,
      }),
    });

    if (!response.ok) {
      throw new Error(`SMS API error: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Failed to send SMS:', error);

    // In demo mode, simulate success after logging
    if (MESSAGING_API_KEY === 'YOUR_API_KEY_HERE') {
      console.warn('📱 Demo Mode: SMS simulation successful');
      return true;
    }

    throw error;
  }
}

/**
 * Sends WhatsApp message to single or multiple recipients
 * @param to - Phone number(s) in format +256 7XX XXX XXX
 * @param message - Message content
 * @returns Promise resolving to success status
 */
export async function sendWhatsAppMessage(to: string | string[], message: string): Promise<boolean> {
  try {
    // Validate inputs
    if (!message || message.trim().length === 0) {
      throw new Error('Message content cannot be empty');
    }

    const recipients = Array.isArray(to) ? to : [to];

    if (recipients.length === 0) {
      throw new Error('At least one recipient is required');
    }

    // TODO: Replace with actual API call
    // For demonstration purposes, we'll simulate an API call
    console.log('💬 Sending WhatsApp:', {
      recipients,
      message,
      timestamp: new Date().toISOString(),
    });

    // Simulated API call
    const response = await fetch(WHATSAPP_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MESSAGING_API_KEY}`,
      },
      body: JSON.stringify({
        to: recipients,
        message,
      }),
    });

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error);

    // In demo mode, simulate success after logging
    if (MESSAGING_API_KEY === 'YOUR_API_KEY_HERE') {
      console.warn('💬 Demo Mode: WhatsApp simulation successful');
      return true;
    }

    throw error;
  }
}

/**
 * Formats currency in Ugandan Shillings
 * @param amount - Amount in UGX
 * @returns Formatted string (e.g., "UGX 2,500,000")
 */
export function formatUGX(amount: number): string {
  return `UGX ${amount.toLocaleString('en-UG')}`;
}

/**
 * Generates rent reminder message template
 * @param tenantName - Name of the tenant
 * @param rentAmount - Monthly rent amount
 * @param dueDate - Next payment due date
 * @returns Formatted reminder message
 */
export function generateRentReminderMessage(
  tenantName: string,
  rentAmount: number,
  dueDate: string
): string {
  const formattedDate = new Date(dueDate).toLocaleDateString('en-UG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `Dear ${tenantName},\n\nThis is a friendly reminder that your rent payment of ${formatUGX(rentAmount)} is due on ${formattedDate}.\n\nPlease ensure timely payment to avoid late fees. For payment options or queries, contact our office.\n\nThank you for being a valued tenant.\n\n- VGK Property Management`;
}

/**
 * Generates payment confirmation message
 * @param tenantName - Name of the tenant
 * @param amount - Amount paid
 * @param referenceNumber - Payment reference number
 * @returns Formatted confirmation message
 */
export function generatePaymentConfirmationMessage(
  tenantName: string,
  amount: number,
  referenceNumber: string
): string {
  return `Dear ${tenantName},\n\nWe confirm receipt of your payment of ${formatUGX(amount)}.\n\nReference: ${referenceNumber}\nDate: ${new Date().toLocaleDateString('en-UG')}\n\nThank you for your prompt payment.\n\n- VGK Property Management`;
}
