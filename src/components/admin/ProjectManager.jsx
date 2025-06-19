import React, { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ProjectManagerForm from '@/components/admin/ProjectManagerForm';
import ProjectManagerList from '@/components/admin/ProjectManagerList';
import { useColors } from '@/contexts/ColorContext';


const ProjectManager = () => {
  const { toast } = useToast();
  const { currentPalette } = useColors();

  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : [];
  });
  
  const initialNewProjectState = {
    title: '', description: '', images: [''], textSections: [{ content: '', position: { x: 0, y: 0 } }], layout: 'left'
  };
  const [projectFormData, setProjectFormData] = useState(initialNewProjectState);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const handleSaveProject = () => {
    if (!projectFormData.title.trim()) {
      toast({ title: "Error", description: "Please enter a project title.", duration: 3000 });
      return;
    }

    const finalProjectData = {
      ...projectFormData,
      images: projectFormData.images.filter(img => img.trim() !== ''),
      textSections: (projectFormData.textSections || []).map(ts => ({
        ...ts,
        position: {
          x: parseInt(ts.position.x, 10) || 0,
          y: parseInt(ts.position.y, 10) || 0,
        }
      }))
    };
    
    if (isEditing) {
      setProjects(prev => prev.map(p => p.id === finalProjectData.id ? finalProjectData : p));
      toast({ title: "Project Updated", description: "Project updated successfully.", duration: 3000 });
    } else {
      setProjects(prev => [...prev, { ...finalProjectData, id: Date.now() }]);
      toast({ title: "Project Added", description: "New project created successfully.", duration: 3000 });
    }
    setProjectFormData(initialNewProjectState);
    setIsEditing(false);
  };

  const handleEditProject = (project) => {
    setProjectFormData({ ...project, textSections: project.textSections || [{ content: '', position: {x:0, y:0}}] }); // Ensure textSections exists
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setProjectFormData(initialNewProjectState);
    setIsEditing(false);
  };

  const handleRemoveProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    toast({ title: "Project Removed", description: "Project deleted successfully.", duration: 3000 });
    if (projectFormData.id === id && isEditing) { // If currently editing deleted project
        handleCancelEdit();
    }
  };

  return (
    <div className="space-y-6 text-color-high-value">
      <h2 className="text-2xl font-bold flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
        <Briefcase size={24} />
        <span>Project Manager</span>
      </h2>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-3">Existing Projects</h3>
          <ProjectManagerList projects={projects} onEdit={handleEditProject} onRemove={handleRemoveProject} />
        </div>
        
        <div>
          <ProjectManagerForm
            projectData={projectFormData}
            setProjectData={setProjectFormData}
            onSave={handleSaveProject}
            onCancel={handleCancelEdit}
            isEditing={isEditing}
            formTitle={isEditing ? 'Edit Project' : 'Add New Project'}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectManager;