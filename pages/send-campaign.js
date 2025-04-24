// /pages/api/send-campaign.js

import SibApiV3Sdk from 'sib-api-v3-sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Set up Brevo client
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY; // Securely from .env

    const apiInstance = new SibApiV3Sdk.EmailCampaignsApi();

    // Define your campaign
    const emailCampaigns = new SibApiV3Sdk.CreateEmailCampaign();
    emailCampaigns.name = "Campaign sent via the API";
    emailCampaigns.subject = "My subject";
    emailCampaigns.sender = { name: "From name", email: "myfromemail@mycompany.com" };
    emailCampaigns.type = "classic";
    emailCampaigns.htmlContent = 'Congratulations! You successfully sent this example campaign via the Brevo API.';
    emailCampaigns.recipients = { listIds: [2, 7] };
    emailCampaigns.scheduledAt = '2025-04-25 00:00:01'; // Update as needed

    // Call the API
    const data = await apiInstance.createEmailCampaign(emailCampaigns);
    return res.status(200).json({ message: 'Campaign sent', data });

  } catch (error) {
    console.error('Error sending campaign:', error);
    return res.status(500).json({ error: 'Failed to send campaign' });
  }
}
