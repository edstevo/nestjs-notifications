export interface SendGridAttachment {
  content: string;
  type?: string;
  filename: string;
  disposition?: string;
  content_id?: string;
}