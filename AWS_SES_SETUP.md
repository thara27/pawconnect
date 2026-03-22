# AWS SES Email Setup Guide

Your contact form is now configured to use **AWS SES (Simple Email Service)** — the perfect solution for AWS Amplify deployments.

## What's Changed

- ✅ Replaced Resend with AWS SES + Nodemailer
- ✅ Uses native AWS credentials
- ✅ Works automatically on AWS Amplify (no additional config needed there)
- ✅ Only need local `.env.local` for development

## Setup Instructions

### For AWS Amplify (Production)

Good news! **AWS Amplify automatically provides AWS credentials** in the environment. Your contact form will "just work" once deployed.

No additional configuration needed on Amplify.

### For Local Development

Add AWS credentials to `.env.local`:

```env
# Contact form email configuration - AWS SES
CONTACT_FORM_EMAIL=thara.jacob@gmail.com
AWS_SES_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...your_key...
AWS_SECRET_ACCESS_KEY=your_secret_key...
```

#### Getting AWS Credentials

1. **Sign in to AWS Console** → https://console.aws.amazon.com
2. **Navigate to IAM** → Users → Create user (or select existing)
3. **Create Access Key**:
   - Click "Create access key" → Choose "Command Line Interface (CLI)"
   - Copy the Access Key ID and Secret Access Key
   - Store safely (never commit to git!)
4. **Add IAM Inline Policy** (attach to user):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "ses:SendEmail",
           "ses:SendRawEmail"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

#### Verify Sender Email in SES

Before sending emails, verify your sender email:

1. **Go to AWS Console** → SES → Email Addresses
2. **Verify Identity** → Enter `thara.jacob@gmail.com`
3. **Check your email** for verification link and click it
4. Once verified, you can send emails

### How It Works

1. Form submits → Server action validates
2. Saves to Supabase `contact_messages` table
3. Creates Nodemailer transport with AWS SES credentials
4. Sends email to `CONTACT_FORM_EMAIL` via AWS SES
5. Sets `replyTo: data.email` so you can reply directly to the sender

### Testing

```bash
npm run dev
```

Navigate to `http://localhost:3000/contact` and submit a test message.

Check:
- ✅ Success message appears
- ✅ Entry in Supabase `contact_messages` table
- ✅ Email received at `thara.jacob@gmail.com` (if AWS credentials configured)

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Email not sending | Verify `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are correct |
| "Sender not verified" | Verify email in AWS SES console |
| Form submits but no email | Check server logs: `npm run dev` output for warnings |
| 401 Unauthorized | AWS credentials are incorrect or don't have SES permissions |

### Email Sender Address

Currently, emails are sent **from** `CONTACT_FORM_EMAIL` (thara.jacob@gmail.com) and you can reply directly to the user since `replyTo` is set to their email address.

To change the sender, update `.env.local`:
```env
CONTACT_FORM_EMAIL=your-verified-email@example.com
```

### Security

✅ AWS credentials auto-managed on Amplify  
✅ Only local `.env.local` needs secrets  
✅ Never commit `.env.local` to git  
✅ Nodemailer securely connects via TLS (port 587)  

### Cost

- **AWS SES is extremely cheap**: $0.10 per 1,000 emails
- Free tier: 62,000 emails/month for first year
- After that: ~$3 per million emails

### Rate Limits

AWS SES has default sending limits:
- **Sandbox mode** (new accounts): 200 emails/day, 1 email/second
- **Production** (after requesting limit increase): Much higher

To lift sandbox limits, request in AWS SES console → Sending Statistics → Edit Account Details

### Available Regions

Common AWS SES regions:
- `us-east-1` (N. Virginia) — recommended
- `us-west-2` (Oregon)
- `eu-west-1` (Ireland)
- `ap-southeast-1` (Singapore)

Change `AWS_SES_REGION` in `.env.local` if needed.

## Integration with Amplify Deployment

When deploying to AWS Amplify:

1. **No changes needed** to code
2. Go to **Amplify Console** → App Settings → Environment Variables
3. AWS credentials are **auto-provided** by Amplify IAM role
4. Your contact form will work automatically ✅

## Next Steps

1. Verify sender email in AWS SES console
2. Add AWS credentials to local `.env.local`
3. Test locally: `npm run dev`
4. Deploy to Amplify and it works automatically!

---

**Questions?** Check AWS SES docs: https://docs.aws.amazon.com/ses/
