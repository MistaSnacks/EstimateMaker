import { useState, useRef } from 'react';
import { FiMic, FiMicOff, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { processVoiceInput } from '../../utils/voiceParser';
import { useEstimate } from '../../contexts/EstimateContext';
import { Button } from '../common/Button';

export function VoiceInput() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { estimate, updateEstimate, updateScope } = useEstimate();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await processRecording(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError('Failed to access microphone');
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processRecording = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setError(null);
    setLastResult(null);

    try {
      console.log('🎵 Processing audio blob:', { size: audioBlob.size, type: audioBlob.type });
      const result = await processVoiceInput(audioBlob);
      console.log('📋 Processing result:', result);

      if (result.success) {
        let successMessage = '';
        
        // Handle line items - batch all items in a single update to avoid state batching issues
        if (result.items && result.items.length > 0) {
          console.log('✅ Adding items to estimate:', result.items);
          if (estimate) {
            const newItems = result.items.map(item => ({
              id: `voice_${Date.now()}_${Math.random()}`,
              category: 'Voice Input',
              description: item.description,
              quantity: item.quantity,
              unitCost: item.unitCost,
              total: item.quantity * item.unitCost,
            }));
            // Batch all items in a single update
            updateEstimate({ lineItems: [...estimate.lineItems, ...newItems] });
          }
          successMessage += `Added ${result.items.length} line item(s). `;
        }

        // Handle project details
        if (result.projectDetails) {
          console.log('✅ Updating project details:', result.projectDetails);
          updateEstimate(result.projectDetails);
          successMessage += 'Updated project details. ';
        }

        // Handle scope
        if (result.scope) {
          console.log('✅ Updating scope:', result.scope);
          updateScope(result.scope);
          successMessage += 'Updated scope details. ';
        }

        if (successMessage) {
          setLastResult(successMessage.trim());
        } else {
          setError('No relevant information found. Try: "Add 10 bags of concrete at $15 each" or "This is for ABC Construction"');
        }
      } else {
        console.log('❌ Failed to parse:', result);
        setError(result.error || 'Failed to parse voice input. Try speaking more clearly.');
      }
    } catch (err) {
      console.error('❌ Error processing recording:', err);
      setError('Error processing voice input');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center gap-4">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            disabled={isProcessing || !estimate}
            variant="primary"
          >
            <FiMic className="inline mr-2" />
            {isProcessing ? 'Processing...' : 'Start Voice Input'}
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            variant="danger"
          >
            <FiMicOff className="inline mr-2" />
            Stop Recording
          </Button>
        )}
        
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <FiAlertCircle size={16} />
            {error}
          </div>
        )}
        
        {lastResult && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <FiCheck size={16} />
            {lastResult}
          </div>
        )}
      </div>
      
      <div className="mt-3 text-sm text-gray-600">
        <p className="font-medium mb-2">Voice Commands:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <div>
            <strong>Line Items:</strong><br />
            "Add 10 bags of concrete at $15 each"
          </div>
          <div>
            <strong>Project Details:</strong><br />
            "This is for ABC Construction, 123 Main St"
          </div>
          <div>
            <strong>Scope:</strong><br />
            "Include installation and warranty"
          </div>
        </div>
      </div>
      
      {!estimate && (
        <p className="text-gray-500 text-sm mt-2">Create a project first to use voice input</p>
      )}
    </div>
  );
}
