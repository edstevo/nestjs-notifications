import { SendGridAttachment } from './sendgrid-attachment.interface';
import { SendGridRecipient } from './sendgrid-recipient.interface';

export interface SendGridRequestBody {
  personalizations: [
    {
      from?: SendGridRecipient | string;
      to: SendGridRecipient[] | string[];
      cc?: SendGridRecipient[] | string[];
      bcc?: SendGridRecipient[] | string[];
      subject?: string;
      headers?: Record<string, any>;
      substitutions?: Record<string, any>;
      dynamic_template_data?: Record<string, any>;
      custom_args?: Record<string, any>;
      send_at?: number;
    },
  ];
  from: SendGridRecipient | string;
  reply_to?: SendGridRecipient | string;
  subject: string;
  content: {
    type: string;
    value: string;
  }[];
  attachments?: SendGridAttachment[];
  template_id?: string;
  headers?: Record<string, any>;
  categories?: string[];
  custom_args?: string;
  send_at?: number;
  batch_id?: string;
  asm?: {
    group_id: number;
    groups_to_display?: number[];
  };
  ip_pool_name?: string;
  mail_settings?: {
    bypass_list_management?: {
      enable?: boolean;
    };
    bypass_spam_management?: {
      enable?: boolean;
    };
    bypass_bounce_management?: {
      enable?: boolean;
    };
    bypass_unsubscribe_management?: {
      enable?: boolean;
    };
    footer?: {
      enable?: boolean;
      text?: string;
      html?: string;
    };
    sandbox_mode?: {
      enable?: boolean;
    };
    spam_check?: {
      enable?: boolean;
      threshold?: number;
      post_to_url?: string;
    };
  };
  tracking_settings?: {
    click_tracking?: {
      enable?: boolean;
      enable_text?: string;
    };
    open_tracking?: {
      enable?: boolean;
      substitution_tag?: string;
    };
    subscription_tracking?: {
      enable?: boolean;
      text?: string;
      html?: string;
      substitution_tag?: string;
    };
    ganalytics?: {
      enable?: boolean;
      utm_source?: string;
      utm_medium?: string;
      utm_term?: string;
      utm_content?: string;
      utm_campaign?: string;
    };
  };
}
