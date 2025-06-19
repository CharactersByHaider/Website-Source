import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Briefcase, Image as ImageIcon, Type, Move } from 'lucide-react';

const ProjectManagerList = ({ projects, onEdit, onRemove }) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-8 text-color-high-value opacity-60">
        <Briefcase size={48} className="mx-auto mb-4" />
        <p>No projects yet. Add your first project!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="p-3 bg-white/5 border border-white/20 rounded-lg text-color-high-value"
        >
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{project.title}</h4>
            <div className="flex space-x-2">
              <button onClick={() => onEdit(project)} className="text-blue-400 hover:text-blue-300 transition-colors"><Edit size={14} /></button>
              <button onClick={() => onRemove(project.id)} className="text-red-400 hover:text-red-300 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
          <p className="text-xs opacity-70 mb-1 truncate">{project.description}</p>
          <div className="flex items-center space-x-3 text-xs opacity-60">
            <span className="flex items-center space-x-1"><ImageIcon size={12} /><span>{project.images.length}</span></span>
            <span className="flex items-center space-x-1"><Type size={12} /><span>{project.textSections?.length || 0}</span></span>
            <span className="flex items-center space-x-1"><Move size={12} /><span>{project.layout}</span></span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProjectManagerList;