import { useEffect, useState } from 'react';
import { EstimateProvider, useEstimate } from './contexts/EstimateContext';
import { ProjectDetailsForm } from './components/estimate/ProjectDetailsForm';
import { LineItemTable } from './components/estimate/LineItemTable';
import { AllocationsEditor } from './components/estimate/AllocationsEditor';
import { ScopeDetailsEditor } from './components/estimate/ScopeDetailsEditor';
import { ProgressPanel } from './components/estimate/ProgressPanel';
import { PDFPreview } from './components/pdf/PDFPreview';
import { QuickAddChips } from './components/library/QuickAddChips';
import { VoiceInput } from './components/voice/VoiceInput';
import { Button } from './components/common/Button';
import { Logo } from './components/common/Logo';
import { generatePDF } from './utils/pdfGenerator';
import { FiPlus, FiSave, FiFileText, FiArrowLeft } from 'react-icons/fi';

function AppContent() {
  const { estimate, createNewEstimate, saveEstimate } = useEstimate();
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!estimate) {
      createNewEstimate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGeneratePDF = async () => {
    if (estimate) {
      await generatePDF(estimate);
    }
  };

  if (!estimate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Logo size="lg" useImage={false} />
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Preview Page View
  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Logo size="md" useImage={false} />
                <h2 className="text-2xl font-semibold text-gray-800">PDF Preview</h2>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowPreview(false)} variant="secondary" size="sm">
                  <FiArrowLeft className="inline mr-2" />
                  Back to Edit
                </Button>
                <Button onClick={handleGeneratePDF} variant="primary" size="sm">
                  <FiFileText className="inline mr-2" />
                  Generate PDF
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-6">
          <PDFPreview />
        </main>
      </div>
    );
  }

  // Main Edit View
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo size="md" useImage={false} />
              <h2 className="text-2xl font-semibold text-gray-800">Estimate Maker</h2>
            </div>
            <div className="flex gap-2">
              <Button onClick={createNewEstimate} variant="secondary" size="sm">
                <FiPlus className="inline mr-2" />
                New Estimate
              </Button>
              <Button onClick={saveEstimate} variant="secondary" size="sm">
                <FiSave className="inline mr-2" />
                Save
              </Button>
              <Button onClick={() => setShowPreview(true)} variant="primary" size="sm">
                <FiFileText className="inline mr-2" />
                Preview PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          <div className="flex-1 space-y-6">
            <ProjectDetailsForm />
            <VoiceInput />
            <QuickAddChips />
            <LineItemTable />
            <AllocationsEditor />
            <ScopeDetailsEditor />
          </div>
          <div className="w-80 flex-shrink-0">
            <ProgressPanel />
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <EstimateProvider>
      <AppContent />
    </EstimateProvider>
  );
}

export default App;
