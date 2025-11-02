# ATSense - AI-Powered Resume Analyzer & Builder

ATSense is a comprehensive platform that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS) and build professional, ATS-friendly resumes.

## Features

- 🏅 **ATS Score Analysis** - Get instant scores on how well your resume matches job descriptions
- 🔎 **Keyword Matching** - Identify missing keywords and skills from job descriptions
- 🛠️ **Actionable Advice** - Receive concrete, prioritized suggestions for improvement
- 🧠 **AI-Powered Optimization** - AI rewrites sections for clarity and ATS compatibility
- ✍️ **Resume Builder** - Create professional resumes with our intuitive builder
- 📄 **PDF Export** - Download your resume as a high-quality PDF
- ⚡ **Instant Results** - Get comprehensive analysis in seconds

## Tech Stack

- **Framework**: Next.js 15.5.4 with Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: Supabase Auth
- **AI**: Google Generative AI (Gemini)
- **PDF Generation**: jsPDF + html2canvas
- **Icons**: React Icons, Heroicons

## Getting Started

### Prerequisites

- Node.js 20+ installed
- npm or yarn package manager
- Supabase account (for authentication)
- Google AI API key (for resume analysis)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ResumeAI
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_API_KEY=your_google_api_key
GOOGLE_GENERATIVE_AI_API_KEY=your_google_generative_ai_api_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render
- DigitalOcean App Platform

Make sure to:
1. Set all environment variables
2. Update `NEXT_PUBLIC_SITE_URL` to your production domain
3. Configure build command: `npm run build`
4. Configure start command: `npm start`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `GOOGLE_API_KEY` | Google AI API key | Yes |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google Generative AI API key | Yes |
| `NEXT_PUBLIC_SITE_URL` | Your site URL (for metadata) | Yes |

## Project Structure

```
├── public/              # Static assets
│   ├── logo.png        # Application logo
│   └── manifest.json   # PWA manifest
├── src/
│   ├── app/            # Next.js app directory
│   │   ├── analyze/    # Resume analysis page
│   │   ├── build-resume/ # Resume builder page
│   │   ├── login/      # Authentication page
│   │   └── layout.tsx  # Root layout
│   ├── components/     # React components
│   │   ├── form/       # Resume builder form components
│   │   ├── preview/    # Resume preview components
│   │   └── utility/    # Utility components
│   └── types/          # TypeScript type definitions
├── .env                # Environment variables (not in git)
├── .env.example        # Environment variables template
└── next.config.ts      # Next.js configuration
```

## Features in Detail

### Resume Analysis
- Upload your resume (PDF format)
- Paste a job description
- Get instant ATS score and detailed feedback
- Receive actionable suggestions for improvement

### Resume Builder
- Fill in your information using an intuitive form
- Real-time preview of your resume
- Save/load your data as JSON
- Download as PDF with one click
- Fully responsive design

## Security

- All API keys are stored as environment variables
- Supabase handles authentication securely
- Security headers configured in `next.config.ts`
- No sensitive data stored in browser

## Performance

- Optimized with Next.js Turbopack
- Image optimization enabled
- Compression enabled
- Server-side rendering for better SEO
- Static page generation where possible

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For support, email support@atsense.com or open an issue in the repository.

## Acknowledgments

- Next.js team for the amazing framework
- Supabase for authentication
- Google for Generative AI
- All open-source contributors

---

Made with ❤️ by ATSense Team
