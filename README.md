# React Analytics Dashboard

# Technical Stack

- Framework: React + Vite
- Styling: Tailwind CSS
- Animations: Motion (`motion/react`)
- Charts: Recharts
- Icons: Lucide React

## Getting Started

# Local Setup

1. **Install dependencies:**
   npm install

2. **Start the development server:**
   npm run dev
   dev Environment
   Open `http://localhost:3000` to view it in your browser.

3. **Build for production:**
   npm run build
   (build for production)

## AWS S3 Setup
1. **Create S3 Bucket:** Create a bucket (e.g., `dashboard-react-bucket`) and uncheck **Block *all* public access**.
2. **Enable Static Hosting:** Go to **Properties** > **Static website hosting** -> **Enable**. Set **Index document** and **Error document** to `index.html`.
3. **Set Bucket Policy:** Under **Permissions** > **Bucket policy**, add the following:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::dashboard-react-bucket/*"
       }
     ]
   }
   ```

## GitHub Secrets Setup
Add these credentials to your GitHub Repository under **Settings** > **Secrets and variables** > **Actions** > **Repository Secrets**:
- `AWS_ACCESS_KEY_ID`: Your AWS access key.
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key.
- `AWS_S3_BUCKET_NAME`: `dashboard-react-bucket`
- `AWS_REGION`: `eu-north-1`

## Deploy
Push your updated files to your repository:
git add .
git commit -m "Deploy to AWS"
git push origin main

Your pipeline triggers automatically, builds the project, and uploads it to S3.
