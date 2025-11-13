import { useEstimate } from '../../contexts/EstimateContext';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import type { ProjectType } from '../../types/estimate';

export function ProjectDetailsForm() {
  const { estimate, updateEstimate } = useEstimate();

  if (!estimate) return null;

  const projectTypeOptions: { value: ProjectType; label: string }[] = [
    { value: 'Multi-Family', label: 'Multi-Family' },
    { value: 'Townhome', label: 'Townhome' },
    { value: 'Commercial TI', label: 'Commercial TI' },
  ];

  const handleChange = (field: keyof typeof estimate, value: string | number) => {
    updateEstimate({ [field]: value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Project Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Project Name"
          value={estimate.projectName}
          onChange={(e) => handleChange('projectName', e.target.value)}
        />
        
        <Input
          label="Client"
          value={estimate.client}
          onChange={(e) => handleChange('client', e.target.value)}
        />
        
        <Input
          label="Address"
          value={estimate.address}
          onChange={(e) => handleChange('address', e.target.value)}
        />
        
        <Input
          label="Bid Date"
          type="date"
          value={estimate.bidDate}
          onChange={(e) => handleChange('bidDate', e.target.value)}
        />
        
        <Select
          label="Project Type"
          options={projectTypeOptions}
          value={estimate.projectType}
          onChange={(e) => handleChange('projectType', e.target.value as ProjectType)}
        />
        
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              label="Buildings"
              type="number"
              min="1"
              value={estimate.buildings}
              onChange={(e) => handleChange('buildings', parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="flex-1">
            <Input
              label="Units"
              type="number"
              min="1"
              value={estimate.units}
              onChange={(e) => handleChange('units', parseInt(e.target.value) || 1)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
