import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { useColors } from '@/contexts/ColorContext';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { useToast } from '@/components/ui/use-toast';

const ProjectCard = ({ project, index, totalProjects }) => {
  const { currentPalette } = useColors();
  const { toast } = useToast();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  let layoutClasses = "md:grid-cols-2";
  let imageOrder = project.layout === 'right' ? 'md:col-start-2' : '';
  let textOrder = project.layout === 'right' ? 'md:col-start-1' : '';

  if (project.layout === 'center') {
    layoutClasses = "md:grid-cols-1 text-center";
    imageOrder = "mx-auto"; 
    textOrder = "mx-auto"; 
  }

  const isLastProject = index === totalProjects - 1;

  const handleNotImplemented = () => {
    toast({
      title: "🚧 Feature Not Implemented",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      duration: 5000,
    });
  };

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
      className="min-h-screen flex items-center justify-center py-20 px-6 relative"
    >
      <div className={`grid ${layoutClasses} gap-12 items-center max-w-6xl mx-auto`}>
        <div className={`space-y-6 ${textOrder}`}>
          <div className="p-8 rounded-2xl" style={{ backgroundColor: `rgba(${currentPalette.primary === '#FF0000' ? '255,0,0' : '128,128,128'}, 0.05)` }}>
            <h3 className="text-3xl font-bold mb-4" style={{ color: currentPalette.primary }}>{project.title}</h3>
            <p className="text-lg mb-6 leading-relaxed" style={{ color: currentPalette.highValue, whiteSpace: 'pre-wrap' }}>
              {project.description}
            </p>
            {project.textSections && project.textSections.map((textSec, tsIndex) => (
              <div key={tsIndex} className="my-4">
                <p className="text-md" style={{ color: currentPalette.highValue, whiteSpace: 'pre-wrap' }}>{textSec.content}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className={`relative ${imageOrder}`}>
          <div className="p-4 rounded-2xl" style={{ backgroundColor: `rgba(${currentPalette.primary === '#FF0000' ? '255,0,0' : '128,128,128'}, 0.05)` }}>
            {project.images && project.images.length > 0 && project.images.map((image, imgIndex) => (
              <motion.img
                key={imgIndex}
                src={image}
                alt={`${project.title} - Image ${imgIndex + 1}`}
                className="w-full h-80 object-cover rounded-xl mb-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>
      </div>
      {!isLastProject && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-1 h-10 rounded-full" style={{ backgroundColor: currentPalette.primary, opacity: 0.5 }}></div>
      )}
    </motion.div>
  );
};

const ProjectsSection = () => {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Project Alpha', description: 'Description for Alpha.', images: ['https://storage.googleapis.com/hostinger-horizons-assets-prod/2451f05f-3d15-44c4-9fef-627dc1d33b48/e9a63bd183fd4492d59d724ef90f50c0.jpg'], layout: 'left', textSections: [{ content: 'Text section for Alpha'}] },
      { id: 2, title: 'Project Beta', description: 'Description for Beta.', images: ['https://storage.googleapis.com/hostinger-horizons-assets-prod/2451f05f-3d15-44c4-9fef-627dc1d33b48/ae1902e3fa6afc89bdfdfc4c040a6bd0.png'], layout: 'right', textSections: [{ content: 'Text section for Beta'}] },
      { id: 3, title: 'Project Gamma', description: 'Description for Gamma.', images: ['https://storage.googleapis.com/hostinger-horizons-assets-prod/2451f05f-3d15-44c4-9fef-627dc1d33b48/9b3b1901fd69e6d47ba7275bd909ca99.png'], layout: 'center', textSections: [{ content: 'Text section for Gamma'}] },
    ];
  });

  const [projectsContent, setProjectsContent] = useState(() => {
    const saved = localStorage.getItem('projectsContent');
    return saved ? JSON.parse(saved) : {
      title: 'Featured Projects',
      subtitle: 'Showcasing my latest creative works and innovations'
    };
  });
  
  const { currentPalette } = useColors();
  const { settings } = useSiteSettings();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef });
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.5, 1]); 
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const sectionStyle = settings.sectionBackgrounds.projects.pc 
    ? { backgroundImage: `url(${settings.sectionBackgrounds.projects.pc})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
    : { backgroundColor: currentPalette.lowValue };


  return (
    <motion.section 
      ref={sectionRef} 
      id="projects"
      className="relative section-bg-pattern"
      style={{ ...sectionStyle, scale, opacity }}
    >
      <div className="min-h-screen flex items-center justify-center py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-shadow" style={{ color: currentPalette.primary }}>
            {projectsContent.title}
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: currentPalette.highValue, whiteSpace: 'pre-wrap' }}>
            {projectsContent.subtitle}
          </p>
        </motion.div>
      </div>

      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} totalProjects={projects.length} />
      ))}
      
      {projects.length > 0 && (
        <div className="h-20 flex items-center justify-center">
          <div className="w-16 h-1 rounded-full" style={{ backgroundColor: currentPalette.primary }}></div>
        </div>
      )}
    </motion.section>
  );
};

export default ProjectsSection;