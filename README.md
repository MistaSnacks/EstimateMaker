# Estimation App - Web-Based Bid Proposal Generator

A modern web application for creating professional construction bid proposals with voice input, intelligent parsing, and automated PDF generation.

## Features

- ✅ **Voice Input**: Use OpenAI Whisper API + GPT-4 to add line items by voice
- ✅ **Project Management**: Store and manage multiple estimates with auto-save
- ✅ **PDF Generation**: Generate branded proposals matching your format
- ✅ **Smart Calculations**: Auto-calculate totals, subtotals, and grand totals
- ✅ **Modular Design**: Scalable architecture for future enhancements

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS
- **AI**: OpenAI Whisper API + GPT-4 Turbo
- **PDF**: jsPDF + jsPDF-AutoTable
- **Storage**: localStorage (designed for easy backend migration)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
cd "/Users/admin/Estimate Maker"
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
VITE_OPENAI_API_KEY=your-openai-api-key-here
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## Usage

### Creating an Estimate

1. **Fill in Project Details**: Enter project name, client, address, bid date, project type, and building/unit counts
2. **Add Line Items**: 
   - Use voice input: Click "Start Voice Input" and speak your items (e.g., "Add 5 screws at $50 each")
   - Or add manually (coming soon)
3. **Configure Scope Details**: Set inclusions, exclusions, and delivery terms
4. **Generate PDF**: Click "Generate PDF" to create your branded proposal

### Voice Input Format

Speak naturally to add items:
- "Add 5 screws at $50 each"
- "Add 130 hinges at $54.32"
- "Ten doors at one hundred dollars each"

The AI will parse quantities, descriptions, and costs automatically.

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── estimate/        # Estimate-related components
│   ├── voice/           # Voice input components
│   └── pdf/             # PDF generation components
├── contexts/            # React Context providers
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
└── utils/               # Utility functions (storage, parsing, calculations)
```

## Key Components

- **EstimateProvider**: Manages global estimate state
- **ProjectDetailsForm**: Form for project information
- **VoiceInput**: Voice recording and AI parsing
- **PDFGenerator**: Creates branded PDF proposals

## Storage

Currently uses browser localStorage. Data is automatically saved and persisted between sessions.

## Future Enhancements (Planned)

- Line item library with pricing history
- Spreadsheet import/export
- Allocation management UI
- Progress tracking panel
- Estimate versioning
- Backend integration (Firebase/Supabase)
- Multi-user collaboration
- Pricing book integration

## Development

### Run Tests
```bash
npm test
```

### Code Formatting
```bash
npm run lint
```

## Deployment

### Netlify Deployment

This app is configured for easy deployment to Netlify. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

Quick steps:
1. Push code to Git repository
2. Connect repository to Netlify
3. Add environment variable: `VITE_OPENAI_API_KEY`
4. Deploy!

The `netlify.toml` file contains all necessary configuration.

## License

Proprietary - Evergreen Millwork
