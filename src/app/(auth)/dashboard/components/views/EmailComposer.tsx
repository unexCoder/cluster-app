'use client';
import styles from './emailComposer.module.css'
import { useState } from 'react';

interface EmailFormData {
  to: string;
  subject: string;
  message: string;
  from?: string;
}

export default function EmailComposer() {
  const [formData, setFormData] = useState<EmailFormData>({
    to: '',
    subject: '',
    message: '',
    from: 'info@festivalcluster.org',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: formData.to,
          subject: formData.subject,
          html: `<div style="font-family: Arial, sans-serif;">${formData.message.replace(/\n/g, '<br>')}</div>`,
          text: formData.message,
          from: formData.from,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setStatus({
        type: 'success',
        message: `Email sent successfully! Message ID: ${data.messageId}`,
      });

      // Reset form
      setFormData({
        to: '',
        subject: '',
        message: '',
        from: formData.from,
      });
    } catch (error: any) {
      setStatus({
        type: 'error',
        message: error.message || 'Failed to send email',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={styles.container}>
      <h2>Compose Email</h2>


      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label htmlFor="from">
            From
          </label>
          <input
            type="email"
            id="from"
            name="from"
            value={formData.from}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="to">
            To
          </label>
          <input
            type="email"
            id="to"
            name="to"
            value={formData.to}
            onChange={handleChange}
            placeholder="recipient@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="subject">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Email subject"
            required
          />
        </div>

        <div>
          <label htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message here..."
            rows={20}
            required
          />
        </div>

        {status.type && (
          <div
            className={`${status.type === 'success'
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
              }`}
          >
            {status.message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={styles.sendButton}>
          {loading ? 'Sending...' : 'Send Email'}
        </button>
      </form>

    </div>
  );
}